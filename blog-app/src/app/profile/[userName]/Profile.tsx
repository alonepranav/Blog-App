// import { useContext } from "react"
// import { AuthUser } from "../AuthLayout"

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { BACKEND } from "../../../CONSTANTS";
import { AuthUser, Authuser } from "../../AuthLayout";

export default function Profile() {

    const userName = useParams().userName;
    const navigate = useNavigate()
    const { login } = useContext(AuthUser)

    const [user, setUser] = useState<Authuser>({
        image: "",
        firstName: "",
        lastName: "",
        userName: "",
        about: "",
        email: ""
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (login?.userName == userName && login != null) {
            setUser(login)
            setLoading(false)
        }
        else {
            const getUser = async () => {
                try {
                    const res = await axios.get(BACKEND + "/user/profile/" + userName)

                    if (res.data.success) {
                        setUser({ ...res.data.user, email: "" });
                        setLoading(() => false)
                    } else {
                        navigate("/")
                    }
                } catch (error) {
                    navigate("/")
                }
            }
            getUser()
        }

    }, [userName])


    if (loading)
        return <div className="h-screen w-screen flex justify-center items-center">
            <p>Getting Profile Infoemation ...</p>
        </div>

    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <div className="h-80 w-80 rounded-full overflow-hidden flex justify-center items-center">
                <img src={user?.image} alt="" className="object-cover h-full w-full" />
            </div>
            <div className="">
                <p className="text-2xl font-semibold mt-8">{user?.firstName} {user?.lastName} <span className="text-lg"> @{user?.userName}</span></p>
            </div>
            <div className=" w-96 h-fit" >
                <p>About</p>
                <p className="mt-1 border border-slate-300 rounded-md p-2">{user?.about}</p>
            </div>
        </div>
    )
}
