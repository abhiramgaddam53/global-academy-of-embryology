"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Mail, Calendar, User } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success) setMessages(json.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    // In a real app, you'd add a DELETE endpoint to /api/contact/[id]
    // For now, we'll just filter it out of the UI
    setMessages(messages.filter(m => m._id !== id));
    alert("Message deleted (UI only - Add DELETE API to persist)");
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
          <p className="text-slate-500 text-sm">Manage inquiries from the contact form.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg text-slate-600 font-medium text-sm">
          {messages.length} Messages
        </div>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
            <Mail className="mx-auto mb-4 opacity-50" size={32} />
            No messages found.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{msg.name}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <Mail size={12} /> {msg.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 flex items-center justify-end gap-1 mb-2">
                    <Calendar size={12} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="pl-13">
                <p className="font-medium text-slate-800 mb-2">{msg.subject}</p>
                <p className="text-slate-600 text-sm whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}