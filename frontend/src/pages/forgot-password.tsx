import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { ArrowLeft, Mail } from "lucide-react";
import { Navbar } from "../components/navbar";
import { apiRequest } from "../lib/request";
import { cn } from "../lib/utils";
import { validateEmail } from "../lib/validators";

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");

      setIsLoading(false);

      return;
    }

    const response = await apiRequest("POST", "/auth/forgot-password", {
      email,
    });

    if (response.success) {
      setIsSent(true);
    } else {
      console.error(response.error);

      if (response.status === 400) {
        toast.error("Email are required.");
      } else if (response.status === 404) {
        toast.error("No account associated with this email address.");
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
          <h4 className="text-2xl mb-7">Forgot Password</h4>
          {!isSent ? (
            <>
              <p className="text-sm text-slate-500">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full text-sm bg-transparent border px-5 py-3 rounded my-4 outline-none disabled:opacity-50"
              />
              <button
                disabled={isLoading}
                type="submit"
                className="w-full text-sm bg-primary text-white p-2 rounded mt-2 my-1 hover:bg-primary/80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-primary"
              >
                Send Reset Link
              </button>
              {error && (
                <p className="text-red-500 text-center text-xs pt-1">{error}</p>
              )}
            </>
          ) : (
            <>
              <div className="w-full flex flex-col items-center justify-center">
                <div className="size-16 rounded-full bg-primary flex items-center justify-center">
                  <Mail className="size-8 text-white" />
                </div>
                <p className="my-4 text-sm text-slate-500 text-center">
                  If an account existins for {email} you will receive a password
                  reset link shortly.
                </p>
              </div>
            </>
          )}
          <div className="w-full flex items-center justify-center">
            <Link
              to={isLoading ? "#" : "/login"}
              className={cn(
                "text-sm font-medium text-primary underline flex flex-row items-center justify-center mt-4",
                {
                  "opacity-50 cursor-default": isLoading,
                }
              )}
            >
              <ArrowLeft className="size-5 mr-2" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
