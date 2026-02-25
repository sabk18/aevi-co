import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-accent text-accent-foreground">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-2xl tracking-widest mb-4">NORA ATELIER</h3>
          <p className="font-accent text-lg text-accent-foreground/70 leading-relaxed">
            Handcrafted luxury jewelry in 925 sterling silver and 18k gold vermeil. Each piece tells a story of elegance and timeless beauty.
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
          <h4 className="font-body text-xs tracking-[0.3em] uppercase mb-6 text-accent-foreground/50">Support</h4>
          <div className="flex flex-col gap-3">
            <Link to="/contact" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Contact Us</Link>
            <Link to="/cart" className="font-accent text-lg text-accent-foreground/70 hover:text-accent-foreground transition-colors">Shopping Bag</Link>
          </div>
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

export default Footer;
