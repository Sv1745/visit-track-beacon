
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Users, Building2, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ACTION_TYPES = [
  'Call',
  'Send Quotation',
  'Site Visit',
  'Email Follow-up',
  'Meeting',
  'Presentation',
  'Product Demo',
  'Contract Discussion'
];

const VisitTracker = ({ visits, setVisits, companies, customers }) => {
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [formData, setFormData] = useState({
    companyId: '',
    customerId: '',
    actionType: '',
    visitDate: '',
    notes: '',
    nextFollowUp: '',
    status: 'completed'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.customerId || !formData.actionType || !formData.visitDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newVisit = {
      id: editingVisit ? editingVisit.id : Date.now().toString(),
      companyId: formData.companyId,
      customerId: formData.customerId,
      actionType: formData.actionType,
      visitDate: formData.visitDate,
      notes: formData.notes,
      nextFollowUp: formData.nextFollowUp,
      status: formData.status,
      createdAt: editingVisit ? editingVisit.createdAt : new Date().toISOString()
    };

    if (editingVisit) {
      setVisits(visits.map(visit => visit.id === editingVisit.id ? newVisit : visit));
      toast({
        title: "Success",
        description: "Visit updated successfully",
      });
    } else {
      setVisits([...visits, newVisit]);
      toast({
        title: "Success",
        description: "Visit recorded successfully",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      companyId: '',
      customerId: '',
      actionType: '',
      visitDate: '',
      notes: '',
      nextFollowUp: '',
      status: 'completed'
    });
    setSelectedCompany('');
    setIsAddingVisit(false);
    setEditingVisit(null);
  };

  const handleEdit = (visit) => {
    setFormData({
      companyId: visit.companyId,
      customerId: visit.customerId,
      actionType: visit.actionType,
      visitDate: visit.visitDate,
      notes: visit.notes,
      nextFollowUp: visit.nextFollowUp,
      status: visit.status
    });
    setSelectedCompany(visit.companyId);
    setEditingVisit(visit);
    setIsAddingVisit(true);
  };

  const handleDelete = (visitId) => {
    setVisits(visits.filter(visit => visit.id !== visitId));
    toast({
      title: "Success",
      description: "Visit deleted successfully",
    });
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(cust => cust.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getCompanyLogo = (companyId) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.logo : null;
  };

  const getFilteredCustomers = () => {
    if (!selectedCompany && !formData.companyId) return [];
    const companyId = selectedCompany || formData.companyId;
    return customers.filter(customer => customer.companyId === companyId);
  };

  const handleCompanyChange = (companyId) => {
    setFormData(prev => ({ ...prev, companyId, customerId: '' }));
    setSelectedCompany(companyId);
  };

  const sortedVisits = [...visits].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Visit Tracker</h2>
        <Button 
          onClick={() => setIsAddingVisit(true)} 
          className="flex items-center gap-2"
          disabled={companies.length === 0 || customers.length === 0}
        >
          <Plus className="w-4 h-4" />
          Record Visit
        </Button>
      </div>

      {(companies.length === 0 || customers.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Setup Required</h3>
            <p className="text-gray-500">
              You need to add companies and customers before recording visits
            </p>
          </CardContent>
        </Card>
      )}

      {isAddingVisit && companies.length > 0 && customers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVisit ? 'Edit Visit' : 'Record New Visit'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Select value={formData.companyId} onValueChange={handleCompanyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name} ({company.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select 
                    value={formData.customerId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                    disabled={!formData.companyId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredCustomers().map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} {customer.position && `(${customer.position})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionType">Action Type *</Label>
                  <Select value={formData.actionType} onValueChange={(value) => setFormData(prev => ({ ...prev, actionType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPES.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextFollowUp">Next Follow-up Date</Label>
                  <Input
                    id="nextFollowUp"
                    type="date"
                    value={formData.nextFollowUp}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this visit..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingVisit ? 'Update Visit' : 'Record Visit'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sortedVisits.map(visit => (
          <Card key={visit.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {getCompanyLogo(visit.companyId) ? (
                    <img 
                      src={getCompanyLogo(visit.companyId)} 
                      alt="Company logo" 
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {visit.actionType}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{getCompanyName(visit.companyId)}</span>
                      <span>•</span>
                      <Users className="w-4 h-4" />
                      <span>{getCustomerName(visit.customerId)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={visit.status === 'completed' ? 'default' : visit.status === 'pending' ? 'secondary' : 'destructive'}>
                    {visit.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(visit)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(visit.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Visit Date</Label>
                  <p className="text-sm">{new Date(visit.visitDate).toLocaleDateString()}</p>
                </div>
                {visit.nextFollowUp && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Next Follow-up</Label>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{new Date(visit.nextFollowUp).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Recorded</Label>
                  <p className="text-sm">{new Date(visit.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {visit.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notes</Label>
                  <p className="text-sm text-gray-700 mt-1">{visit.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {visits.length === 0 && companies.length > 0 && customers.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No visits recorded yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your business visits and follow-ups</p>
            <Button onClick={() => setIsAddingVisit(true)}>Record First Visit</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisitTracker;
