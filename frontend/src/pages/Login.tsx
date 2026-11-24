import { type FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); //evite que ca refresh apres chaque evenement
      setError('')
      if (!username.trim() || !password) {
        setError("Input cannot be empty");
        return
      }
      setLoading(true)
      try{
        const response = await fetch('/api/auth/login', {
            method:'POST',
            headers:{'Content-Type':'application/json'}, // dire au backend que ce qui arrive est en JSON
            body:JSON.stringify({username, password }), // change les variable en "login":"Oshawott","password":"123Oshawott"
        })
        if (!response.ok) {
            setError(response.status === 401?'Username or password incorrect.':'Error Server: try later.');
            return;
        }
        navigate('/');
      }
      catch{
        setError('Server not avaiable');
      }
      finally {
        setLoading(false);
      }
    }
  return(
      <form onSubmit={handleLogin} className="flex h-full  items-center justify-center p-6">
        <section className="flex flex-col gap-3 w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-8 shadow-xl ">
          <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
          <input
            aria-label="Ton id"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Username"
            autoComplete='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            aria-label="Ton mot de passe"
            className="min-w-0 flex-1 rounded bg-white/15 p-2"
            placeholder="Password"
            autoComplete='current-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="rounded px-3 py-2">
          →
          </button>
        </section>
      </form>
  );
}

