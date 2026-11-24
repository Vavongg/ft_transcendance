import { type FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); //evite que ca refresh apres chaque evenement
      setError('')
      if (!username.trim() || !email.trim() || !password || !confirmPassword) {
        setError("Input cannot be empty");
        return
      }
      if ( password.length < 5 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError('Le mot de passe doit faire au moins 5 caractères, avec une lettre et un chiffre.')
        return
      }
      if (password !== confirmPassword) {
        setError("password unmatched");
        return
      }
      setLoading(true)
      try{
        const response = await fetch('/api/auth/register', {
            method:'POST',
            headers:{'Content-Type':'application/json'}, // dire au backend que ce qui arrive est en JSON
            body:JSON.stringify({username, email, password }), // change les variable en "login":"Oshawott","password":"123Oshawott"
        })
        if (response.status === 409) {
          setError('Ce nom ou cet email est déjà utilisé.')
          return
        }
        if (response.status === 400) {
          setError('Données invalides.')
          return
        }
        if (!response.ok) {
          setError('Erreur serveur, réessaie plus tard.')
          return
        }
        navigate('/login');
      }
      catch{
        setError('Server not avaiable');
      }
      finally {
        setLoading(false);
      }
    }
  return(
      <form onSubmit={handleSignup} className="flex h-full  items-center justify-center p-6">
        <section className="flex flex-col gap-3 w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-8 shadow-xl ">
          <h1 className="mb-6 text-center text-2xl font-bold">Sign up</h1>
          <input
            aria-label="Ton id"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Username"
            autoComplete='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="email"
            aria-label="Ton email"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Email"
            autoComplete='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            aria-label="Ton mot de passe"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Password *"
            autoComplete='new-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            aria-label="Ton mot de passe"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Confirm Password *"
            autoComplete='new-password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <p >* minimum size of 5 with at least 1 character and 1 number</p>
          {error && <p className="text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="rounded px-3 py-2">
          →
          </button>
        </section>
      </form>
  )
}
