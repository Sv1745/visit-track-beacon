
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet } from 'lucide-react';
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel' ||
          selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel (.xlsx, .xls) or CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const parseCSV = (text: string): CompanyData[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const company: CompanyData = {
        name: '',
        type: ''
      };
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header.includes('name')) company.name = value;
        else if (header.includes('type')) company.type = value;
        else if (header.includes('address')) company.address = value;
        else if (header.includes('phone')) company.phone = value;
      });
      
      return company;
    }).filter(company => company.name && company.type);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
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
        // For Excel files, we'll need a library like xlsx
        toast({
          title: "Excel files not yet supported",
          description: "Please use CSV format for now. Expected columns: Company Name, Company Type, Address, Phone",
          variant: "destructive",
        });
        return;
      }

      if (companies.length === 0) {
        toast({
          title: "No valid data found",
          description: "Please ensure your file has columns for Company Name and Company Type",
          variant: "destructive",
        });
        return;
      }

      // Insert companies into database
      const { data, error } = await supabase
        .from('companies')
        .insert(companies);

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${companies.length} companies`,
      });

      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload companies. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Companies
        </CardTitle>
        <CardDescription>
          Upload company data from CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-2">
            CSV format: Company Name, Company Type, Address, Phone
          </p>
        </div>
        
        {file && (
          <div className="text-sm text-gray-600">
            Selected: {file.name}
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
