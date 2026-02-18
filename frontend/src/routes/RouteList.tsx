import { Route, Routes } from "react-router"
import PersistLogin from "../features/PersistLogin"
import PrivateLayout from "../layouts/PrivateLayout"
import SignIn from "../pages/auth/SignIn"
import Chat from "../pages/chat"
import { PATH_LIST } from "../constants/path"

const RouteList = () => {

    return (
        <Routes>
            <Route path={PATH_LIST.SIGN_IN} element={<SignIn />} />
            <Route element={<PersistLogin />}>
                <Route element={<PrivateLayout />}>
                    <Route path={PATH_LIST.CHAT} element={<Chat />} />
                </Route>
            </Route>
        </Routes>

    )
}

export default RouteList
