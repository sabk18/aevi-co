import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { customerLogin, fetchCustomer } from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await customerLogin(email, password);
      if ("errors" in result) {
        toast.error((result.errors as any)[0]?.message || "Invalid credentials");
        return;
      }
      const customer = await fetchCustomer(result.accessToken);
      setAuth(result.accessToken, customer);
      toast.success("Welcome back!");
      navigate("/account");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aevi-full-vh bg-background">
      <Navbar />
      <section className="pt-20 pb-24 px-6">
        <div className="container mx-auto max-w-sm">
          <h1 className="font-display text-3xl text-foreground text-center mb-8">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border eclat-border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-foreground transition-colors rounded-sm"
              />
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border eclat-border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-foreground transition-colors rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sign In"}
            </button>
          </form>
          <p className="text-center font-body text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground underline underline-offset-4">Create one</Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
