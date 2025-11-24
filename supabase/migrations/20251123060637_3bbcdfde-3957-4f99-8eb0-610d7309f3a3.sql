-- Fix function search path for update_guide_rating
CREATE OR REPLACE FUNCTION public.update_guide_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guide_profiles
  SET 
    average_rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.reviews 
      WHERE guide_id = NEW.guide_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE guide_id = NEW.guide_id
    )
  WHERE user_id = NEW.guide_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
DROP TRIGGER IF EXISTS after_review_insert ON public.reviews;
CREATE TRIGGER after_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_guide_rating();