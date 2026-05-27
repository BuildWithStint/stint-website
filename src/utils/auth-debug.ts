// Debug utilities for authentication testing
// These functions can be called from browser console for testing

export const authDebug = {
  // Clear all authentication data
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('Authentication data cleared');
    window.location.reload();
  },

  // Check current auth status
  checkAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log('Access Token:', accessToken ? 'Present' : 'Not found');
    console.log('Refresh Token:', refreshToken ? 'Present' : 'Not found');
    
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expires:', new Date(payload.exp * 1000));
        console.log('Token valid:', payload.exp * 1000 > Date.now());
      } catch (error) {
        console.log('Invalid token format');
      }
    }
  },

  // Create a test admin session
  createTestSession: () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: '1',
      email: 'admin@stint.com',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = 'mock-signature';
    
    const accessToken = `${header}.${payload}.${signature}`;
    const refreshToken = `refresh-${header}.${payload}.${signature}`;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    console.log('Test admin session created');
    window.location.reload();
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).authDebug = authDebug;
}