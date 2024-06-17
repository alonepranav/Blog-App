import { Dispatch, ReactNode, createContext, useEffect, useState } from 'react'
import Login from './@auth/Login';
import Signin from './@auth/Signin';
import axios from 'axios';
import { BACKEND } from '../CONSTANTS';

export interface Authuser {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    about: string;
}

export const AuthUser = createContext<{ login: Authuser | null, setLogin: Dispatch<Authuser | null> }>({ login: null, setLogin: () => { } });

export default function AuthLayout({ children }: { children: ReactNode }) {

    // const [login, setLogin] = useState<Authuser | null>(
    //     {
    //         "userName": "pranav",
    //         "firstName": "Pranav",
    //         "lastName": "S",
    //         "about": "i am hacker",
    //         "email": "pranav@gmail.com",
    //         "image": "https://res.cloudinary.com/dwht0wp3u/image/upload/v1718356261/image/sstbqmrfdlf5zoan6ynh.jpg",
    //     }
    // )
    const [login, setLogin] = useState<Authuser | null>(null)

    useEffect(() => {
        const verifyDetails = async () => {
            const s = localStorage.getItem("login")

            if (s) {
                try {
                    const o = JSON.parse(s);
                    const r = await axios.post(BACKEND + "/auth/validate-token", {
                        ...o
                    });
                    if (r.data.success) {
                        setLogin(r.data.user);
                    }
                } catch (error) {

                }
            }
        }
        verifyDetails()
    }, [])

    const [authRoute, setAuthRoute] = useState<"login" | "signin">("login")

    return (
        <AuthUser.Provider value={{ login, setLogin }}>
            {
                login != null ?
                    children
                    :
                    authRoute == "login" ?
                        <Login setAuthRoute={setAuthRoute} />
                        :
                        <Signin setAuthRoute={setAuthRoute} />
            }
        </AuthUser.Provider >
    )
}