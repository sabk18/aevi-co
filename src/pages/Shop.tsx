import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const categories = ["All", "Necklaces", "Bracelets", "Rings", "Earrings"];
const materials = ["Gold", "Silver"];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(50).then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    const type = ((p.node as any).productType || "").toLowerCase();
    const title = p.node.title.toLowerCase();
    const price = parseFloat(p.node.priceRange.minVariantPrice.amount);

    // Category filter
    if (activeCategory !== "All") {
      const cat = activeCategory.toLowerCase().replace(/s$/, "");
      if (!type.includes(cat) && !title.includes(cat)) return false;
    }

    // Material filter
    if (activeMaterial) {
      if (activeMaterial === "Under $20") {
        if (price >= 20) return false;
      } else {
        const mat = activeMaterial.toLowerCase();
        if (!title.includes(mat) && !type.includes(mat)) return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-8 pb-20 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2">Shop</h1>
            <p className="font-body text-sm text-muted-foreground">
              Everyday jewelry, made to last.
            </p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
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

          {/* Material chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {materials.map((mat) => (
              <button
                key={mat}
                onClick={() => setActiveMaterial(activeMaterial === mat ? null : mat)}
                className={`font-body text-[11px] tracking-[0.08em] px-4 py-1.5 rounded-full eclat-border transition-all duration-200 ${
                  activeMaterial === mat
                    ? "bg-gold-accent text-primary-foreground border-gold-accent"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                }`}
              >
                {mat}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center font-body text-sm text-muted-foreground py-20">
              No products match your filters.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8"
            >
              {filtered.map((p) => (
                <ShopifyProductCard key={p.node.id} product={p} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
