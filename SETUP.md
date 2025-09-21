# ByteBrief Blog Setup Guide

This guide will help you set up your ByteBrief tech blog with Supabase database and admin authentication.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- A Google account for OAuth setup
- Git for version control

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate
```

### 2. Set up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization, give it a name (e.g., "bytebrief-blog")
   - Set a strong database password
   - Choose a region close to your users

2. **Get Database Credentials**
   - Go to Project Settings > Database
   - Find the "Connection string" section
   - Copy the URI (it looks like `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`)

3. **Get API Keys**
   - Go to Project Settings > API
   - Copy the Project URL and anon public key

### 3. Configure Environment Variables

1. **Copy the environment template:**
   ```bash
   cp env-template.txt .env.local
   ```

2. **Fill in your Supabase credentials in `.env.local`:**
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres"

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
   ```

### 4. Set up Google OAuth (for Admin Authentication)

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

2. **Add Google credentials to `.env.local`:**
   ```env
   GOOGLE_CLIENT_ID="[YOUR-GOOGLE-CLIENT-ID]"
   GOOGLE_CLIENT_SECRET="[YOUR-GOOGLE-CLIENT-SECRET]"
   ```

### 5. Configure Admin Access

1. **Set your admin email(s) in `.env.local`:**
   ```env
   ADMIN_EMAILS="your-admin@email.com,another-admin@email.com"
   ```

2. **Generate NextAuth secret:**
   ```bash
   # Generate a secret key
   openssl rand -base64 32
   ```
   Add it to `.env.local`:
   ```env
   NEXTAUTH_SECRET="[YOUR-GENERATED-SECRET]"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 6. Set up Database

1. **Push database schema:**
   ```bash
   npm run db:push
   ```

2. **Seed with initial data:**
   ```bash
   npm run db:seed
   ```

### 7. Start Development Server

```bash
npm run dev
```

Your blog should now be running at `http://localhost:3000`!

## 🛠 Admin Panel Access

1. Visit `http://localhost:3000/admin/login`
2. Sign in with Google using an email from your `ADMIN_EMAILS` list
3. You'll be redirected to the admin dashboard

## 📝 Content Management

### Creating Your First Post

1. Go to Admin Dashboard → Posts → New Post
2. Fill in the title, content, category, and other details
3. Set status to "Published" when ready
4. Your post will appear on the main site

### Managing Categories

- Categories are pre-seeded with tech-focused options
- You can manage them via the admin panel
- Each category has a color for visual distinction

## 🔧 Database Management Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and apply migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database browser)
npm run db:studio

# Reset database (careful - this deletes all data!)
npm run db:reset
```

## 🚀 Production Deployment

### Environment Variables for Production

Update your production `.env` with:
```env
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Recommended Platforms

- **Vercel**: Seamless Next.js deployment
- **Netlify**: Easy static site deployment  
- **Railway**: Simple database and app hosting
- **DigitalOcean App Platform**: Managed containers

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- Use strong passwords for your Supabase database
- Regularly update your dependencies
- Only add trusted email addresses to `ADMIN_EMAILS`

## 📊 Features Included

✅ **Blog Management**
- Create, edit, delete posts
- Draft/published status
- Featured posts carousel
- Categories and tags
- View count tracking
- Reading time estimation

✅ **Admin Authentication**
- Google OAuth integration
- Role-based access control
- Protected admin routes

✅ **Database**
- PostgreSQL with Supabase
- Prisma ORM for type safety
- Migrations and seeding
- Optimized queries

✅ **UI/UX**
- Responsive design
- Dark theme optimized
- Loading states
- Error handling

## 🆘 Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check if your IP is allowed in Supabase settings
- Ensure the database password doesn't contain special characters that need encoding

### Authentication Issues
- Verify Google OAuth redirect URIs are correct
- Check that your admin email is in the ADMIN_EMAILS list
- Ensure NEXTAUTH_SECRET is set and consistent

### Build Issues
- Run `npm run db:generate` after any schema changes
- Clear .next folder if seeing cache issues
- Check that all environment variables are set

## 🎉 You're All Set!

Your ByteBrief tech blog is now ready to go! Start creating amazing content and building your tech community.

For additional help or feature requests, check the documentation or create an issue in the repository.

---

**Happy Blogging! 🚀**
