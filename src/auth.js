import { supabaseConfigured } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const STORAGE_KEY = 'nababi_admin_session';

async function authRequest(path, options = {}) {
  if (!supabaseConfigured) throw new Error('Supabase configuration is missing.');
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || 'Authentication failed.');
  }
  return data;
}

export async function adminLogin(email, password) {
  const session = await authRequest('token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (!session.access_token || !session.user?.id) {
    throw new Error('Login succeeded but no valid session was returned.');
  }

  const profileResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=id,role&id=eq.${encodeURIComponent(session.user.id)}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
        Accept: 'application/json'
      }
    }
  );

  const profileText = await profileResponse.text();
  let profileData = [];
  try { profileData = profileText ? JSON.parse(profileText) : []; } catch { profileData = []; }

  if (!profileResponse.ok) {
    throw new Error('Login worked, but the admin profile could not be verified. Please check the profiles RLS policy.');
  }

  if (!profileData[0] || profileData[0].role !== 'admin') {
    throw new Error('This account is authenticated but does not have the admin role.');
  }

  const safeSession = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: { id: session.user.id, email: session.user.email }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeSession));
  return safeSession;
}

export function getStoredAdminSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function adminLogout() {
  const session = getStoredAdminSession();
  if (session?.access_token) {
    try {
      await authRequest('logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
    } catch {
      // Clear the local session even if the remote logout request fails.
    }
  }
  clearAdminSession();
}
