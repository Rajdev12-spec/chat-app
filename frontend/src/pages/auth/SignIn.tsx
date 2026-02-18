import React, { useState, type SyntheticEvent } from "react"
import { useNavigate } from "react-router"
import { PATH_LIST } from "../../constants/path"
import { useSignInMutation } from "../../services/auth.service"
import { setCredentials } from "../../features/authSlice"
import { useAppDispatch } from "../../hooks/redux"

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [signIn, { isLoading }] = useSignInMutation()

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email.trim() || !password.trim()) return

        const data = await signIn({ email, password }).unwrap();
        if (data?.accessToken) {
            dispatch(setCredentials({ accessToken: data?.accessToken }))
            navigate(PATH_LIST.CHAT)
        }

        // call login mutation here

    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={!email.trim() || !password.trim() || isLoading}
                        className={`w-full py-2 rounded-lg text-white transition
              ${email.trim() && password.trim()
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }
            `}
                    >
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    )
}

export default SignIn
