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
    "twitter",
    "linkedin",
    "telegram",
    "dateAdded"
  ]);
  const [requireSocials, setRequireSocials] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fieldOptions = [
    { id: "projectName", label: "Project Name", required: true },
    { id: "website", label: "Website", required: true },
    { id: "email", label: "Email", premium: true, comingSoon: true },
    { id: "twitter", label: "Twitter", premium: true },
    { id: "linkedin", label: "LinkedIn", premium: true },
    { id: "telegram", label: "Telegram", premium: true },
    { id: "dateAdded", label: "Date Added", premium: false }
  ];

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "2weeks", label: "Last 2 Weeks" },
    { value: "month", label: "This Month" }
  ];

  const handleFieldToggle = (fieldId: string) => {
    const field = fieldOptions.find(f => f.id === fieldId);
    if (field?.required || field?.comingSoon) return;

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
      console.log(`📋 Client received ${exportData.data.length} records in exportData.data`);
      console.log(`🔍 Export response:`, exportData);
      console.log(`📊 First few records:`, exportData.data.slice(0, 3));
      console.log(`📊 Last few records:`, exportData.data.slice(-3));

      const headers = Object.keys(exportData.data[0] || {});
      console.log(`📋 CSV Headers:`, headers);
      
      const csvRows = exportData.data.map(row => {
        return headers.map(header => {
          const value = row[header] || '';
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(",");
      });
      
      console.log(`📋 Generated ${csvRows.length} CSV rows`);
      console.log(`📋 First CSV row:`, csvRows[0]);
      console.log(`📋 Last CSV row:`, csvRows[csvRows.length - 1]);
      
      const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + csvRows.join("\n");

      console.log(`📋 Final CSV content length: ${csvContent.length} characters`);
      console.log(`📋 CSV line count: ${csvContent.split('\n').length - 1} lines (including header)`);

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const timestamp = now.toTimeString().split(' ')[0].replace(/:/g, '');
      const filterSuffix = timeFilter === 'all' ? 'all-data' : timeFilter;
      const filename = `web3-leads-${filterSuffix}-${date}&${timestamp}.csv`;

      // Use Blob instead of URI encoding to handle large files
      const csvBlob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const blobUrl = URL.createObjectURL(csvBlob);
      
      const link = document.createElement("a");
      link.setAttribute("href", blobUrl);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      console.log(`📋 Download initiated with Blob URL for ${filename}`);

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
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Export Lead Data</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize your export with filtering and field selection options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Time Period</label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="bg-card/50 border-border/50 hover:border-primary/30">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {timeFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-primary/5">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Include Fields</label>
            <div className="grid grid-cols-2 gap-3">
              {fieldOptions.map(field => {
                const isAvailable = (userTier === 'paid' || !field.premium) && !field.comingSoon;
                const isChecked = includeFields.includes(field.id) && !field.comingSoon;
                
                return (
                  <div
                    key={field.id}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                      field.comingSoon 
                        ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 opacity-75' 
                        : !isAvailable 
                        ? 'bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20 opacity-75' 
                        : 'bg-card/50 border-border/50 hover:border-primary/30'
                    }`}
                  >
                    <Checkbox
                      id={field.id}
                      checked={isChecked}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                      disabled={!isAvailable || field.required || field.comingSoon}
                    />
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed flex items-center gap-2 flex-1"
                    >
                      {field.label}
                      {field.required && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">Required</Badge>
                      )}
                      {field.comingSoon && (
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">Coming Soon</Badge>
                      )}
                      {field.premium && userTier !== 'paid' && !field.comingSoon && (
                        <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">Pro</Badge>
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
              <label className="text-sm font-medium text-foreground">Quality Filters</label>
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
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border/50">
            <Button variant="outline" onClick={onClose} disabled={isExporting} className="border-border/50 hover:border-primary/30">
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-medium"
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;