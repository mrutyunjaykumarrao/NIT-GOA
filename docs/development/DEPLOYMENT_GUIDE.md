# NIT Goa Website - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- Firebase account (for hosting/analytics)

### Local Development
```bash
# Clone and setup
git clone <repository-url>
cd nitgoa

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm start
# Application will open at http://localhost:3000
```

### Production Build
```bash
# Create optimized production build
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Environment Variables
Create a `.env` file with your Firebase configuration:
```env
REACT_APP_API_KEY=your_firebase_api_key
REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
```

### Deployment Options

#### 1. Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init hosting

# Deploy to Firebase
firebase deploy
```

#### 2. Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

#### 3. Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 4. Static File Server
```bash
# Build the project
npm run build

# Upload the 'build' folder to any static file hosting
# (AWS S3, GitHub Pages, etc.)
```

### Performance Optimization

#### Current Build Stats
- Bundle size: 62.36 kB (gzipped)
- CSS: 3.35 kB
- Build time: <3 seconds

#### Additional Optimizations
1. **Enable Compression**: Ensure your server serves gzipped files
2. **CDN**: Use a CDN for static assets
3. **Caching**: Set proper cache headers
4. **Image Optimization**: Optimize PNG/JPG assets

### Security Considerations

#### Implemented Security Features
- ✅ Environment variables for sensitive data
- ✅ External links open in new tabs with `noopener,noreferrer`
- ✅ No hardcoded credentials in source code
- ✅ Firebase configuration properly secured

#### Recommended Additional Security
1. **HTTPS**: Ensure your domain uses HTTPS
2. **Content Security Policy**: Add CSP headers
3. **Regular Updates**: Keep dependencies updated
4. **Monitoring**: Set up error tracking (Sentry, etc.)

### Monitoring & Analytics

#### Firebase Analytics
The app is configured to use Firebase Analytics. Events will be tracked automatically once deployed.

#### Error Monitoring
Consider adding error boundary components and external monitoring:
```bash
npm install @sentry/react
```

### Maintenance

#### Regular Tasks
1. **Security Updates**: Run `npm audit` monthly
2. **Dependency Updates**: Update packages quarterly
3. **Performance Monitoring**: Check build size and load times
4. **Accessibility Testing**: Run accessibility audits

#### Health Checks
```bash
# Run all checks
npm test                    # Unit tests
npm run build              # Build verification
npm audit                  # Security check
```

### Troubleshooting

#### Common Issues
1. **Build Fails**: Check Node.js version (requires 14+)
2. **Firebase Errors**: Verify environment variables are set
3. **Routing Issues**: Ensure server is configured for SPA routing
4. **Performance**: Check bundle analyzer for large dependencies

#### Support
- Check `ISSUES_ANALYSIS.md` for known issues
- Review component documentation in source files
- Test locally before deployment

### Current Status
✅ **Production Ready** - The application has been thoroughly tested and optimized for deployment.
