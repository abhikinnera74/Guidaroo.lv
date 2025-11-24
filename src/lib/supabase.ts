import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type UserRole = 'tourist' | 'guide' | 'admin';
export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
