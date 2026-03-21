import { useState, useEffect, useMemo } from "react";
import { Star, CheckCircle, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JUDGEME_SHOP = "nora-atelier-jewelry.myshopify.com";
const API_BASE = "https://judge.me/api/v1/reviews";

interface Review {
  id: number;
  title: string;
  body: string;
  rating: number;
  reviewer: { name: string };
  created_at: string;
  verified: string;
  pictures: Array<{ urls: { original: string; compact: string } }>;
}

interface ReviewsData {
  reviews: Review[];
  rating: number;
  count: number;
}

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`transition-colors ${i <= rating ? "fill-primary text-primary" : "text-border"}`}
        style={{ width: size, height: size }}
      />
    ))}
  </div>
);

const FilterButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full font-body text-xs tracking-wide transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-muted-foreground hover:text-foreground hover:border-foreground border border-border"
    }`}
  >
    {label}
  </button>
);

export default function ProductReviews({ handle }: { handle: string }) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setFilter(null);

    // Judge.me public widget API
    fetch(
      `${API_BASE}?api_token=&shop_domain=${JUDGEME_SHOP}&handle=${handle}&per_page=50`
    )
      .then((r) => r.json())
      .then((json) => {
        const reviews: Review[] = json.reviews || [];
        const count = reviews.length;
        const rating =
          count > 0
            ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / count
            : 0;
        setData({ reviews, rating, count });
      })
      .catch(() => setData({ reviews: [], rating: 0, count: 0 }))
      .finally(() => setLoading(false));
  }, [handle]);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === null) return data.reviews;
    return data.reviews.filter((r) => r.rating === filter);
  }, [data, filter]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!data || data.count === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-display italic text-lg text-muted-foreground">
          No reviews yet — be the first to share your thoughts.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-16 pt-12 border-t border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display italic text-2xl text-foreground mb-1">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(data.rating)} size={20} />
            <span className="font-body text-sm text-muted-foreground">
              {data.rating.toFixed(1)} out of 5 · {data.count}{" "}
              {data.count === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <FilterButton label="All" active={filter === null} onClick={() => setFilter(null)} />
        {[5, 4, 3, 2, 1].map((s) => (
          <FilterButton
            key={s}
            label={`${s}★`}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {/* Reviews list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter ?? "all"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {filtered.length === 0 ? (
            <p className="font-display italic text-muted-foreground py-8 text-center">
              No {filter}★ reviews yet.
            </p>
          ) : (
            filtered.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-lg bg-card border border-border"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display italic text-sm text-foreground">
                        {review.reviewer?.name || "Anonymous"}
                      </span>
                      {review.verified === "buyer" && (
                        <span className="inline-flex items-center gap-1 font-body text-[10px] tracking-[0.1em] uppercase text-primary">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <span className="font-body text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {review.title && (
                  <p className="font-body font-medium text-sm text-foreground mt-2">
                    {review.title}
                  </p>
                )}
                {review.body && (
                  <p className="font-body font-light text-sm text-muted-foreground leading-relaxed mt-1">
                    {review.body}
                  </p>
                )}

                {/* Review photos */}
                {review.pictures && review.pictures.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.pictures.map((pic, i) => (
                      <button
                        key={i}
                        onClick={() => setExpandedImage(pic.urls.original)}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors relative group"
                      >
                        <img
                          src={pic.urls.compact}
                          alt="Review photo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                          <Camera className="w-3 h-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Expanded image overlay */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-6"
            onClick={() => setExpandedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={expandedImage}
              alt="Review photo"
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
