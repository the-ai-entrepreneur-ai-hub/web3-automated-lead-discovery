import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('🔍 AuthSuccess: Processing authentication...');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🔗 Search params:', window.location.search);
    console.log('📍 Hash:', window.location.hash);
    
    // Extract token directly from URL to handle double slash issues
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || searchParams.get('token');
    const error = urlParams.get('error') || searchParams.get('error');
    
    console.log('🎫 Token received:', token ? 'YES' : 'NO');
    console.log('🎫 Token value:', token);
    console.log('❌ Error received:', error || 'NONE');
    console.log('🔍 URL search params:', Object.fromEntries(urlParams.entries()));
    console.log('🔍 React Router params:', Object.fromEntries(searchParams.entries()));

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
      return;
    }

    if (token) {
      console.log('💾 Storing token and redirecting to dashboard...');
      localStorage.setItem('token', token);
      console.log('✅ Token stored in localStorage');
      
      // Longer delay to ensure localStorage is properly set before Dashboard checks
      setTimeout(() => {
        const storedToken = localStorage.getItem('token');
        console.log('🔍 Verifying token storage:', storedToken ? 'SUCCESS' : 'FAILED');
        console.log('🔄 Executing redirect to /dashboard');
        
        // Try React Router navigation first
        try {
          navigate('/dashboard', { replace: true });
          console.log('✅ React Router navigation attempted');
        } catch (navError) {
          console.error('❌ React Router navigation failed:', navError);
        }
        
        // Immediate fallback: Force redirect with window.location
        setTimeout(() => {
          console.log('🔄 Fallback: Using window.location redirect to #/dashboard');
          window.location.hash = '/dashboard';
        }, 100);
      }, 200);
    } else {
      console.error('❌ No token found in URL parameters');
      console.error('🔍 URL breakdown:', {
        href: window.location.href,
        search: window.location.search,
        hash: window.location.hash,
        pathname: window.location.pathname
      });
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