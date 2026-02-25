import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Get in Touch</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">Contact Us</h1>
              <p className="font-accent text-xl text-muted-foreground leading-relaxed mb-10">
                We'd love to hear from you. Whether you have a question about our collections, need help with an order, or want to discuss a custom piece.
              </p>
              <div className="space-y-6">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Email</p>
                  <p className="font-accent text-lg text-foreground">hello@noraatelier.com</p>
                </div>
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Hours</p>
                  <p className="font-accent text-lg text-foreground">Mon–Fri, 9am–6pm EST</p>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-muted border-border font-accent text-lg h-12"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-muted border-border font-accent text-lg h-12"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Message</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-muted border-border font-accent text-lg"
                />
              </div>
              <Button variant="luxury" size="lg" type="submit" className="w-full h-12">
                Send Message
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
