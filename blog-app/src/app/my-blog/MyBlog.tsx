import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { BACKEND } from '../../CONSTANTS'
import { toast } from 'sonner';
import { AuthUser } from '../AuthLayout'; 
import { MdOutlineDelete } from 'react-icons/md';

export default function MyBlog() {

  type BlogType = {
    content: string;
    _id: string;
    title: string;
    time: string;
    image: string;
    user: {
      name: string;
      userName: string;
      image: string;
    };
  }

  const { login } = useContext(AuthUser)

  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState<BlogType[]>([])

  const DeleteBlog = async (id: string) => {
    try {
      const res = await axios.delete(BACKEND + "/blog/delete-blog/" + id);
      if (res.data.success) {
        setBlogs((a) => a.filter((q) => q._id != id));
        toast.success("Blog Deleted");
      }
    } catch (error) {
      toast.error("Error in deleting blog");
    }
  }

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get(BACKEND + "/blog/get-blogs/" + login?.userName)

        setBlogs(res.data.blog)
        setLoading(false)
      } catch (error) {
        toast.error("Error in getting blogs");
      }
    }
    getBlogs()
  }, [])

  const Blog = ({ image, user, content, time, title, _id }: BlogType) => {
    return <div className='w-full border border-slate-200 rounded p-3'>
      <div className='flex gap-3 justify-between items-start'>
        <div className="">
          <div className="">
            <img src={user.image} className='h-12 w-12 object-cover bg-center rounded-full' alt={user.name} />
          </div>
          <div className="">
            <p className='text-lg font-semibold'>{user.name} <span className='text-base font-normal'>@{user.userName} . {new Date(time).toLocaleDateString()}</span></p>
            <p>{title}</p>
          </div>
        </div>
        <p className="p-2 bg-slate-300 rounded-full text-xl" onClick={() => DeleteBlog(_id)}>
          <MdOutlineDelete />
        </p>
      </div>
      <div className="mb-2">
        {content}
      </div>
      <div className="">
        <img src={image} alt={title} />
      </div>
    </div>
  }

  if (loading)
    return <div className='h-screen w-screen flex justify-center items-center'>
      <p>Loading Blogs ...</p>
    </div>

  return (
    <div className='py-16'>
      <p className='text-center font-semibold text-2xl mt-4'>My Blogs</p>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col gap-3 items-center justify-center w-full md:w-[45rem]">
          {
            blogs.map((a, i) => {
              return <Blog key={i} {...a} />
            })
          }
        </div>
      </div>

    </div>
  )
}
