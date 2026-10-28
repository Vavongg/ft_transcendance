import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen bg-[url('/charizardExTgc.jpeg')] bg-cover bg-center bg-black/10 bg-blend-multiply text-white">
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<p>Page introuvable</p>} />
      </Route>
    </Routes>
    </div>
  )
}
