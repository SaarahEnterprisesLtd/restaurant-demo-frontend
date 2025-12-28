import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../api/http";
import { apiAdminDeleteMenuItem } from "../../api/menu";

export default function MenuList() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const { data } = await http.get("/admin/menu"); // { items: [...] }
      setItems(data?.items || []);
    } catch (e) {
      setErr(e.userMessage || e.message || "Failed to load admin menu");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    try {
      await apiAdminDeleteMenuItem(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete menu item");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>

        <Link
          to="/admin/menu/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + New item
        </Link>
      </div>

      {err && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="mt-6 text-gray-600">No items yet.</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Available</th>
                <th className="p-3 font-semibold">Sort</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-gray-200">
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">
                      {it.name}
                    </div>
                    {it.description && (
                      <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {it.description}
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-gray-700">
                    {it.categoryName || "Uncategorized"}
                  </td>

                  <td className="p-3 text-gray-900">
                    {it.currency}{" "}
                    {(Number(it.price_cents) / 100).toFixed(2)}
                  </td>

                  <td className="p-3">
                    {it.is_available ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-800">
                        No
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-gray-900">
                    {it.sort_order ?? 0}
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/menu/${it.id}`}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(it)}
                      className="ml-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && items.length > 0 && (
        <button
          onClick={load}
          className="mt-4 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Refresh
        </button>
      )}
    </div>
  );
}
