import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerStrip from "@/components/TickerStrip";
import EmailSubscribe from "@/components/EmailSubscribe";

const About = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-6 text-center noise-overlay relative">
        <div className="relative z-10 container mx-auto max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-[11px] tracking-[0.2em] uppercase text-aevi-label mb-4"
          >
            Est. 2026 · Crafted with intention
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display italic text-4xl md:text-5xl text-foreground leading-[1.15] mb-6"
          >
            Born from wanderlust. Made for you.
          </motion.h1>
          <div className="w-16 h-px bg-aevi-gold mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body font-light text-base text-muted-foreground max-w-lg mx-auto"
          >
            We traveled the world looking for pieces that felt right — real, 
            wearable, beautiful without trying too hard. This is where we landed.
          </motion.p>
        </div>
      </section>

      {/* Story block */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl aspect-[4/5] overflow-hidden">
              <img src="https://cdn.shopify.com/s/files/1/0816/1191/5484/files/DSC03265_40x40@3x.jpg?v=1773719348" alt="Aevi Lifestyle jewelry" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-aevi-label mb-3">Our story</p>
              <h2 className="font-display italic text-2xl md:text-3xl text-foreground mb-4 leading-snug">
                Found in markets. Worn in cities.
              </h2>
              <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                We believe elegance isn't a luxury — it's a feeling you carry. 
                Pieces brought from across the world, designed to move with your life 
                without the price tag that holds you back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values row */}
      <section className="py-16 px-6 bg-secondary noise-overlay relative">
        <div className="relative z-10 container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: "✦",
                title: "Real materials",
                desc: "925 sterling silver & 18K gold-plated. Nothing less.",
              },
              {
                icon: "◎",
                title: "Everyday wear",
                desc: "Designed to be worn, not saved for special occasions.",
              },
              {
                icon: "◇",
                title: "Accessible price",
                desc: "You shouldn't have to choose between quality and cost.",
              },
            ].map((val) => (
              <div key={val.title}>
                <span className="text-primary text-2xl block mb-3">{val.icon}</span>
                <h3 className="font-display italic text-lg text-foreground mb-2">{val.title}</h3>
                <p className="font-body font-light text-sm text-muted-foreground">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 px-6 bg-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="font-display italic text-2xl md:text-3xl text-aevi-gold leading-relaxed mb-8">
            "For the girl who is many things at once — and looks effortless doing it."
          </p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-aevi-footer-link">
            Aevi Lifestyle · Est. 2026
          </p>
        </div>
      </section>

      {/* Founder note */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-aevi-peach mx-auto mb-6" />
          <p className="font-display italic text-lg text-foreground leading-relaxed mb-4 max-w-lg mx-auto">
            "I started this because I couldn't find jewelry that felt like me — real, wearable, 
            beautiful without trying too hard. So I went looking for it myself."
          </p>
          <p className="font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
            Founder · Aevi Lifestyle · 2026
          </p>
        </div>
      </section>

      {/* Ticker */}
      <TickerStrip />

      {/* Email subscribe */}
      <EmailSubscribe />

      <Footer />
    </div>
  );
};

export default About;
