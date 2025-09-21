# Google OAuth Setup for ByteBrief Admin

## 🔐 Setting up Google OAuth for Admin Authentication

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create or Select Project
1. Click the project dropdown at the top
2. Click "New Project" or select an existing one
3. Give it a name like "ByteBrief Blog"

### Step 3: Enable Google+ API
1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 4: Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS"
3. Select "OAuth 2.0 Client IDs"

### Step 5: Configure OAuth Consent Screen (if first time)
1. Click "Configure Consent Screen"
2. Choose "External" (unless you have Google Workspace)
3. Fill in:
   - App name: "ByteBrief Admin"
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue" through the steps

### Step 6: Create OAuth Client ID
1. Back in Credentials, click "CREATE CREDENTIALS" > "OAuth 2.0 Client IDs"
2. Application type: "Web application"
3. Name: "ByteBrief Admin Auth"
4. Authorized redirect URIs - Add these:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production later)

### Step 7: Get Your Credentials
1. After creating, you'll see your Client ID and Client Secret
2. Copy these values
3. Add them to your `.env.local` file:
   ```env
   GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret-here"
   ```

### Step 8: Set Admin Email
In your `.env.local`, replace `your-email@gmail.com` with the Google account email you want to use as admin:
```env
ADMIN_EMAILS="your-actual-email@gmail.com"
```

## ✅ You're Done!
Your Google OAuth is now configured for admin authentication.
