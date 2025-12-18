"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Mail, Calendar, CheckCircle2, AlertCircle, X } from "lucide-react";

// --- CUSTOM ALERT COMPONENT ---
type AlertType = "success" | "error" | null;

interface CustomAlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

function CustomAlert({ type, message, onClose }: CustomAlertProps) {
  if (!type) return null;

  const isSuccess = type === "success";

  return (
    <div className={`fixed top-6 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-300 max-w-sm w-full shadow-lg rounded-xl border-l-4 p-4 flex items-start gap-4 bg-white ${
      isSuccess ? "border-emerald-500" : "border-red-500"
    }`}>
      <div className={`p-2 rounded-full shrink-0 ${isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
        {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      <div className="flex-1 pt-1">
        <h4 className={`font-bold text-sm ${isSuccess ? "text-emerald-800" : "text-red-800"}`}>
          {isSuccess ? "Success" : "Error"}
        </h4>
        <p className="text-slate-600 text-sm mt-1 leading-snug">{message}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}

// --- MAIN PAGE ---
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
  
  // Alert State
  const [alert, setAlert] = useState<{ type: AlertType; message: string }>({ type: null, message: "" });

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alert.type) {
      const timer = setTimeout(() => setAlert({ type: null, message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

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
      setAlert({ type: "error", message: "Failed to load messages." });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    // We keep the native confirm for safety, but use Custom Alert for success/error
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Remove from UI immediately
        setMessages((prev) => prev.filter((m) => m._id !== id));
        setAlert({ type: "success", message: "Message deleted successfully." });
      } else {
        setAlert({ type: "error", message: data.error || "Failed to delete message." });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Server error while deleting." });
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Alert */}
      <CustomAlert 
        type={alert.type} 
        message={alert.message} 
        onClose={() => setAlert({ type: null, message: "" })} 
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
          <p className="text-slate-500 text-sm">Manage inquiries from the contact form.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg text-slate-600 font-medium text-sm">
          {messages.length} Messages
        </div>
      </div>

      {/* Message List */}
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
            <Mail className="mx-auto mb-4 opacity-50" size={32} />
            No messages found.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg uppercase">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{msg.name}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <Mail size={12} /> {msg.email}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
                    <Calendar size={12} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="pl-0 md:pl-13">
                <p className="font-medium text-slate-800 mb-2">{msg.subject}</p>
                <div className="text-slate-600 text-sm whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {msg.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}