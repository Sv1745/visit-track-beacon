
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Visit {
  id: string;
  company_id: string;
  customer_id: string;
  action_type: string;
  visit_date: string;
  notes?: string;
  next_follow_up?: string;
  next_action_type?: string;
  status: string;
  created_at: string;
}

export const useVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast({
        title: "Error",
        description: "Failed to load visits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVisit = async (visit: Omit<Visit, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .insert([visit])
        .select()
        .single();

      if (error) throw error;
      setVisits(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding visit:', error);
      toast({
        title: "Error",
        description: "Failed to add visit",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateVisit = async (id: string, updates: Partial<Visit>) => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setVisits(prev => prev.map(visit => visit.id === id ? data : visit));
      return data;
    } catch (error) {
      console.error('Error updating visit:', error);
      toast({
        title: "Error",
        description: "Failed to update visit",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteVisit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVisits(prev => prev.filter(visit => visit.id !== id));
    } catch (error) {
      console.error('Error deleting visit:', error);
      toast({
        title: "Error",
        description: "Failed to delete visit",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  return {
    visits,
    loading,
    addVisit,
    updateVisit,
    deleteVisit,
    refetch: fetchVisits
  };
};
