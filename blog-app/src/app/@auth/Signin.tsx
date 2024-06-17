import { Dispatch, FormEvent, useState } from 'react'
import { BACKEND, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from '../../CONSTANTS';
import axios from 'axios';
import { toast } from 'sonner';

export default function Signin({ setAuthRoute }: { setAuthRoute: Dispatch<"login" | "signin"> }) {

  const [image, setImage] = useState<null | File>(null)

  const [user, setUser] = useState<{
    userName: string;
    about: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>({
    userName: "",
    about: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleForm = async (e: FormEvent) => {
    e.preventDefault()

    if (image != null) {
      try {
        setLoading(true)
        try {
          const res = await axios.post(BACKEND + "/auth/validate-cred", {
            userName: user.userName,
            email: user.email,
          });

          if (res.data.success) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
            data.append("folder", "image");

            try {
              const response = await fetch(
                CLOUDINARY_URL,
                {
                  method: "POST",
                  body: data,
                }
              );

              const q = await response.json();

              if (q.secure_url) {
                try {
                  const re = await axios.post(BACKEND + "/auth/signin", {
                    ...user,
                    image: q.secure_url
                  });
                  if (re.data.success) {
                    toast.success("Signin successfull")
                    setAuthRoute("login")
                  }
                } catch (error) {
                  setLoading(false)
                }
              }
            }
            catch (err) {
              toast.error("Error in uploading image")
              setLoading(false)
            }
          }
          else {
            toast.error("Username or email already taken")
            setLoading(false)
          }
        } catch (error) {
          toast.error("Username or email already taken")
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        toast.error("Error")
      }
    }
  }

  if (loading)
    return <div className='h-screen w-screen flex justify-center items-center '>
      <p className='text-3xl font-semibold'>Creating Account ...</p>
    </div>

  return (
    <div className='h-full w-full px-5 md:px-60 py-20'>
      <form className='mt-4' onSubmit={handleForm}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl font-semibold leading-7 text-gray-900">Signin</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">blog-app.vercel.app/profile/</span>
                    <input type="text" name="username" id="username" autoComplete="username" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="johndoe"
                      value={user.userName}
                      onChange={(e) => setUser({ ...user, userName: e.target.value.trim().toLowerCase() })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">About</label>
                <div className="mt-2">
                  <textarea id="about" name="about" rows={3} className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={user.about}
                    onChange={(e) => setUser({ ...user, about: e.target.value })}
                    required
                  ></textarea>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
              </div>

              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div className="mt-2 flex items-center gap-x-3">
                  {
                    image && <img src={URL.createObjectURL(image)} />
                  }
                </div>
              </div>

              <div className="col-span-full">

                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => {
                          if (e.target.files) {
                            setImage(e.target.files[0])
                          }
                        }}
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 1MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                <div className="mt-2">
                  <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                <div className="mt-2">
                  <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                  <input id="email" name="email" type="email" autoComplete="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value.toLowerCase().trim() })}
                    required
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                  <input id="password" name="password" type="password" autoComplete="password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <p className="text-center">
            Already have an account?
            <span onClick={() => setAuthRoute("login")} className="font-semibold text-blue-500 cursor-pointer"> Login</span>
          </p>
          <button type="reset" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
        </div>
      </form>
    </div>
  )
}