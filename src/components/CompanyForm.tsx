
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  created_at: string;
}

interface CompanyFormProps {
  onSubmit: (company: Omit<Company, 'id' | 'created_at'>) => void;
}

const companyTypes = [
  'Manufacturing',
  'Services',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Construction',
  'Transportation',
  'Energy',
  'Other'
];

export const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) {
      toast({
        title: "Error",
        description: "Name and type are required",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ name, type, address, phone });
    setName('');
    setType('');
    setAddress('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter company name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Company Type *</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select company type" />
          </SelectTrigger>
          <SelectContent>
            {companyTypes.map((companyType) => (
              <SelectItem key={companyType} value={companyType}>
                {companyType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter company address"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>
      
      <Button type="submit" className="w-full">
        Add Company
      </Button>
    </form>
  );
};
