import { type FormEvent } from 'react'

export default function Login() {
  // Formulaire visuel uniquement : la connexion au backend reste à brancher.
  const handleRefresh = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //evite que ca refresh apres chaque evenement
        }
  return(
      <form onSubmit={handleRefresh} className="flex h-full  items-center justify-center p-6">
        <section className="flex flex-col gap-3 w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-8 shadow-xl ">
          <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
          <input
            aria-label="Ton id"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Login"
            autoComplete='username'
          />
          <input
            type="password"
            aria-label="Ton mot de passe"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Password"
            autoComplete='current-password'
          />
          <button type="submit" className="rounded px-3 py-2">
          →
          </button>
        </section>
      </form>
  )
}
