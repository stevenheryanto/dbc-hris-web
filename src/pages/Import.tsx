import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { employeeAPI } from '../services/api';
import type { CreateEmployeeRequest } from '../types/employee';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Import: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setImportResults(null);
      } else {
        toast.error('Please select a CSV file');
      }
    }
  };

  const parseCSV = (csvText: string): CreateEmployeeRequest[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const employees: CreateEmployeeRequest[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      const employee: CreateEmployeeRequest = {
        name: values[headers.indexOf('name')] || '',
        email: values[headers.indexOf('email')] || '',
        phone: values[headers.indexOf('phone')] || '',
        position: values[headers.indexOf('position')] || '',
        department: values[headers.indexOf('department')] || '',
        joinDate: values[headers.indexOf('joindate')] || new Date().toISOString().split('T')[0],
      };
      
      // Validate required fields
      if (employee.name && employee.email) {
        employees.push(employee);
      }
    }
    
    return employees;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      const csvText = await file.text();
      const employees = parseCSV(csvText);
      
      if (employees.length === 0) {
        toast.error('No valid employee data found in the file');
        return;
      }

      const results = await employeeAPI.import({ employees });
      setImportResults(results);
      
      if (results.success > 0) {
        toast.success(`Successfully imported ${results.success} employees`);
      }
      
      if (results.errors.length > 0) {
        toast.error(`${results.errors.length} errors occurred during import`);
      }
      
      // Clear the file input
      setFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,phone,position,department,joindate\n' +
                      'John Doe,john.doe@example.com,+1234567890,Software Engineer,IT,2024-01-15\n' +
                      'Jane Smith,jane.smith@example.com,+1234567891,HR Manager,Human Resources,2024-01-20';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Employees</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload a CSV file to import multiple employees at once
          </p>
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Download the CSV template to ensure your data is formatted correctly.
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <button
                  onClick={downloadTemplate}
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Download template
                  <Download className="inline w-4 h-4 ml-1" />
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upload CSV File
            </h3>
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
            </div>

            {file && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleImport}
                disabled={!file || isUploading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Importing...' : 'Import Employees'}
              </button>
            </div>
          </div>
        </div>

        {/* Import Results */}
        {importResults && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Import Results
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {importResults.success}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Successfully imported employees
                    </p>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm font-medium text-red-800">
                        Errors ({importResults.errors.length})
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <ul className="text-sm text-red-700 space-y-1">
                        {importResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              CSV Format Requirements
            </h3>
            <div className="prose text-sm text-gray-600">
              <p>Your CSV file should include the following columns:</p>
              <ul className="mt-2 space-y-1">
                <li><strong>name</strong> - Employee full name (required)</li>
                <li><strong>email</strong> - Employee email address (required)</li>
                <li><strong>phone</strong> - Employee phone number</li>
                <li><strong>position</strong> - Job position/title</li>
                <li><strong>department</strong> - Department name</li>
                <li><strong>joindate</strong> - Join date (YYYY-MM-DD format)</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Note: The first row should contain column headers. Empty rows will be skipped.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Import;