import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { MessageCircle, ShoppingBag, User as UserIcon, LogOut, Loader2, LogIn, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);
    setFavorites(data?.map(f => f.product_id) || []);
  };

  const toggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    const isFavorite = favorites.includes(productId);
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== productId));
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
    } else {
      setFavorites([...favorites, productId]);
      await supabase.from('favorites').insert([{ user_id: user.id, product_id: productId }]);
    }
  };

  const handleBuyWhatsApp = async (product: Product) => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-erotic-black text-stone-200">
      {/* Navigation */}
      <nav className="bg-erotic-black/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-serif italic gold-gradient cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            Dark Pleasure
          </motion.h1>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <button onClick={() => navigate('/profile')} className="nav-link flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Profil</span>
                </button>
                <button onClick={handleLogout} className="nav-link flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Quitter</span>
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="nav-link flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/erotic/1920/1080?blur=10" 
            className="w-full h-full object-cover opacity-30"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-erotic-black/0 via-erotic-black/50 to-erotic-black" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center px-4"
        >
          <h2 className="text-6xl md:text-8xl font-serif italic gold-gradient mb-6 leading-tight">L'Art du Désir</h2>
          <p className="text-stone-400 max-w-xl mx-auto text-lg font-light tracking-wide leading-relaxed">
            Une collection confidentielle pour explorer vos sens en toute élégance.
          </p>
          {!user && (
            <button 
              onClick={() => navigate('/login')}
              className="gold-button mt-10"
            >
              Rejoindre l'expérience
            </button>
          )}
        </motion.div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h3 className="text-2xl font-serif italic text-erotic-gold">La Collection</h3>
          <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-[0.2em]">
            <Heart className="w-3 h-3 text-erotic-red" />
            Sélectionné pour vous
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-erotic-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-3xl gold-border">
            <ShoppingBag className="w-16 h-16 text-stone-700 mx-auto mb-6" />
            <p className="text-stone-500 font-serif italic text-xl">Le catalogue est en cours de préparation...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-stone-900 mb-6 gold-border transition-all duration-700 group-hover:red-glow">
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => toggleFavorite(e, product.id)}
                      className="p-2 rounded-full bg-erotic-black/40 backdrop-blur-md border border-white/10 hover:bg-erotic-black/60 transition-all"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${favorites.includes(product.id) ? 'text-erotic-red fill-erotic-red' : 'text-stone-400'}`} />
                    </button>
                  </div>
                  <img
                    src={product.image_url || 'https://picsum.photos/seed/product/600/800'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-erotic-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-erotic-gold text-[10px] font-bold uppercase tracking-[0.3em] border border-erotic-gold/30 px-4 py-2 rounded-full">Indisponible</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-erotic-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-erotic-gold">Découvrir l'article</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif italic text-xl text-stone-200 group-hover:text-erotic-gold transition-colors">{product.name}</h4>
                    {user ? (
                      <span className="font-serif italic text-erotic-gold">{formatPrice(product.price)}</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-erotic-red blur-[2px] select-none">Prix secret</span>
                    )}
                  </div>
                  
                  <p className="text-stone-500 text-sm font-light line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  {user ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyWhatsApp(product);
                      }}
                      disabled={product.stock <= 0}
                      className="w-full mt-4 bg-white/5 hover:bg-erotic-gold hover:text-erotic-black text-stone-300 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-500 border border-white/10 hover:border-erotic-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Commander
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/login');
                      }}
                      className="w-full mt-4 bg-erotic-red/10 hover:bg-erotic-red text-erotic-red hover:text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border border-erotic-red/20"
                    >
                      Se connecter pour voir le prix
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-erotic-black border-t border-white/5 py-20 mt-20">
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
