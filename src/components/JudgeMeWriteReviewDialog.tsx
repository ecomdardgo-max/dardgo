import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shopifyGidToProductNumericId } from "@/components/JudgeMe";
import { submitJudgeMeReview } from "@/lib/judgeme-submit-review";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | undefined;
  productTitle: string | undefined;
  onSubmitted?: () => void;
};

export function JudgeMeWriteReviewDialog({
  open,
  onOpenChange,
  productId,
  productTitle,
  onSubmitted,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const displayRating = hoverRating || rating;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setReviewBody("");
      setName("");
      setEmail("");
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    if (rating < 1) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitJudgeMeReview({
        externalId: shopifyGidToProductNumericId(productId),
        name: name.trim(),
        email: email.trim(),
        rating,
        title: title.trim(),
        reviewBody: reviewBody.trim(),
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      onSubmitted?.();
      handleOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[10100] max-w-md max-h-[min(90vh,720px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            {productTitle
              ? `Share your experience with ${productTitle}.`
              : "Share your experience with this product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Your rating</Label>
            <div
              className="flex items-center gap-1 mt-2"
              role="radiogroup"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      value <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="judgeme-review-title">Review title</Label>
            <Input
              id="judgeme-review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="judgeme-review-body">Your review</Label>
            <textarea
              id="judgeme-review-body"
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="What did you like or dislike?"
              required
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="judgeme-review-name">Name</Label>
              <Input
                id="judgeme-review-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="judgeme-review-email">Email</Label>
              <Input
                id="judgeme-review-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Reviews are submitted via Judge.me and may be moderated before they appear on the
            site.
          </p>

          <Button type="submit" className="w-full rounded-full font-bold" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting…
              </>
            ) : (
              "Submit review"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
