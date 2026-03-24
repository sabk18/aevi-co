import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShopifyProduct } from "@/lib/shopify";

interface Props {
  products: ShopifyProduct[];
}

const HeroProductCarousel = ({ products }: Props) => {
  const [current, setCurrent] = useState(0);
  const items = products.filter(
    (p) => p.node.images.edges.length > 0
  );

  const advance = useCallback(() => {
    if (items.length === 0) return;
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(advance, 3000);
    return () => clearInterval(id);
  }, [advance, items.length]);

  if (items.length === 0) return null;

  // Show 3 images: prev, current, next
  const getIndex = (offset: number) =>
    (current + offset + items.length) % items.length;

  const positions = [
    { offset: -1, x: "-110%", scale: 0.7, opacity: 0.4, z: 0 },
    { offset: 0, x: "0%", scale: 1, opacity: 1, z: 10 },
    { offset: 1, x: "110%", scale: 0.7, opacity: 0.4, z: 0 },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-[220px] md:h-[280px] my-6">
      {positions.map((pos) => {
        const idx = getIndex(pos.offset);
        const product = items[idx];
        const img = product.node.images.edges[0]?.node;
        const handle = product.node.handle;

        return (
          <AnimatePresence mode="popLayout" key={pos.offset}>
            <motion.div
              key={`${idx}-${pos.offset}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                x: pos.x,
                scale: pos.scale,
                opacity: pos.opacity,
                zIndex: pos.z,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[200px] md:w-[200px] md:h-[250px]"
            >
              <Link
                to={`/product/${handle}`}
                className="block w-full h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <img
                  src={img?.url}
                  alt={img?.altText || product.node.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-body text-[10px] tracking-[0.1em] uppercase text-background truncate">
                    {product.node.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        );
      })}

      {/* Dots */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroProductCarousel;
