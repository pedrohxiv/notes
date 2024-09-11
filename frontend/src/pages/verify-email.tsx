import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Navbar } from "../components/navbar";
import { apiRequest } from "../lib/request";

export const VerifyEmail = () => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const ref = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code.");

      setIsLoading(false);

      return;
    }

    const response = await apiRequest("POST", "/auth/verify-email", {
      code,
    });

    if (response.success) {
      navigate("/dashboard");
    } else {
      console.error(response.error);

      if (response.status === 400) {
        toast.error("Verification code are required.");
      } else if (response.status === 404) {
        toast.error("Invalid or expired verification code.");
      } else {
        toast.error(
          "Something went wrong! There was a problem with your request."
        );
      }
    }

    setError(null);

    setIsLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newCode = code.split("");

      newCode[index] = value;

      setCode(newCode.join(""));

      if (index < ref.current.length - 1) {
        ref.current[index + 1]?.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newCode = code.split("");

      newCode[index] = "";

      setCode(newCode.join(""));

      if (index > 0 && ref.current[index]?.value === "") {
        ref.current[index - 1]?.focus();
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <form
          onSubmit={handleSubmit}
          className="w-96 border rounded-xl bg-white px-7 py-10"
        >
          <h4 className="text-2xl mb-7">Verify your Email</h4>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code send to your email address.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(e) => (ref.current[index] = e)}
                disabled={isLoading}
                className="w-10 text-sm bg-transparent border text-center py-3 rounded mb-4 outline-none disabled:opacity-50"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button
            disabled={code.length !== 6 || isLoading}
            type="submit"
            className="w-full text-sm bg-primary text-white p-2 rounded my-1 hover:bg-primary/80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-primary"
          >
            Verify Email
          </button>
        </form>
      </div>
    </>
  );
};
