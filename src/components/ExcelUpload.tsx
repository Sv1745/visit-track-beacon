
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CompanyData {
  name: string;
  type: string;
  address?: string;
  phone?: string;
}

export const ExcelUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<CompanyData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || 
          selectedFile.name.endsWith('.csv') ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        if (selectedFile.name.endsWith('.csv')) {
          previewCSV(selectedFile);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file (.csv)",
          variant: "destructive",
        });
      }
    }
  };

  const previewCSV = async (file: File) => {
    try {
      const text = await file.text();
      const companies = parseCSV(text);
      setPreview(companies.slice(0, 5)); // Show first 5 for preview
    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  const parseCSV = (text: string): CompanyData[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const company: CompanyData = {
        name: '',
        type: ''
      };
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header.includes('name') || header.includes('company')) {
          company.name = value;
        } else if (header.includes('type')) {
          company.type = value;
        } else if (header.includes('address')) {
          company.address = value;
        } else if (header.includes('phone')) {
          company.phone = value;
        }
      });
      
      return company;
    }).filter(company => company.name && company.type);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      let companies: CompanyData[] = [];

      if (file.name.endsWith('.csv')) {
        companies = parseCSV(text);
      } else {
        toast({
          title: "Excel files not supported",
          description: "Please convert your Excel file to CSV format and try again",
          variant: "destructive",
        });
        return;
      }

      if (companies.length === 0) {
        toast({
          title: "No valid data found",
          description: "Please ensure your CSV has columns: Company Name, Company Type, Address (optional), Phone (optional)",
          variant: "destructive",
        });
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert companies with user_id
      const companiesWithUserId = companies.map(company => ({ ...company, user_id: user.id }));
      const { data, error } = await supabase
        .from('companies')
        .insert(companiesWithUserId);

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${companies.length} companies`,
      });

      setFile(null);
      setPreview([]);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload companies. Please check your file format and try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Companies from CSV
        </CardTitle>
        <CardDescription>
          Upload company data from CSV file with columns: Company Name, Company Type, Address, Phone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <p>Expected CSV format:</p>
            <p className="font-mono text-xs bg-muted p-2 rounded">
              Company Name,Company Type,Address,Phone<br/>
              ABC Corp,Manufacturing,123 Main St,555-0123<br/>
              XYZ Ltd,Services,456 Oak Ave,555-0456
            </p>
          </div>
        </div>
        
        {file && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Selected: {file.name}
            </div>
            
            {preview.length > 0 && (
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-foreground mb-2">Preview (first 5 rows):</h4>
                <div className="space-y-2">
                  {preview.map((company, index) => (
                    <div key={index} className="text-sm bg-muted/50 p-2 rounded">
                      <span className="font-medium text-foreground">{company.name}</span> - {company.type}
                      {company.address && <span className="text-muted-foreground"> • {company.address}</span>}
                      {company.phone && <span className="text-muted-foreground"> • {company.phone}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Companies'}
        </Button>
      </CardContent>
    </Card>
  );
};
