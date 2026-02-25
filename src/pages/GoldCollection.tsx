import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import goldHero from "@/assets/gold-collection.jpg";
import { goldProducts } from "@/data/products";

const GoldCollection = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative h-[60vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src={goldHero} alt="Gold Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>
      <div className="relative z-10 container mx-auto px-6 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-xs tracking-[0.4em] uppercase text-background/70 mb-3"
        >
          Golden Hour
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-5xl md:text-6xl text-background"
        >
          Gold Collection
        </motion.h1>
      </div>
    </section>

    {/* Products */}
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <p className="font-accent text-xl text-muted-foreground max-w-2xl mb-16 leading-relaxed">
          Sun-drenched warmth in 18k gold vermeil. Inspired by Mediterranean light and Parisian elegance — pieces that radiate with a soft, golden glow.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {goldProducts.map((p) => (
            <div key={p.id}>
              <ProductCard id={p.id} name={p.name} price={p.price} image={p.image} category={p.category} />
              <p className="font-accent text-base text-muted-foreground mt-3 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default GoldCollection;
