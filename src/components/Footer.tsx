import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { newsletterSignup } from "@/lib/shopify";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const result = await newsletterSignup(email);
      if (result.success) {
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display italic text-2xl mb-3">Éclat</h3>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              Made for the everyday you. Handcrafted jewelry in 18K gold and 925 sterling silver.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.12v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.28 8.28 0 0 0 4.76 1.5v-3.5a4.85 4.85 0 0 1-1-.04Z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary-foreground/40 mb-4">Shop</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/shop" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">All Jewelry</Link>
                <Link to="/shop?category=Necklace" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Necklaces</Link>
                <Link to="/shop?category=Ring" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Rings</Link>
                <Link to="/shop?category=Bracelet" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Bracelets</Link>
                <Link to="/shop?category=Earrings" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Earrings</Link>
              </div>
            </div>
            <div>
              <h4 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary-foreground/40 mb-4">Info</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/about" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">About</Link>
                <Link to="/care" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Jewelry Care</Link>
                <Link to="/contact" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Contact</Link>
                <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Shipping & Returns</a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary-foreground/40 mb-4">Stay in the loop</h4>
            <p className="font-body text-sm text-primary-foreground/60 mb-4">
              New drops, restocks, and exclusive offers — straight to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-primary-foreground/10 border eclat-border border-primary-foreground/20 px-3 py-2 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 outline-none focus:border-primary-foreground/40 transition-colors rounded-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gold-accent text-primary-foreground font-body text-xs tracking-[0.1em] uppercase hover:bg-gold-accent/90 transition-colors rounded-sm disabled:opacity-50"
              >
                {isSubmitting ? "..." : "Join"}
              </button>
            </form>
          </div>
        </div>

        <div className="eclat-border border-t border-primary-foreground/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-[11px] tracking-[0.1em] text-primary-foreground/30">
            © 2026 Éclat. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-[11px] tracking-[0.1em] text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors">Privacy</a>
            <a href="#" className="font-body text-[11px] tracking-[0.1em] text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors">Terms</a>
            <a href="#" className="font-body text-[11px] tracking-[0.1em] text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
