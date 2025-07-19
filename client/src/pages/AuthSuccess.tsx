import { useEffect, useState } from 'react';
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
      
      // Try a simpler approach first - just redirect to dashboard and let it fetch user data
      console.log('🔄 Redirecting to dashboard immediately...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500); // Longer delay to ensure everything is ready
      
      // Still try to fetch user data in background for faster loading
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
          console.log('✅ User data received and stored:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(error => {
          console.error('❌ Error fetching user data:', error);
          console.log('⚠️ Dashboard will fetch user data instead');
        });
    } else {
      console.error('❌ No token found in URL parameters');
      // No token found, redirect to login
      navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
    }
  }, [navigate, searchParams]);

  const [debugInfo, setDebugInfo] = useState({
    token: '',
    error: '',
    step: 'initializing'
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    setDebugInfo({
      token: token || 'NO TOKEN',
      error: error || 'NO ERROR',
      step: 'url_parsed'
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-pulse"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-2xl font-bold mb-2">OAuth Authentication</h1>
          <p className="text-muted-foreground">Processing your Google login...</p>
        </div>
        
        {/* Debug Information */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 font-mono text-sm">
            <div><strong>Current Step:</strong> {debugInfo.step}</div>
            <div><strong>Token Present:</strong> {debugInfo.token !== 'NO TOKEN' ? 'YES' : 'NO'}</div>
            <div><strong>Error Present:</strong> {debugInfo.error !== 'NO ERROR' ? 'YES' : 'NO'}</div>
            <div><strong>Current URL:</strong> {window.location.href}</div>
            <div><strong>localStorage Check:</strong> {localStorage.getItem('token') ? 'TOKEN EXISTS' : 'NO TOKEN'}</div>
          </div>
        </div>

        {/* Manual Navigation */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Manual Navigation</h2>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90"
            >
              Go to Dashboard (window.location)
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded hover:bg-secondary/90"
            >
              Go to Dashboard (navigate)
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded hover:bg-destructive/90"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;