import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';

const LogoutNotification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  useEffect(() => {
    const logoutParam = searchParams.get('logout');
    if (logoutParam) {
      setLogoutMessage(decodeURIComponent(logoutParam));
      
      // Remove the logout parameter from URL after showing
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('logout');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleDismiss = () => {
    setLogoutMessage(null);
  };

  if (!logoutMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-orange-200 bg-orange-50 text-orange-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{logoutMessage}</span>
          <button 
            onClick={handleDismiss}
            className="ml-2 text-orange-600 hover:text-orange-800"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LogoutNotification;