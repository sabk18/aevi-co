import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import CartDrawer from "@/components/CartDrawer";

const ACCOUNT_URL = "https://shopify.com/81611915484/account";

const navLinks = [
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const accessToken = useAuthStore((s) => s.accessToken);
  const customer = useAuthStore((s) => s.customer);
  const isLoggedIn = !!accessToken;

  const linkClass = (active: boolean) =>
    `font-body font-light text-[11px] tracking-[0.15em] uppercase transition-colors duration-200 ${
      active ? "text-foreground" : "text-aevi-nav-link hover:text-foreground"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-aevi-border-warm">
        <nav className="container mx-auto px-6">
          {/* Top row: nav links */}
          <div className="flex justify-center gap-8 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(location.pathname === link.path)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <a
                href={ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass(false) + " inline-flex items-center gap-1.5"}
              >
                <User className="w-3.5 h-3.5" />
                {customer?.firstName ? `Hi, ${customer.firstName}` : "My Account"}
              </a>
            ) : (
              <a
                href={ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass(false)}
              >
                Log In
              </a>
            )}
          </div>

          {/* Middle row: logo */}
          <div className="flex justify-center py-1">
            <Link to="/" className="font-display italic text-[48px] leading-none tracking-wide text-foreground flex items-center gap-2">
              <span className="text-primary text-lg">·</span>
              Aevi
              <span className="text-primary text-lg">·</span>
            </Link>
          </div>

          {/* Bottom row: icons */}
          <div className="flex justify-center gap-6 py-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground hover:text-muted-foreground transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button onClick={() => setCartOpen(true)} className="relative text-foreground hover:text-muted-foreground transition-colors">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-body font-medium">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
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
                <a
                  href={ACCOUNT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="font-body text-sm tracking-[0.08em] text-muted-foreground inline-flex items-center gap-1.5"
                >
                  {isLoggedIn ? (
                    <>
                      <User className="w-3.5 h-3.5" />
                      {customer?.firstName ? `Hi, ${customer.firstName}` : "My Account"}
                    </>
                  ) : (
                    "Log In"
                  )}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
