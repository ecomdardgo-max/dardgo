export type SubmitJudgeMeReviewInput = {
  externalId: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  reviewBody: string;
};

export async function submitJudgeMeReview(
  input: SubmitJudgeMeReviewInput,
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  const res = await fetch("/api/judgeme-submit-review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };

  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error || "Could not submit review" };
  }

  return { ok: true, message: data.message || "Thank you! Your review was submitted." };
}
