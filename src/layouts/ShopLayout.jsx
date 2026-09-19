import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { CartDrawer } from "../components/UI";
export default function ShopLayout() {
  const [cartOpen, setCartOpen] = useState(false),
    [menu, setMenu] = useState(false);
  const { cart, user } = useStore();
  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-xs tracking-widest text-white">
        COMPLIMENTARY SHIPPING ON ORDERS OVER $200
      </div>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#f7f5f0]/95 px-5 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between">
          <button
            className="md:hidden"
            onClick={() => setMenu(!menu)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <Link to="/" className="serif text-2xl tracking-[.16em]">
            MAISON
          </Link>
          <nav
            className={`${menu ? "absolute left-0 top-full flex w-full flex-col border-b bg-[#f7f5f0] p-5" : "hidden"} md:static md:flex md:w-auto md:flex-row md:gap-6 md:border-0 md:p-0`}
          >
            <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop?gender=Women">Women</NavLink>
          <NavLink to="/shop?gender=Men">Men</NavLink>
            <NavLink to="/shop?sort=new">New arrivals</NavLink>
            <NavLink to="/shop?sale=true">Sale</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/search" aria-label="Search">
              <Search size={19} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist">
              <Heart size={19} />
            </Link>
            <Link to={user ? "/account" : "/login"} aria-label="Account">
              <User size={19} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative"
            >
              <ShoppingBag size={19} />
              <span className="absolute -right-2 -top-2 rounded-full bg-ink px-1.5 text-[10px] text-white">
                {cart.length}
              </span>
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-ink px-5 py-14 text-stone-200">
        <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-4">
          <div>
            <p className="serif text-2xl tracking-[.16em] text-white">MAISON</p>
            <p className="mt-3 text-sm">
              Considered pieces for an expressive everyday.
            </p>
          </div>
          <div>
            <p className="eyebrow">Shop</p>
            <p className="mt-3 text-sm">
              Women
              <br />
              Men
              <br />
              New arrivals
            </p>
          </div>
          <div>
            <p className="eyebrow">Service</p>
            <p className="mt-3 text-sm">
              Delivery & returns
              <br />
              Contact
              <br />
              Size guide
            </p>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
