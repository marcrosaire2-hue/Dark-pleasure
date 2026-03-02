import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { MessageCircle, ArrowLeft, Loader2, ShoppingBag, ShieldCheck, Heart, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  description: string;
  usage_tips: string;
  price: number;
  image_url: string;
  images: string[];
  stock: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    checkUser();
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkIfFavorite();
    }
  }, [user, id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkIfFavorite = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .single();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFavorite) {
      setIsFavorite(false);
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', id);
    } else {
      setIsFavorite(true);
      await supabase.from('favorites').insert([{ user_id: user.id, product_id: id }]);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      setActiveImage(data.image_url);
    } catch (err) {
      console.error('Error fetching product:', err);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyWhatsApp = async () => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await supabase.from('orders').insert([{
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        status: 'pending'
      }]);
    } catch (err) {
      console.error('Error recording order:', err);
    }

    const message = encodeURIComponent(`Bonjour, je souhaite commander ${product.name} au prix de ${formatPrice(product.price)}`);
    window.open(`https://wa.me/33600000000?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-erotic-black">
        <Loader2 className="w-12 h-12 animate-spin text-erotic-gold" />
      </div>
    );
  }

  if (!product) return null;

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-erotic-black text-stone-200">
      <nav className="bg-erotic-black/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate('/shop')} className="nav-link flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la collection</span>
          </button>
          <h1 className="text-xl font-serif italic gold-gradient">Détails de l'article</h1>
          <div className="w-20" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-stone-900 gold-border red-glow relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6 }}
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute top-6 right-6">
                <button 
                  onClick={toggleFavorite}
                  className="bg-erotic-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 hover:bg-erotic-black/60 transition-all"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-erotic-red fill-erotic-red' : 'text-stone-400'}`} />
                </button>
              </div>
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                      activeImage === img ? 'border-erotic-gold shadow-lg shadow-erotic-gold/20' : 'border-white/5 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 text-erotic-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                  <ShoppingBag className="w-4 h-4" />
                  Édition Limitée
                </div>
                <h2 className="text-5xl md:text-7xl font-serif italic gold-gradient mb-6 leading-tight">{product.name}</h2>
                
                {user ? (
                  <div className="text-4xl font-serif italic text-stone-200 mb-8">{formatPrice(product.price)}</div>
                ) : (
                  <div className="inline-block px-6 py-3 bg-erotic-red/10 border border-erotic-red/20 rounded-2xl mb-8">
                    <span className="text-erotic-red text-xs font-bold uppercase tracking-widest blur-[1px]">Prix confidentiel</span>
                  </div>
                )}
                
                <div className="prose prose-invert max-w-none mb-10">
                  <p className="text-stone-400 text-lg font-light leading-relaxed whitespace-pre-line italic">
                    "{product.description}"
                  </p>
                </div>

                {product.usage_tips && (
                  <div className="mb-10 p-8 glass-card rounded-3xl gold-border">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-erotic-gold mb-4 flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      L'Art de l'Usage
                    </h3>
                    <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line font-light italic opacity-80">
                      {product.usage_tips}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl mb-10 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-erotic-gold/10 flex items-center justify-center border border-erotic-gold/20">
                    <ShieldCheck className="w-6 h-6 text-erotic-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-200 uppercase tracking-widest">Discrétion Absolue</p>
                    <p className="text-xs text-stone-500 font-light mt-1">Expédition anonyme, colis neutre sans marquage.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {user ? (
                    <button
                      onClick={handleBuyWhatsApp}
                      disabled={product.stock <= 0}
                      className="gold-button w-full flex items-center justify-center gap-4 py-5 text-lg"
                    >
                      <MessageCircle className="w-6 h-6" />
                      Commander maintenant
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-erotic-red text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-erotic-red/80 transition-all flex items-center justify-center gap-4 shadow-xl shadow-erotic-red/20"
                    >
                      <LogIn className="w-6 h-6" />
                      Se connecter pour commander
                    </button>
                  )}
                  
                  {product.stock <= 0 && (
                    <p className="text-erotic-red text-xs text-center font-bold uppercase tracking-widest mt-2">Victime de son succès • Rupture de stock</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
