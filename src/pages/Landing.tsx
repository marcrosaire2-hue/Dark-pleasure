import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-erotic-black text-stone-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/image/m2.jpg" 
            className="w-full h-full object-cover opacity-40 scale-110"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-erotic-black/20 via-erotic-black/60 to-erotic-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-9xl font-serif italic gold-gradient mb-8 leading-tight tracking-tighter">
              Dark Pleasure
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 font-light tracking-[0.3em] uppercase mb-12 opacity-80">
              L'Éveil des Sens • L'Art du Désir
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/shop')}
                className="gold-button group flex items-center gap-3"
              >
                Explorer la Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-full border border-white/10 text-stone-400 hover:text-erotic-gold hover:border-erotic-gold transition-all uppercase text-xs font-bold tracking-widest"
              >
                Rejoindre le Cercle
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-stone-500">Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-erotic-gold to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-serif italic gold-gradient leading-tight">
              Une Expérience <br /> Confidentielle
            </h2>
            <p className="text-stone-400 text-lg font-light leading-relaxed">
              Dark Pleasure n'est pas qu'une simple boutique. C'est un sanctuaire dédié à l'exploration de vos désirs les plus profonds, où l'élégance rencontre la passion.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-6 h-6 text-erotic-gold" />
                </div>
                <div>
                  <h4 className="text-erotic-gold font-bold text-xs uppercase tracking-widest mb-2">Discrétion</h4>
                  <p className="text-stone-500 text-sm font-light">Expédition anonyme et colis neutre pour votre tranquillité.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Sparkles className="w-6 h-6 text-erotic-gold" />
                </div>
                <div>
                  <h4 className="text-erotic-gold font-bold text-xs uppercase tracking-widest mb-2">Qualité</h4>
                  <p className="text-stone-500 text-sm font-light">Une sélection rigoureuse des meilleurs articles de bien-être.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden gold-border red-glow"
          >
            <img 
              src="/image/m.jpg" 
              className="w-full h-full object-cover opacity-80"
              alt="Artistic erotic"
            />
          </motion.div>
        </div>
      </section>

      {/* Catalog Preview Section */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-5xl font-serif italic gold-gradient mb-6">Le Catalogue</h2>
          <p className="text-stone-400 max-w-2xl mx-auto font-light">
            Parcourez notre collection en toute liberté. Les membres bénéficient de tarifs exclusifs et de conseils d'utilisation détaillés.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Bien-être", desc: "Accessoires pour la détente et le plaisir.", icon: Heart },
            { title: "Lingerie", desc: "Élégance et séduction au quotidien.", icon: ShoppingBag },
            { title: "Conseils", desc: "Accompagnement personnalisé via WhatsApp.", icon: MessageCircle }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card p-10 rounded-[2.5rem] gold-border hover:red-glow transition-all group text-center"
            >
              <div className="w-16 h-16 bg-erotic-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-erotic-gold/20 group-hover:bg-erotic-gold transition-colors">
                <item.icon className="w-8 h-8 text-erotic-gold group-hover:text-erotic-black transition-colors" />
              </div>
              <h3 className="text-2xl font-serif italic text-stone-200 mb-4">{item.title}</h3>
              <p className="text-stone-500 font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20">
          <button 
            onClick={() => navigate('/shop')}
            className="gold-button"
          >
            Voir tout le catalogue
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-erotic-red/10 blur-[150px] rounded-full z-0" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-serif italic gold-gradient mb-8 leading-tight">
            Prêt à Explorer ?
          </h2>
          <p className="text-stone-400 text-lg font-light mb-12 leading-relaxed">
            Rejoignez notre cercle privé pour accéder à l'intégralité de nos services et bénéficier d'une expérience sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="gold-button"
            >
              Créer mon compte
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="nav-link"
            >
              Continuer en tant qu'invité
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-erotic-black border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-3xl font-serif italic gold-gradient mb-6">Dark Pleasure</h4>
          <p className="text-stone-500 text-sm font-light tracking-widest uppercase mb-10">Confidentialité absolue • Élégance • Désir</p>
          <div className="flex justify-center gap-8 mb-10">
            <Link to="/cgv" className="nav-link">CGV</Link>
            <Link to="/confidentiality" className="nav-link">Confidentialité</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
          <p className="text-stone-600 text-[10px] uppercase tracking-widest">© 2024 Dark Pleasure. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
