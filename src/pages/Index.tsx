import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import heroImage from "@/assets/hero-jewelry.jpg";
import silverCollection from "@/assets/silver-collection.jpg";
import goldCollection from "@/assets/gold-collection.jpg";
import aboutAtelier from "@/assets/about-atelier.jpg";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(6).then((p) => { setProducts(p); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Nora Atelier luxury jewelry" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-body text-xs tracking-[0.4em] uppercase text-background/80 mb-6">
            925 Sterling Silver &amp; 18K Gold Vermeil
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-display text-5xl md:text-7xl text-background leading-tight mb-8">
            Timeless Elegance, Handcrafted for You
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/silver"><Button variant="hero" size="lg">Silver Collection</Button></Link>
            <Link to="/gold"><Button variant="hero-outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">Gold Collection</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Collections</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">Two Worlds of Beauty</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/silver">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative group overflow-hidden silver-shadow">
                <img src={silverCollection} alt="Silver Collection" className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8">
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-background/70 mb-2">Moonlit Minimalist</p>
                  <h3 className="font-display text-3xl text-background">Silver Collection</h3>
                </div>
              </motion.div>
            </Link>
            <Link to="/gold">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative group overflow-hidden luxury-shadow">
                <img src={goldCollection} alt="Gold Collection" className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8">
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-background/70 mb-2">Golden Hour</p>
                  <h3 className="font-display text-3xl text-background">Gold Collection</h3>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products from Shopify */}
      <section className="py-24 px-6 bg-muted">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">From Our Store</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">Featured Pieces</h2>
          </motion.div>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : products.length === 0 ? (
            <p className="text-center font-accent text-xl text-muted-foreground py-20">No products found yet. Add products to your Shopify store to display them here.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => <ShopifyProductCard key={p.node.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img src={aboutAtelier} alt="Nora Atelier boutique" className="w-full aspect-[4/3] object-cover luxury-shadow" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Story</p>
            <h2 className="font-display text-4xl text-foreground mb-6">Crafted with Intention</h2>
            <p className="font-accent text-xl text-muted-foreground leading-relaxed mb-6">
              At Nora Atelier, every piece begins as a sketch, inspired by the interplay of light and form. We work exclusively with 925 sterling silver and 18k gold vermeil to create jewelry that transcends trends.
            </p>
            <p className="font-accent text-xl text-muted-foreground leading-relaxed">
              Our commitment to quality craftsmanship ensures each piece is not just an accessory, but a companion for life's most precious moments.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
