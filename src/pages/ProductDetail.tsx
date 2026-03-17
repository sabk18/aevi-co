import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Heart, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;
  const title = product.title.toLowerCase();

  // Material badges
  const badges: string[] = [];
  if (title.includes("gold")) badges.push("18K Gold");
  if (title.includes("silver")) badges.push("925 Silver");
  badges.push("Hypoallergenic");

  const handleAddToCart = async () => {
    if (!variant) return;
    const shopifyProduct: ShopifyProduct = { node: product };
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to bag", { description: product.title });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-6 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link to="/shop" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-body text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {images.length > 0 && (
                <div className="bg-card overflow-hidden rounded-sm">
                  <img
                    src={images[selectedImage]?.node.url}
                    alt={images[selectedImage]?.node.altText || product.title}
                    className="w-full aspect-square object-cover"
                  />
                </div>
              )}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 overflow-hidden rounded-sm eclat-border transition-all ${
                        i === selectedImage ? "border-foreground" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">{product.title}</h1>
              <p className="font-body text-xl text-gold-accent mb-6">
                {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
              </p>

              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              {/* Material badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 bg-card text-muted-foreground rounded-full eclat-border border-border"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Variants */}
              {product.variants.edges.length > 1 && (
                <div className="mb-6">
                  <p className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Options</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v, i) => (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariantIdx(i)}
                        className={`px-4 py-2 font-body text-xs eclat-border rounded-sm transition-colors ${
                          i === selectedVariantIdx
                            ? "border-foreground bg-foreground text-primary-foreground"
                            : "border-border text-foreground hover:border-foreground"
                        }`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to cart + Wishlist */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isCartLoading || !variant?.availableForSale}
                  className="flex-1 bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase py-3.5 hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-50"
                >
                  {isCartLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : !variant?.availableForSale ? (
                    "Sold Out"
                  ) : (
                    "Add to Bag"
                  )}
                </button>
                <button
                  onClick={() => {
                    setWishlisted(!wishlisted);
                    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
                  }}
                  className={`w-12 flex items-center justify-center eclat-border border rounded-sm transition-colors ${
                    wishlisted ? "border-gold-accent text-gold-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Trust bar */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-card rounded-sm">
                {[
                  { icon: "✦", text: "Free shipping over $35" },
                  { icon: "◈", text: "925 sterling silver" },
                  { icon: "↻", text: "30-day returns" },
                  { icon: "❋", text: "Gift wrap available" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <span className="text-gold-accent text-sm">{item.icon}</span>
                    <span className="font-body text-[11px] text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;
