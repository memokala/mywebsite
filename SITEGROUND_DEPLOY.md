# Deployment Guide for SiteGround

## Prerequisites
- Node.js v18+ (SiteGround supports Node.js)
- A SiteGround hosting plan with Node.js support
- Domain pointed to SiteGround nameservers

## SiteGround Setup

### 1. Node.js Application Setup in SiteGround
1. Log into SiteGround Site Tools
2. Go to **Dev** → **Node.js** 
3. Click **CREATE** to set up a new Node.js application
4. Configure:
   - **Application mode**: `Production`
   - **Application path**: `/toolnova`
   - **Application URL**: Your domain
   - **Application startup file**: `npm start`

### 2. Deploy the Code
Option A: **Git Deployment** (Recommended)
```bash
# SSH into your SiteGround account
ssh user@yourdomain.com

# Navigate to your application directory
cd ~/toolnova

# Clone the repository
git clone https://github.com/your-username/toolnova.git .

# Install dependencies
npm install --production

# Build the application
npm run build

# Restart the Node.js app
# Restart via Site Tools interface
```

Option B: **Manual Upload**
1. Build the project locally: `npm run build`
2. Upload all files via FTP/SFTP to `~/toolnova/`
3. Ensure `package.json`, `node_modules`, and `.next/` are uploaded
4. Restart the Node.js app via Site Tools

### 3. Environment Variables
In SiteGround, set environment variables via:
- **Site Tools** → **Dev** → **Node.js** → **Edit** → **Environment Variables**

Required variables:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
PORT=3000
```

### 4. SSL Certificate
SiteGround provides free Let's Encrypt SSL:
- Go to **Security** → **SSL Manager**
- Click **Let's Encrypt** for your domain
- Enable HTTPS redirect

### 5. CDN (Cloudflare - Recommended)
1. Add your domain to Cloudflare
2. Change nameservers to Cloudflare
3. Enable:
   - Auto Minify (HTML, CSS, JS)
   - Brotli compression
   - Cache static assets (TTL 1 month+)
   - HTTP/2
   - Rocket Loader (selective)

### 6. Performance Optimization
SiteGround includes:
- **SG Optimizer** plugin (for WordPress - skip)
- **SuperCacher** - Enable Dynamic Cache for Node.js
- **CDN** - Built-in CDN service

Recommended .htaccess rules (place in `public/.htaccess`):
```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
```

### 7. Maintenance

**Update the app:**
```bash
# SSH in
ssh user@yourdomain.com

# Navigate to app
cd ~/toolnova

# Pull latest code
git pull origin main

# Install any new dependencies
npm install --production

# Rebuild
npm run build

# Restart via Site Tools interface
```

**Monitor logs:**
- Site Tools → **Dev** → **Node.js** → **Logs**
- Or use SSH: `tail -f ~/toolnova/logs/*.log`

### 8. Scaling
When traffic grows:
1. Upgrade SiteGround plan for more resources
2. Add Cloudflare Pro/Enterprise for advanced caching
3. Implement Redis caching for API routes
4. Add a CDN for static assets
5. Consider moving to a VPS or cloud provider

### 9. Security Checklist
- [ ] SSL certificate installed and enforced
- [ ] Environment variables set (not in code)
- [ ] File permissions: 755 for directories, 644 for files
- [ ] .env.local excluded from version control
- [ ] Rate limiting configured in middleware
- [ ] Automatic file cleanup scheduled
- [ ] Security headers verified via securityheaders.com
