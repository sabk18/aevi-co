import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const categories = ["All", "Necklaces", "Bracelets", "Rings", "Earrings"];

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchProducts(12).then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => {
        const type = ((p.node as any).productType || "").toLowerCase();
        const title = p.node.title.toLowerCase();
        const cat = activeCategory.toLowerCase().replace(/s$/, ""); // "Necklaces" -> "necklace"
        return type.includes(cat) || title.includes(cat);
      });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-32 md:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-card" />
        <div className="relative z-10 container mx-auto text-center max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4"
          >
            18K Gold · 925 Silver · Hypoallergenic
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6"
          >
            Made for the{" "}
            <span className="italic">everyday</span>{" "}
            you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-base text-muted-foreground mb-8 max-w-md mx-auto"
          >
            Quiet luxury jewelry designed to be worn every single day — from morning coffee to midnight.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/shop"
              className="inline-block bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-foreground/90 transition-colors rounded-sm"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category pills + Featured products */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">Featured Pieces</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-body text-xs tracking-[0.1em] uppercase px-5 py-2 rounded-full eclat-border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-foreground text-primary-foreground border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
              {filteredProducts.slice(0, 8).map((p) => (
                <ShopifyProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-block font-body text-xs tracking-[0.15em] uppercase text-foreground border eclat-border border-foreground px-8 py-3 hover:bg-foreground hover:text-primary-foreground transition-colors rounded-sm"
              >
                View All
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 px-6 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✦", label: "Free Shipping", sub: "On orders $35+" },
              { icon: "◈", label: "925 Sterling Silver", sub: "Tarnish resistant" },
              { icon: "↻", label: "30-Day Returns", sub: "Easy & free" },
              { icon: "❋", label: "Gift Wrap", sub: "Available at checkout" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-gold-accent text-lg mb-1">{item.icon}</p>
                <p className="font-body text-xs tracking-[0.1em] uppercase text-foreground">{item.label}</p>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
