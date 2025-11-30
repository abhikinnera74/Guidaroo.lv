import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MapPin, Star, Languages, Shield, Search as SearchIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface GuideProfile {
  id: string;
  user_id: string;
  city: string;
  languages: string[];
  hourly_rate: number;
  bio: string;
  verification_status: boolean;
  average_rating: number;
  total_reviews: number;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

const SearchPage = () => {
  const [guides, setGuides] = useState<GuideProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [maxPrice, setMaxPrice] = useState([200]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('guide_profiles')
        .select(`
          *,
          profiles!guide_profiles_user_id_fkey (
            full_name,
            avatar_url
          )
        `);

      if (searchCity) {
        query = query.ilike('city', `%${searchCity}%`);
      }

      if (verifiedOnly) {
        query = query.eq('verification_status', true);
      }

      query = query.lte('hourly_rate', maxPrice[0]);

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      if (selectedLanguage !== "all") {
        filteredData = filteredData.filter(guide => 
          guide.languages.includes(selectedLanguage)
        );
      }

      setGuides(filteredData as any);
    } catch (error: any) {
      toast.error("Failed to load guides");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchGuides();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Guide</h1>
          <p className="text-muted-foreground">Discover local experts for your next adventure</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price: {formatCurrency(maxPrice[0])}/hr</label>
                <Slider
                  value={maxPrice}
                  onValueChange={setMaxPrice}
                  max={200}
                  min={10}
                  step={5}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => setVerifiedOnly(!verifiedOnly)} 
                  variant={verifiedOnly ? "default" : "outline"}
                  className="w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Verified Only
                </Button>
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading guides...</p>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No guides found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card 
                key={guide.id} 
                className="shadow-soft hover:shadow-hover transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold text-xl">
                        {guide.profiles?.full_name?.[0] || "G"}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{guide.profiles?.full_name || "Guide"}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {guide.city}
                        </CardDescription>
                      </div>
                    </div>
                    {guide.verification_status && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{guide.bio}</p>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {guide.languages.slice(0, 3).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">
                        {guide.average_rating > 0 ? guide.average_rating.toFixed(1) : "New"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({guide.total_reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <span className="h-4 w-4 flex items-center justify-center">₹</span>
                      {formatCurrency(guide.hourly_rate)}/hr
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/guide/${guide.user_id}`}>View Profile</Link>
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

export default SearchPage;
