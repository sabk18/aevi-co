import { useState } from "react";
import { newsletterSignup } from "@/lib/shopify";
import { toast } from "sonner";

const EmailSubscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const result = await newsletterSignup(email);
      if (result.success) {
        setSuccess(true);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-secondary noise-overlay relative">
      <div className="relative z-10 container mx-auto max-w-lg text-center">
        <p className="font-body text-[11px] tracking-[0.2em] uppercase text-aevi-label mb-4">
          Join the inner circle
        </p>
        <h2 className="font-display italic text-3xl text-foreground mb-3">
          First to know. First to wear.
        </h2>
        <p className="font-body font-light text-sm text-muted-foreground mb-8">
          New drops, travel finds & member-only offers. No spam — ever.
        </p>

        {success ? (
          <p className="font-display italic text-xl text-primary">You're in ✦</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-card border aevi-border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors rounded-lg"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-[0.12em] uppercase hover:bg-aevi-orange-deep transition-colors rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default EmailSubscribe;
