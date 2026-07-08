import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const DUMMY_USER = {
  id: 'dummy-user-nafero-rafif',
  email: 'nafero@agrokates.com',
  user_metadata: { full_name: 'Nafero Rafif' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as const;

const DUMMY_USERNAME = 'Nafero Rafif';
const DUMMY_PASSWORD = 'Rafif1004.';
const SESSION_KEY = 'agro_kates_dummy_session';
const PROFILE_KEY = 'agro_kates_profile_name';

type DummyUser = typeof DUMMY_USER;

interface AuthContextValue {
  session: { user: DummyUser } | null;
  user: DummyUser | null;
  loading: boolean;
  signIn: (usernameOrEmail: string, password: string) => Promise<{ error: string | null }>;
  signUp: (usernameOrEmail: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(SESSION_KEY) === '1';
  });

  const session = loggedIn ? { user: DUMMY_USER } : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: loggedIn ? DUMMY_USER : null,
      loading: false,
      signIn: async (usernameOrEmail, password) => {
        const matchUser =
          usernameOrEmail.trim() === DUMMY_USERNAME ||
          usernameOrEmail.trim() === DUMMY_USER.email;
        if (matchUser && password === DUMMY_PASSWORD) {
          localStorage.setItem(SESSION_KEY, '1');
          localStorage.setItem(PROFILE_KEY, DUMMY_USERNAME);
          setLoggedIn(true);
          return { error: null };
        }
        return { error: 'Username atau kata sandi salah.' };
      },
      signUp: async (_email, _password, name) => {
        localStorage.setItem(SESSION_KEY, '1');
        localStorage.setItem(PROFILE_KEY, name || DUMMY_USERNAME);
        setLoggedIn(true);
        return { error: null };
      },
      signOut: async () => {
        localStorage.removeItem(SESSION_KEY);
        setLoggedIn(false);
      },
    }),
    [loggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStoredProfileName(): string {
  return localStorage.getItem(PROFILE_KEY) ?? '';
}


export { AuthProvider, useAuth }