import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdminCategories, apiAdminCreateMenuItem } from "../../api/menu.js";
import AdminImageUpload from "../../components/AdminImageUpload.jsx";

export default function MenuNew() {
  const nav = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("9.99");
  const [currency, setCurrency] = useState("GBP");
  const [categoryId, setCategoryId] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [imageUrl, setImageUrl] = useState("");

  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiAdminCategories();
        setCategories(data.categories || []);
      } catch {
        setErr("Failed to load categories");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  const priceCents = useMemo(() => {
    const n = price.replace(",", ".");
    const [p, c = "0"] = n.split(".");
    if (!/^\d+$/.test(p) || !/^\d+$/.test(c)) return null;
    return Number(p) * 100 + Number((c + "00").slice(0, 2));
  }, [price]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("Name is required");
    if (priceCents == null) return setErr("Invalid price");

    setSaving(true);
    try {
      await apiAdminCreateMenuItem({
        name: name.trim(),
        description: description.trim(),
        price_cents: priceCents,
        currency,
        category_id: categoryId === "" ? null : Number(categoryId),
        is_available: isAvailable,
        sort_order: Number(sortOrder || 0),
        imageUrl: imageUrl || null,
      });

      nav("/admin/menu");
    } catch {
      setErr("Failed to create menu item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-gray-900">New Menu Item</h1>

      {err && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price / Currency */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (GBP)
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="9.99"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload + Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>

          <div className="flex items-center gap-4 mt-1">
            <AdminImageUpload onUploaded={(url) => setImageUrl(url)} />

            {imageUrl && (
              <img
                src={imageUrl}
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
            Upload image via Cloudinary. Preview shown after upload.
          </p>
        </div>

        {/* Availability / Sort */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Available
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sort order
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Create Menu Item"}
        </button>
      </form>
    </div>
  );
}
