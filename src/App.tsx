import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import GuideProfilePage from "./pages/GuideProfilePage";
import BookingsPage from "./pages/BookingsPage";
import ChatPage from "./pages/ChatPage";
import ReviewPage from "./pages/ReviewPage";
import GuideDashboard from "./pages/GuideDashboard";
import TouristDashboard from "./pages/TouristDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/guide/:guideId" element={<GuideProfilePage />} />
            <Route path="/dashboard/guide" element={<GuideDashboard />} />
            <Route path="/dashboard/tourist" element={<TouristDashboard />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/messages/:bookingId" element={<ChatPage />} />
            <Route path="/review/:bookingId" element={<ReviewPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
