import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const navLinks = [
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "Care", path: "/care" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <>
      {/* Free Shipping Banner */}
      <div className="bg-foreground text-primary-foreground text-center py-2 font-body text-xs tracking-[0.15em] uppercase">
        Free shipping on orders $35+ &nbsp;·&nbsp; <span className="text-gold-accent font-medium">stack & save</span>
      </div>

      <header className="sticky top-0 z-50 bg-background eclat-border border-b border-border">
        <nav className="container mx-auto flex items-center justify-between h-14 px-6">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-[13px] tracking-[0.08em] transition-colors duration-200 ${
                  location.pathname === link.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-display italic text-2xl tracking-wide text-foreground">
            Éclat
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground hover:text-muted-foreground transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link to={accessToken ? "/account" : "/login"} className="text-foreground hover:text-muted-foreground transition-colors">
              <User className="w-[18px] h-[18px]" />
            </Link>
            <Link to="/cart" className="relative text-foreground hover:text-muted-foreground transition-colors">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-body font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="container mx-auto px-6 py-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search jewelry..."
                  className="w-full bg-transparent font-body text-sm outline-none placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border overflow-hidden"
            >
              <div className="flex flex-col items-center py-6 gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-body text-sm tracking-[0.08em] ${
                      location.pathname === link.path ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
