import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Calendar, LogOut, Loader2, ArrowLeft, Heart } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, role, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFavorites();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('products(*)')
        .eq('user_id', user?.id);
      if (error) throw error;
      setFavorites(data?.map(f => f.products) || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-erotic-black">
        <Loader2 className="w-12 h-12 animate-spin text-erotic-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-erotic-black p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-erotic-red/10 blur-[150px] rounded-full" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button onClick={() => navigate('/shop')} className="nav-link flex items-center gap-2 mb-10">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'univers</span>
        </button>

        <div className="glass-card rounded-[2rem] overflow-hidden red-glow gold-border">
          <div className="bg-gradient-to-r from-erotic-red to-erotic-black h-40 relative">
            <div className="absolute -bottom-16 left-10">
              <div className="w-32 h-32 bg-erotic-black rounded-3xl shadow-2xl flex items-center justify-center border-4 border-erotic-gold/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-erotic-gold/5 group-hover:bg-erotic-gold/10 transition-colors" />
                <User className="w-16 h-16 text-erotic-gold relative z-10" />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-10 px-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-serif italic gold-gradient mb-2">{profile?.full_name || 'Utilisateur'}</h1>
                <p className="text-stone-500 font-light tracking-widest uppercase text-xs">{user?.email}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${role === 'admin' ? 'bg-erotic-gold text-erotic-black border-erotic-gold' : 'bg-white/5 text-erotic-gold border-white/10'}`}>
                {role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-5 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-erotic-gold/30 transition-all group">
                <div className="w-12 h-12 bg-erotic-black rounded-2xl flex items-center justify-center border border-white/10 group-hover:gold-border transition-all">
                  <Mail className="w-5 h-5 text-erotic-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Email</p>
                  <p className="text-stone-200 text-sm font-light">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-erotic-gold/30 transition-all group">
                <div className="w-12 h-12 bg-erotic-black rounded-2xl flex items-center justify-center border border-white/10 group-hover:gold-border transition-all">
                  <Shield className="w-5 h-5 text-erotic-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Privilège</p>
                  <p className="text-stone-200 text-sm font-light capitalize">{role}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-erotic-gold/30 transition-all group md:col-span-2">
                <div className="w-12 h-12 bg-erotic-black rounded-2xl flex items-center justify-center border border-white/10 group-hover:gold-border transition-all">
                  <Calendar className="w-5 h-5 text-erotic-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Membre du cercle depuis</p>
                  <p className="text-stone-200 text-sm font-light">{new Date(profile?.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-serif italic gold-gradient mb-8 flex items-center gap-3">
                <Heart className="w-5 h-5 text-erotic-red fill-erotic-red" />
                Mes Coups de Cœur
              </h3>
              
              {favorites.length === 0 ? (
                <div className="p-10 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-stone-500 text-sm font-light italic">Vous n'avez pas encore d'articles favoris.</p>
                  <button onClick={() => navigate('/shop')} className="text-erotic-gold text-xs font-bold uppercase tracking-widest mt-4 hover:underline">Explorer la collection</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {favorites.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-erotic-gold/30 transition-all cursor-pointer group"
                    >
                      <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <h4 className="text-stone-200 font-serif italic group-hover:text-erotic-gold transition-colors">{product.name}</h4>
                        <p className="text-erotic-gold text-xs font-serif italic">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-12 py-5 bg-erotic-red/10 text-erotic-red rounded-full font-bold uppercase tracking-widest hover:bg-erotic-red hover:text-white transition-all duration-500 border border-erotic-red/20 flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Quitter l'univers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
