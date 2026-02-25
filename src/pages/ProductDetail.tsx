import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle).then((p) => { setProduct(p); setLoading(false); });
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center"><h1 className="font-display text-3xl text-foreground">Product not found</h1></div>
        <Footer />
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

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
      <section className="pt-28 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-body text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {images.length > 0 && (
                <img
                  src={images[selectedImage]?.node.url}
                  alt={images[selectedImage]?.node.altText || product.title}
                  className="w-full aspect-square object-cover luxury-shadow mb-4"
                />
              )}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Nora Atelier</p>
              <h1 className="font-display text-4xl text-foreground mb-4">{product.title}</h1>
              <p className="font-display text-2xl text-primary mb-8">
                {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
              </p>
              <p className="font-accent text-lg text-muted-foreground leading-relaxed mb-10">{product.description}</p>

              {/* Variants */}
              {product.variants.edges.length > 1 && (
                <div className="mb-8">
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Variant</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v, i) => (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariantIdx(i)}
                        className={`px-4 py-2 font-body text-sm border transition-colors ${
                          i === selectedVariantIdx ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="luxury"
                size="lg"
                className="w-full h-14"
                onClick={handleAddToCart}
                disabled={isCartLoading || !variant?.availableForSale}
              >
                {isCartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : !variant?.availableForSale ? "Sold Out" : "Add to Bag"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;
