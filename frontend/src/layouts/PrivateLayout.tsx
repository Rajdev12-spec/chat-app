import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../hooks/redux"
import { PATH_LIST } from "../constants/path"

const PrivateLayout = () => {
  const { accessToken, isAuthChecked } = useAppSelector((state) => state.auth)

  // 🔥 wait until refresh check completes
  if (!isAuthChecked) {
    return <h1>Loading...</h1>
  }

  return accessToken
    ? <Outlet />
    : <Navigate to={PATH_LIST.SIGN_IN} replace />
}

export default PrivateLayout
