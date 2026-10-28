import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-white/30 backdrop-blur ">
        <nav className="flex gap-4 p-4">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/login">Connexion</NavLink>
          <NavLink to="/profile">Profil</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}