import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../lib/request";
import { cn, getInitials } from "../lib/utils";
import { User } from "../types";

interface Props {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

export const Navbar = ({ onSearch, onClearSearch }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiRequest("POST", "/auth/logout");

    navigate("/login");
  };

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<SVGElement>
  ) => {
    e.preventDefault();

    if (!search) {
      return;
    }

    onSearch(search);
  };

  useEffect(() => {
    (async () => {
      const response = await apiRequest("GET", "/auth/get-user");

      if (response.success && response.data) {
        setUser(response.data as User);
      }
    })();
  }, []);

  return (
    <div
      className={cn("bg-white flex items-center px-6 py-2 drop-shadow h-14", {
        "justify-between": user,
      })}
    >
      <h2 className="text-xl font-medium text-black">Notes</h2>
      {user && user.isVerified && (
        <>
          <form
            className="w-80 flex items-center px-4 bg-slate-100 rounded-md -mb-0"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search Notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent py-3 outline-none"
            />
            {search && (
              <X
                className="size-6 text-slate-500 cursor-pointer hover:text-black"
                onClick={() => {
                  setSearch("");
                  onClearSearch();
                }}
              />
            )}
            <Search
              className="size-6 text-slate-400 cursor-pointer hover:text-black ml-3"
              onClick={handleSearch}
            />
          </form>
          <div className="flex items-center gap-3">
            <div className="size-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
              {getInitials(user.name)}
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{user.name}</p>
              <button
                className="text-sm text-slate-700 underline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
