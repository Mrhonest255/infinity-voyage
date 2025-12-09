import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
};

interface Props {
  tourId: string;
  tourTitle: string;
}

export const TourReviews = ({ tourId, tourTitle }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!tourId) return;
    fetchReviews();
  }, [tourId]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,rating,comment,created_at")
      .eq("tour_id", tourId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please add your name and comment.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      tour_id: tourId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit review.");
      return;
    }
    toast.success("Review submitted! Visible after approval.");
    setName("");
    setRating(5);
    setComment("");
    fetchReviews();
  };

  const averageRating =
    reviews.length === 0
      ? null
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <Card className="border-2 border-border shadow-elevated">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageCircle className="w-5 h-5 text-primary" />
              Traveler Reviews
            </CardTitle>
            <CardDescription>
              Share your experience for <strong>{tourTitle}</strong>. Reviews appear after approval.
            </CardDescription>
          </div>
          {averageRating && (
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-lg font-semibold">
                <Star className="w-4 h-4 text-primary" />
                {averageRating}/5
              </div>
              <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <form onSubmit={submitReview} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rating</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Math.min(5, Math.max(1, Number(e.target.value))))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love? Any tips for others?"
              rows={4}
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit review
            </Button>
          </div>
        </form>

        {/* Reviews list */}
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading reviews...
            </div>
          )}
          {!loading && reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
          )}
          {!loading &&
            reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-border/60 p-4 bg-card/60"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="font-semibold text-foreground">{review.name}</div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary" />
                    {review.rating}/5
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

