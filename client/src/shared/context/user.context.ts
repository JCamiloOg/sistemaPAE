import type { LoggedUser } from "@/features/dashboard/types/users";
import { createContext, type Dispatch, type SetStateAction } from "react";

type UserContextType = {
    user: LoggedUser | null;
    setUser: Dispatch<SetStateAction<LoggedUser | null>>;
};

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;