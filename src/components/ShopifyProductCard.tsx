import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  featured?: boolean;
}

const ShopifyProductCard = ({ product, featured }: ShopifyProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const productType = (node as any).productType || "";
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
    <Link to={`/product/${node.handle}`} className={featured ? "col-span-2" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer bg-card rounded-lg overflow-hidden"
      >
        <div className="relative overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className={`w-full ${featured ? "aspect-[2/1]" : "aspect-square"} object-cover transition-transform duration-500 group-hover:scale-[1.04]`}
              loading="lazy"
            />
          ) : (
            <div className={`w-full ${featured ? "aspect-[2/1]" : "aspect-square"} bg-aevi-peach flex items-center justify-center`}>
              <span className="text-muted-foreground font-body text-sm">No Image</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            {productType && (
              <p className="font-body text-[9px] tracking-[0.15em] uppercase text-primary-foreground/80 mb-1">{productType}</p>
            )}
            <h3 className="font-display italic text-primary-foreground text-base leading-snug">{node.title}</h3>
            <p className="font-body text-aevi-gold text-sm mt-0.5">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="p-3">
          {productType && (
            <p className="font-body text-[9px] tracking-[0.15em] uppercase text-aevi-label-soft mb-1">{productType}</p>
          )}
          <h3 className="font-display italic text-sm text-foreground leading-snug">{node.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body text-sm text-primary font-medium">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </p>
            {materialBadge && (
              <span className="font-body text-[9px] tracking-[0.08em] px-2 py-0.5 bg-aevi-peach text-aevi-orange-deep rounded-full">
                {materialBadge}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ShopifyProductCard;
