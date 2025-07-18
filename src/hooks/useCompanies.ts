
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface Company {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  logo?: string;
  user_id: string;
  created_at: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchCompanies = async () => {
    if (!isAuthenticated || !user) {
      setCompanies([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching companies for user:', user.id);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched companies:', data);
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (company: Omit<Company, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Adding company for user:', user.id);
      const { data, error } = await supabase
        .from('companies')
        .insert([{ ...company, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setCompanies(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setCompanies(prev => prev.map(company => company.id === id ? data : company));
      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setCompanies(prev => prev.filter(company => company.id !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompanies();
    }
  }, [user, isAuthenticated]);

  return {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  };
};
