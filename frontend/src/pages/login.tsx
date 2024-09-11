import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { Navbar } from "../components/navbar";
import { apiRequest } from "../lib/request";
import { cn } from "../lib/utils";
import { validateEmail } from "../lib/validators";

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");

      setIsLoading(false);

      return;
    }

    if (!password) {
      setError("Please enter the password.");

      setIsLoading(false);

      return;
    }

    const response = await apiRequest("POST", "/auth/login", {
      email,
      password,
    });

    if (response.success) {
      navigate("/dashboard");
    } else {
      console.error(response.error);

      if (response.status === 400) {
        toast.error("All fields (email and password) are required.");
      } else if (response.status === 404) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(
          "Something went wrong! There was a problem with your request."
        );
      }
    }

    setError(null);

    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <form
          onSubmit={handleSubmit}
          className="w-96 border rounded-xl bg-white px-7 py-10"
        >
          <h4 className="text-2xl mb-7">Login</h4>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full text-sm bg-transparent border px-5 py-3 rounded mb-4 outline-none disabled:opacity-50"
          />
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
              placeholder="Password"
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
          <Link
            to={isLoading ? "#" : "/forgot-password"}
            className={cn("text-sm text-primary hover:underline", {
              "opacity-50 cursor-default": isLoading,
            })}
          >
            Forgot Password?
          </Link>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full text-sm bg-primary text-white p-2 rounded mt-2 my-1 hover:bg-primary/80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-primary"
          >
            Login
          </button>
          {error && (
            <p className="text-red-500 text-center text-xs pt-1">{error}</p>
          )}
          <p className="text-sm text-center mt-4">
            Not registered yet?
            <Link
              to={isLoading ? "#" : "/sign-up"}
              className={cn("font-medium text-primary underline ml-1", {
                "opacity-50 cursor-default": isLoading,
              })}
            >
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
