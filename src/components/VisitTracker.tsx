
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, Plus, Edit, Trash2, Users, Building2, Clock, Filter, Table as TableIcon, Grid } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useVisits } from '@/hooks/useVisits';
import { useCompanies } from '@/hooks/useCompanies';
import { useCustomers } from '@/hooks/useCustomers';

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

const VisitTracker = () => {
  const { visits, addVisit, updateVisit, deleteVisit } = useVisits();
  const { companies } = useCompanies();
  const { customers } = useCustomers();
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState({
    company_id: 'all',
    customer_id: 'all',
    action_type: 'all',
    status: 'all'
  });
  const [formData, setFormData] = useState({
    company_id: '',
    customer_id: '',
    action_type: '',
    visit_date: '',
    notes: '',
    next_follow_up: '',
    status: 'completed'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company_id || !formData.customer_id || !formData.action_type || !formData.visit_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const visitData = {
        company_id: formData.company_id,
        customer_id: formData.customer_id,
        action_type: formData.action_type,
        visit_date: formData.visit_date,
        notes: formData.notes,
        next_follow_up: formData.next_follow_up || null,
        status: formData.status
      };

      if (editingVisit) {
        await updateVisit(editingVisit.id, visitData);
        toast({
          title: "Success",
          description: "Visit updated successfully",
        });
      } else {
        await addVisit(visitData);
        toast({
          title: "Success",
          description: "Visit recorded successfully",
        });
      }

      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      customer_id: '',
      action_type: '',
      visit_date: '',
      notes: '',
      next_follow_up: '',
      status: 'completed'
    });
    setSelectedCompany('');
    setIsAddingVisit(false);
    setEditingVisit(null);
  };

  const handleEdit = (visit) => {
    setFormData({
      company_id: visit.company_id,
      customer_id: visit.customer_id,
      action_type: visit.action_type,
      visit_date: visit.visit_date,
      notes: visit.notes || '',
      next_follow_up: visit.next_follow_up || '',
      status: visit.status
    });
    setSelectedCompany(visit.company_id);
    setEditingVisit(visit);
    setIsAddingVisit(true);
  };

  const handleDelete = async (visitId) => {
    try {
      await deleteVisit(visitId);
      toast({
        title: "Success",
        description: "Visit deleted successfully",
      });
    } catch (error) {
      // Error handling is done in the hook
    }
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
    if (!selectedCompany && !formData.company_id) return [];
    const companyId = selectedCompany || formData.company_id;
    return customers.filter(customer => customer.company_id === companyId);
  };

  const handleCompanyChange = (companyId) => {
    setFormData(prev => ({ ...prev, company_id: companyId, customer_id: '' }));
    setSelectedCompany(companyId);
  };

  const getFilteredVisits = () => {
    let filtered = [...visits];

    if (filters.company_id !== 'all') {
      filtered = filtered.filter(visit => visit.company_id === filters.company_id);
    }
    if (filters.customer_id !== 'all') {
      filtered = filtered.filter(visit => visit.customer_id === filters.customer_id);
    }
    if (filters.action_type !== 'all') {
      filtered = filtered.filter(visit => visit.action_type === filters.action_type);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(visit => visit.status === filters.status);
    }

    return filtered.sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
  };

  const sortedVisits = getFilteredVisits();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Visit Tracker</h2>
        <Button 
          onClick={() => setIsAddingVisit(true)} 
          className="flex items-center gap-2"
          disabled={companies.length === 0 || customers.length === 0}
        >
          <Plus className="w-4 h-4" />
          Record Visit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="cards" aria-label="Card view">
                <Grid className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view">
                <TableIcon className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Company</Label>
            <Select value={filters.company_id} onValueChange={(value) => setFilters(prev => ({ ...prev, company_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={filters.customer_id} onValueChange={(value) => setFilters(prev => ({ ...prev, customer_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All customers</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Action Type</Label>
            <Select value={filters.action_type} onValueChange={(value) => setFilters(prev => ({ ...prev, action_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {ACTION_TYPES.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {(companies.length === 0 || customers.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Setup Required</h3>
            <p className="text-muted-foreground">
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
                  <Select value={formData.company_id} onValueChange={handleCompanyChange}>
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
                    value={formData.customer_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
                    disabled={!formData.company_id}
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
                  <Select value={formData.action_type} onValueChange={(value) => setFormData(prev => ({ ...prev, action_type: value }))}>
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
                    value={formData.visit_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextFollowUp">Next Follow-up Date</Label>
                  <Input
                    id="nextFollowUp"
                    type="date"
                    value={formData.next_follow_up}
                    onChange={(e) => setFormData(prev => ({ ...prev, next_follow_up: e.target.value }))}
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

      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVisits.map(visit => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCompanyLogo(visit.company_id) ? (
                          <img 
                            src={getCompanyLogo(visit.company_id)} 
                            alt="Company logo" 
                            className="w-6 h-6 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
                            <Building2 className="w-3 h-3 text-purple-600" />
                          </div>
                        )}
                        <span className="font-medium">{getCompanyName(visit.company_id)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCustomerName(visit.customer_id)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{visit.action_type}</Badge>
                    </TableCell>
                    <TableCell>{new Date(visit.visit_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={visit.status === 'completed' ? 'default' : visit.status === 'pending' ? 'secondary' : 'destructive'}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {visit.next_follow_up ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {new Date(visit.next_follow_up).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {visit.notes ? (
                        <span className="text-sm line-clamp-2" title={visit.notes}>
                          {visit.notes.length > 50 ? `${visit.notes.substring(0, 50)}...` : visit.notes}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(visit)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(visit.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVisits.map(visit => (
            <Card key={visit.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getCompanyLogo(visit.company_id) ? (
                      <img 
                        src={getCompanyLogo(visit.company_id)} 
                        alt="Company logo" 
                        className="w-10 h-10 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {visit.action_type}
                      </h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{getCompanyName(visit.company_id)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="truncate">{getCustomerName(visit.customer_id)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(visit)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(visit.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={visit.status === 'completed' ? 'default' : visit.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                      {visit.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {visit.next_follow_up && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Follow-up: {new Date(visit.next_follow_up).toLocaleDateString()}</span>
                    </div>
                  )}

                  {visit.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {visit.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {visits.length === 0 && companies.length > 0 && customers.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No visits recorded yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking your business visits and follow-ups</p>
            <Button onClick={() => setIsAddingVisit(true)}>Record First Visit</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisitTracker;
