import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Heart, ChevronLeft } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { fetchProductByHandle, fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle).then((p) => {
      setProduct(p);
      setLoading(false);
    });
    fetchProducts(12).then((all) => {
      setRelatedProducts(all.filter(p => p.node.handle !== handle).slice(0, 3));
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
          <h1 className="font-display italic text-3xl text-foreground">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;
  const title = product.title.toLowerCase();
  const productType = (product as any).productType || "";

  const badges: string[] = [];
  if (title.includes("gold")) badges.push("18K Gold");
  if (title.includes("silver")) badges.push("925 Silver");
  badges.push("Hypoallergenic");
  if (title.includes("adjustable")) badges.push("Adjustable");

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
    <div className="min-h-screen bg-background animate-fade-in">
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
                <div
                  className="bg-aevi-peach overflow-hidden rounded-lg cursor-zoom-in"
                  onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true); }}
                >
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
                      className={`w-16 h-16 overflow-hidden rounded-lg aevi-border transition-all ${
                        i === selectedImage ? "border-primary" : "border-border hover:border-muted-foreground"
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
              {productType && (
                <p className="font-body text-[11px] tracking-[0.15em] uppercase text-aevi-label mb-2">{productType}</p>
              )}
              <h1 className="font-display italic text-[22px] md:text-3xl text-foreground mb-2">{product.title}</h1>
              <p className="font-body text-xl text-primary font-bold mb-6">
                {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
              </p>

              <p className="font-body font-light text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              {/* Material badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 bg-aevi-peach text-aevi-orange-deep rounded-full"
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
                        className={`px-4 py-2 font-body text-xs rounded-lg transition-colors ${
                          i === selectedVariantIdx
                            ? "border-2 border-primary bg-primary text-primary-foreground"
                            : "border border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !variant?.availableForSale}
                className="w-full bg-primary text-primary-foreground font-body text-xs tracking-[0.15em] uppercase py-3.5 hover:bg-aevi-orange-deep transition-colors rounded-lg disabled:opacity-50 mb-3"
              >
                {isCartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : !variant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  "Add to Bag"
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  setWishlisted(!wishlisted);
                  toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 border rounded-lg font-body text-xs tracking-[0.1em] uppercase transition-colors mb-8 ${
                  wishlisted ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                {wishlisted ? "Saved" : "Save to Wishlist"}
              </button>

              {/* Trust bar */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-secondary rounded-lg">
                {[
                  { icon: "✦", text: "Free ship $35+" },
                  { icon: "◎", text: "925 Silver" },
                  { icon: "↩", text: "30-day returns" },
                  { icon: "✉", text: "Gift wrap" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <span className="text-primary text-sm">{item.icon}</span>
                    <span className="font-body text-[11px] text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display italic text-2xl text-foreground mb-8">You might also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <ShopifyProductCard key={p.node.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <ImageLightbox
        images={images.map((img) => ({ url: img.node.url, altText: img.node.altText }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
