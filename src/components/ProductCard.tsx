import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "silver" | "gold";
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer"
    >
      <div className={`relative overflow-hidden mb-4 ${category === "gold" ? "luxury-shadow" : "silver-shadow"}`}>
        <img
          src={image}
          alt={name}
          className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <Button
            variant="luxury"
            className="w-full"
            onClick={() => addItem({ id, name, price, image, quantity: 1 })}
          >
            Add to Bag
          </Button>
        </div>
      </div>
      <h3 className="font-accent text-xl text-foreground">{name}</h3>
      <p className="font-body text-sm tracking-wider text-muted-foreground mt-1">
        ${price.toFixed(2)}
      </p>
    </motion.div>
  );
};

export default ProductCard;
