import { createContext, useContext, useEffect, useState } from "react";
const Store = createContext();
export const useStore = () => useContext(Store);
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("maison_cart") || "[]"),
  );
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("maison_wishlist") || "[]"),
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("maison_user") || "null"),
  );
  useEffect(
    () => localStorage.setItem("maison_cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("maison_wishlist", JSON.stringify(wishlist)),
    [wishlist],
  );
  useEffect(
    () =>
      user
        ? localStorage.setItem("maison_user", JSON.stringify(user))
        : localStorage.removeItem("maison_user"),
    [user],
  );
  const addCart = (p) =>
    setCart((c) => {
      const found = c.find((x) => x.itemID === p.itemID);
      return found
        ? c.map((x) => (x.itemID === p.itemID ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { ...p, qty: 1 }];
    });
  const toggleWish = (p) =>
    setWishlist((w) =>
      w.some((x) => x.itemID === p.itemID)
        ? w.filter((x) => x.itemID !== p.itemID)
        : [...w, p],
    );
  return (
    <Store.Provider
      value={{ cart, setCart, wishlist, user, setUser, addCart, toggleWish }}
    >
      {children}
    </Store.Provider>
  );
}
