import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { Plus, Trash2, Edit, Package, Loader2, Upload, X, Users, ShoppingCart, LayoutDashboard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface Profile {
  id: string;
  full_name: string;
  role: string;
  last_seen: string;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  product_name: string;
  product_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  profiles?: { full_name: string };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'sales'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [usageTips, setUsageTips] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'products') await fetchProducts();
    if (activeTab === 'users') await fetchProfiles();
    if (activeTab === 'sales') await fetchOrders();
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  const isOnline = (lastSeen: string) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    return (now.getTime() - seen.getTime()) < 5 * 60 * 1000; // 5 minutes
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          alert("Erreur: Le bucket 'products' n'existe pas dans Supabase Storage. Veuillez le créer dans votre tableau de bord Supabase.");
        } else {
          throw uploadError;
        }
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error: any) {
      alert('Erreur lors de l\'upload de l\'image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name,
      description,
      usage_tips: usageTips,
      price: parseFloat(price),
      stock: parseInt(stock),
      image_url: imageUrl,
      images: additionalImages,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setUsageTips(product.usage_tips || '');
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setImageUrl(product.image_url);
    setAdditionalImages(product.images || []);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setUsageTips('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setAdditionalImages([]);
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setAdditionalImages([...additionalImages, publicUrl]);
    } catch (error: any) {
      alert('Erreur: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 px-4 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-serif italic text-stone-900">Admin Panel</h1>
          <div className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <Package className="w-4 h-4" /> Catalogue
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <Users className="w-4 h-4" /> Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'sales' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <ShoppingCart className="w-4 h-4" /> Ventes
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/shop')} className="text-sm text-stone-500 hover:text-stone-900">Boutique</button>
          {activeTab === 'products' && (
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-stone-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b border-stone-200 bg-white">
        <button onClick={() => setActiveTab('products')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'products' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400'}`}>Catalogue</button>
        <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'users' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400'}`}>Clients</button>
        <button onClick={() => setActiveTab('sales')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'sales' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400'}`}>Ventes</button>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Produit</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Prix</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Stock</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-stone-300" /></td></tr>
                  ) : products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image_url || 'https://picsum.photos/seed/product/50/50'} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                          <div>
                            <div className="font-medium text-stone-900">{product.name}</div>
                            <div className="text-xs text-stone-500 truncate max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-serif italic text-stone-900">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 5 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {product.stock} en stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(product)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Utilisateur</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Rôle</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-stone-300" /></td></tr>
                ) : profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900">{profile.full_name || 'Utilisateur sans nom'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${profile.role === 'admin' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isOnline(profile.last_seen) ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`} />
                        <span className="text-sm text-stone-500">{isOnline(profile.last_seen) ? 'En ligne' : 'Hors ligne'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(profile.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Client / Produit</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Prix</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-stone-300" /></td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{order.profiles?.full_name || 'Inconnu'}</div>
                      <div className="text-xs text-stone-500">{order.product_name}</div>
                    </td>
                    <td className="px-6 py-4 font-serif italic text-stone-900">{formatPrice(order.product_price)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-50 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                         order.status === 'cancelled' ? <XCircle className="w-3 h-3" /> :
                         <Clock className="w-3 h-3" />}
                        {order.status === 'completed' ? 'Terminé' :
                         order.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateOrderStatus(order.id, 'completed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-all" title="Marquer comme terminé"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all" title="Annuler"><XCircle className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal for Products */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-900">{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Nom du produit</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-stone-900 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Description</label>
                  <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-stone-900 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Conseils d'utilisation (Explications)</label>
                  <textarea rows={3} value={usageTips} onChange={(e) => setUsageTips(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-stone-900 transition-all" placeholder="Comment utiliser ce produit..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Prix (FCFA)</label>
                  <input type="number" step="1" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-stone-900 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Stock</label>
                  <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-stone-900 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Image Principale</label>
                  <div className="flex gap-4 items-center">
                    {imageUrl && <img src={imageUrl} className="w-16 h-16 rounded-lg object-cover border border-stone-200" />}
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg p-4 cursor-pointer hover:border-stone-400 transition-all">
                      {uploading ? <Loader2 className="w-6 h-6 animate-spin text-stone-400" /> : <Upload className="w-6 h-6 text-stone-400" />}
                      <span className="text-xs text-stone-500 mt-2">Cliquez pour uploader l'image principale</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Images Additionnelles</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {additionalImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <img src={img} className="w-full h-full rounded-lg object-cover border border-stone-200" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg p-4 cursor-pointer hover:border-stone-400 transition-all">
                    <Plus className="w-6 h-6 text-stone-400" />
                    <span className="text-xs text-stone-500 mt-2">Ajouter une autre photo</span>
                    <input type="file" accept="image/*" onChange={handleAdditionalImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-all">Annuler</button>
                <button type="submit" disabled={loading || uploading} className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all disabled:opacity-50">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
