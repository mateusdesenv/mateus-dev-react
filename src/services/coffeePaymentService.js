const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Não foi possível processar o pagamento.';
    throw new Error(message);
  }

  return data;
}

export async function createPixPayment(payload) {
  return request('/payments/pix', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createCardPayment(payload) {
  return request('/payments/card', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPaymentStatus(paymentId) {
  return request(`/payments/${paymentId}`);
}
