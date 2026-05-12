const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export async function fetchAPI(endpoint: string, options: any = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}

export async function login(credentials: any) {
  const res = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  console.log("Login API Response:", res);
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user || { role: 'ADMIN' }));
  }
  return res;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export const getProducts = () => fetchAPI("/product");
export const getProduct = (id: string) => fetchAPI(`/product/${id}`);
export const createOrder = (data: any) => fetchAPI("/order", {
  method: "POST",
  body: JSON.stringify(data),
});
export const getCMS = () => fetchAPI("/cms");
export const getCMSByKey = (key: string) => fetchAPI(`/cms/${key}`);
export const getReviews = () => fetchAPI("/review");
export const createReview = (data: any) => fetchAPI("/review", {
  method: "POST",
  body: JSON.stringify(data),
});
export const updateReview = (id: string, data: any) => fetchAPI(`/review/${id}`, {
  method: "PATCH",
  body: JSON.stringify(data),
});
export const deleteReview = (id: string) => fetchAPI(`/review/${id}`, {
  method: "DELETE",
});
