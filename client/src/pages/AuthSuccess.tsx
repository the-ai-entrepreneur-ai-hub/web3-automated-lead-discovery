import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('🔍 AuthSuccess: Processing authentication...');
    
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    console.log('🎫 Token received:', token ? 'YES' : 'NO');
    console.log('❌ Error received:', error || 'NONE');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
      return;
    }

    if (token) {
      console.log('💾 Storing token and redirecting to dashboard...');
      localStorage.setItem('token', token);
      
      // Small delay to ensure localStorage is properly set
      setTimeout(() => {
        console.log('🔄 Executing redirect to /dashboard');
        navigate('/dashboard', { replace: true });
      }, 100);
    } else {
      console.error('❌ No token found in URL parameters');
      navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-pulse"></div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-ping"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Successful</h1>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;