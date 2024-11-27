import {Outlet} from "react-router-dom";
import AppHeader from "components/layout/app.header";
import {useEffect} from "react";
import {fetchAccountAPI} from "services/api.ts";
import {useCurrentApp} from "components/context/app.context.tsx";
import PacmanLoader from "react-spinners/PacmanLoader";

const Layout = () => {
    const {setUser, isLoading, setIsLoading, setIsAuthenticated} = useCurrentApp();

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
        fetchAccount();
    }, []);

    return (
        <>
            {isLoading === false ?
                <div>
                    <AppHeader/>
                    <Outlet/>
                </div>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
                >
                    <PacmanLoader
                        size={30}
                        color={"#36d6b4"}
                    />
                </div>
            }
        </>
    )
}

export default Layout;
