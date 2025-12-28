import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../../api/http";
import AdminImageUpload from "../../components/AdminImageUpload.jsx";

export default function MenuEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    isAvailable: true,
    sortOrder: "0",
    currency: "GBP",
  });

  const priceCents = useMemo(() => {
    const n = form.price.replace(",", ".");
    const [p, c = "0"] = n.split(".");
    if (!/^\d+$/.test(p) || !/^\d+$/.test(c)) return null;
    return Number(p) * 100 + Number((c + "00").slice(0, 2));
  }, [form.price]);

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, itemRes] = await Promise.all([
          http.get("/admin/categories"),
          http.get(`/admin/menu/${id}`),
        ]);

        const it = itemRes.data.item;

        setCategories(catsRes.data.categories || []);
        setForm({
          name: it.name || "",
          description: it.description || "",
          price: (it.price_cents / 100).toFixed(2),
          imageUrl: it.imageUrl || "",
          categoryId: it.categoryId ? String(it.categoryId) : "",
          isAvailable: !!it.is_available,
          sortOrder: String(it.sort_order || 0),
          currency: it.currency || "GBP",
        });
      } catch {
        setErr("Failed to load menu item");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!form.name.trim()) return setErr("Name is required");
    if (priceCents == null) return setErr("Invalid price");

    try {
      await http.put(`/admin/menu/${id}`, {
        name: form.name.trim(),
        description: form.description.trim(),
        price_cents: priceCents,
        currency: form.currency,
        imageUrl: form.imageUrl || null,
        category_id: form.categoryId === "" ? null : Number(form.categoryId),
        is_available: form.isAvailable,
        sort_order: Number(form.sortOrder || 0),
      });

      nav("/admin/menu");
    } catch {
      setErr("Update failed");
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Menu Item</h1>

      {err && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Price / Category */}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="rounded-lg border px-3 py-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="9.99"
            required
          />

          <select
            className="rounded-lg border bg-white px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload + Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>

          <div className="mt-1 flex items-center gap-4">
            <AdminImageUpload
              onUploaded={(url) =>
                setForm({ ...form, imageUrl: url })
              }
            />

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover border"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder-food.webp";
                }}
              />
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Upload image via Cloudinary. Preview shown above.
          </p>
        </div>

        {/* Available / Sort */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
            />
            Available
          </label>

          <input
            className="rounded-lg border px-3 py-2"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: e.target.value })
            }
            placeholder="Sort order"
          />
        </div>

        <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
