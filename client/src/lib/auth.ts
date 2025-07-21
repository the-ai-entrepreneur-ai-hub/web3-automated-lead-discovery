import { config } from '@/lib/config';

interface AuthState {
  user: any | null;
  token: string | null;
  lastActivity: number;
  isGoogleUser: boolean;
}

class AuthService {
  private static instance: AuthService;
  private activityTimer: NodeJS.Timeout | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
  
  private constructor() {
    this.initializeActivityTracking();
    this.checkStoredAuth();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private checkStoredAuth(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const lastActivity = localStorage.getItem('lastActivity');

    if (token && user && lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      
      if (timeSinceLastActivity > this.INACTIVITY_TIMEOUT) {
        console.log('🕐 Session expired due to inactivity');
        this.forceLogout('Session expired due to inactivity');
      } else {
        // Session is still valid, update activity
        this.updateActivity();
      }
    }
  }

  private initializeActivityTracking(): void {
    // Track user activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      this.updateActivity();
    };

    // Add event listeners for activity detection
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the inactivity check timer
    this.startInactivityTimer();
  }

  private updateActivity(): void {
    const now = Date.now();
    localStorage.setItem('lastActivity', now.toString());
    
    // Reset the inactivity timer
    this.resetInactivityTimer();
  }

  private startInactivityTimer(): void {
    this.inactivityTimer = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      const token = localStorage.getItem('token');
      
      if (token && lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        
        if (timeSinceLastActivity > this.INACTIVITY_TIMEOUT) {
          console.log('🕐 Auto-logout due to inactivity');
          this.forceLogout('Session expired due to inactivity');
        }
      }
    }, this.ACTIVITY_CHECK_INTERVAL);
  }

  private resetInactivityTimer(): void {
    // Timer is checked periodically, no need to reset
    // Just update the last activity timestamp
  }

  private async revokeGoogleAccess(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user || !this.isGoogleUser()) return;

      // Check if user has Google access token stored
      const googleAccessToken = sessionStorage.getItem('google_access_token');
      
      if (googleAccessToken) {
        console.log('🔄 Revoking Google access token...');
        
        // Revoke the Google access token
        await fetch(`https://oauth2.googleapis.com/revoke?token=${googleAccessToken}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        
        console.log('✅ Google access token revoked');
        sessionStorage.removeItem('google_access_token');
      }

      // Also try to revoke using the Google Sign-In API if available
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
        console.log('✅ Google auto-select disabled');
      }

    } catch (error) {
      console.error('⚠️ Failed to revoke Google access:', error);
      // Don't throw error - continue with local logout even if Google revocation fails
    }
  }

  private isGoogleUser(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Check if user has Google-specific fields or was created via Google OAuth
    return !!(user.googleId || user.source === 'google' || sessionStorage.getItem('google_access_token'));
  }

  private getCurrentUser(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private clearLocalStorage(): void {
    const itemsToRemove = [
      'token',
      'user',
      'lastActivity',
      'appliedDiscountCode',
      'termsAccepted',
      'authFlow'
    ];

    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });

    // Clear session storage items
    const sessionItemsToRemove = [
      'google_access_token',
      'termsAccepted',
      'authFlow'
    ];

    sessionItemsToRemove.forEach(item => {
      sessionStorage.removeItem(item);
    });
  }

  private stopTimers(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
    
    if (this.inactivityTimer) {
      clearInterval(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  public async logout(reason: string = 'User initiated logout'): Promise<void> {
    console.log('🚪 Initiating logout:', reason);
    
    try {
      // Step 1: Revoke Google access if user signed in with Google
      if (this.isGoogleUser()) {
        console.log('👤 Google user detected, revoking Google access...');
        await this.revokeGoogleAccess();
      }

      // Step 2: Notify server about logout
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch(`${config.API_URL}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
          });
          console.log('✅ Server notified of logout');
        } catch (serverError) {
          console.error('⚠️ Failed to notify server of logout:', serverError);
          // Continue with client-side logout even if server notification fails
        }
      }

      // Step 3: Clear all local data
      this.clearLocalStorage();

      // Step 4: Stop all timers
      this.stopTimers();

      console.log('✅ Logout completed successfully');
      
      // Step 5: Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }

    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Force logout even if there were errors
      this.forceLogout('Logout error occurred');
    }
  }

  public forceLogout(reason: string): void {
    console.log('🔒 Force logout:', reason);
    
    // Clear all local data immediately
    this.clearLocalStorage();
    
    // Stop timers
    this.stopTimers();
    
    // Redirect to home with logout message
    if (typeof window !== 'undefined') {
      const message = encodeURIComponent(reason);
      window.location.href = `/?logout=${message}`;
    }
  }

  public getLastActivity(): number {
    const lastActivity = localStorage.getItem('lastActivity');
    return lastActivity ? parseInt(lastActivity) : 0;
  }

  public getTimeUntilExpiry(): number {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) return 0;
    
    const timeSinceActivity = Date.now() - lastActivity;
    const timeRemaining = this.INACTIVITY_TIMEOUT - timeSinceActivity;
    
    return Math.max(0, timeRemaining);
  }

  public isSessionExpired(): boolean {
    return this.getTimeUntilExpiry() <= 0 && !!localStorage.getItem('token');
  }

  public refreshSession(): void {
    this.updateActivity();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Global Google Sign-In callback for storing access token
declare global {
  interface Window {
    google: any;
    handleGoogleSignIn: (response: any) => void;
  }
}

// Function to store Google access token when user signs in
export const storeGoogleAccessToken = (token: string): void => {
  sessionStorage.setItem('google_access_token', token);
  console.log('📝 Google access token stored for logout purposes');
};

export default authService;