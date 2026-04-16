import { getToken } from "@/lib/authenticate";

async function apiRequest(method, endpoint, body = null) {
  const token = getToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: body ? JSON.stringify(body) : null, 
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    return []; 
  }
}

export function addToFavourites(id) {
  return apiRequest('PUT', `favourites/${id}`);
}

export function removeFromFavourites(id) {
  return apiRequest('DELETE', `favourites/${id}`);
}

export function getFavourites() {
  return apiRequest('GET', 'favourites');
}

export function addToHistory(id) {
  return apiRequest('PUT', `history/${id}`);
}

export function removeFromHistory(id) {
  return apiRequest('DELETE', `history/${id}`);
}

export function getHistory() {
  return apiRequest('GET', 'history');
}
