import { useState, useEffect, useRef, type FormEvent } from 'react'

type Message = { id: number; author: string; text: string }

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
    const [messages, setMessages] = useState<Message[]>([
  { id: 1, author: 'Spheal', text: 'BaaaAAaAAa !' },
  { id: 2, author: 'Victini', text: 'Tiniiii ✌️ !' },
  { id: 3, author: 'Oshawott', text: 'Oshaaaa !' },
  { id: 4, author: 'Snorlax', text: 'zzZZzzZ !' },
  { id: 5, author: 'Mimikyu', text: '✨-✨!' },
    ]);
    const [draft, setDraft] = useState('');

    //pour qu'on ramene tjr l'utilisateur au bas du chat s'il y a un new msg
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Ajoute les messages à l'état local ; la persistance serveur viendra avec Socket.IO.
    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //evite que ca refresh apres chaque new msg
        const text = draft.trim();
        if (!text)
            return;
        const newMessage = {
            id : Date.now(),
            author : 'GM',
            text : text,
        }
        setMessages((current) => [...current, newMessage]);
        setDraft('')
    };
  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="text-lg font-bold">General</h2>

      <div className="my-4 min-h-0 flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => (
            <p key={message.id}>
            <strong>{message.author} :</strong> {message.text}
            </p>
        ))}
        <div ref={messagesEndRef}/>
      </div >

      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <input
          aria-label="Ton message"
          className="min-w-0 flex-1 rounded bg-white/10 p-2"
          placeholder="Write your message..."
          onChange={(e) => setDraft(e.target.value)}
          value = {draft}
        />
        <button type="submit" className="rounded bg-white/10 px-3 py-2">
          →
        </button>

      </form>
    </div>
  )
}
