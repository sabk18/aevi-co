import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const CATEGORIES = [
  { label: "Necklaces", type: "necklace" },
  { label: "Bracelets", type: "bracelet" },
  { label: "Rings", type: "ring" },
  { label: "Earrings", type: "earrings" },
];

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-[#d4722a] font-medium">{part}</span>
    ) : (
      part
    )
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProducts(50, q).then((products) => {
      setResults(products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const goToProduct = (handle: string) => {
    onClose();
    navigate(`/product/${handle}`);
  };

  const goToCategory = (label: string) => {
    onClose();
    navigate(`/shop?category=${label}`);
  };

  // Match categories from query
  const matchedCategories = query.trim()
    ? CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile: full-screen overlay; Desktop: dropdown */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed md:absolute left-0 right-0 top-0 md:top-full z-[60] md:z-50 overflow-hidden bg-[#fdfaf7] border-b border-[#f0e8dc] md:shadow-lg"
            style={{ maxHeight: "100dvh" }}
          >
            <div className="flex flex-col h-full md:h-auto">
              {/* Search input row */}
              <div className="flex items-center gap-3 px-6 py-3 border-b border-[#f0e8dc]">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                  type="text"
                  placeholder="Search jewelry..."
                  className="flex-1 bg-transparent font-body text-sm text-[#1a1208] font-normal outline-none placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") onClose();
                  }}
                />
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results area */}
              {hasQuery && (
                <div className="overflow-y-auto max-h-[60vh] md:max-h-[400px]">
                  {/* Category matches */}
                  {matchedCategories.length > 0 && (
                    <div className="px-6 py-2 border-b border-[#f0e8dc]">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {matchedCategories.map((cat) => (
                          <button
                            key={cat.label}
                            onClick={() => goToCategory(cat.label)}
                            className="px-3 py-1.5 rounded-full border border-[#f0e8dc] text-xs font-body text-[#1a1208] hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {highlightMatch(cat.label, query)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loading */}
                  {loading && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {/* Product results */}
                  {!loading && results.length > 0 && (
                    <div className="px-6 py-2">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body mb-2">Products</p>
                      <ul className="divide-y divide-[#f0e8dc]">
                        {results.map((product) => {
                          const p = product.node;
                          const img = p.images.edges[0]?.node.url;
                          const price = parseFloat(p.priceRange.minVariantPrice.amount);
                          const currency = p.priceRange.minVariantPrice.currencyCode;
                          return (
                            <li key={p.id}>
                              <button
                                onClick={() => goToProduct(p.handle)}
                                className="w-full flex items-center gap-3 py-3 text-left hover:bg-black/[0.02] transition-colors rounded-sm"
                              >
                                {img && (
                                  <img
                                    src={img}
                                    alt={p.title}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-body text-sm text-[#1a1208] truncate">
                                    {highlightMatch(p.title, query)}
                                  </p>
                                  {p.productType && (
                                    <p className="font-body text-xs text-muted-foreground">
                                      {highlightMatch(p.productType, query)}
                                    </p>
                                  )}
                                </div>
                                <span className="font-body text-sm text-[#1a1208] shrink-0">
                                  {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price)}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* No results */}
                  {!loading && results.length === 0 && (
                    <div className="px-6 py-10 text-center">
                      <p className="font-display italic text-base text-muted-foreground">
                        No pieces found for '{query}'
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[55] md:hidden"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
