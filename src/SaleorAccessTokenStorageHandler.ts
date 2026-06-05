import type { StorageRepository } from "./types";

export const getAccessTokenKey = (prefix?: string) =>
  [prefix, "saleor_auth_access_token"].filter(Boolean).join("+");

export class SaleorAccessTokenStorageHandler {
  // In-memory cache so the token is available even when the storage
  // backend is read-only (e.g. Next.js cookies during render).
  private cachedToken: string | null = null;

  constructor(
    private storage: StorageRepository,
    private prefix?: string,
  ) {}

  getAccessToken = () => {
    if (this.cachedToken) return this.cachedToken;
    const key = getAccessTokenKey(this.prefix);
    return this.storage.getItem(key);
  };

  setAccessToken = (token: string) => {
    this.cachedToken = token;
    const key = getAccessTokenKey(this.prefix);
    return this.storage.setItem(key, token);
  };

  clearAuthStorage = () => {
    this.cachedToken = null;
    const key = getAccessTokenKey(this.prefix);
    return this.storage.removeItem(key);
  };
}
