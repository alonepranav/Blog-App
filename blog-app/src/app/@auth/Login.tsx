import axios from "axios"
import { Dispatch, FormEvent, useContext, useState } from "react"
import { BACKEND } from "../../CONSTANTS"
import { AuthUser } from "../AuthLayout";
import { toast } from "sonner";


export default function Login({ setAuthRoute }: { setAuthRoute: Dispatch<"login" | "signin"> }) {

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const { setLogin } = useContext(AuthUser)

  const handlSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post(BACKEND + "/auth/login", {
        ...user
      });

      if (res.data.success) {
        localStorage.setItem("login", JSON.stringify(res.data.data.auth));
        setLogin(res.data.data.user);
      }
      else {
        throw new Error()
      }
    } catch (error) {
      toast.error("No user found")
    }
  }

  return (
    <div className='flex h-screen w-full justify-center items-center'>
      <form className="w-96" onSubmit={handlSubmit}>
        <div className="">
          <p className='text-3xl font-semibold text-center mb-10'>Login</p>
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
          <input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value.trim().toLowerCase() })}
            type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@abc.com" required />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="*******" required />
        </div>
        <p className="text-center">
          Don&apos;t have an account?
          <span onClick={() => setAuthRoute("signin")} className="font-semibold text-blue-500 cursor-pointer"> Sign in</span>
        </p>
        <div className="flex justify-center mt-6">
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
        </div>
      </form>
    </div>
  )
}
