import { useState, type SyntheticEvent } from "react"
import { Link, useNavigate } from "react-router"
import { PATH_LIST } from "../../constants/path"
import { setCredentials } from "../../features/authSlice"
import { useAppDispatch } from "../../hooks/redux"
import { useSignInMutation } from "../../services/auth.service"
import siteImage from "../../assets/images/side-image.jpg"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [signIn, { isLoading }] = useSignInMutation()

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required")
      return
    }

    try {
      const data = await signIn({ email, password }).unwrap()

      if (data?.accessToken) {
        dispatch(setCredentials({ accessToken: data.accessToken }))
        navigate(PATH_LIST.CHAT)
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials")
    }
  }
const isFormValid = email.trim() && password.trim()
 return (
  <div className="min-h-screen flex bg-gray-100">

    {/* LEFT SIDE (Desktop Only) */}
    <div className="hidden lg:flex lg:w-1/2 relative">
      <img
        src={siteImage}
        alt="Login visual"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex items-center justify-center w-full text-white px-12">
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Welcome back.
          </h2>
          <p className="mt-4 text-lg text-gray-200">
            Sign in to continue your conversations.
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE (Form) */}
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to={PATH_LIST.SIGN_UP}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  </div>
)

}

export default SignIn
