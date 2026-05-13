const API_BASE = 'https://Mozaicteck-mozaicteck-rag.hf.space'

async function refreshToken() {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  })
  return response.ok
}

export async function fetchWithRefresh(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'include' })

  if (response.status === 401) {
    const refreshed = await refreshToken()

    if (refreshed) {
      const retry = await fetch(url, { ...options, credentials: 'include' })
      return retry.json()
    } else {
      window.location.href = '/mozaicteck-frontend/login'
      return null
    }
  }

  return response.json()
}

export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function loginUser(data) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  })
  return response.json()
}

export async function getMe() {
  return fetchWithRefresh(`${API_BASE}/auth/me`, {
    method: 'GET'
  })
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  return response.json()
}

export async function resetPassword(data) {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function verifyEmail(token) {
  const response = await fetch(`${API_BASE}/auth/verify-email?token=${token}`, {
    method: 'GET'
  })
  return response.json()
}