import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi, type User } from "../api/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  fetchMe: async () => {},
  login: async () => { throw new Error("No provider"); },
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("entr_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await authApi.me();
      setUser(data.user);
      if (data.user) {
        localStorage.setItem("entr_user", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("entr_user");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("entr_user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    localStorage.setItem("entr_user", JSON.stringify(data.user));
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem("entr_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchMe, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
