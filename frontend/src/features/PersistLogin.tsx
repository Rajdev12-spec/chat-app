import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { useGetRefreshTokenQuery } from "../services/auth.service"
import { setAuthChecked, setCredentials } from "./authSlice"
import { Outlet } from "react-router"

const PersistLogin = () => {
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector((state) => state.auth)

  const { data, isLoading } = useGetRefreshTokenQuery(undefined, {
    skip: !!accessToken,
  })

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(setCredentials({ accessToken: data.accessToken }))
    } else if (!isLoading) {
      dispatch(setAuthChecked())
    }
  }, [data, isLoading, dispatch])

  return <Outlet />
}
export default PersistLogin
