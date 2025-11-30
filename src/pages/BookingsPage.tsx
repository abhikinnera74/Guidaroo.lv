import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Clock, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tourist:tourist_id (full_name),
          guide:guide_id (full_name),
          guide_profile:guide_id (city)
        `)
        .or(`tourist_id.eq.${user?.id},guide_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'accepted': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'completed': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'declined': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return '';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">My Bookings</h1>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'accepted', 'completed'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading bookings...</p>
                </div>
              ) : bookings.filter(b => tab === 'all' || b.status === tab).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No {tab !== 'all' ? tab : ''} bookings found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings
                    .filter(b => tab === 'all' || b.status === tab)
                    .map((booking, index) => {
                      const isGuide = booking.guide_id === user.id;
                      const otherPerson = isGuide ? booking.tourist : booking.guide;

                      return (
                        <Card 
                          key={booking.id} 
                          className="shadow-soft hover:shadow-hover transition-all animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl mb-2">
                                  {isGuide ? 'Tour with' : 'Guide:'} {otherPerson?.full_name}
                                </CardTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  {booking.guide_profile?.city && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {booking.guide_profile.city}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(booking.booking_date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {booking.start_time} - {booking.end_time}
                                  </span>
                                </div>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-primary font-semibold">
                                  <span className="h-4 w-4 flex items-center justify-center">₹</span>
                                  {formatCurrency(booking.total_amount)}
                                </div>
                              <div className="flex gap-2">
                                {booking.status === 'pending' && isGuide && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateBookingStatus(booking.id, 'declined')}
                                    >
                                      Decline
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, 'accepted')}
                                    >
                                      Accept
                                    </Button>
                                  </>
                                )}
                                {booking.status === 'accepted' && isGuide && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                                  >
                                    Mark Complete
                                  </Button>
                                )}
                                {['accepted', 'completed'].includes(booking.status) && (
                                  <Button size="sm" variant="outline" asChild>
                                    <Link to={`/messages/${booking.id}`}>
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      Chat
                                    </Link>
                                  </Button>
                                )}
                                {booking.status === 'completed' && !isGuide && (
                                  <Button size="sm" asChild>
                                    <Link to={`/review/${booking.id}`}>Leave Review</Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                            {booking.notes && (
                              <p className="mt-4 text-sm text-muted-foreground">
                                <strong>Notes:</strong> {booking.notes}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default BookingsPage;
