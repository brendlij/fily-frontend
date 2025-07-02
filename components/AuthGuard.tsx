import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * AuthGuard component to protect routes
 * - requireAuth: if true, redirects to login if user is not authenticated
 * - requireAdmin: if true, redirects to home if user is not an admin
 */
export function AuthGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
}: AuthGuardProps) {
  const { isAuthenticated, isAdmin, loadUserFromToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Try to load user from token (local storage)
    const isValid = loadUserFromToken();

    if (requireAuth && !isAuthenticated && !isValid) {
      // Save the attempted URL to redirect back after login
      if (pathname !== "/login") {
        sessionStorage.setItem("redirectUrl", pathname);
      }
      router.push("/login");
    } else if (requireAdmin && !isAdmin) {
      router.push("/");
    }
  }, [
    isAuthenticated,
    isAdmin,
    loadUserFromToken,
    requireAuth,
    requireAdmin,
    router,
    pathname,
  ]);

  // If authentication is required but user is not authenticated, return null
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If admin access is required but user is not admin, return null
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
