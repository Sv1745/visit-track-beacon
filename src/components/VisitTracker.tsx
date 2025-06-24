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

interface Company {
  id: string;
  name: string;
  type: string;
  logo?: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  companyId: string;
  position?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

interface Visit {
  id: string;
  companyId: string;
  customerId: string;
  actionType: string;
  visitDate: string;
  notes?: string;
  nextFollowUp?: string;
  status: string;
  createdAt: string;
}

interface VisitTrackerProps {
  visits: Visit[];
  setVisits: (visits: Visit[]) => void;
  companies: Company[];
  customers: Customer[];
}

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

const VisitTracker: React.FC<VisitTrackerProps> = ({ visits, setVisits, companies, customers }) => {
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState({
    companyId: 'all',
    customerId: 'all',
    actionType: 'all',
    status: 'all'
  });
  const [formData, setFormData] = useState({
    companyId: '',
    customerId: '',
    actionType: '',
    visitDate: '',
    notes: '',
    nextFollowUp: '',
    status: 'completed'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.customerId || !formData.actionType || !formData.visitDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newVisit: Visit = {
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

  const handleEdit = (visit: Visit) => {
    setFormData({
      companyId: visit.companyId,
      customerId: visit.customerId,
      actionType: visit.actionType,
      visitDate: visit.visitDate,
      notes: visit.notes || '',
      nextFollowUp: visit.nextFollowUp || '',
      status: visit.status
    });
    setSelectedCompany(visit.companyId);
    setEditingVisit(visit);
    setIsAddingVisit(true);
  };

  const handleDelete = (visitId: string) => {
    setVisits(visits.filter(visit => visit.id !== visitId));
    toast({
      title: "Success",
      description: "Visit deleted successfully",
    });
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(cust => cust.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getCompanyLogo = (companyId: string) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.logo : null;
  };

  const getFilteredCustomers = () => {
    if (!selectedCompany && !formData.companyId) return [];
    const companyId = selectedCompany || formData.companyId;
    return customers.filter(customer => customer.companyId === companyId);
  };

  const handleCompanyChange = (companyId: string) => {
    setFormData(prev => ({ ...prev, companyId, customerId: '' }));
    setSelectedCompany(companyId);
  };

  const getFilteredVisits = () => {
    let filtered = [...visits];

    if (filters.companyId !== 'all') {
      filtered = filtered.filter(visit => visit.companyId === filters.companyId);
    }
    if (filters.customerId !== 'all') {
      filtered = filtered.filter(visit => visit.customerId === filters.customerId);
    }
    if (filters.actionType !== 'all') {
      filtered = filtered.filter(visit => visit.actionType === filters.actionType);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(visit => visit.status === filters.status);
    }

    return filtered.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
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
            <Select value={filters.companyId} onValueChange={(value) => setFilters(prev => ({ ...prev, companyId: value }))}>
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
            <Select value={filters.customerId} onValueChange={(value) => setFilters(prev => ({ ...prev, customerId: value }))}>
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
            <Select value={filters.actionType} onValueChange={(value) => setFilters(prev => ({ ...prev, actionType: value }))}>
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
                        {getCompanyLogo(visit.companyId) ? (
                          <img 
                            src={getCompanyLogo(visit.companyId)} 
                            alt="Company logo" 
                            className="w-6 h-6 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
                            <Building2 className="w-3 h-3 text-purple-600" />
                          </div>
                        )}
                        <span className="font-medium">{getCompanyName(visit.companyId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCustomerName(visit.customerId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{visit.actionType}</Badge>
                    </TableCell>
                    <TableCell>{new Date(visit.visitDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={visit.status === 'completed' ? 'default' : visit.status === 'pending' ? 'secondary' : 'destructive'}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {visit.nextFollowUp ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {new Date(visit.nextFollowUp).toLocaleDateString()}
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
                    {getCompanyLogo(visit.companyId) ? (
                      <img 
                        src={getCompanyLogo(visit.companyId)} 
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
                        {visit.actionType}
                      </h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{getCompanyName(visit.companyId)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="truncate">{getCustomerName(visit.customerId)}</span>
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
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {visit.nextFollowUp && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Follow-up: {new Date(visit.nextFollowUp).toLocaleDateString()}</span>
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
