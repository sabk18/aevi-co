import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import goldHero from "@/assets/gold-collection.jpg";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const GoldCollection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(20, "tag:gold OR title:gold OR product_type:gold").then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={goldHero} alt="Gold Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 container mx-auto px-6 pb-16">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-body text-xs tracking-[0.4em] uppercase text-background/70 mb-3">
            Golden Hour
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-display text-5xl md:text-6xl text-background">
            Gold Collection
          </motion.h1>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto">
          <p className="font-accent text-xl text-muted-foreground max-w-2xl mb-16 leading-relaxed">
            Sun-drenched warmth in 18k gold vermeil. Inspired by Mediterranean light and Parisian elegance.
          </p>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : products.length === 0 ? (
            <p className="text-center font-accent text-xl text-muted-foreground py-20">No products found in this collection yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p) => <ShopifyProductCard key={p.node.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default GoldCollection;
