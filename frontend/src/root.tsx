import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { ForgotPassword } from "./pages/forgot-password";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { ResetPassword } from "./pages/reset-password";
import { SignUp } from "./pages/sign-up";
import { VerifyEmail } from "./pages/verify-email";
import { ProtectedRoute } from "./routes/protected-route";

import "./styles/global.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" />
  </StrictMode>
);
