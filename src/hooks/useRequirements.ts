
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

export interface Requirement {
  id: string;
  company_id: string;
  customer_id: string;
  equipment_name: string;
  required_period: string;
  status: string;
  notes?: string;
  recorded_date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentType {
  id: string;
  name: string;
  created_at: string;
}

export const useRequirements = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requirements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = async (requirement: Omit<Requirement, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('requirements')
        .insert([{ ...requirement, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setRequirements(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding requirement:', error);
      throw error;
    }
  };

  const updateRequirement = async (id: string, updates: Partial<Requirement>) => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRequirements(prev => prev.map(req => req.id === id ? data : req));
      return data;
    } catch (error) {
      console.error('Error updating requirement:', error);
      throw error;
    }
  };

  const deleteRequirement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRequirements(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error('Error deleting requirement:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  return {
    requirements,
    loading,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    refreshRequirements: fetchRequirements
  };
};

export const useEquipmentTypes = () => {
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipmentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setEquipmentTypes(data || []);
    } catch (error) {
      console.error('Error fetching equipment types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch equipment types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEquipmentType = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('equipment_types')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;
      setEquipmentTypes(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data;
    } catch (error) {
      console.error('Error adding equipment type:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  return {
    equipmentTypes,
    loading,
    addEquipmentType,
    refreshEquipmentTypes: fetchEquipmentTypes
  };
};
