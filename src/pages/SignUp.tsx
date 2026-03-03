import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCustomer } from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await createCustomer({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        acceptsMarketing: true,
      });

      if (result.errors.length > 0) {
        setError(result.errors[0].message);
        return;
      }

      // Auto-login after signup
      const loginResult = await login(email, password);
      if (loginResult.success) {
        navigate("/account");
      } else {
        navigate("/login");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-20 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-3">Create Account</h1>
            <p className="font-accent text-lg text-muted-foreground">Join the Nora Atelier family</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-body">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 font-accent text-base border-border bg-card"
                    placeholder="First"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Last Name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="font-accent text-base border-border bg-card"
                  placeholder="Last"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-accent text-base border-border bg-card"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 font-accent text-base border-border bg-card"
                  placeholder="Min. 5 characters"
                  required
                  minLength={5}
                />
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>

            <p className="text-center font-accent text-base text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
