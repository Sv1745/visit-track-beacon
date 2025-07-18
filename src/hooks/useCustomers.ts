
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface Customer {
  id: string;
  name: string;
  company_id: string;
  position?: string;
  email?: string;
  phone?: string;
  user_id: string;
  created_at: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchCustomers = async () => {
    if (!isAuthenticated || !user) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching customers for user:', user.id);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched customers:', data);
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Adding customer for user:', user.id);
      const { data, error } = await supabase
        .from('customers')
        .insert([{ ...customer, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setCustomers(prev => prev.map(cust => cust.id === id ? data : cust));
      return data;
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setCustomers(prev => prev.filter(cust => cust.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers();
    }
  }, [user, isAuthenticated]);

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
};
