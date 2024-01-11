import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const SessionStoreContext = createContext<SessionStore>(null!);

export const SessionStoreProvider: FC<{
  userId: number | null | undefined;
  children: ReactNode;
}> = ({ userId, children }) => {
  const [zustandStore] = useState(() => createSessionStore(userId ?? null));
  return (
    <SessionStoreContext.Provider value={zustandStore}>{children}</SessionStoreContext.Provider>
  );
};

export const useSessionStore = () => useContext(SessionStoreContext)();

type SessionStore = ReturnType<typeof createSessionStore>;

const createSessionStore = (userId: number | null) =>
  create(
    combine(
      {
        userId,
      },
      (set) => ({
        setUserId(userId: number) {
          set({ userId });
        },

        removeUserId() {
          set({ userId: null });
        },
      }),
    ),
  );
