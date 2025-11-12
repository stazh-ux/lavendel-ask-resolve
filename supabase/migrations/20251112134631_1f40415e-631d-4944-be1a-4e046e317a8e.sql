-- Create ratings table for institution ratings
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Policies for ratings
CREATE POLICY "Users can insert their own rating"
ON public.ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all ratings"
ON public.ratings
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own rating"
ON public.ratings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to create notification when problem is resolved
CREATE OR REPLACE FUNCTION public.notify_problem_resolved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create notification if status changed to 'resolved'
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    INSERT INTO public.notifications (user_id, problem_id, message)
    VALUES (
      NEW.user_id,
      NEW.id,
      'Your problem "' || NEW.title || '" has been resolved by an admin.'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to notify when problem is resolved
CREATE TRIGGER on_problem_resolved
  AFTER UPDATE ON public.problems
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_problem_resolved();