import { useState, useEffect, useRef, type FormEvent } from 'react'
import { io, type Socket } from 'socket.io-client'

type Message = { id: number; sender: string; content: string; createdAt: string }
// Identité temporaire de dev : sera remplacée par l'authentification de Lyris.
const username = new URLSearchParams(window.location.search).get('as') ?? 'Spheal'
const userId = username === 'Oshawott' ? 9002 : 9001

// Conteneur du panneau de chat latéral.
export default function ChatPanel() {
  return (
    <aside className="flex h-full min-h-0 w-50 shrink-0 flex-col rounded border-l border-white/10 bg-black/40 p-4 text-sm">
      <GeneralChat/>
    </aside>
  )
}

// Gère les messages de démonstration et le brouillon du chat général.
 function GeneralChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState('');
    const [error, setError] = useState('');
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    //pour qu'on ramene tjr l'utilisateur au bas du chat s'il y a un new msg
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // TMP TESTER
    useEffect(() => {
        const socket = io({ auth: { userId, username } });
        socketRef.current = socket;
        //if (import.meta.env.DEV) Object.assign(window, { socket }); // [ DEBUG ] rendre le socket accessible sur la console du navigateur

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('connect_error', () => setConnected(false));
        socket.on('chat:history', (history: Message[]) => setMessages(history));
        socket.on('chat:message', (message: Message) => {
            setMessages((current) => [...current, message]);
        });
        socket.on('chat:error', (err: { message: string }) => setError(err.message));
        socket.on('exception', () => setError('Message invalide'));
        return () => { 
            socket.disconnect();
            socketRef.current = null;
        };
    }, []); // le [] dit a React de ne pas relancer ce bloc meme si l'user tape du texte

    // Ajoute les messages à l'état local ; msg enregistré dans le backend via Gateway
    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //evite que ca refresh apres chaque new msg
        const content = draft.trim();
        if (!content)
            return;
        socketRef.current?.emit('chat:send', { content });
        setDraft('')
        setError('');
    };
  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="text-lg font-bold">General</h2>

      <div className="my-4 min-h-0 flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => (
            <p key={message.id}>
            <strong>{message.sender} :</strong> {message.content}
            </p>
        ))}
        <div ref={messagesEndRef}/>
      </div >
      {error && <p className="mb-2 text-red-400">{error}</p>}
      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <input
          aria-label="Ton message"
          className="min-w-0 flex-1 rounded bg-white/10 p-2"
          placeholder="Write your message..."
          onChange={(e) => setDraft(e.target.value)}
          value = {draft}
          maxLength={1000}
        />
        <button type="submit" disabled={!connected} className="rounded bg-white/10 px-3 py-2">
          →
        </button>
      </form>
    </div>
  )
}
