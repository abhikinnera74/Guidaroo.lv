import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

const TouristDashboard = () => {
  const { user } = useAuth();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guide_profiles')
        .select(`*, profiles: user_id (full_name, avatar_url)`)
        .order('average_rating', { ascending: false });

      if (error) throw error;
      setGuides(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Find Guides</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading guides...</p>
        ) : guides.length === 0 ? (
          <p className="text-muted-foreground">No guides found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((g) => (
              <Card key={g.id} className="shadow-soft">
                <CardHeader>
                  <CardTitle>{g.profiles?.full_name || 'Guide'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{g.city}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(g.hourly_rate)}/hr</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to={`/guide/${g.user_id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristDashboard;
