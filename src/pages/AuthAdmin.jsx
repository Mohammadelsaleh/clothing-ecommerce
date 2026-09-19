import { useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Users, LogOut } from "lucide-react";
import { api } from "../services/api";
import { useStore } from "../context/StoreContext";
import { categories, products } from "../data/products";
import { Empty } from "../components/UI";
export function Auth({ mode = "login" }) {
  const nav = useNavigate(),
    { setUser } = useStore();
  const [error, setError] = useState("");
  const sign = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    try {
      const data =
        mode === "login"
          ? await api.login({
              useremail: form.email,
              userpassword: form.password,
            })
          : await api.register({
              userName: form.name,
              useremail: form.email,
              userphone: form.phone,
              userpassword: form.password,
            });
      localStorage.setItem("maison_token", data.token);
      setUser(data.user);
      nav(data.user.userRole === "admin" ? "/admin" : "/account");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="page flex min-h-[65vh] items-center justify-center">
      <form onSubmit={sign} className="w-full max-w-md bg-white p-7 shadow-sm">
        <p className="eyebrow">MAISON ACCOUNT</p>
        <h1 className="serif mt-2 text-4xl">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        {error && (
          <p role="alert" className="mt-4 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </p>
        )}
        <div className="mt-7 space-y-3">
          {mode === "signup" && (
            <>
              <input
                className="field"
                required
                name="name"
                placeholder="Full name"
              />
              <input
                className="field"
                name="phone"
                placeholder="Phone (optional)"
              />
            </>
          )}
          <input
            className="field"
            required
            name="email"
            type="email"
            placeholder="Email address"
          />
          <input
            className="field"
            required
            name="password"
            minLength="6"
            type="password"
            placeholder="Password"
          />
        </div>
        <button className="btn btn-dark mt-5 w-full">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
        {mode === "login" && (
          <Link className="mt-4 block text-center text-sm underline" to="/forgot-password">
            Forgot password?
          </Link>
        )}
        <p className="mt-5 text-center text-sm">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link className="underline" to="/signup">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already a member?{" "}
              <Link className="underline" to="/login">
                Sign in
              </Link>
            </>
          )}
        </p>
      </form>
    </section>
  );
}
export function Account() {
  const { user, setUser, wishlist } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.userRole === "admin") return <Navigate to="/admin" replace />;
  return (
    <section className="page">
      <p className="eyebrow">Your Maison</p>
      <h1 className="serif mt-2 text-4xl">Hello, {user.userName}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="border p-5">
          <h2 className="font-medium">Profile</h2>
          <p className="mt-3 text-sm text-stone-600">
            {user.useremail}
            <br />
            {user.userphone || "No phone saved"}
          </p>
        </div>
        <div className="border p-5">
          <h2 className="font-medium">Orders</h2>
          <p className="mt-3 text-sm text-stone-600">
            Your completed orders will appear here.
          </p>
        </div>
        <div className="border p-5">
          <h2 className="font-medium">Wishlist</h2>
          <p className="mt-3 text-sm text-stone-600">
            {wishlist.length} saved piece{wishlist.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <button
        className="btn btn-light mt-8"
        onClick={() => {
          localStorage.removeItem("maison_token");
          setUser(null);
        }}
      >
        Sign out
      </button>
    </section>
  );
}
const nav = [
  ["/admin", LayoutDashboard, "Overview"],
  ["/admin/items", Package, "Products"],
  ["/admin/categories", Tags, "Categories"],
  ["/admin/users", Users, "Customers"],
];
export function AdminLayout() {
  const { user, setUser } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.userRole !== "admin") return <Navigate to="/account" replace />;
  return (
    <div className="min-h-screen bg-stone-100 md:grid md:grid-cols-[230px_1fr]">
      <aside className="bg-ink p-6 text-white">
        <Link className="serif text-xl tracking-[.14em]" to="/">
          MAISON
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map(([to, Icon, label]) => (
            <Link
              className="flex items-center gap-3 p-2 text-sm hover:bg-white/10"
              to={to}
              key={to}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="mt-10 flex items-center gap-2 text-sm"
          onClick={() => setUser(null)}
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
export function AdminHome() {
  const cards = [
    ["Products", products.length],
    ["Categories", categories.length],
    ["Orders", "—"],
    ["Revenue", "$—"],
  ];
  return (
    <>
      <p className="eyebrow">Admin dashboard</p>
      <h1 className="serif mt-2 text-4xl">Overview</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div className="bg-white p-5" key={label}>
            <p className="text-sm text-stone-500">{label}</p>
            <p className="serif mt-2 text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-6">
        <h2 className="serif text-2xl">Recent activity</h2>
        <Empty title="No orders yet">
          Orders submitted through the live API will appear here.
        </Empty>
      </div>
    </>
  );
}
export function AdminList({ type }) {
  const source =
    type === "Products" ? products : type === "Categories" ? categories : [];
  return (
    <>
      <p className="eyebrow">Admin / {type}</p>
      <div className="mt-2 flex items-end justify-between">
        <h1 className="serif text-4xl">{type}</h1>
        <button className="btn btn-dark">Add {type.slice(0, -1)}</button>
      </div>
      {source.length ? (
        <div className="mt-7 overflow-auto bg-white">
          <table className="w-full min-w-140 text-left text-sm">
            <thead className="border-b text-stone-500">
              <tr>
                {Object.keys(source[0])
                  .slice(0, 5)
                  .map((k) => (
                    <th className="p-4 font-medium" key={k}>
                      {k}
                    </th>
                  ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {source.map((row) => (
                <tr className="border-b" key={row.itemID || row.id}>
                  {Object.keys(source[0])
                    .slice(0, 5)
                    .map((k) => (
                      <td className="p-4" key={k}>
                        {String(row[k])}
                      </td>
                    ))}
                  <td>
                    <button className="underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-7">
          <Empty title="API-driven">
            Connect the server endpoint to manage {type.toLowerCase()}.
          </Empty>
        </div>
      )}
    </>
  );
}
