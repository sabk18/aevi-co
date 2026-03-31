import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createCustomer, customerLogin, fetchCustomer } from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createCustomer({ email, password, firstName, lastName });
      if (result.errors.length > 0) {
        toast.error(result.errors[0].message);
        return;
      }
      const loginResult = await customerLogin(email, password);
      if ("errors" in loginResult) {
        toast.success("Account created! Please sign in.");
        navigate("/login");
        return;
      }
      const customer = await fetchCustomer(loginResult.accessToken);
      setAuth(loginResult.accessToken, customer);
      toast.success("Welcome to Éclat!");
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
          <h1 className="font-display text-3xl text-foreground text-center mb-8">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1 block">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border eclat-border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-foreground transition-colors rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1 block">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border eclat-border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-foreground transition-colors rounded-sm" />
              </div>
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-transparent border eclat-border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-foreground transition-colors rounded-sm" />
            </div>
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={5}
                className="w-full bg-transparent border eclat-border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-foreground transition-colors rounded-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
            </button>
          </form>
          <p className="text-center font-body text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SignUp;
