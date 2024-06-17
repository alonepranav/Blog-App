import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthUser } from '../app/AuthLayout'

export default function Navbar() {

    const { login, setLogin } = useContext(AuthUser);
    const navigate = useNavigate()

    return (
        <div className='flex justify-between items-center backdrop-blur-sm px-40 py-5 bg-[rgba(255,255,255,0.3)] fixed top-0 left-0 w-screen'>
            <Link to={"/"} className='text-2xl font-semibold'>
                <img src="/logo.png" className='h-12 w-16' alt="Blog App Logo" />
            </Link>
            <ul className="flex gap-14">
                {
                    [
                        { route: "/", title: "Home" },
                        { route: "/my-blogs", title: "My Blogs" },
                        { route: "/add-blog", title: "Add Blog" },
                        { route: `/profile/${login?.userName}`, title: "Profile" },
                    ].
                        map((a, i) => <Link key={i} to={a.route}
                            className='font-semibold text-lg'
                        >{a.title}</Link>)
                }
                <p onClick={() => {
                    const s = confirm("Do you want to logout?");
                    if (s) {
                        localStorage.clear();
                        setLogin(null);
                        navigate("/")
                    }
                }}
                    className='font-semibold text-lg'
                >Logout</p>
            </ul>
        </div>
    )
}
