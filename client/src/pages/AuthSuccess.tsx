import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { config } from '@/lib/config';
import { storeGoogleAccessToken, authService } from '@/lib/auth';

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

        // Check if this is a new user registration that needs terms acceptance
        const termsAccepted = sessionStorage.getItem('termsAccepted');
        const authFlow = sessionStorage.getItem('authFlow');
        
        if (!termsAccepted && authFlow === 'register') {
          console.error('❌ Terms not accepted during OAuth flow');
          setStatus('Terms acceptance required. Redirecting...');
          sessionStorage.removeItem('termsAccepted');
          sessionStorage.removeItem('authFlow');
          setTimeout(() => {
            navigate('/register?error=' + encodeURIComponent('You must accept the Terms of Service to create an account.'));
          }, 1000);
          return;
        }

        // Clean up session storage
        sessionStorage.removeItem('termsAccepted');
        sessionStorage.removeItem('authFlow');

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
        
        // Initialize auth service activity tracking
        authService.refreshSession();
        
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
            console.log('✅ LocalStorage token:', localStorage.getItem('token'));
            console.log('✅ LocalStorage user:', localStorage.getItem('user'));
            
            // Check if this is a Google OAuth user and store access token if available
            const authFlow = sessionStorage.getItem('authFlow');
            if (authFlow === 'google' || userData.source === 'google') {
              // For Google OAuth users, we need to get the access token
              // This would be passed from the OAuth callback if available
              const googleAccessToken = searchParams.get('google_access_token');
              if (googleAccessToken) {
                storeGoogleAccessToken(googleAccessToken);
                console.log('📝 Google access token stored for logout');
              }
            }
            
            setStatus('Authentication successful! Redirecting to dashboard...');
            
            // Wait a moment then redirect
            setTimeout(() => {
              console.log('🔄 Redirecting to dashboard...');
              navigate('/dashboard', { replace: true });
            }, 1000);
          } else {
            console.error('❌ Profile fetch failed with status:', response.status);
            const errorText = await response.text();
            console.error('❌ Profile fetch error:', errorText);
            throw new Error('Failed to fetch user profile');
          }
        } catch (profileError) {
          console.error('❌ Failed to fetch user profile:', profileError);
          setStatus('Authentication successful! Redirecting to dashboard...');
          
          // Even if profile fetch fails, redirect to dashboard with token
          setTimeout(() => {
            console.log('🔄 Redirecting to dashboard (fallback)...');
            navigate('/dashboard', { replace: true });
          }, 1000);
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