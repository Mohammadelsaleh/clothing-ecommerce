import {
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../services/api";

const navigation = [
  ["/admin", LayoutDashboard, "Overview"],
  ["/admin/items", Package, "Products"],
  ["/admin/categories", Tags, "Categories"],
  ["/admin/orders", ClipboardList, "Orders"],
  ["/admin/users", Users, "Customers"],
  ["/admin/reviews", MessageSquare, "Reviews"],
  ["/admin/discounts", CreditCard, "Discounts"],
  ["/admin/settings", Settings, "Settings"],
];

export function AdminLayout() {
  const { user, setUser } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.userRole !== "admin") return <Navigate to="/account" replace />;
  return (
    <div className="min-h-screen bg-[#f3f2ee] md:grid md:grid-cols-[260px_1fr]">
      <aside className="flex min-h-full flex-col bg-ink p-6 text-white">
        <Link className="serif text-xl tracking-[.14em]" to="/">
          MAISON
        </Link>
        <p className="mt-1 text-[10px] tracking-[.2em] text-stone-400">
          ADMIN CONSOLE
        </p>
        <nav className="mt-10 space-y-1">
          {navigation.map(([to, Icon, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition ${isActive ? "bg-white text-ink" : "text-stone-300 hover:bg-white/10 hover:text-white"}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/15 pt-5">
          <p className="mb-3 text-xs text-stone-400">{user.userName}</p>
          <button
            className="flex items-center gap-2 text-sm text-stone-300 hover:text-white"
            onClick={() => {
              localStorage.removeItem("maison_token");
              setUser(null);
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([items, categoryData]) => {
        setProducts(items);
        setCategories(categoryData);
      })
      .catch(() => {});
  }, []);
  const cards = [
    ["Total products", products.length, Package],
    ["Total categories", categories.length, Tags],
    ["Orders today", "0", ClipboardList],
    ["Revenue", "$0.00", CircleDollarSign],
  ];
  const low = products.filter((p) => p.itemquantity < 10);
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Store operations</p>
          <h1 className="serif mt-2 text-4xl">Good morning.</h1>
          <p className="mt-2 text-sm text-stone-500">
            Here is what needs your attention today.
          </p>
        </div>
        <Link className="btn btn-dark" to="/admin/items/new">
          Add product
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div className="border border-stone-200 bg-white p-5" key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">{label}</p>
              <Icon size={18} className="text-stone-400" />
            </div>
            <p className="serif mt-4 text-3xl">{value}</p>
            <p className="mt-2 text-xs text-stone-500">Live catalog data.</p>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2 className="serif mt-1 text-2xl">Low-stock pieces</h2>
            </div>
            <Link
              className="flex items-center gap-1 text-sm underline"
              to="/admin/items"
            >
              Manage <ChevronRight size={15} />
            </Link>
          </div>
          <div className="mt-5 divide-y">
            {low.map((p) => (
              <div className="flex items-center gap-3 py-3" key={p.itemID}>
                <img
                  className="h-12 w-10 object-cover"
                  src={p.primaryImage}
                  alt=""
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.itemname}</p>
                  <p className="text-xs text-stone-500">{p.categorytype}</p>
                </div>
                <span className="bg-amber-50 px-2 py-1 text-xs text-amber-900">
                  {p.itemquantity} left
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="border border-stone-200 bg-white p-6">
          <p className="eyebrow">Sales overview</p>
          <h2 className="serif mt-1 text-2xl">This week</h2>
          <div className="mt-8 flex h-32 items-end gap-2">
            {[24, 45, 31, 68, 43, 76, 56].map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-stone-900/90"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-stone-500">
            <span>Mon</span>
            <span>Sun</span>
          </div>
          <p className="mt-5 border-t pt-4 text-sm text-stone-500">
            Connect orders to show live sales performance.
          </p>
        </section>
      </div>
    </>
  );
}
