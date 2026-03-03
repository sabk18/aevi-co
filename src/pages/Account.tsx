import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Account = () => {
  const { customer, accessToken, logout, refreshCustomer, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    refreshCustomer();
  }, [accessToken, navigate, refreshCustomer]);

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <p className="font-accent text-lg text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const orders = customer.orders?.edges || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-2">My Account</h1>
                <p className="font-accent text-lg text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {customer.firstName ? `${customer.firstName} ${customer.lastName || ''}` : customer.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => { logout(); navigate("/"); }}
                className="font-body text-xs tracking-[0.15em] uppercase"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Orders */}
            <div>
              <h2 className="font-display text-2xl tracking-wide mb-6 flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-16 border border-border rounded-md bg-card">
                  <p className="font-accent text-lg text-muted-foreground mb-2">No orders yet</p>
                  <p className="font-body text-sm text-muted-foreground">Your order history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(({ node: order }) => (
                    <div key={order.id} className="border border-border rounded-md bg-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground">
                            Order {order.name}
                          </p>
                          <p className="font-accent text-sm text-muted-foreground">
                            {new Date(order.processedAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg">
                            {parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                          </p>
                          {order.statusUrl && (
                            <a
                              href={order.statusUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-body text-xs text-primary hover:underline tracking-[0.1em] uppercase"
                            >
                              Track Order
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.lineItems.edges.map(({ node: item }, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            {item.variant?.image && (
                              <img
                                src={item.variant.image.url}
                                alt={item.variant.image.altText || item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-accent text-base">{item.title}</p>
                              <p className="font-body text-xs text-muted-foreground">
                                Qty: {item.quantity}
                                {item.variant?.price && ` · ${parseFloat(item.variant.price.amount).toFixed(2)} ${item.variant.price.currencyCode}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
