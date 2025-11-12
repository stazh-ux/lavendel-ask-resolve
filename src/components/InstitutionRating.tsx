import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "./RatingStars";
import { ratingService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface InstitutionRatingProps {
  userId: string;
}

export const InstitutionRating = ({ userId }: InstitutionRatingProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingRating();
  }, [userId]);

  const loadExistingRating = async () => {
    const { data } = await ratingService.getUserRating(userId);
    if (data) {
      setExistingRating(data);
      setRating(data.rating);
      setComment(data.comment || "");
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await ratingService.submitRating(rating, comment, userId);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error submitting rating",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: existingRating ? "Rating updated!" : "Rating submitted!",
        description: "Thank you for rating Brototype.",
      });
      loadExistingRating();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Brototype</CardTitle>
        <CardDescription>
          Share your experience with the institution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <RatingStars
            rating={rating}
            onRatingChange={setRating}
            size="lg"
          />
          <p className="text-sm text-muted-foreground">
            {rating === 0 ? "Select a rating" : `${rating} out of 5 stars`}
          </p>
        </div>

        <Textarea
          placeholder="Share your thoughts (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
        </Button>
      </CardContent>
    </Card>
  );
};
