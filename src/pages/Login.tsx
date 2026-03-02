import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Fetch profile to redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/shop');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, full_name: fullName, role: 'customer' },
          ]);
          if (profileError) throw profileError;
        }
        
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-erotic-black p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-erotic-red/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-erotic-red/20 blur-[120px] rounded-full" />

      <div className="max-w-md w-full glass-card rounded-3xl p-8 relative z-10 red-glow">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-serif italic gold-gradient mb-3 tracking-tight">Dark Pleasure</h1>
          <p className="text-stone-400 text-sm font-light tracking-widest uppercase">Élégance & Désir</p>
        </div>

        <div className="flex mb-10 bg-white/5 p-1 rounded-full gold-border">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-500 ${
              isLogin ? 'bg-erotic-gold text-erotic-black shadow-lg' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-500 ${
              !isLogin ? 'bg-erotic-gold text-erotic-black shadow-lg' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all placeholder:text-stone-600"
                placeholder="Votre nom"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all placeholder:text-stone-600"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-erotic-gold mb-2 ml-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 px-5 py-4 rounded-2xl border border-white/10 text-white focus:ring-2 focus:ring-erotic-gold focus:border-transparent outline-none transition-all placeholder:text-stone-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-erotic-red/20 text-erotic-red text-xs rounded-2xl border border-erotic-red/30 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-button w-full flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Entrer dans l'univers
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Rejoindre le cercle
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
