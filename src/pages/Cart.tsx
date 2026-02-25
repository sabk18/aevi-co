import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, Trash2, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart, clearCart } = useCartStore();

  useEffect(() => { syncCart(); }, [syncCart]);

  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "USD";

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl text-foreground mb-6">Your Bag is Empty</h1>
            <p className="font-accent text-xl text-muted-foreground mb-10">Discover our handcrafted collections.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/silver"><Button variant="luxury" size="lg">Silver Collection</Button></Link>
              <Link to="/gold"><Button variant="luxury" size="lg">Gold Collection</Button></Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl text-foreground mb-12">Shopping Bag</h1>
          <div className="space-y-6">
            {items.map((item) => (
              <motion.div
                key={item.variantId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6 items-center border-b border-border pb-6"
              >
                <div className="w-24 h-24 overflow-hidden flex-shrink-0">
                  {item.product.node.images?.edges?.[0]?.node && (
                    <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-accent text-lg text-foreground">{item.product.node.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {item.selectedOptions.map(o => o.value).join(' · ')}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="text-muted-foreground hover:text-foreground" disabled={isLoading}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-body text-sm text-foreground w-24 text-right">
                  {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                </p>
                <button onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-destructive" disabled={isLoading}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-display text-2xl text-foreground">
              Total: {currency} {totalPrice.toFixed(2)}
            </p>
            <Button variant="luxury" size="lg" onClick={handleCheckout} disabled={isLoading || isSyncing} className="h-14 px-12">
              {isLoading || isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <><ExternalLink className="w-4 h-4 mr-2" /> Checkout with Shopify</>
              )}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart;
