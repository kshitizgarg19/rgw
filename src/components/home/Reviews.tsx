"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars, StarInput } from "@/components/ui/StarRating";
import { useToast } from "@/components/providers/ToastProvider";
import { initials, formatDateShort } from "@/lib/utils";
import type { ReviewItem } from "@/lib/types";

export function Reviews({
  initialReviews,
  avg,
  count,
  productSlug = null,
  eyebrow = "Kind Words",
  title = "Loved by families across Delhi NCR",
  subtitle = "A few notes from the people who keep coming back for more.",
}: {
  initialReviews: ReviewItem[];
  avg: number;
  count: number;
  productSlug?: string | null;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast("Please add your name and a few words.", "info");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name.trim(), rating, comment: comment.trim(), productSlug }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((r) => [data.review, ...r]);
        setName("");
        setComment("");
        setRating(5);
        toast("Thank you for your review!");
      } else {
        toast(data.error || "Could not submit review.", "info");
      }
    } catch {
      toast("Could not submit review. Please try again.", "info");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Summary + form */}
        <div className="flex flex-col gap-6">
          <div className="card-lux flex items-center gap-5 p-6">
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-foil">{avg.toFixed(1)}</p>
              <Stars value={avg} className="mt-1 justify-center" />
            </div>
            <div className="h-12 w-px bg-[var(--color-gold)]/30" />
            <p className="text-sm text-[var(--color-ink-soft)]">
              Based on <span className="font-semibold text-[var(--color-maroon)]">{count}</span>{" "}
              happy customers who shared their experience.
            </p>
          </div>

          <form onSubmit={submit} className="card-lux flex flex-col gap-4 p-6">
            <h3 className="font-serif text-xl font-bold text-[var(--color-maroon)]">Leave a review</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-4 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-gold)]"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-ink-soft)]">Your rating</span>
              <StarInput value={rating} onChange={setRating} size={26} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you loved…"
              rows={3}
              className="resize-none rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-4 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-gold)]"
            />
            <button type="submit" disabled={busy} className="btn-gold w-fit disabled:opacity-60">
              {busy ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Review cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="card-lux flex flex-col p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[var(--color-maroon-soft)] to-[var(--color-maroon-deep)] text-sm font-bold text-[var(--color-gold-light)]">
                  {initials(r.customerName)}
                </span>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{r.customerName}</p>
                  <Stars value={r.rating} size={14} />
                </div>
              </div>
              <p className="flex-1 leading-relaxed text-[var(--color-ink-soft)]">“{r.comment}”</p>
              <p className="mt-3 text-xs text-[var(--color-ink-faint)]">{formatDateShort(r.createdAt)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
