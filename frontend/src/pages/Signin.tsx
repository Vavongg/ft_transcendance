import { type FormEvent } from 'react'

export default function Signin() {
  // Formulaire visuel uniquement : la connexion au backend reste à brancher.
  const handleRefresh = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //evite que ca refresh apres chaque evenement
        }
  return(
      <form onSubmit={handleRefresh} className="flex h-full  items-center justify-center p-6">
        <section className="flex flex-col gap-3 w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-8 shadow-xl ">
          <h1 className="mb-6 text-center text-2xl font-bold">Sign in</h1>
          <input
            aria-label="Ton id"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Login"
            autoComplete='username'
          />
          <input
            aria-label="Ton email"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="email"
            autoComplete='email'
          />
          <input
            type="password"
            aria-label="Ton mot de passe"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Password *"
            autoComplete='current-password'
          />
          <input
            type="password"
            aria-label="Ton mot de passe"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Confirm Password *"
            autoComplete='current-password'
          />
          <p >* minimum size 5 with at least 1 character and 1 number</p>
          <button type="submit" className="rounded px-3 py-2">
          →
          </button>
        </section>
      </form>
  )
}
