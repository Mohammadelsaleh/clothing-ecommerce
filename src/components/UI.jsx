import { Heart, Minus, Plus, ShoppingBag, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
export function ProductCard({ product }) {
  const { addCart, wishlist, toggleWish } = useStore();
  const liked = wishlist.some((x) => x.itemID === product.itemID);
  return (
    <article className="group relative">
      <Link to={`/product/${product.itemID}`}>
        <img
          className="product-image transition duration-500 group-hover:scale-[1.01]"
          src={product.primaryImage}
          alt={product.itemname}
        />
      </Link>
      <button
        aria-label="Toggle wishlist"
        onClick={() => toggleWish(product)}
        className="absolute right-3 top-3 rounded-full bg-white/90 p-2"
      >
        <Heart size={17} fill={liked ? "currentColor" : "none"} />
      </button>
      <div className="pt-3">
        <p className="eyebrow text-stone-500">
          {product.catgender} · {product.categorytype}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <Link className="font-medium" to={`/product/${product.itemID}`}>
            {product.itemname}
          </Link>
          <span>${Number(product.itembaseprice).toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Star size={14} fill="currentColor" /> {product.rating}
          </span>
          <button
            className="underline underline-offset-4"
            onClick={() => addCart(product)}
          >
            Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}
export function Quantity({ value, onChange }) {
  return (
    <div className="inline-flex items-center border border-stone-300">
      <button
        className="p-2"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus size={15} />
      </button>
      <span className="w-7 text-center">{value}</span>
      <button
        className="p-2"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function CartDrawer({ open, onClose }) {
  const { cart, setCart } = useStore();
  const total = cart.reduce((n, p) => n + p.itembaseprice * p.qty, 0);
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        onClick={onClose}
        aria-label="Close cart"
        className={`absolute inset-0 bg-black/35 ${open ? "opacity-100" : "opacity-0"} transition`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fffdf9] p-6 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b pb-5">
          <h2 className="serif text-2xl">Your bag ({cart.length})</h2>
          <button onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        <div className="flex-1 overflow-auto py-5">
          {cart.length ? (
            cart.map((p) => (
              <div key={p.itemID} className="mb-5 flex gap-4">
                <img
                  src={p.primaryImage}
                  alt=""
                  className="h-24 w-20 object-cover"
                />
                <div className="flex-1">
                  <p>{p.itemname}</p>
                  <p className="mt-1">${p.itembaseprice}</p>
                  <Quantity
                    value={p.qty}
                    onChange={(qty) =>
                      setCart((c) =>
                        c.map((x) =>
                          x.itemID === p.itemID ? { ...x, qty } : x,
                        ),
                      )
                    }
                  />
                </div>
                <button
                  onClick={() =>
                    setCart((c) => c.filter((x) => x.itemID !== p.itemID))
                  }
                  aria-label={`Remove ${p.itemname}`}
                >
                  <X size={17} />
                </button>
              </div>
            ))
          ) : (
            <p className="pt-8 text-stone-500">
              Your bag is waiting for its first piece.
            </p>
          )}
        </div>
        <div className="border-t pt-5">
          <div className="mb-4 flex justify-between">
            <span>Subtotal</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <Link
            onClick={onClose}
            to="/checkout"
            className="btn btn-dark w-full"
          >
            <ShoppingBag size={17} /> Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
export function Empty({ title, children }) {
  return (
    <div className="border border-dashed border-stone-300 p-10 text-center">
      <h2 className="serif text-2xl">{title}</h2>
      <p className="mt-2 text-stone-600">{children}</p>
    </div>
  );
}
