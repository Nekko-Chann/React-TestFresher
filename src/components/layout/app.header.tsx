import {useCurrentApp} from "components/context/app.context.tsx";

const AppHeader = () => {
    const {user, setUser, isAuthenticated, setIsAuthenticated} = useCurrentApp();
    return (
        <>
            App Header
            <div>
                {JSON.stringify(user)}
            </div>
        </>
    )
}
export default AppHeader;