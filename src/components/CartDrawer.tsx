import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const FREE_SHIPPING_THRESHOLD = 35;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "USD";
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/30 z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg">Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
              <button onClick={onClose} className="text-foreground hover:text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-6 py-3 bg-card">
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
                  <div
                    className="h-full bg-gold-accent rounded-full transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="font-display text-lg text-foreground mb-1">Your bag is empty</p>
                  <p className="font-body text-sm text-muted-foreground">Add something beautiful.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-20 h-20 bg-card overflow-hidden flex-shrink-0 rounded-sm">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm text-foreground truncate">{item.product.node.title}</h4>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {item.selectedOptions.map(o => o.value).join(' · ')}
                        </p>
                        <p className="font-body text-sm text-gold-accent mt-1">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} disabled={isLoading} className="text-muted-foreground hover:text-foreground">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-body text-xs w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} disabled={isLoading} className="text-muted-foreground hover:text-foreground">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => removeItem(item.variantId)} disabled={isLoading} className="ml-auto text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-sm text-foreground">Subtotal</span>
                  <span className="font-display text-lg text-foreground">{currency} {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing}
                  className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase py-3.5 hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-50"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Checkout"
                  )}
                </button>
                <p className="font-body text-[11px] text-muted-foreground text-center mt-3">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
