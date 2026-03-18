import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
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
    <footer className="bg-foreground relative">
      <div className="container mx-auto px-6 py-16 text-center">
        {/* Logo */}
        <h3 className="font-display italic text-[50px] text-aevi-gold leading-none mb-2">Aevi</h3>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-aevi-footer-muted mb-8">
          Lifestyle · Est. 2026
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-aevi-footer-divider mb-8" />

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {[
            { label: "Instagram", href: "#" },
            { label: "TikTok", href: "#" },
            { label: "Shipping", href: "#" },
            { label: "Returns", href: "#" },
            { label: "Contact", href: "/contact" },
          ].map((link) => (
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                className="font-body text-[10px] tracking-[0.15em] uppercase text-aevi-footer-link hover:text-aevi-gold transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-[10px] tracking-[0.15em] uppercase text-aevi-footer-link hover:text-aevi-gold transition-colors"
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Copyright */}
        <p className="font-body text-[11px] text-aevi-footer-copy">
          © 2026 Aevi Lifestyle. All rights reserved.
        </p>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-aevi-orange-deep transition-colors z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};

export default Footer;
