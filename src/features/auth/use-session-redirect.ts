import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client.ts";

type SessionRedirectOptions = {
  whenAuthenticated?: string;
  whenUnauthenticated?: string;
};

export function useSessionRedirect(options: SessionRedirectOptions) {
  const navigate = useNavigate();
  const sessionQuery = authClient.useSession();

  useEffect(() => {
    if (sessionQuery.isPending) {
      return;
    }

    if (options.whenAuthenticated && sessionQuery.data?.session) {
      void navigate({ to: options.whenAuthenticated });
      return;
    }

    if (options.whenUnauthenticated && !sessionQuery.data?.session) {
      void navigate({ to: options.whenUnauthenticated });
    }
  }, [
    navigate,
    options.whenAuthenticated,
    options.whenUnauthenticated,
    sessionQuery.data?.session,
    sessionQuery.isPending,
  ]);

  return sessionQuery;
}
