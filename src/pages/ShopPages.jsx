import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Search, SlidersHorizontal } from "lucide-react";
import { api } from "../services/api";
import { products as demo } from "../data/products";
import { Empty, ProductCard, Quantity } from "../components/UI";
import { useStore } from "../context/StoreContext";
function useProducts() {
  const [products, setProducts] = useState(demo);
  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);
  return products;
}
export function Home() {
  const products = useProducts();
  return (
    <>
      <section className="grid min-h-[70vh] md:grid-cols-2">
        <div className="flex flex-col justify-center p-10 md:p-[10%]">
          <p className="eyebrow">Spring / Summer 2026</p>
          <h1 className="serif mt-4 text-5xl leading-[.95] md:text-7xl">
            The art of
            <br />
            everyday dress.
          </h1>
          <p className="mt-6 max-w-md text-stone-600">
            A considered wardrobe of quiet statement pieces, made to move
            through the day beautifully.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-dark" to="/shop">
              Shop collection <ArrowRight size={16} />
            </Link>
            <Link className="btn btn-light" to="/shop?sort=new">
              New arrivals
            </Link>
          </div>
        </div>
        <img
          className="h-full min-h-[440px] w-full object-cover"
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85"
          alt="Clothing collection on a rail"
        />
      </section>
      <section className="page">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">The selection</p>
            <h2 className="serif mt-2 text-4xl">New arrivals</h2>
          </div>
          <Link to="/shop" className="hidden text-sm underline md:block">
            View all pieces
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.itemID} product={p} />
          ))}
        </div>
      </section>
      <section className="grid bg-sand md:grid-cols-2">
        <img
          className="h-100 w-full object-cover"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
          alt="Curated clothing collection"
        />
        <div className="flex flex-col justify-center p-10 md:p-[15%]">
          <p className="eyebrow">Made to last</p>
          <h2 className="serif mt-3 text-4xl">Less, but better.</h2>
          <p className="mt-4 text-stone-700">
            We select beautiful materials and timeless proportions so your
            favourites become lasting companions.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 underline underline-offset-6"
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function Shop() {
  const products = useProducts();
  const [categories, setCategories] = useState([]);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const gender = params.get("gender") || "All";
  const category = params.get("category") || "All";
  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);
  const shown = useMemo(
    () =>
      products.filter(
        (p) =>
          (gender === "All" ||
            p.catgender === gender ||
            p.catgender === "All") &&
          (category === "All" || String(p.categoryID) === category) &&
          `${p.itemname} ${p.categorytype}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [products, gender, category, query],
  );
  return (
    <section className="page fade">
      <p className="eyebrow">Collection</p>
      <h1 className="serif mt-2 text-5xl">All pieces</h1>
      <div className="mt-8 flex flex-col gap-3 border-y py-4 md:flex-row md:items-center md:justify-between">
        <label className="flex items-center gap-2">
          <Search size={17} />
          <input
            className="bg-transparent outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces"
          />
        </label>
        <div className="flex gap-2">
          <SlidersHorizontal size={17} />
          {["All", "Women", "Men"].map((g) => (
            <button
              className={gender === g ? "underline" : ""}
              key={g}
              onClick={() => setParams(g === "All" ? {} : { gender: g })}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ categoryID: "All", categorytype: "All categories" }, ...categories].map((item) => (
            <button
              key={item.categoryID}
              className={`border px-3 py-1.5 text-sm ${category === String(item.categoryID) ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300"}`}
              onClick={() => setParams(item.categoryID === "All" ? {} : { category: item.categoryID })}
            >
              {item.categorytype}
            </button>
          ))}
        </div>
      )}
      {shown.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.itemID} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <Empty title="No pieces found">
            Try a different search or collection.
          </Empty>
        </div>
      )}
    </section>
  );
}
export function Product() {
  const { id } = useParams();
  const product = useProducts().find((p) => String(p.itemID) === id) || demo[0];
  const { addCart } = useStore();
  const [qty, setQty] = useState(1);
  return (
    <section className="page">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            className="w-full object-cover"
            src={product.primaryImage}
            alt={product.itemname}
          />
        </div>
        <div className="md:sticky md:top-28 md:h-fit">
          <p className="eyebrow">
            {product.catgender} · {product.categorytype}
          </p>
          <h1 className="serif mt-3 text-4xl">{product.itemname}</h1>
          <p className="mt-3 text-xl">${product.itembaseprice}</p>
          <p className="mt-6 leading-7 text-stone-600">
            {product.itemdescription}
          </p>
          <p
            className={`mt-4 text-sm ${product.itemquantity > 0 ? "text-stone-600" : "font-medium text-red-700"}`}
          >
            {product.itemquantity > 0
              ? `Stock left: ${product.itemquantity}`
              : "Out of stock"}
          </p>
          <div className="mt-7 flex gap-3">
            <Quantity value={qty} onChange={setQty} />
            <button
              disabled={!product.itemquantity}
              className="btn btn-dark flex-1 disabled:opacity-40"
              onClick={() =>
                Array.from({ length: qty }).forEach(() => addCart(product))
              }
            >
              Add to bag
            </button>
          </div>
          <div className="mt-8 border-t pt-5 text-sm">
            <p className="flex gap-2">
              <Check size={16} /> Complimentary shipping above $200
            </p>
            <p className="mt-3 flex gap-2">
              <Check size={16} /> Returns accepted within 30 days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function SearchPage() {
  return (
    <section className="page">
      <p className="eyebrow">Discover</p>
      <h1 className="serif mt-2 text-5xl">Search the collection</h1>
      <div className="mt-8">
        <Shop />
      </div>
    </section>
  );
}
export function Category() {
  const { id } = useParams();
  return <Shop key={id} />;
}
export function Checkout() {
  const { cart, setCart, user } = useStore();
  const [done, setDone] = useState(false);
  const total = cart.reduce((s, p) => s + p.itembaseprice * p.qty, 0);
  if (done)
    return (
      <section className="page">
        <Empty title="Thank you for your order">
          Your confirmation will be sent to your email shortly.
        </Empty>
      </section>
    );
  return (
    <section className="page">
      <h1 className="serif text-4xl">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.7fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCart([]);
            setDone(true);
          }}
          className="space-y-6"
        >
          <fieldset>
            <legend className="mb-3 font-medium">1. Contact information</legend>
            <input
              className="field"
              required
              type="email"
              defaultValue={user?.useremail}
              placeholder="Email address"
            />
          </fieldset>
          <fieldset>
            <legend className="mb-3 font-medium">2. Shipping address</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "First name",
                "Last name",
                "Address",
                "City",
                "Postal code",
                "Country",
              ].map((x) => (
                <input className="field" required placeholder={x} key={x} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-3 font-medium">3. Payment</legend>
            <div className="border p-4 text-sm">
              Payment is securely collected by your payment provider after
              backend integration.
            </div>
          </fieldset>
          <button className="btn btn-dark w-full">Place order</button>
        </form>
        <aside className="h-fit bg-white p-6 lg:sticky lg:top-28">
          <h2 className="serif text-2xl">Order summary</h2>
          {cart.map((p) => (
            <div className="mt-4 flex justify-between text-sm" key={p.itemID}>
              <span>
                {p.itemname} × {p.qty}
              </span>
              <span>${(p.qty * p.itembaseprice).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-6 flex justify-between border-t pt-4">
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
