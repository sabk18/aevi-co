import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Shipping = () => {
  return (
    <div className="aevi-full-vh bg-background animate-fade-in">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-aevi-label mb-3">Delivery Info</p>
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-10">Shipping</h1>

            <div className="space-y-10">
              {/* Estimated Delivery */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-4">United States — Estimated Delivery</h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  5–10 business days
                </p>
              </div>

              {/* Shipping Rates */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-4">Shipping Rates</h2>
                <ul className="space-y-2 font-body font-light text-sm text-muted-foreground leading-relaxed">
                  <li>✦ <span className="text-foreground font-normal">Free shipping</span> on all orders over $35</li>
                  <li>✦ <span className="text-foreground font-normal">Standard shipping:</span> $4.99 on orders under $35</li>
                </ul>
              </div>

              {/* Please Note */}
              <div>
                <h2 className="font-display italic text-xl text-foreground mb-4">Please Note</h2>
                <ul className="space-y-3 font-body font-light text-sm text-muted-foreground leading-relaxed">
                  <li>Delivery times are estimates and may vary due to customs, holidays, or carrier delays.</li>
                  <li>International orders may be subject to import duties or taxes — these are the responsibility of the customer.</li>
                  <li>We are not responsible for delays once the package is with the carrier.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping;
