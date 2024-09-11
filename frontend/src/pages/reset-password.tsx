import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar } from "../components/navbar";
import { apiRequest } from "../lib/request";
import { cn } from "../lib/utils";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { token } = useParams<{ token: string }>();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!password) {
      setError("Please enter the new password.");

      setIsLoading(false);

      return;
    }

    if (!confirmPassword) {
      setError("Please enter the confirm new password.");

      setIsLoading(false);

      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords must be the same.");

      setIsLoading(false);

      return;
    }

    const response = await apiRequest("POST", `/auth/reset-password/${token}`, {
      password,
    });

    if (response.success) {
      toast.success('Password changed successfully.')

      navigate("/login");
    } else {
      console.error(response.error);

      if (response.status === 400) {
        toast.error("Password are required..");
      } else if (response.status === 404) {
        toast.error("Invalid or expired reset password token.");
      } else {
        toast.error(
          "Something went wrong! There was a problem with your request."
        );
      }
    }

    setError(null);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <form
          onSubmit={handleSubmit}
          className="w-96 border rounded-xl bg-white px-7 py-10"
        >
          <h4 className="text-2xl mb-7">Reset Password</h4>
          <div
            className={cn(
              "flex items-center bg-transparent border px-5 rounded mb-3",
              {
                "opacity-50": isLoading,
              }
            )}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
            />
            {showPassword ? (
              <Eye
                className={cn("size-5 text-primary cursor-pointer", {
                  "cursor-default": isLoading,
                })}
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                className={cn("size-5 text-primary cursor-pointer", {
                  "cursor-default": isLoading,
                })}
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              />
            )}
          </div>
          <div
            className={cn(
              "flex items-center bg-transparent border px-5 rounded mb-3",
              {
                "opacity-50": isLoading,
              }
            )}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
            />
            {showPassword ? (
              <Eye
                className={cn("size-5 text-primary cursor-pointer", {
                  "cursor-default": isLoading,
                })}
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                className={cn("size-5 text-primary cursor-pointer", {
                  "cursor-default": isLoading,
                })}
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              />
            )}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full text-sm bg-primary text-white p-2 rounded mt-2 my-1 hover:bg-primary/80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-primary"
          >
            Set New Password
          </button>
          {error && (
            <p className="text-red-500 text-center text-xs pt-1">{error}</p>
          )}
        </form>
      </div>
    </>
  );
};
