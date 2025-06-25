
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Building2, TrendingUp, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

const LandingPage = () => {
  const features = [
    {
      icon: Building2,
      title: "Company Management",
      description: "Organize and track all your business relationships with detailed company profiles and contact information."
    },
    {
      icon: Users,
      title: "Customer Tracking",
      description: "Maintain comprehensive customer records with contact details, positions, and interaction history."
    },
    {
      icon: Calendar,
      title: "Visit Scheduler",
      description: "Record visits, schedule follow-ups, and never miss an important business meeting again."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Get insights into your business activities with comprehensive reports and visual analytics."
    },
    {
      icon: Clock,
      title: "Follow-up Reminders",
      description: "Stay on top of your business relationships with automated follow-up notifications."
    },
    {
      icon: CheckCircle,
      title: "Activity Tracking",
      description: "Monitor all your business activities including calls, meetings, and site visits."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Business Visit Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your business relationships with our comprehensive visit tracking and customer management solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignInButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Get Started Free
              </Button>
            </SignInButton>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              No credit card required
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Everything You Need to Manage Your Business Relationships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Unlimited Companies</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Unlimited Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Unlimited Visits</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-blue-100 mb-6 text-lg">
                Join thousands of businesses already using our platform to manage their relationships.
              </p>
              <SignInButton mode="modal">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Start Tracking Today
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
