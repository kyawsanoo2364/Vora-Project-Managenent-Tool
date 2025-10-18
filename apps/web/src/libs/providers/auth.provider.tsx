"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserType } from "../types";
import { FETCH_SESSION_USER } from "../utils/queryStringGraphql";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuth(FETCH_SESSION_USER);
        setUser(data.user);
      } catch (error) {
        setError("Failed to fetch session user");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthProvider;
