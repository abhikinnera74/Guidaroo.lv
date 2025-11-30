import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GuideDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, tourist:tourist_id (full_name, email), guide:guide_id (full_name)`) 
        .eq('guide_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success('Updated');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Guide Dashboard</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Card key={b.id} className="shadow-soft">
                <CardHeader>
                  <CardTitle>{b.tourist?.full_name || 'Tourist'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: {new Date(b.booking_date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Time: {b.start_time} - {b.end_time}</p>
                  <p className="text-sm text-muted-foreground">Notes: {b.notes || '—'}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(b.id, 'declined')}>Decline</Button>
                        <Button size="sm" onClick={() => updateStatus(b.id, 'accepted')}>Accept</Button>
                      </>
                    )}
                    {b.status === 'accepted' && (
                      <Button size="sm" onClick={() => updateStatus(b.id, 'completed')}>Mark Complete</Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;
