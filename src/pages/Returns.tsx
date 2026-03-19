import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-aevi-label mb-3">Our Policy</p>
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-10">Returns & Exchanges</h1>

            <div className="space-y-10">
              {/* Our Promise */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">Our Promise</h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  At Aevi, we want you to love every piece. If something isn't right, we're here to make it right.
                </p>
              </div>

              {/* Return Window */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">Return Window</h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed mb-3">
                  We accept returns within 30 days of delivery for items that are:
                </p>
                <ul className="space-y-1 font-body font-light text-sm text-muted-foreground">
                  <li>✦ Unworn and undamaged</li>
                  <li>✦ In their original condition</li>
                  <li>✦ Returned with proof of purchase</li>
                </ul>
              </div>

              {/* How to Start a Return */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">How to Start a Return</h2>
                <ol className="space-y-2 font-body font-light text-sm text-muted-foreground leading-relaxed list-decimal list-inside">
                  <li>Email us at <a href="mailto:nora.atelier.jewelry@gmail.com" className="text-primary hover:underline">nora.atelier.jewelry@gmail.com</a> with your order number and reason for return</li>
                  <li>We'll respond within 2 business days with return instructions</li>
                  <li>Ship the item back to us</li>
                  <li>Once received and inspected, your refund will be processed within 5–7 business days to your original payment method</li>
                </ol>
              </div>

              {/* Exchanges */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">Exchanges</h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  Want a different piece instead? We're happy to exchange. Just follow the same process above and let us know what you'd like instead — subject to availability.
                </p>
              </div>

              {/* Non-Returnable Items */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">Non-Returnable Items</h2>
                <ul className="space-y-1 font-body font-light text-sm text-muted-foreground">
                  <li>✦ Items marked as final sale</li>
                  <li>✦ Items that show signs of wear, damage, or alteration</li>
                  <li>✦ Gift cards</li>
                </ul>
              </div>

              {/* Damaged or Wrong Item */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">Damaged or Wrong Item?</h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  If your order arrives damaged or we sent the wrong item, please email us within 7 days of delivery with a photo and we'll sort it immediately — no need to return anything.
                </p>
              </div>

              {/* Return Shipping */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-3">Return Shipping</h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  Return shipping costs are the responsibility of the customer unless the item arrived damaged or incorrect, in which case we cover it fully.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Returns;
