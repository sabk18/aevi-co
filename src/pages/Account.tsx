import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchCustomer, ShopifyCustomer } from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";

const Account = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) { navigate("/login"); return; }
    fetchCustomer(accessToken).then((c) => {
      if (!c) { logout(); navigate("/login"); return; }
      setCustomer(c);
      setLoading(false);
    });
  }, [accessToken, navigate, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  const orders = customer?.orders?.edges || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-12 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-display text-3xl text-foreground">Hello, {customer?.firstName || "there"}</h1>
              <p className="font-body text-sm text-muted-foreground mt-1">{customer?.email}</p>
            </div>
            <button onClick={() => { logout(); navigate("/"); }}
              className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors">
              Sign Out
            </button>
          </div>

          <h2 className="font-display text-xl text-foreground mb-6">Order History</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-sm">
              <p className="font-body text-sm text-muted-foreground mb-4">No orders yet.</p>
              <Link to="/shop"
                className="inline-block bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase px-6 py-2.5 hover:bg-foreground/90 transition-colors rounded-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(({ node: order }) => (
                <div key={order.id} className="p-5 bg-card rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-body text-sm text-foreground font-medium">{order.name}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {new Date(order.processedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm text-gold-accent">
                        {order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toFixed(2)}
                      </p>
                      {order.statusUrl && (
                        <a href={order.statusUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                          Track <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {order.lineItems.edges.map(({ node: item }, i) => (
                      <div key={i} className="flex-shrink-0 w-12 h-12 bg-background rounded-sm overflow-hidden">
                        {item.variant?.image ? (
                          <img src={item.variant.image.url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[8px]">—</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Account;
