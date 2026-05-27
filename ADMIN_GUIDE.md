# STINT Admin Panel Guide

## Overview
The STINT website now includes a complete admin panel with JWT authentication for managing projects and users.

## Features

### 🔐 Authentication System
- JWT-based authentication with access and refresh tokens
- Protected routes requiring admin privileges
- Secure login/logout functionality

### 👥 User Management
- Create new admin users
- View all existing users
- Delete users (with confirmation)
- Role-based access control

### 📁 Project Management
- Add new projects with:
  - Title and description
  - Category/label
  - Image upload
  - Deployment link
  - Custom accent color
- Edit existing projects
- Delete projects (with confirmation)
- Real-time preview of projects

### 🎨 Dynamic Content
- Projects added through admin panel automatically appear on the main website
- No hardcoded project data - everything is managed through the admin interface
- Projects are stored in localStorage (can be upgraded to a database later)

## Access Instructions

### 1. Admin Access Routes
- **Main Admin Route:** `/admin` - Automatically redirects based on login status
- **Login Page:** `/admin/login` - Direct access to login form
- **Dashboard:** `/admin/dashboard` - Protected route, requires admin login

### 2. Authentication Flow
- **Not logged in + visit `/admin`** → Redirects to `/admin/login`
- **Not logged in + visit `/admin/dashboard`** → Redirects to `/admin/login`
- **Logged in as admin + visit `/admin`** → Redirects to `/admin/dashboard`
- **Logged in as admin + visit `/admin/login`** → Redirects to `/admin/dashboard`

### 3. Initial Setup
- The system comes with a default admin account: `admin@stint.com`
- Default password: `admin123` (change this after first login)
- After logging in, you can create additional admin accounts through the admin panel

### 4. Quick Admin Access
- **Shift + Click** on the STINT logo to quickly access admin panel

### 5. Admin Dashboard
- After login, you'll be redirected to `/admin/dashboard`
- Two main tabs available:
  - **Manage Projects:** Add, edit, delete projects
  - **Manage Users:** Create new admins, manage existing users

### 3. Adding Projects
1. Go to "Manage Projects" tab
2. Click "Add New Project"
3. Fill in all required fields:
   - Project Title
   - Label/Category (e.g., "Web Design", "Brand Identity")
   - Description
   - Deployment Link (must be a valid URL)
   - Accent Color (color picker)
   - Project Image (upload from your computer)
4. Click "Create Project"
5. Project will immediately appear on the main website

### 4. Managing Users
1. Go to "Manage Users" tab
2. Click "Add New Admin"
3. Enter email, password, and select role
4. New admin can then log in with their credentials

## Technical Details

### Authentication Flow
1. User logs in with email/password
2. System generates JWT access token (1 hour expiry) and refresh token
3. Tokens stored in localStorage
4. Protected routes check for valid tokens
5. Automatic token refresh when needed

### Data Storage
- Projects: Stored in localStorage as `stint-projects`
- User sessions: JWT tokens in localStorage
- Can be easily upgraded to use a backend API and database

### Security Features
- Protected admin routes
- Role-based access control
- Token expiration handling
- Input validation and sanitization

## Development Notes

### File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context and logic
├── pages/
│   ├── AdminLogin.tsx           # Login page
│   └── AdminDashboard.tsx       # Main admin dashboard
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── admin/
│       ├── ManageUsers.tsx      # User management interface
│       └── ManageProjects.tsx   # Project management interface
└── types/
    └── index.ts                 # TypeScript interfaces
```

### Key Dependencies Added
- `react-router-dom` - Routing
- `axios` - HTTP client (ready for API integration)
- `react-hook-form` - Form handling
- `zod` - Validation

### Future Enhancements
1. **Backend Integration:** Replace localStorage with proper API calls
2. **Image Storage:** Use cloud storage (AWS S3, Cloudinary) for images
3. **Advanced Auth:** Add password reset, email verification
4. **Audit Logs:** Track admin actions
5. **Bulk Operations:** Import/export projects
6. **Advanced Permissions:** More granular role-based permissions

## Troubleshooting

### Common Issues
1. **Can't access admin panel:** 
   - Try going to `/admin` (will auto-redirect based on login status)
   - Clear browser cache and localStorage if needed
2. **Login fails:** Verify you're using the demo credentials exactly as shown
3. **Projects not showing:** Check browser console for errors, ensure localStorage is enabled
4. **Images not uploading:** Make sure file is a valid image format (JPG, PNG, etc.)
5. **Stuck in redirect loop:** Clear authentication data using browser console

### Testing & Debug Tools
In development mode, you can use these browser console commands:
```javascript
// Clear all authentication data
authDebug.clearAuth();

// Check current authentication status
authDebug.checkAuth();

// Create a test admin session (bypass login)
authDebug.createTestSession();
```

### Authentication Testing
1. **Test unauthorized access:** 
   - Clear localStorage: `authDebug.clearAuth()`
   - Try to visit `/admin/dashboard` - should redirect to login
2. **Test authorized access:**
   - Login with credentials or use `authDebug.createTestSession()`
   - Visit `/admin` - should redirect to dashboard
3. **Test token expiration:** Tokens expire after 1 hour

### Demo Credentials
- **Email:** `admin@stint.com`
- **Password:** `admin123`

## Support
For technical support or questions about the admin panel, please contact the development team.