import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, EyeOff, Lock } from 'lucide-react';

export default function ConfidentialityPage() {
  const navigate = useNavigate();

  const policies = [
    {
      title: "Confidentialité Absolue",
      icon: EyeOff,
      content: "Votre vie privée est notre priorité absolue. Nous comprenons la nature sensible de nos produits et nous nous engageons à protéger votre identité à chaque étape de votre expérience avec Dark Pleasure."
    },
    {
      title: "Collecte des Données",
      icon: ShieldCheck,
      content: "Nous ne collectons que les informations strictement nécessaires au traitement de vos commandes (Nom, Email, Adresse de livraison). Ces données ne sont jamais partagées avec des tiers à des fins publicitaires."
    },
    {
      title: "Sécurité des Échanges",
      icon: Lock,
      content: "Nos échanges via WhatsApp sont protégés par un chiffrement de bout en bout. Vos préférences et historiques de commandes sont stockés de manière sécurisée et ne sont accessibles qu'à notre équipe restreinte."
    }
  ];

  return (
    <div className="min-h-screen bg-erotic-black text-stone-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-erotic-red/5 blur-[150px] rounded-full" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="nav-link flex items-center gap-2 mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-10 md:p-16 gold-border"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-serif italic gold-gradient mb-6">Politique de Confidentialité</h1>
            <p className="text-stone-400 font-light tracking-widest uppercase text-xs">Votre secret est en sécurité avec nous</p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {policies.map((policy, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl bg-white/5 border border-white/5 hover:gold-border transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-erotic-black flex items-center justify-center border border-white/10 group-hover:border-erotic-gold transition-colors shrink-0">
                  <policy.icon className="w-8 h-8 text-erotic-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-stone-200 mb-4">{policy.title}</h2>
                  <p className="text-stone-400 font-light leading-relaxed italic">
                    {policy.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-3xl bg-erotic-red/5 border border-erotic-red/10 text-center">
            <p className="text-stone-300 font-serif italic text-lg mb-2">"La discrétion n'est pas une option, c'est notre promesse."</p>
            <p className="text-erotic-gold text-[10px] uppercase tracking-[0.3em]">L'équipe Dark Pleasure</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
