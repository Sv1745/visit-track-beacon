
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Building2, TrendingUp, Bell, Plus, Download } from 'lucide-react';
import CompanyManagement from '@/components/CompanyManagement';
import CustomerManagement from '@/components/CustomerManagement';
import VisitTracker from '@/components/VisitTracker';
import ExportReport from '@/components/ExportReport';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [companies, setCompanies] = useLocalStorage('companies', []);
  const [customers, setCustomers] = useLocalStorage('customers', []);
  const [visits, setVisits] = useLocalStorage('visits', []);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard statistics
  const totalCompanies = companies.length;
  const totalCustomers = customers.length;
  const totalVisits = visits.length;
  const pendingFollowUps = visits.filter(visit => {
    if (!visit.nextFollowUp) return false;
    const followUpDate = new Date(visit.nextFollowUp);
    const today = new Date();
    const diffTime = followUpDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  }).length;

  // Company type distribution
  const companyTypeData = companies.reduce((acc, company) => {
    const existing = acc.find(item => item.type === company.type);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type: company.type, count: 1 });
    }
    return acc;
  }, []);

  // Visit action type distribution
  const actionTypeData = visits.reduce((acc, visit) => {
    const existing = acc.find(item => item.action === visit.actionType);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ action: visit.actionType, count: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

  // Check for upcoming follow-ups on component mount
  useEffect(() => {
    if (pendingFollowUps > 0) {
      toast({
        title: "Reminder Alert",
        description: `You have ${pendingFollowUps} follow-up(s) due in the next 2 days!`,
        variant: "default",
      });
    }
  }, [pendingFollowUps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Visit Tracker</h1>
          <p className="text-lg text-gray-600">Manage your business visits, companies, and customer relationships</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Visits
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {pendingFollowUps > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <Bell className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Reminder:</strong> You have {pendingFollowUps} follow-up(s) due in the next 2 days!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                  <Building2 className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCompanies}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVisits}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
                  <Bell className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingFollowUps}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Companies by Type</CardTitle>
                  <CardDescription>Distribution of companies across different industries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={companyTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visit Actions</CardTitle>
                  <CardDescription>Breakdown of visit types and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={actionTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ action, percent }) => `${action} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {actionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => setActiveTab('companies')} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Company
                </Button>
                <Button onClick={() => setActiveTab('customers')} variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Customer
                </Button>
                <Button onClick={() => setActiveTab('visits')} variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Record Visit
                </Button>
                <Button onClick={() => setActiveTab('reports')} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManagement companies={companies} setCompanies={setCompanies} />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement 
              customers={customers} 
              setCustomers={setCustomers} 
              companies={companies} 
            />
          </TabsContent>

          <TabsContent value="visits">
            <VisitTracker 
              visits={visits} 
              setVisits={setVisits} 
              companies={companies} 
              customers={customers} 
            />
          </TabsContent>

          <TabsContent value="reports">
            <ExportReport visits={visits} companies={companies} customers={customers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
