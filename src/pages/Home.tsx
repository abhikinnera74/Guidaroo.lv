import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, MessageCircle, Star, Shield, Clock, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Discover the World with
              <span className="block mt-2">Local Experts</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Connect with verified local guides for authentic travel experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {user ? (
                <>
                  <Button size="lg" variant="secondary" asChild className="shadow-hover">
                    <Link to="/search">Find Your Guide</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                    <Link to="/profile">My Profile</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild className="shadow-hover">
                    <Link to="/search">Browse Guides</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Guidaroo?</h2>
            <p className="text-muted-foreground text-lg">Everything you need for an unforgettable journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-hover transition-all animate-fade-in">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Guides</CardTitle>
                <CardDescription>
                  All our guides are thoroughly verified to ensure quality and safety
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>
                  Connect instantly with guides through our integrated messaging system
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Trusted Reviews</CardTitle>
                <CardDescription>
                  Read authentic reviews from travelers who've experienced the tours
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Flexible Booking</CardTitle>
                <CardDescription>
                  Easy booking management with real-time availability updates
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Find local guides in destinations around the world
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Local Expertise</CardTitle>
                <CardDescription>
                  Experience destinations like a local with insider knowledge
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 px-4 bg-muted">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Adventure?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of travelers discovering authentic experiences with local guides
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">Sign Up as Tourist</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Become a Guide</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
