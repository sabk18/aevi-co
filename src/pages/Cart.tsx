import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 35;

const Cart = () => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();

  useEffect(() => { syncCart(); }, [syncCart]);

  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "USD";
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) window.open(checkoutUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-20 pb-24 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl text-foreground mb-4">Your Bag is Empty</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">Discover something you love.</p>
            <Link
              to="/shop"
              className="inline-block bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-foreground/90 transition-colors rounded-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-8 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-display text-3xl text-foreground mb-8">Shopping Bag</h1>

          {/* Free shipping progress */}
          <div className="p-4 bg-card rounded-sm mb-8">
            {shippingRemaining > 0 ? (
              <p className="font-body text-xs text-muted-foreground mb-2">
                You're <span className="text-gold-accent font-medium">${shippingRemaining.toFixed(2)}</span> away from free shipping
              </p>
            ) : (
              <p className="font-body text-xs text-gold-accent font-medium mb-2">
                🎉 You've unlocked free shipping!
              </p>
            )}
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-gold-accent rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>

          <div className="space-y-0">
            {items.map((item) => (
              <motion.div
                key={item.variantId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-5 items-center py-5 eclat-border border-b border-border"
              >
                <div className="w-20 h-20 bg-card overflow-hidden flex-shrink-0 rounded-sm">
                  {item.product.node.images?.edges?.[0]?.node && (
                    <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm text-foreground">{item.product.node.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    {item.selectedOptions.map(o => o.value).join(' · ')}
                  </p>
                  <p className="font-body text-sm text-gold-accent mt-1">
                    {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-body text-xs w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-body text-sm text-foreground w-20 text-right">
                  {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                </p>
                <button onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-destructive" disabled={isLoading}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-body text-sm text-muted-foreground">Subtotal</p>
              <p className="font-display text-2xl text-foreground">{currency} {totalPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading || isSyncing}
              className="bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase px-10 py-3.5 hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-50"
            >
              {isLoading || isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Checkout"
              )}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart;
