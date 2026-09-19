import { Link, Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Empty, ProductCard, Quantity } from "../components/UI";

export function CartPage() {
  const { cart, setCart } = useStore();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.itembaseprice * item.qty,
    0,
  );
  if (!cart.length)
    return (
      <section className="page">
        <Empty title="Your bag is empty">
          Discover considered pieces for your wardrobe.{" "}
          <Link className="underline" to="/shop">
            Shop now
          </Link>
        </Empty>
      </section>
    );
  return (
    <section className="page">
      <p className="eyebrow">Your selection</p>
      <h1 className="serif mt-2 text-4xl">Shopping bag</h1>
      <div className="mt-8 grid gap-9 lg:grid-cols-[1fr_340px]">
        <div>
          {cart.map((item) => (
            <article className="flex gap-4 border-b py-5" key={item.itemID}>
              <img
                className="h-32 w-24 object-cover"
                src={item.primaryImage}
                alt={item.itemname}
              />
              <div className="flex-1">
                <p className="font-medium">{item.itemname}</p>
                <p className="mt-1 text-sm text-stone-600">
                  ${item.itembaseprice.toFixed(2)}
                </p>
                <div className="mt-4">
                  <Quantity
                    value={item.qty}
                    onChange={(qty) =>
                      setCart((items) =>
                        items.map((x) =>
                          x.itemID === item.itemID ? { ...x, qty } : x,
                        ),
                      )
                    }
                  />
                </div>
              </div>
              <button
                className="self-start text-sm underline"
                onClick={() =>
                  setCart((items) =>
                    items.filter((x) => x.itemID !== item.itemID),
                  )
                }
              >
                Remove
              </button>
            </article>
          ))}
        </div>
        <aside className="h-fit bg-white p-6 lg:sticky lg:top-28">
          <h2 className="serif text-2xl">Summary</h2>
          <div className="mt-5 flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-3 flex justify-between text-stone-600">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-5 flex justify-between border-t pt-4 font-medium">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link className="btn btn-dark mt-6 w-full" to="/checkout">
            Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
export function WishlistPage() {
  const { wishlist } = useStore();
  return (
    <section className="page">
      <p className="eyebrow">Saved for later</p>
      <h1 className="serif mt-2 text-4xl">Wishlist</h1>
      {wishlist.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((p) => (
            <ProductCard key={p.itemID} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <Empty title="No saved pieces yet">
            Tap the heart on any product to add it here.
          </Empty>
        </div>
      )}
    </section>
  );
}
export function AccountSection({ title, children }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <section className="page">
      <p className="eyebrow">Your Maison</p>
      <h1 className="serif mt-2 text-4xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </section>
  );
}
export function Orders() {
  return (
    <AccountSection title="Orders">
      <Empty title="No orders yet">
        Orders placed through checkout will appear here after API integration.
      </Empty>
    </AccountSection>
  );
}
export function Addresses() {
  return (
    <AccountSection title="Addresses">
      <Empty title="No saved addresses">
        Add an address during checkout to save it to your account.
      </Empty>
    </AccountSection>
  );
}
export function ResetPassword() {
  return (
    <section className="page flex min-h-[55vh] items-center justify-center">
      <form
        className="w-full max-w-md bg-white p-7"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="serif text-4xl">Choose a new password</h1>
        <input
          className="field mt-6"
          type="password"
          minLength="6"
          required
          placeholder="New password"
        />
        <input
          className="field mt-3"
          type="password"
          minLength="6"
          required
          placeholder="Confirm password"
        />
        <button className="btn btn-dark mt-4 w-full">Update password</button>
      </form>
    </section>
  );
}
