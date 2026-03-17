import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
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

  // Derive category from product type or tags
  const productType = (node as any).productType || "";

  // Derive material badge from tags or title
  const title = node.title.toLowerCase();
  const materialBadge = title.includes("gold") ? "18K Gold" : title.includes("silver") ? "925 Silver" : null;

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
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden bg-card mb-3">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-square bg-card flex items-center justify-center">
              <span className="text-muted-foreground font-body text-sm">No Image</span>
            </div>
          )}
          {/* Material badge */}
          {materialBadge && (
            <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground font-body text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm">
              {materialBadge}
            </span>
          )}
          {/* Quick add overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
            <button
              onClick={handleAddToCart}
              disabled={isLoading || !variant?.availableForSale}
              className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.1em] uppercase py-2.5 hover:bg-foreground/90 transition-colors disabled:opacity-50 rounded-sm"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
              ) : !variant?.availableForSale ? (
                "Sold Out"
              ) : (
                "Quick Add"
              )}
            </button>
          </div>
        </div>
        {/* Category label */}
        {productType && (
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
            {productType}
          </p>
        )}
        <h3 className="font-display text-base text-foreground leading-snug">{node.title}</h3>
        <p className="font-body text-sm text-gold-accent mt-0.5">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </motion.div>
    </Link>
  );
};

export default ShopifyProductCard;
