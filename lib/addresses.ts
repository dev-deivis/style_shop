import { supabase } from './supabase';

export interface Address {
  id: string;
  user_id: string;
  address_name?: string;
  full_name: string;
  phone: string;
  address: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  label: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressInput {
  address_name?: string;
  full_name: string;
  phone: string;
  address: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  label: string;
  is_default?: boolean;
}

// Obtener todas las direcciones del usuario
export async function getUserAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Obtener dirección predeterminada del usuario
export async function getDefaultAddress(userId: string): Promise<Address | null> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Crear nueva dirección
export async function createAddress(userId: string, addressData: AddressInput): Promise<Address> {
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      ...addressData,
      country: addressData.country || 'México',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Actualizar dirección existente
export async function updateAddress(
  addressId: string, 
  addressData: Partial<AddressInput>
): Promise<Address> {
  const { data, error } = await supabase
    .from('addresses')
    .update(addressData)
    .eq('id', addressId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Establecer dirección como predeterminada
export async function setDefaultAddress(addressId: string, userId: string): Promise<Address> {
  const { data, error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Eliminar dirección
export async function deleteAddress(addressId: string): Promise<void> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) throw error;
}
