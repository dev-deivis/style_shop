'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AddressInput } from '@/lib/addresses';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressInput) => Promise<void>;
  initialData?: AddressInput & { id?: string };
  title: string;
}

export default function AddressModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  title 
}: AddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressInput>({
    address_name: '',
    full_name: '',
    phone: '',
    address: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'México',
    label: 'Casa',
    is_default: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        address_name: '',
        full_name: '',
        phone: '',
        address: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'México',
        label: 'Casa',
        is_default: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeInUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
              placeholder="+52 55 1234 5678"
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección (Calle y Número)
            </label>
            <input
              type="text"
              required
              value={formData.address_line1}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ 
                  ...formData, 
                  address_line1: value,
                  address: value // Sincronizar con address
                });
              }}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
              placeholder="Av. Insurgentes Sur 1234"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Complemento (Opcional)
            </label>
            <input
              type="text"
              value={formData.address_line2 || ''}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
              placeholder="Piso 4B, Col. Del Valle"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
                placeholder="Ciudad de México"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
                placeholder="CDMX"
              />
            </div>
          </div>

          {/* Zip Code & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                required
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
                placeholder="03100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
                placeholder="México"
              />
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiqueta
            </label>
            <select
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-gray-900 dark:text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none"
            >
              <option value="Casa">Casa</option>
              <option value="Oficina">Oficina</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Is Default */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]"
            />
            <label htmlFor="is_default" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Establecer como dirección predeterminada
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
