import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to bag", { description: node.title });
  };

  return (
    <Link to={`/product/${node.handle}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden mb-4 luxury-shadow">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-accent">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <Button
              variant="luxury"
              className="w-full"
              onClick={handleAddToCart}
              disabled={isLoading || !variant?.availableForSale}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : !variant?.availableForSale ? "Sold Out" : "Add to Bag"}
            </Button>
          </div>
        </div>
        <h3 className="font-accent text-xl text-foreground">{node.title}</h3>
        <p className="font-body text-sm tracking-wider text-muted-foreground mt-1">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </motion.div>
    </Link>
  );
};

export default ShopifyProductCard;
