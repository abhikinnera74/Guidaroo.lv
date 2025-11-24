import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
import { MapPin, MessageCircle, User, LogOut, Search } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="Guidaroo" 
              className="h-10 w-auto transition-transform group-hover:scale-110 animate-float"
            />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Guidaroo
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Find Guides
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/bookings">
                    <MapPin className="h-4 w-4 mr-2" />
                    My Bookings
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/messages">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/search">Find Guides</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
