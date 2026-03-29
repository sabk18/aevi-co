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

  const product = items[current];
  const img = product.node.images.edges[0]?.node;
  const handle = product.node.handle;

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-8 mb-4">
      {/* Single image — no absolute positioning */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-[200px] h-[240px] md:w-[240px] md:h-[280px]"
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

      {/* Dots */}
      <div className="flex gap-1.5">
        {items.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroProductCarousel;
```

---

## What Changed

The old version used:
```
position: absolute + left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
```
Which floated the images on top of everything ❌

The new version uses:
```
normal document flow — width/height set, no absolute positioning
