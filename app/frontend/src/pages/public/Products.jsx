import React, { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import api, { fileUrl } from "@/lib/api";
import { Search } from "lucide-react";

export default function Products() {
  const { settings } = useOutletContext() || {};
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const activeSlug = params.get("category") || "";

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data || []));
  }, []);

  useEffect(() => {
    const search = params.get("q") || "";
    setQ(search);
    const query = {};
    if (activeSlug) query.category = activeSlug;
    if (search) query.q = search;
    api.get("/products", { params: query }).then((r) => setProducts(r.data || []));
  }, [params, activeSlug]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (q) next.set("q", q);
    else next.delete("q");
    setParams(next);
  };

  const setCategory = (slug) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setParams(next);
  };

  const groupTitle = useMemo(() => {
    if (activeSlug) {
      const c = categories.find((cat) => cat.slug === activeSlug);
      return c?.name || settings?.products_title_all || "Products";
    }
    return settings?.products_title_all || "All products";
  }, [activeSlug, categories, settings]);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16" data-testid="products-page">
      <div className="overline mb-3">{settings?.products_overline || "CATALOGUE"}</div>
      <h1 className="text-4xl sm:text-5xl font-display font-light text-slate-900 tracking-tight mb-10">
        {groupTitle}
      </h1>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-1" data-testid="products-sidebar">
          <button
            onClick={() => setCategory("")}
            data-testid="filter-all"
            className={`w-full text-left text-sm py-2.5 px-4 rounded-md transition-colors ${
              !activeSlug ? "bg-lime-600 text-white" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            {settings?.products_all_categories || "All categories"}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              data-testid={`filter-${c.slug}`}
              className={`w-full text-left text-sm py-2.5 px-4 rounded-md transition-colors ${
                activeSlug === c.slug ? "bg-lime-600 text-white" : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </aside>

        <div>
          <form onSubmit={handleSearch} className="relative mb-8" data-testid="products-search-form">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              data-testid="products-search-input"
              placeholder={settings?.products_search_placeholder || "Search by name or composition…"}
              className="w-full pl-10 pr-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm bg-white"
            />
          </form>

          {products.length === 0 ? (
            <div className="text-center py-20 text-slate-500" data-testid="products-empty">
              <p className="text-lg">{settings?.products_empty_title || "No products found."}</p>
              <p className="text-sm mt-1">
                {settings?.products_empty_subtitle || "Try a different category or search term."}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  data-testid={`product-card-${p.id}`}
                  className="product-card group bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={fileUrl(p.image_url)}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="overline text-[10px] mb-2">{p.category?.name || "Product"}</div>
                    <div className="font-display font-semibold text-slate-900">{p.name}</div>
                    <div className="text-sm text-slate-500 mt-1 line-clamp-2">{p.composition}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
