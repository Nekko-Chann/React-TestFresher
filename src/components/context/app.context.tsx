import React, {createContext, useContext, useEffect, useState} from "react";
import {fetchAccountAPI} from "services/api";
import {PacmanLoader} from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    user: IUser | null;
    setUser: (value: IUser | null) => void;
    carts: ICart[];
    setCarts: (value: ICart[]) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

interface IProps {
    children: React.ReactNode;
}

const AppProvider = (props: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [carts, setCarts] = useState<ICart[]>([]);
    const {children} = props;
    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            const carts = localStorage.getItem("carts");
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                if (carts) {
                    setCarts(JSON.parse(carts));
                }
            }
            setIsLoading(false);
        }

        fetchAccount();
    }, [])

    return (
        <>
            {!isLoading ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser,
                    isLoading, setIsLoading, carts, setCarts
                }}>
                    {children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <PacmanLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            }
        </>
    );
};

const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};

export {AppProvider, useCurrentApp};