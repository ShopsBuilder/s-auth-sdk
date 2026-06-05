import { useEffect } from "react";
import { type SaleorAuthEvent, getStorageAuthEventKey } from "../SaleorRefreshTokenStorageHandler";

interface UseAuthChangeProps {
  saleorApiUrl: string;
  storageKeyPrefix?: string;
  onSignedIn?: () => void;
  onSignedOut?: () => void;
}

// used to handle client cache invalidation on login / logout and when
// token refreshin fails
export const useAuthChange = ({ saleorApiUrl, storageKeyPrefix, onSignedOut, onSignedIn }: UseAuthChangeProps) => {
  const keyPrefix = storageKeyPrefix ?? saleorApiUrl;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleAuthChange = (event: SaleorAuthEvent) => {
      const isCustomAuthEvent = event?.type === getStorageAuthEventKey(keyPrefix);

      if (!isCustomAuthEvent) {
        return;
      }

      const { authState } = event.detail;

      if (authState === "signedIn") {
        onSignedIn?.();
      } else if (authState === "signedOut") {
        onSignedOut?.();
      }
    };

    // for current window
    window.addEventListener(getStorageAuthEventKey(keyPrefix), handleAuthChange as EventListener);

    return () => {
      window.removeEventListener(getStorageAuthEventKey(keyPrefix), handleAuthChange as EventListener);
    };
  }, [keyPrefix, onSignedIn, onSignedOut]);
};
