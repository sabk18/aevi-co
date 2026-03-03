import { useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-display text-2xl tracking-widest mb-4">NORA ATELIER</h3>
            <p className="font-accent text-lg text-accent-foreground/70 leading-relaxed">
              Handcrafted luxury jewelry in 925 sterling silver and 18k gold vermeil.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase mb-6 text-accent-foreground/50">Collections</h4>
            <div className="flex flex-col gap-3">
              <Link to="/silver" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Silver Collection</Link>
              <Link to="/gold" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Gold Collection</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase mb-6 text-accent-foreground/50">Account</h4>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Sign In</Link>
              <Link to="/contact" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Contact Us</Link>
              <Link to="/cart" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Shopping Bag</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase mb-6 text-accent-foreground/50">Newsletter</h4>
            <p className="font-accent text-base text-accent-foreground/70 mb-4">
              Be the first to know about new collections and exclusive offers.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/40 font-accent text-base"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-accent-foreground/10 mt-12 pt-8 text-center">
          <p className="font-body text-xs tracking-[0.2em] text-accent-foreground/40">
            © 2026 NORA ATELIER. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
