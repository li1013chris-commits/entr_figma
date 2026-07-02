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

// Only non-sensitive display fields are cached in localStorage; the session
// itself lives in an HttpOnly cookie and the full profile stays server-side.
function cacheUser(user: User | null) {
  if (!user) {
    localStorage.removeItem("entr_user");
    return;
  }
  const minimal = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    language_pref: user.language_pref,
    restaurant_name: user.restaurant_name,
  };
  localStorage.setItem("entr_user", JSON.stringify(minimal));
}

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
      cacheUser(data.user);
    } catch {
      setUser(null);
      cacheUser(null);
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
    cacheUser(data.user);
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
