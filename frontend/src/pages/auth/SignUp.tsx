import { useState, type SyntheticEvent } from "react"
import { Link, useNavigate } from "react-router"
import { useAppDispatch } from "../../hooks/redux"
import { useSignUpMutation } from "../../services/auth.service"
import { PATH_LIST } from "../../constants/path"
import { setCredentials } from "../../features/authSlice"
import siteImage from "../../assets/images/side-image.jpg"

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [signUp, { isLoading }] = useSignUpMutation()

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      const response = await signUp(formData).unwrap()

      if (response?.accessToken) {
        dispatch(setCredentials({ accessToken: response.accessToken }))
        navigate(PATH_LIST.CHAT)
      }
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong")
    }
  }

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.password.trim()

  return (
  <div className="min-h-screen flex bg-gray-100">

    {/* LEFT SIDE (Desktop Only) */}
    <div className="hidden lg:flex lg:w-1/2 relative">
      <img
        src={siteImage}
        alt="Auth visual"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex items-center justify-center w-full text-white px-12">
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Join the future of chat.
          </h2>
          <p className="mt-4 text-lg text-gray-200">
            Create your account and start connecting instantly.
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE (Form) */}
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* First + Last Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={PATH_LIST.SIGN_IN}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  </div>
)

}

export default SignUp
