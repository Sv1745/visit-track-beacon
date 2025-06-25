
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCompanies } from '@/hooks/useCompanies';

const COMPANY_TYPES = [
  'Pharma Manufacturing',
  'Research',
  'Food',
  'Cosmetics',
  'Nutraceuticals',
  'Biotechnology',
  'Medical Devices',
  'Chemical',
  'Agriculture'
];

const CompanyManagement = () => {
  const { companies, addCompany, updateCompany, deleteCompany } = useCompanies();
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    logo: null,
    logoPreview: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const companyData = {
        name: formData.name,
        type: formData.type,
        logo: formData.logoPreview
      };

      if (editingCompany) {
        await updateCompany(editingCompany.id, companyData);
        toast({
          title: "Success",
          description: "Company updated successfully",
        });
      } else {
        await addCompany(companyData);
        toast({
          title: "Success",
          description: "Company added successfully",
        });
      }

      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const resetForm = () => {
    setFormData({ name: '', type: '', logo: null, logoPreview: null });
    setIsAddingCompany(false);
    setEditingCompany(null);
  };

  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      type: company.type,
      logo: null,
      logoPreview: company.logo
    });
    setEditingCompany(company);
    setIsAddingCompany(true);
  };

  const handleDelete = async (companyId) => {
    try {
      await deleteCompany(companyId);
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Company Management</h2>
        <Button 
          onClick={() => setIsAddingCompany(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </Button>
      </div>

      {isAddingCompany && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Company Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo').click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                  {formData.logoPreview && (
                    <img 
                      src={formData.logoPreview} 
                      alt="Logo preview" 
                      className="w-12 h-12 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCompany ? 'Update Company' : 'Add Company'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(company => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {company.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(company)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(company.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Added on {new Date(company.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first company</p>
            <Button onClick={() => setIsAddingCompany(true)}>Add Company</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyManagement;
