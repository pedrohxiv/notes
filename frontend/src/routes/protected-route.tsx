import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiRequest } from "../lib/request";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const isAuthenticated = async () => {
        const response = await apiRequest("GET", "/auth/check-auth");

        return response.success;
      };

      setAuth(await isAuthenticated());
    })();
  }, []);

  if (auth === null) {
    return (
      <div className="size-full flex items-center justify-center">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
