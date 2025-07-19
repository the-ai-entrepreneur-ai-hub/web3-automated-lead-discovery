import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { config } from '@/lib/config';

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
      // Handle OAuth error
      console.error('OAuth error:', error);
      navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
      return;
    }

    if (token) {
      console.log('💾 Storing token in localStorage...');
      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      
      console.log('📡 Fetching user profile data...');
      console.log('🔗 API URL:', config.API_URL);
      
      // Fetch user data
      fetch(`${config.API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('📥 Profile response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(userData => {
          console.log('✅ User data received:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('🔄 Redirecting to dashboard...');
          // Small delay to ensure localStorage is updated
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        })
        .catch(error => {
          console.error('❌ Error fetching user data:', error);
          console.log('🔄 Redirecting to dashboard anyway...');
          // Still redirect to dashboard, user data will be fetched there
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        });
    } else {
      console.error('❌ No token found in URL parameters');
      // No token found, redirect to login
      navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-pulse"></div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-ping"></div>
        </div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;