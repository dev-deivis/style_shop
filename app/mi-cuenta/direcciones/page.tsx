'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  Address,
  AddressInput,
} from '@/lib/addresses';
import AddressModal from '@/components/account/AddressModal';
import { Plus, MapPin, Phone, Pencil, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function DireccionesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Esperar a que termine de cargar el auth antes de redirigir
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadAddresses();
  }, [user, authLoading, router]);

  const loadAddresses = async () => {
    try {
      const data = await getUserAddresses(user!.id);
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: AddressInput) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
        setMessage({ type: 'success', text: 'Dirección actualizada correctamente' });
      } else {
        await createAddress(user!.id, addressData);
        setMessage({ type: 'success', text: 'Dirección añadida correctamente' });
      }
      await loadAddresses();
      setIsModalOpen(false);
      setEditingAddress(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) return;

    try {
      await deleteAddress(addressId);
      setMessage({ type: 'success', text: 'Dirección eliminada correctamente' });
      await loadAddresses();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId, user!.id);
      setMessage({ type: 'success', text: 'Dirección predeterminada actualizada' });
      await loadAddresses();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Mis Direcciones
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona tus lugares de entrega frecuentes
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#7c3aed]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Añadir Nueva
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl ${message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          } animate-fadeIn`}>
          {message.text}
        </div>
      )}

      {/* Grid of Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Add New Address Placeholder Card */}
        <button
          onClick={handleAddNew}
          className="group border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#7c3aed] dark:hover:border-[#7c3aed] rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all min-h-[220px] bg-transparent cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-[#7c3aed]/10 flex items-center justify-center transition-colors">
            <MapPin className="text-gray-400 group-hover:text-[#7c3aed] w-8 h-8" />
          </div>
          <span className="text-base font-bold text-gray-500 group-hover:text-[#7c3aed] transition-colors">
            Añadir Nueva Dirección
          </span>
        </button>

        {/* Address Cards */}
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${address.is_default
                    ? 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
                  }`}>
                  {address.label}
                </span>
                <button
                  onClick={() => !address.is_default && handleSetDefault(address.id)}
                  className="text-gray-300 hover:text-[#7c3aed] transition-colors disabled:cursor-not-allowed"
                  disabled={address.is_default}
                >
                  {address.is_default ? (
                    <CheckCircle className="text-[#7c3aed] w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">
                {address.full_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {address.address_line1}<br />
                {address.address_line2 && <>{address.address_line2}<br /></>}
                {address.city}, {address.zip_code}<br />
                {address.state && `${address.state}, `}{address.country}
              </p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {address.phone}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-50 dark:border-gray-700">
              <button
                onClick={() => handleEdit(address)}
                className="flex-1 py-2 text-sm font-bold bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="flex-1 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialData={editingAddress || undefined}
        title={editingAddress ? 'Editar Dirección' : 'Añadir Nueva Dirección'}
      />
    </div>
  );
}
