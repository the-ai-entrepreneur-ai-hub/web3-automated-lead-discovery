import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { config } from "@/lib/config";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTier: string;
}

const ExportModal = ({ isOpen, onClose, userTier }: ExportModalProps) => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [includeFields, setIncludeFields] = useState([
    "projectName",
    "website",
    "email",
    "twitter",
    "linkedin",
    "telegram"
  ]);
  const [requireSocials, setRequireSocials] = useState(false);
  const [requireEmail, setRequireEmail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fieldOptions = [
    { id: "projectName", label: "Project Name", required: true },
    { id: "website", label: "Website", required: true },
    { id: "email", label: "Email", premium: true },
    { id: "twitter", label: "Twitter", premium: true },
    { id: "linkedin", label: "LinkedIn", premium: true },
    { id: "telegram", label: "Telegram", premium: true },
    { id: "dateAdded", label: "Date Added", premium: false },
    { id: "status", label: "Status", premium: false },
    { id: "source", label: "Source", premium: false }
  ];

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "2weeks", label: "Last 2 Weeks" },
    { value: "month", label: "This Month" }
  ];

  const handleFieldToggle = (fieldId: string) => {
    const field = fieldOptions.find(f => f.id === fieldId);
    if (field?.required) return;

    setIncludeFields(prev => 
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const exportParams = {
        timeFilter,
        includeFields,
        requireSocials,
        requireEmail,
        format: 'csv'
      };

      const response = await fetch(`${config.API_URL}/export-premium`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportParams)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch export data');
      }

      const exportData = await response.json();
      
      if (!exportData.success) {
        throw new Error(exportData.error || 'Export failed');
      }

      console.log(`Exporting ${exportData.exported} projects out of ${exportData.total} total`);

      const headers = Object.keys(exportData.data[0] || {});
      const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + exportData.data.map(row => {
          return headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
          }).join(",");
        }).join("\n");

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const timestamp = now.toTimeString().split(' ')[0].replace(/:/g, '');
      const filterSuffix = timeFilter === 'all' ? 'all-data' : timeFilter;
      const filename = `web3-leads-${filterSuffix}-${date}&${timestamp}.csv`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Lead Data</DialogTitle>
          <DialogDescription>
            Customize your export with filtering and field selection options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timeFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Include Fields</label>
            <div className="grid grid-cols-2 gap-3">
              {fieldOptions.map(field => {
                const isAvailable = userTier === 'paid' || !field.premium;
                const isChecked = includeFields.includes(field.id);
                
                return (
                  <div
                    key={field.id}
                    className={`flex items-center space-x-2 p-2 rounded border ${
                      !isAvailable ? 'opacity-50 bg-gray-50' : ''
                    }`}
                  >
                    <Checkbox
                      id={field.id}
                      checked={isChecked}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                      disabled={!isAvailable || field.required}
                    />
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      {field.label}
                      {field.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                      {field.premium && userTier !== 'paid' && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">Pro</Badge>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality Filters */}
          {userTier === 'paid' && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Quality Filters</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-socials"
                    checked={requireSocials}
                    onCheckedChange={setRequireSocials}
                  />
                  <label htmlFor="require-socials" className="text-sm">
                    Only include projects with social media links
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-email"
                    checked={requireEmail}
                    onCheckedChange={setRequireEmail}
                  />
                  <label htmlFor="require-email" className="text-sm">
                    Only include projects with email addresses
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;