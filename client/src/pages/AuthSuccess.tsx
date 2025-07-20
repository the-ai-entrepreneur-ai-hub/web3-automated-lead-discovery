import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { config } from '@/lib/config';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const processAuthentication = async () => {
      try {
        console.log('🔍 AuthSuccess: Processing authentication...');
        setStatus('Processing authentication...');
        
        // Extract token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || searchParams.get('token');
        const error = urlParams.get('error') || searchParams.get('error');
        
        console.log('🎫 Token received:', token ? 'YES' : 'NO');
        console.log('❌ Error received:', error || 'NONE');

        if (error) {
          console.error('OAuth error:', error);
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
          }, 1000);
          return;
        }

        if (!token) {
          console.error('❌ No token found in URL parameters');
          setStatus('No authentication token found. Redirecting...');
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'));
          }, 1000);
          return;
        }

        // Validate token format (basic check)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('❌ Invalid token format');
          setStatus('Invalid authentication token. Redirecting...');
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent('Invalid authentication token.'));
          }, 1000);
          return;
        }

        console.log('💾 Storing token and fetching user data...');
        setStatus('Storing authentication token...');
        
        // Store token immediately
        localStorage.setItem('token', token);
        
        // Fetch user data to validate token and populate user info
        setStatus('Fetching user profile...');
        try {
          const response = await fetch(`${config.API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ User data stored:', userData);
            setStatus('Authentication successful! Redirecting to dashboard...');
            
            // Wait a moment then redirect
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 500);
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } catch (profileError) {
          console.error('❌ Failed to fetch user profile:', profileError);
          setStatus('Authentication successful! Redirecting to dashboard...');
          
          // Even if profile fetch fails, redirect to dashboard with token
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 500);
        }
      } catch (error) {
        console.error('❌ Authentication processing error:', error);
        setStatus('Authentication error. Redirecting...');
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent('Authentication processing failed.'));
        }, 1000);
      } finally {
        setIsProcessing(false);
      }
    };

    processAuthentication();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-pulse"></div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-ping"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {isProcessing ? 'Processing...' : 'Authentication Successful'}
        </h1>
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default AuthSuccess;