
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ExportReport = ({ visits, companies, customers }) => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedCompanyType, setSelectedCompanyType] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('');

  const getCompanyName = (companyId) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const getCompanyType = (companyId) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.type : 'Unknown Type';
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(cust => cust.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getFilteredVisits = () => {
    let filtered = [...visits];

    // Filter by date range
    if (dateRange.startDate) {
      filtered = filtered.filter(visit => new Date(visit.visitDate) >= new Date(dateRange.startDate));
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(visit => new Date(visit.visitDate) <= new Date(dateRange.endDate));
    }

    // Filter by company type
    if (selectedCompanyType) {
      filtered = filtered.filter(visit => getCompanyType(visit.companyId) === selectedCompanyType);
    }

    // Filter by action type
    if (selectedActionType) {
      filtered = filtered.filter(visit => visit.actionType === selectedActionType);
    }

    return filtered.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  };

  const exportToCSV = () => {
    const filteredVisits = getFilteredVisits();
    
    if (filteredVisits.length === 0) {
      toast({
        title: "No Data",
        description: "No visits found for the selected criteria",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      'Visit Date',
      'Company',
      'Company Type',
      'Customer',
      'Action Type',
      'Status',
      'Notes',
      'Next Follow-up',
      'Recorded Date'
    ];

    const csvData = filteredVisits.map(visit => [
      new Date(visit.visitDate).toLocaleDateString(),
      getCompanyName(visit.companyId),
      getCompanyType(visit.companyId),
      getCustomerName(visit.customerId),
      visit.actionType,
      visit.status,
      visit.notes || '',
      visit.nextFollowUp ? new Date(visit.nextFollowUp).toLocaleDateString() : '',
      new Date(visit.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `visit-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Successful",
      description: `Exported ${filteredVisits.length} visits to CSV`,
    });
  };

  const companyTypes = [...new Set(companies.map(company => company.type))];
  const actionTypes = [...new Set(visits.map(visit => visit.actionType))];
  const filteredVisits = getFilteredVisits();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Export Reports</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyType">Company Type</Label>
              <Select value={selectedCompanyType} onValueChange={setSelectedCompanyType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {companyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Select value={selectedActionType} onValueChange={setSelectedActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  {actionTypes.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {filteredVisits.length} visit(s) match your criteria
            </div>
            <Button onClick={exportToCSV} className="flex items-center gap-2" disabled={filteredVisits.length === 0}>
              <Download className="w-4 h-4" />
              Export to CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Preview ({filteredVisits.length} visits)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVisits.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
              <p className="text-gray-500">Adjust your filter criteria to see visits</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVisits.slice(0, 10).map(visit => (
                <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{getCompanyName(visit.companyId)}</span>
                      <Badge variant="outline" className="text-xs">
                        {getCompanyType(visit.companyId)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {getCustomerName(visit.customerId)} • {visit.actionType} • {new Date(visit.visitDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={visit.status === 'completed' ? 'default' : visit.status === 'pending' ? 'secondary' : 'destructive'}>
                    {visit.status}
                  </Badge>
                </div>
              ))}
              {filteredVisits.length > 10 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  And {filteredVisits.length - 10} more visits...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {visits.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No visits to export</h3>
            <p className="text-gray-500">Start recording visits to generate reports</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExportReport;
