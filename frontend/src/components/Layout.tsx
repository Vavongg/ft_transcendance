import { NavLink, Outlet } from 'react-router-dom'
import ChatPanel from '../pages/Chat'

// Enveloppe les pages avec la navigation et le panneau de chat partagé.
export default function Layout() {
  return (
    <div >
      <header className="sticky top-0 z-10 border-b border-white/10 bg-white/30 backdrop-blur ">
        <nav className="flex gap-4 p-4">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/login">Connexion</NavLink>
          <NavLink to="/profile">Profil</NavLink>
        </nav>
      </header>
      <div className="mx-auto mt-6 flex h-[80vh] w-full max-w-7xl gap-4 px-6">
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-xl">
          <Outlet />
        </main>
          <ChatPanel />
      </div>
    </div>
  )
}
