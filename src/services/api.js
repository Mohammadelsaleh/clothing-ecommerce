const base = import.meta.env.VITE_API_URL || "/api";
const assetUrl = (url) =>
  url?.startsWith("/") && /^https?:/.test(base)
    ? `${base.replace(/\/api\/?$/, "")}${url}`
    : url;
async function request(path, options = {}) {
  const token = localStorage.getItem("maison_token");
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${base}${path}`, {
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).message || "Request failed",
    );
  return res.json();
}
export const api = {
  getProducts: async () =>
    (await request("/items")).map((item) => ({
      ...item,
      primaryImage: assetUrl(item.primaryImage),
    })),
  getCategories: () => request("/categories"),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
  createItem: (body) => request("/items", { method: "POST", body: JSON.stringify(body) }),
  updateItem: (id, body) => request(`/items/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteItem: (id) => request(`/items/${id}`, { method: "DELETE" }),
  createCategory: (body) => request("/categories", { method: "POST", body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),
  uploadProductImage: (itemID, image) => {
    const body = new FormData();
    body.append("itemID", itemID);
    body.append("image", image);
    body.append("isPrimary", "true");
    return request("/product-images", { method: "POST", body });
  },
};
