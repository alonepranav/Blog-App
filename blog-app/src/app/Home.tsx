import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { BACKEND } from '../CONSTANTS';
import { Link } from 'react-router-dom';

export default function Home() {

  type BlogType = {
    content: string;
    id: string;
    title: string;
    time: string;
    image: string;
    user: {
      name: string;
      userName: string;
      image: string;
    };
  }

  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState<BlogType[]>([])

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get(BACKEND + "/blog/get-blog")

        if (res.data.success) {
          setBlogs(res.data.blog)
          setLoading(false)
        } else {
          throw new Error()
        }
      } catch (error) {
        toast.error("Error in getting blogs");
      }
    }
    getBlogs()
  }, [])

  const Blog = ({ image, user, content, time, title }: BlogType) => {
    return <div className='w-full border border-slate-200 rounded p-3'>
      <div className='flex gap-3'>
        <div className="">
          <img src={user.image} className='h-12 w-12 object-cover bg-center rounded-full' alt={user.name} />
        </div>
        <div className="">
          <div className='text-lg font-semibold'> {user.name} <Link to={"/profile/" + user.userName} className='text-base font-normal'>@{user.userName} . {new Date(time).toLocaleDateString()}</Link></div>
          <p>{title}</p>
        </div>
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
