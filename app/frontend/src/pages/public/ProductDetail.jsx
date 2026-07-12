import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { ChevronRight, Pill, Package, FileText } from "lucide-react";
import api, { fileUrl } from "@/lib/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { settings } = useOutletContext() || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-slate-500">
        {settings?.product_loading || "Loading…"}
      </div>
    );
  }
  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-slate-500">
        {settings?.product_not_found || "Product not found."}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12" data-testid="product-detail">
      <nav className="text-xs text-slate-500 flex items-center gap-1 mb-8">
        <Link to="/" className="hover:text-sky-700">
          {settings?.nav_home || "Home"}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-sky-700">
          {settings?.nav_products || "Products"}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center p-12">
          <img
            src={fileUrl(product.image_url)}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div>
          <div className="overline mb-3">{product.category?.name || "Product"}</div>
          <h1 className="text-4xl sm:text-5xl font-display font-light text-slate-900 tracking-tight">
            {product.name}
          </h1>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  {settings?.product_label_composition || "Composition"}
                </div>
                <div className="text-base text-slate-900 font-medium">{product.composition || "—"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  {settings?.product_label_packaging || "Packaging"}
                </div>
                <div className="text-base text-slate-900 font-medium">{product.packaging || "—"}</div>
              </div>
            </div>

            {product.description && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    {settings?.product_label_description || "Description"}
                  </div>
                  <div className="text-base text-slate-700 leading-relaxed">{product.description}</div>
                </div>
              </div>
            )}
          </div>

          <Link
            to={`/contact?product=${encodeURIComponent(product.name)}`}
            data-testid="product-inquire-btn"
            className="mt-10 inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white rounded-md px-6 py-3 text-sm font-medium transition-colors"
          >
            {settings?.product_inquire_cta || "Enquire about this product"}
          </Link>
        </div>
      </div>
    </section>
  );
}
