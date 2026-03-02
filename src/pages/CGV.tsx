import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck, Scale } from 'lucide-react';

export default function CGVPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Objet",
      content: "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Dark Pleasure et toute personne effectuant un achat sur le site. Elles visent à définir les modalités de vente, de paiement et de livraison."
    },
    {
      title: "2. Produits",
      content: "Les produits proposés sont ceux qui figurent dans le catalogue publié sur le site. Chaque produit est accompagné d'un descriptif. Les photographies sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit offert."
    },
    {
      title: "3. Prix",
      content: "Les prix figurant dans le catalogue sont des prix TTC en FCFA. Dark Pleasure se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable à l'acheteur."
    },
    {
      title: "4. Commande et Paiement",
      content: "La commande s'effectue via WhatsApp après sélection du produit. Le paiement s'effectue selon les modalités convenues lors de l'échange (Mobile Money, Espèces à la livraison, etc.). La vente n'est considérée comme définitive qu'après confirmation par Dark Pleasure."
    },
    {
      title: "5. Livraison et Discrétion",
      content: "Les livraisons sont faites à l'adresse indiquée lors de la commande. Nous garantissons une discrétion absolue : les colis sont neutres, sans aucune mention de la nature du contenu ou du nom de la boutique."
    },
    {
      title: "6. Rétractation",
      content: "Compte tenu de la nature des produits (hygiène et santé), le droit de rétractation ne peut être exercé pour les articles qui ont été descellés ou utilisés après la livraison."
    }
  ];

  return (
    <div className="min-h-screen bg-erotic-black text-stone-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-erotic-red/5 blur-[150px] rounded-full" />
      
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
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-erotic-gold/10 border border-erotic-gold/20">
              <Scale className="w-6 h-6 text-erotic-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic gold-gradient">Conditions Générales de Vente</h1>
          </div>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-l border-erotic-gold/20 pl-8"
              >
                <h2 className="text-xl font-serif italic text-erotic-gold mb-4">{section.title}</h2>
                <p className="text-stone-400 font-light leading-relaxed italic">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-stone-500 text-xs uppercase tracking-widest">Dernière mise à jour : Février 2024</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
