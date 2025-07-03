
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

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
  const { user } = useUser();

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
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
    try {
      if (!user) throw new Error('User not authenticated');

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
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
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
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCompanies(prev => prev.filter(company => company.id !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  };
};
