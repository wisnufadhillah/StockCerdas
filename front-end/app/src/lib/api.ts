const API_BASE_URL = "http://localhost:5000/api";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<{ status: string; data?: T; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Terjadi kesalahan pada server");
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Koneksi ke server gagal");
  }
}

// === PRODUCTS ===
export async function getProducts(params?: { category?: string; search?: string; status?: string; store_id?: number }) {
  const query = new URLSearchParams(params as any).toString();
  return fetchApi<any[]>(`/products${query ? `?${query}` : ""}`);
}

export async function getProductById(id: string | number) {
  return fetchApi<any>(`/products/${id}`);
}

export async function createProduct(data: any) {
  return fetchApi<any>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string | number, data: any) {
  return fetchApi<any>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string | number) {
  return fetchApi<any>(`/products/${id}`, {
    method: "DELETE",
  });
}

// === TRANSACTIONS ===
export async function getTransactions(params?: { store_id?: number; tenant_id?: number }) {
  const query = new URLSearchParams(params as any).toString();
  return fetchApi<any[]>(`/transactions${query ? `?${query}` : ""}`);
}

export async function createTransaction(data: any) {
  return fetchApi<any>("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTransaction(id: string | number) {
  return fetchApi<any>(`/transactions/${id}`, {
    method: "DELETE",
  });
}

// === PREDICTIONS ===
export async function getPredictions(params?: { store_id?: number; tenant_id?: number }) {
  const query = new URLSearchParams(params as any).toString();
  return fetchApi<any[]>(`/predictions${query ? `?${query}` : ""}`);
}

export async function createPrediction(data: { product_id: number; forecast_period?: string; features?: number[] }) {
  return fetchApi<any>("/predictions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// === TENANTS ===
export async function getTenants() {
  return fetchApi<any[]>("/tenants");
}

export async function createTenant(data: any) {
  return fetchApi<any>("/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTenant(id: string | number, data: any) {
  return fetchApi<any>(`/tenants/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTenant(id: string | number) {
  return fetchApi<any>(`/tenants/${id}`, {
    method: "DELETE",
  });
}

// === DASHBOARD STATS ===
export async function getDashboardUsers() {
  return fetchApi<any[]>("/dashboard/users");
}

// === STORES ===
export async function getStores(tenantId?: number) {
  return fetchApi<any[]>(`/stores${tenantId ? `?tenant_id=${tenantId}` : ""}`);
}

export async function createStore(data: any) {
  return fetchApi<any>("/stores", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteStore(id: string | number) {
  return fetchApi<any>(`/stores/${id}`, {
    method: "DELETE",
  });
}

// === IMPORT ===
export async function uploadData(data: { tenant_id: number, store_id?: number, file_name: string, file_type: string, file_content?: string }) {
  return fetchApi<any>("/import/upload", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function syncApiData() {
  return fetchApi<any>("/import/sync", {
    method: "POST",
  });
}

export async function getSystemServices() {
  return fetchApi<any[]>("/dashboard/system-services");
}

export async function getSystemSettings() {
  return fetchApi<any[]>("/dashboard/system-settings");
}

// === CATEGORIES ===
export async function getCategories(tenantId?: number) {
  return fetchApi<any[]>(`/categories${tenantId ? `?tenant_id=${tenantId}` : ""}`);
}

export async function createCategory(data: { tenant_id: number, name: string, description?: string }) {
  return fetchApi<any>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string | number, data: { name: string, description?: string }) {
  return fetchApi<any>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string | number) {
  return fetchApi<any>(`/categories/${id}`, {
    method: "DELETE",
  });
}
