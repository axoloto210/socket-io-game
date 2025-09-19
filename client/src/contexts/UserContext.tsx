import { createContext } from "react";

type UserContextType = {
  userName: string;
  setUserName: (username: string) => void;
};

export const UserContext = createContext<UserContextType>({
  userName: "",
  setUserName: () => {},
});
