"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { upsertProduct, toggleProduct, deleteProduct } from "@/app/rgw-admin/actions";
import { useToast } from "@/components/providers/ToastProvider";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/lib/types";
import type { AdminRole } from "@/lib/types";

export function ProductsManager({ products, role }: { products: Product[]; role: AdminRole }) {
  const isSuper = role === "SUPER_ADMIN";
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function toggle(p: Product) {
    startTransition(async () => {
      await toggleProduct(p.id, !p.active);
      router.refresh();
    });
  }
  function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const r = await deleteProduct(p.id);
      toast(r.ok ? "Product deleted" : r.error || "Failed", r.ok ? "success" : "info");
      router.refresh();
    });
  }

  return (
    <div>
      {isSuper && (
        <button onClick={() => setEditing("new")} className="btn-gold mb-6">
          <Plus size={18} /> Add Product
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="card-lux flex gap-4 p-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-espresso)] to-[var(--color-maroon-deep)]">
              <Image src={p.images[0]} alt={p.name} fill className="object-contain p-2" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[var(--color-maroon)]">{p.name}</h3>
                {!p.active && <span className="rounded-full bg-[var(--color-ink)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ink-soft)]">Hidden</span>}
              </div>
              <p className="text-sm text-[var(--color-gold-deep)]">{formatINR(p.price)} · {p.weight}</p>
              <p className="text-xs text-[var(--color-ink-faint)]">Stock: {p.stock} · ⭐ {p.ratingAvg.toFixed(1)} ({p.ratingCount})</p>
              <div className="mt-auto flex gap-1.5 pt-2">
                <IconBtn onClick={() => toggle(p)} title={p.active ? "Hide" : "Show"}>
                  {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
                </IconBtn>
                {isSuper && (
                  <>
                    <IconBtn onClick={() => setEditing(p)} title="Edit"><Pencil size={15} /></IconBtn>
                    <IconBtn onClick={() => remove(p)} title="Delete" danger><Trash2 size={15} /></IconBtn>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isSuper && (
        <p className="mt-4 text-sm text-[var(--color-ink-faint)]">
          Staff can show/hide products. Editing, adding and deleting require Super Admin access.
        </p>
      )}

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
      {pending && <p className="mt-4 text-sm text-[var(--color-ink-faint)]">Updating…</p>}
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
        danger
          ? "border-[var(--color-maroon)]/30 text-[var(--color-maroon)] hover:bg-[var(--color-maroon)]/10"
          : "border-[var(--color-gold)]/30 text-[var(--color-ink-soft)] hover:bg-[var(--color-gold)]/15"
      }`}
    >
      {children}
    </button>
  );
}

function ProductEditor({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    tagline: product?.tagline ?? "",
    price: String(product?.price ?? 750),
    stock: String(product?.stock ?? 100),
    weight: product?.weight ?? "1 Kg",
    accent: product?.accent ?? "mawa",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    story: product?.story ?? "",
    ingredients: (product?.ingredients ?? []).join("\n"),
    notes: (product?.notes ?? []).join("\n"),
    images: (product?.images ?? ["/products/mawa-barfi.svg"]).join("\n"),
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data.path) {
      set("images", (form.images ? form.images + "\n" : "") + data.path);
      toast("Image uploaded");
    } else {
      toast(data.error || "Upload failed", "info");
    }
  }

  async function save() {
    setSaving(true);
    const r = await upsertProduct({
      id: product?.id,
      slug: product?.slug,
      name: form.name,
      tagline: form.tagline,
      price: Number(form.price),
      stock: Number(form.stock),
      weight: form.weight,
      accent: form.accent as "mawa" | "pistachio",
      shortDescription: form.shortDescription,
      description: form.description,
      story: form.story,
      ingredients: form.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      notes: form.notes.split("\n").map((s) => s.trim()).filter(Boolean),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      sortOrder: product?.sortOrder ?? 0,
    });
    setSaving(false);
    if (r.ok) {
      toast(product ? "Product updated" : "Product created");
      onSaved();
    } else {
      toast(r.error || "Failed to save", "info");
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-center overflow-y-auto bg-[var(--color-espresso)]/60 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-8 h-fit w-full max-w-2xl rounded-2xl bg-[var(--color-cream)] p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-maroon)]">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]"><X size={22} /></button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Name"><input className="inp" value={form.name} onChange={(e) => set("name", e.target.value)} /></L>
          <L label="Tagline"><input className="inp" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></L>
          <L label="Price (₹)"><input type="number" className="inp" value={form.price} onChange={(e) => set("price", e.target.value)} /></L>
          <L label="Stock"><input type="number" className="inp" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></L>
          <L label="Weight"><input className="inp" value={form.weight} onChange={(e) => set("weight", e.target.value)} /></L>
          <L label="Accent colour">
            <select className="inp" value={form.accent} onChange={(e) => set("accent", e.target.value)}>
              <option value="mawa">Mawa (amber)</option>
              <option value="pistachio">Pistachio (green)</option>
            </select>
          </L>
          <L label="Short description" full><textarea rows={2} className="inp" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></L>
          <L label="Full description" full><textarea rows={3} className="inp" value={form.description} onChange={(e) => set("description", e.target.value)} /></L>
          <L label="Story" full><textarea rows={3} className="inp" value={form.story} onChange={(e) => set("story", e.target.value)} /></L>
          <L label="Ingredients (one per line)"><textarea rows={5} className="inp" value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} /></L>
          <L label="Notes (one per line)"><textarea rows={5} className="inp" value={form.notes} onChange={(e) => set("notes", e.target.value)} /></L>
          <L label="Image paths (one per line)" full>
            <textarea rows={3} className="inp" value={form.images} onChange={(e) => set("images", e.target.value)} />
            <div className="mt-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline !py-2 !text-sm">
                <Upload size={15} /> Upload image
              </button>
            </div>
          </L>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-gold disabled:opacity-60">
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-[var(--color-ink-soft)]">{label}</span>
      {children}
    </label>
  );
}
