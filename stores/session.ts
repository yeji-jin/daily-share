import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  isLoaded: boolean;
  user: User | null;
};
const initialState = {
  isLoaded: false,
  user: null,
} as State;

const useSessionStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setUser: (user: User | null) => {
          set({ user, isLoaded: true }, false, "setUser");
        },
      },
    })),
    {
      name: "sessionStore",
    },
  ),
);

export const useUser = () => {
  const user = useSessionStore((store) => store.user);
  return user;
};

export const useIsUserLoaded = () => {
  const isUserLoaded = useSessionStore((store) => store.isLoaded);
  return isUserLoaded;
};

export const useSetUser = () => {
  const setUser = useSessionStore((store) => store.actions.setUser);
  return setUser;
};
