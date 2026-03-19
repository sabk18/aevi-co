import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerStrip from "@/components/TickerStrip";
import EmailSubscribe from "@/components/EmailSubscribe";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const categories = ["All", "Necklaces", "Bracelets", "Rings", "Earrings"];
const categoryTiles = [
  { name: "Necklaces", path: "/shop?category=Necklaces" },
  { name: "Bracelets", path: "/shop?category=Bracelets" },
  { name: "Rings", path: "/shop?category=Rings" },
  { name: "Earrings", path: "/shop?category=Earrings" },
];

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const load = () => {
      fetchProducts(12).then((p) => {
        setProducts(p);
        setLoading(false);
      });
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const categoryToType: Record<string, string> = {
    Necklaces: "necklace",
    Bracelets: "bracelet",
    Rings: "ring",
    Earrings: "earrings",
  };

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => {
        const type = (p.node.productType || "").toLowerCase().trim();
        return type === categoryToType[activeCategory];
      });

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden noise-overlay">
        {/* Blob shapes */}
        <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-aevi-peach/50 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] rounded-full bg-secondary/60 blur-3xl" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display italic text-[200px] md:text-[300px] text-foreground/[0.03] select-none">Aevi</span>
        </div>

        {/* Sparkles */}
        <span className="absolute top-[20%] left-[15%] text-aevi-gold text-2xl sparkle">✦</span>
        <span className="absolute top-[30%] right-[20%] text-aevi-gold text-lg sparkle-delay-1">✦</span>
        <span className="absolute bottom-[25%] left-[60%] text-aevi-gold text-sm sparkle-delay-2">✦</span>

        <div className="relative z-10 text-center max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[11px] tracking-[0.2em] uppercase text-aevi-label mb-4"
          >
            Est. 2026 · Born from travel
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display italic text-[38px] md:text-5xl lg:text-6xl text-foreground leading-[1.15] mb-6"
          >
            Born from{" "}
            <span className="text-primary">wanderlust</span>.{" "}
            Made for you.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body font-light text-base text-muted-foreground mb-8 max-w-md mx-auto"
          >
            Jewelry found across cultures and cities — for the girl who moves through the world with intention.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-3 justify-center"
          >
            <Link
              to="/shop"
              className="inline-block bg-primary text-primary-foreground font-body text-xs tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-aevi-orange-deep transition-colors rounded-sm"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="inline-block border border-foreground text-foreground font-body text-xs tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-foreground hover:text-primary-foreground transition-colors rounded-sm"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <TickerStrip />

      {/* Category tiles */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryTiles.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="bg-aevi-peach rounded-xl p-8 text-center border-2 border-transparent hover:border-primary transition-all duration-200 group"
              >
                <h3 className="font-display italic text-lg text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display italic text-[26px] text-foreground mb-6">New pieces</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-body text-xs tracking-[0.1em] uppercase px-5 py-2 rounded-full aevi-border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center font-body text-sm text-muted-foreground py-20">
              No products found. Add products to your Shopify store to display them here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.slice(0, 8).map((p, i) => (
                <ShopifyProductCard key={p.node.id} product={p} featured={(i + 1) % 4 === 0} />
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-block font-body text-xs tracking-[0.15em] uppercase text-foreground border border-foreground px-8 py-3 hover:bg-foreground hover:text-primary-foreground transition-colors rounded-sm"
              >
                View All
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Free shipping banner */}
      <section className="py-4 px-6 bg-aevi-peach">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <p className="font-body text-xs tracking-[0.1em] text-aevi-orange-deep">
            Free shipping on orders $35+
          </p>
          <span className="font-body text-[9px] tracking-[0.1em] uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            stack & save
          </span>
        </div>
      </section>

      {/* Email subscribe */}
      <EmailSubscribe />

      <Footer />
    </div>
  );
};

export default Index;
