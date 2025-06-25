
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, Building2, Clock, FileText, Phone } from 'lucide-react';
import { Visit } from '@/hooks/useVisits';

interface VisitDetailsModalProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  customerName: string;
  companyLogo?: string;
}

const VisitDetailsModal = ({ 
  visit, 
  isOpen, 
  onClose, 
  companyName, 
  customerName, 
  companyLogo 
}: VisitDetailsModalProps) => {
  if (!visit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company logo" 
                className="w-8 h-8 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
            )}
            Visit Details - {visit.action_type}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Visit Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Company:</span>
                  <span>{companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Customer:</span>
                  <span>{customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Action:</span>
                  <Badge variant="outline">{visit.action_type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{new Date(visit.visit_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge 
                    variant={
                      visit.status === 'completed' ? 'default' : 
                      visit.status === 'pending' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {visit.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(visit.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up Information */}
          {visit.next_follow_up && (
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Clock className="w-5 h-5" />
                  Next Follow-up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Scheduled for:</span>
                  <span className="font-semibold">
                    {new Date(visit.next_follow_up).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                  {(() => {
                    const today = new Date();
                    const followUpDate = new Date(visit.next_follow_up);
                    const diffTime = followUpDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays < 0) {
                      return `Overdue by ${Math.abs(diffDays)} day(s)`;
                    } else if (diffDays === 0) {
                      return 'Due today';
                    } else if (diffDays === 1) {
                      return 'Due tomorrow';
                    } else {
                      return `Due in ${diffDays} day(s)`;
                    }
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {visit.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{visit.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitDetailsModal;
