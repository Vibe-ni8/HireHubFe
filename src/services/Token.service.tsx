import { jwtDecode } from "jwt-decode"


const TOKEN_KEY = "authToken";

let decodedToken: any;

/* Initialize token once (like constructor) */
(function init() {
  setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0.30ojxH5BnXppDERyFW-Qu9WfxmXfcngb3wPj9LjivVI')
  const token = getToken();
  if (token) {
    try {
      decodedToken = jwtDecode(token);
    }
    catch {
      clearToken();
    }
  }
})();

export function setToken(token: string): void {
  decodedToken = jwtDecode(token);
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  decodedToken = null;
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(): boolean {
  if (!decodedToken) return true;

  const exp = decodedToken.exp;
  if (!exp) return false;

  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}

export function getCurrentUserId(): string | null {
  return (
    decodedToken?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ?? null
  );
}

export function getCurrentUserRole(): string | null {
  return (
    decodedToken?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] ?? null
  );
}
