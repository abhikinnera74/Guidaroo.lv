import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Star, Languages, Shield, Calendar, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const GuideProfilePage = () => {
  const { guideId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  
  // Booking form
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const bookingHours = (() => {
    if (!bookingDate || !startTime || !endTime) return 0;
    const start = new Date(`${bookingDate}T${startTime}`);
    const end = new Date(`${bookingDate}T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  })();

  const bookingTotalPreview = guide?.hourly_rate ? bookingHours * guide.hourly_rate : 0;

  useEffect(() => {
    if (guideId) {
      fetchGuideProfile();
      fetchReviews();
    }
  }, [guideId]);

  const fetchGuideProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('guide_profiles')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('user_id', guideId)
        .single();

      if (error) throw error;
      setGuide(data);
    } catch (error) {
      toast.error("Failed to load guide profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:tourist_id (
            full_name
          )
        `)
        .eq('guide_id', guideId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book a guide");
      navigate("/auth");
      return;
    }

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const start = new Date(`${bookingDate}T${startTime}`);
      const end = new Date(`${bookingDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours <= 0) {
        toast.error("End time must be after start time");
        return;
      }
      const totalAmount = hours * guide.hourly_rate;

      const { error } = await supabase
        .from('bookings')
        .insert({
          tourist_id: user.id,
          guide_id: guideId,
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          total_amount: totalAmount,
          notes: notes,
        });

      if (error) throw error;

      toast.success("Booking request sent successfully!");
      setBookingOpen(false);
      navigate("/bookings");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Guide not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <Card className="shadow-soft mb-6 animate-fade-in">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold text-4xl">
                {guide.profiles?.full_name?.[0] || "G"}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{guide.profiles?.full_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {guide.city}
                    </CardDescription>
                  </div>
                  {guide.verification_status && (
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-4 w-4" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold text-lg">
                      {guide.average_rating > 0 ? guide.average_rating.toFixed(1) : "New"}
                    </span>
                    <span className="text-muted-foreground">
                      ({guide.total_reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold text-xl">
                    <span className="h-5 w-5 flex items-center justify-center">₹</span>
                    {formatCurrency(guide.hourly_rate)}/hour
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{guide.bio || "No bio provided"}</p>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((lang: string) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{review.profiles?.full_name || "Anonymous"}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Book Button */}
        {user && user.id !== guideId && (
          <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                <Calendar className="h-5 w-5 mr-2" />
                Book This Guide
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Booking</DialogTitle>
                <DialogDescription>
                  Fill in the details for your tour with {guide.profiles?.full_name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                {bookingHours > 0 && (
                  <div className="p-4 rounded-md bg-muted/30">
                    <p className="text-sm">Estimated duration: <strong>{bookingHours.toFixed(2)} hrs</strong></p>
                    <p className="text-sm">Estimated total: <strong className="text-primary">{formatCurrency(bookingTotalPreview)}</strong></p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBookingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBooking}>
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default GuideProfilePage;
