// src/pages/Menu.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiGetMenu } from "../api/menu";
import { useCart } from "../context/CartContext";

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Menu() {
  const { add } = useCart();

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ no "All"

  const sectionRefs = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetMenu();
        setItems(Array.isArray(data) ? data : data?.items ?? []);
      } catch {
        setErr("Failed to load menu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { categories, grouped } = useMemo(() => {
    const map = new Map();
    items.forEach((it) => {
      const name = it.categoryName || "Uncategorized";
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(it);
    });

    const cats = [...map.keys()];
    return { categories: cats, grouped: map };
  }, [items]);

  // set default selected category once categories are ready
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  function scrollToCategory(cat) {
    const el = sectionRefs.current[slugify(cat)];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72; // navbar offset
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  const chipClass = (active) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm border transition ${
      active
        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading && <div className="text-gray-600 lg:pl-[300px]">Loading…</div>}
        {err && <div className="text-red-600 lg:pl-[300px]">{err}</div>}

        {/* Mobile/Tablet chips */}
        {(categories.length > 0 || loading) && (
          <div className="lg:hidden mt-2 sticky top-16 z-40 -mx-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {(loading ? ["Loading…"] : categories).map((c) => (
                <button
                  key={c}
                  disabled={loading}
                  onClick={() => {
                    if (loading) return;
                    setSelectedCategory(c);
                    scrollToCategory(c);
                  }}
                  className={chipClass(selectedCategory === c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 lg:mt-0 relative">
          {/* Desktop fixed categories */}
          <aside className="hidden lg:block">
            <div className="fixed top-16 w-[280px]">
              <div className="rounded-xl p-5">
                {/* <div className="font-semibold text-gray-800 mb-3">
                  Categories
                </div> */}

                <div className="max-h-[72vh] overflow-auto space-y-1 pr-1">
                  {loading ? (
                    <>
                      <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                      <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                      <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                      <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                      <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                    </>
                  ) : (
                    <>
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCategory(c);
                            scrollToCategory(c);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                            selectedCategory === c
                              ? "bg-emerald-100 text-emerald-800"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Right column: ALWAYS show all categories */}
          <div className="space-y-10 lg:pl-[300px]">
            {!loading &&
              categories.map((cat) => (
                <section
                  key={cat}
                  ref={(el) => (sectionRefs.current[slugify(cat)] = el)}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {cat}
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {grouped.get(cat)?.map((it) => (
                      <div key={it.id} className="overflow-hidden">
                        {it.imageUrl && (
                          <img
                            src={it.imageUrl}
                            alt={it.name}
                            className="h-44 w-full object-cover"
                            loading="lazy"
                          />
                        )}

                        <div className="p-4">
                          <div className="flex justify-between gap-3">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {it.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {it.description}
                              </div>
                            </div>
                            <div className="font-medium text-gray-900">
                              £{Number(it.price).toFixed(2)}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              add({
                                id: it.id,
                                name: it.name,
                                price: it.price,
                                imageUrl: it.imageUrl,
                              })
                            }
                            className="mt-4 w-full rounded-sm bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600"
                          >
                            Add to cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}
