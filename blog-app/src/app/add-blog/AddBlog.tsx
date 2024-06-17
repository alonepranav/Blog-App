import { FormEvent, useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { BACKEND, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from "../../CONSTANTS";
import axios from "axios";
import { AuthUser } from "../AuthLayout";
import { toast } from "sonner";


export default function AddBlog() {

    const [image, setImage] = useState<null | Blob>(null)
    const [loading, setLoading] = useState(false)

    const [blog, setBlog] = useState<{
        title: string;
        content: string;
    }>({ content: "", title: "" })

    const navigate = useNavigate()

    const { login } = useContext(AuthUser)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (image) {
            setLoading(true)
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
            data.append("folder", "image");

            try {
                const response = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
                const q = await response.json();
                if (q.secure_url) {
                    try {
                        const r = await axios.post(BACKEND + "/blog/add-blog", {
                            ...blog,
                            image: q.secure_url,
                            time: new Date().toString(),
                            user: {
                                name: login?.firstName + "" + login?.lastName,
                                userName: login?.userName,
                                image: login?.image
                            }
                        })

                        if (r.data.success) {
                            navigate("/")
                            toast.success("Blog Added")
                            setLoading(false)
                        }
                    } catch (error) {
                        toast.error("Error")
                        setLoading(false)
                    }
                }
            } catch (err) {
                setLoading(false)
            }
        }
    }

    if (loading)
        return <div className="h-screen w-screen flex justify-center items-center">
            <p className="text-2xl font-semibold">Adding Blog ...</p>
        </div>

    return (
        <div className="min-h-screen pt-20 w-screen flex justify-center items-center">
            <form className="w-full  md:w-[30rem]" onSubmit={handleSubmit}>
                <p className="text-2xl font-semibold">Add Blog</p>
                <p className="mt-5">Title</p>
                <input type="text" value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} className="w-full border border-slate-300 rounded-md p-2" required />

                <p className="mt-5">Content</p>
                <textarea rows={4} value={blog.content} onChange={(e) => setBlog({ ...blog, content: e.target.value })} className="w-full border border-slate-300 rounded-md p-2" required></textarea>

                {
                    image && <img src={URL.createObjectURL(image)} className="mt-5" alt="" />
                }

                <p className="mt-5">Image</p>
                <input type="file" accept="image/*" onChange={(e) => {
                    if (e.target.files) {
                        setImage(e.target.files[0])
                    }
                }} className="w-full border border-slate-300 rounded-md p-2" required />

                <button type="submit" className="py-2 px-5 bg-blue-500 text-white font-semibold rounded-md mt-7">Add Blog</button>
            </form>
        </div>
    )
}