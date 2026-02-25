import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<"cart" | "billing">(items.length > 0 ? "cart" : "cart");
  const [billing, setBilling] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "" });

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Order placed!", description: "Thank you for shopping with Nora Atelier." });
    clearCart();
    setStep("cart");
  };

  if (items.length === 0 && step === "cart") {
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
          <h1 className="font-display text-4xl text-foreground mb-12">
            {step === "cart" ? "Shopping Bag" : "Billing"}
          </h1>

          {step === "cart" ? (
            <div>
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-6 items-center border-b border-border pb-6"
                  >
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                    <div className="flex-1">
                      <h3 className="font-accent text-lg text-foreground">{item.name}</h3>
                      <p className="font-body text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-body text-sm text-foreground w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex items-center justify-between">
                <p className="font-display text-2xl text-foreground">Total: ${total.toFixed(2)}</p>
                <Button variant="luxury" size="lg" onClick={() => setStep("billing")}>
                  Proceed to Billing
                </Button>
              </div>
            </div>
          ) : (
            <motion.form
              onSubmit={handleCheckout}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-foreground mb-4">Shipping Details</h2>
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Full Name</label>
                  <Input value={billing.name} onChange={(e) => setBilling({...billing, name: e.target.value})} required className="bg-muted border-border font-accent text-lg h-12" />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Email</label>
                  <Input type="email" value={billing.email} onChange={(e) => setBilling({...billing, email: e.target.value})} required className="bg-muted border-border font-accent text-lg h-12" />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Address</label>
                  <Input value={billing.address} onChange={(e) => setBilling({...billing, address: e.target.value})} required className="bg-muted border-border font-accent text-lg h-12" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">City</label>
                    <Input value={billing.city} onChange={(e) => setBilling({...billing, city: e.target.value})} required className="bg-muted border-border font-accent text-lg h-12" />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Zip Code</label>
                    <Input value={billing.zip} onChange={(e) => setBilling({...billing, zip: e.target.value})} required className="bg-muted border-border font-accent text-lg h-12" />
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-foreground mb-4">Payment</h2>
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Card Number</label>
                  <Input value={billing.card} onChange={(e) => setBilling({...billing, card: e.target.value})} placeholder="•••• •••• •••• ••••" required className="bg-muted border-border font-accent text-lg h-12" />
                </div>
                <div className="border-t border-border pt-6 mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-body text-sm text-foreground">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-body text-sm text-muted-foreground">Shipping</span>
                    <span className="font-body text-sm text-foreground">Free</span>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-border">
                    <span className="font-display text-xl text-foreground">Total</span>
                    <span className="font-display text-xl text-foreground">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="hero-outline" type="button" onClick={() => setStep("cart")} className="flex-1">
                    Back
                  </Button>
                  <Button variant="luxury" type="submit" className="flex-1 h-12">
                    Place Order
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart;
