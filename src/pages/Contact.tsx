import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Conseil produit',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- CONNEXION À FORMSPREE ---
      const response = await fetch("https://formspree.io/f/mwvnjrla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSent(true);
        setFormData({ name: '', email: '', subject: 'Conseil produit', message: '' });
      } else {
        alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-erotic-black text-stone-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-erotic-red/5 blur-[150px] rounded-full" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="nav-link flex items-center gap-2 mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info de Contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h1 className="text-6xl md:text-7xl font-serif italic gold-gradient mb-6">Contactez-nous</h1>
              <p className="text-stone-400 text-lg font-light leading-relaxed">
                Une question ? Un conseil personnalisé ? Notre équipe est à votre écoute pour vous accompagner dans votre quête de plaisir.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:gold-border transition-all">
                  <MessageCircle className="w-6 h-6 text-erotic-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">WhatsApp Direct</p>
                  <a href="https://wa.me/2290198719423" target="_blank" className="text-stone-200 hover:text-erotic-gold transition-colors">+229 01 98 71 94 23</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:gold-border transition-all">
                  <Mail className="w-6 h-6 text-erotic-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Email</p>
                  {/* Mise à jour de l'email ici */}
                  <a href="mailto:darkdesire45t@gmail.com" className="text-stone-200 hover:text-erotic-gold transition-colors">darkdesire45t@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:gold-border transition-all">
                  <MapPin className="w-6 h-6 text-erotic-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Boutique</p>
                  <p className="text-stone-200">Service de livraison uniquement • Discrétion garantie</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulaire de Contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[2.5rem] p-10 gold-border red-glow"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 rounded-full bg-erotic-gold/20 flex items-center justify-center border border-erotic-gold/30">
                  <Send className="w-10 h-10 text-erotic-gold" />
                </div>
                <h3 className="text-3xl font-serif italic gold-gradient">Message Envoyé</h3>
                <p className="text-stone-400 font-light">Nous vous répondrons dans les plus brefs délais, en toute discrétion.</p>
                <button onClick={() => setSent(false)} className="text-erotic-gold text-xs font-bold uppercase tracking-widest hover:underline">Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">Nom</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">Sujet</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option value="Conseil produit" className="bg-erotic-black">Conseil produit</option>
                    <option value="Suivi de commande" className="bg-erotic-black">Suivi de commande</option>
                    <option value="Autre demande" className="bg-erotic-black">Autre demande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button w-full flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}