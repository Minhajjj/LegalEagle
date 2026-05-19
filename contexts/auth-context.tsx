// contexts/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const profileUserIdRef = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    const syncSession = async (nextUser: User | null) => {
      const nextId = nextUser?.id ?? null;

      setUser((prev) => {
        if (!nextUser) return null;
        if (prev?.id === nextUser.id) return prev;
        return nextUser;
      });

      if (nextId !== profileUserIdRef.current) {
        profileUserIdRef.current = nextId;
        if (nextId) {
          await fetchProfile(nextId);
        } else {
          setProfile(null);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        await syncSession(session?.user ?? null);
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        setLoading(false);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Auth getSession error:", error.message);
          return syncSession(null);
        }
        return syncSession(session?.user ?? null);
      })
      .catch((err) => {
        console.error("Auth getSession failed:", err);
        return syncSession(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile: () =>
          user?.id ? fetchProfile(user.id) : Promise.resolve(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
