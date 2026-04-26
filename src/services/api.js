const BASE_URL = 'http://localhost:3000/api';

export const getProductsAdmin = async () => {
  const response = await fetch(`${BASE_URL}/admin/products`, {
    headers: {
      'x-user-id': '1'
    }
  });
  return response.json();
};

export const createProductAdmin = async (product) => {
  const response = await fetch(`${BASE_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': '1'
    },
    body: JSON.stringify(product)
  });
  return response.json();
};

export const updateProductAdmin = async (id, product) => {
  const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': '1'
    },
    body: JSON.stringify(product)
  });
  return response.json();
};

export const deleteProductAdmin = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': '1'
    }
  });
  return response.json();
};