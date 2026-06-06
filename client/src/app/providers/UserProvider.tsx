import type { LoggedUser } from "@/features/dashboard/types/users";
import UserContext from "@/shared/context/user.context";
import { useState, type ReactNode } from "react";


export default function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<LoggedUser | null>(null);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}