import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLayout from './app/AuthLayout'
import Home from './app/Home'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import NotFound from './app/NotFound'
import Profile from './app/profile/[userName]/Profile'
import MyBlog from './app/my-blog/MyBlog'
import AddBlog from './app/add-blog/AddBlog'

function App() {

  return (
    <>
      <div>
        <Toaster position='top-center' />
        <BrowserRouter>
          <AuthLayout>
            <Navbar />
            <Routes>
              <Route path='/' Component={Home} />
              <Route path='/profile/:userName' Component={Profile} />
              <Route path='/my-blogs' Component={MyBlog} />
              <Route path='/add-blog' Component={AddBlog} />
              <Route path='*' Component={NotFound} />
            </Routes>
          </AuthLayout>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
