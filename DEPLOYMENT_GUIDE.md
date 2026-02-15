# 🚀 Deployment Guide - RideForward

## ✅ Pre-Deployment Checklist

- ✅ All features implemented (Part A + Part B)
- ✅ Build successful with 31 pages + 3 API routes
- ✅ Zero TypeScript errors
- ✅ Mobile responsive design
- ✅ Accessibility features complete
- ✅ Environment variables documented

---

## 📦 Quick Deploy to Vercel (Recommended)

### Option 1: Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel Dashboard)
   ```
   OPENAI_API_KEY=sk_your_openai_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
   ```

4. **Redeploy** after adding environment variables

---

## 🌐 Deploy to Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Build the app
npm run build

# 4. Deploy
netlify deploy --prod --dir=.next
```

**Add Environment Variables in Netlify:**
- Go to Site Settings → Environment Variables
- Add all required variables from `.env.example`

---

## ☁️ Deploy to AWS (Advanced)

### Using AWS Amplify

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify**
   ```bash
   amplify init
   amplify add hosting
   ```

3. **Deploy**
   ```bash
   amplify publish
   ```

### Using AWS EC2 (Manual)

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier eligible)
   - Configure security group (ports 80, 443, 3000)

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # PM2 for process management
   sudo npm install -g pm2
   ```

4. **Clone and Setup**
   ```bash
   git clone your-repo-url
   cd rideforward
   npm install
   npm run build
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "rideforward" -- start
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/rideforward
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔐 Environment Variables Setup

### Required for Full Functionality

```bash
# OpenAI Integration (Optional)
OPENAI_API_KEY=sk_your_openai_key_here

# Stripe Payment Integration (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Socket.io Real-time Chat (Optional)
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com

# Map Integration (Optional)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Get Your API Keys

1. **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Stripe**: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) (use TEST keys)
3. **Mapbox**: [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)

---

## 🧪 Testing After Deployment

### 1. Basic Functionality Test
```bash
# Visit your deployed URL
https://your-app.vercel.app

# Test these flows:
✓ Sign up / Sign in
✓ Book a ride (location → ride type → confirm)
✓ View ride history
✓ Update profile
✓ Add payment method
✓ View notifications
```

### 2. Feature-Specific Tests

**OpenAI Chatbot:**
- Go to `/help`
- Ask: "How do I book a ride?"
- Should get AI response

**Payment Integration:**
- Add payment method with test card: `4242 4242 4242 4242`
- Should save successfully

**Voice Input:**
- Go to `/chat`
- Click microphone button
- Allow microphone permission
- Speak: "Hello driver"
- Should transcribe text

**Loyalty Program:**
- Go to `/profile`
- Check loyalty points display
- Complete a ride
- Points should increase

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Vercel)
```bash
# Add custom domain in Vercel dashboard
# Update DNS records:
# A Record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com
```

### 2. SSL Certificate
- Vercel/Netlify: Automatic SSL (Let's Encrypt)
- AWS: Use AWS Certificate Manager

### 3. Performance Optimization
```bash
# Enable Vercel Analytics
npm install @vercel/analytics

# Add to layout.tsx:
import { Analytics } from '@vercel/analytics/react';
<Analytics />
```

---

## 📊 Monitoring & Maintenance

### Enable Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Performance Monitoring
- Use Vercel Analytics (built-in)
- Or Google Analytics
- Or Plausible Analytics

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working
- Restart deployment after adding variables
- Make sure to prefix client-side variables with `NEXT_PUBLIC_`

### 404 Errors
- Check `next.config.ts` for correct output settings
- Ensure all pages are in `src/app` directory

### API Routes Not Working
- Verify API routes are in `src/app/api/`
- Check serverless function logs in dashboard

---

## ✅ Deployment Success Checklist

- [ ] App deployed and accessible via URL
- [ ] All pages load correctly
- [ ] Authentication works (sign up/sign in)
- [ ] Ride booking flow completes
- [ ] Payment integration functional (test mode)
- [ ] OpenAI chatbot responds (if API key added)
- [ ] Voice input works (in supported browsers)
- [ ] Mobile responsive design verified
- [ ] Dark mode toggle works
- [ ] Environment variables configured
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (optional)

---

## 🎉 Your App is Live!

**Share Your Deployment:**
- Production URL: `https://your-app.vercel.app`
- Test with multiple devices
- Share with users for feedback

**Next Steps:**
- Monitor performance metrics
- Collect user feedback
- Implement additional features
- Scale as needed

---

## 📞 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **AWS Amplify**: [docs.amplify.aws](https://docs.amplify.aws)

---

**Estimated Deployment Time:**
- Vercel/Netlify: 5-10 minutes
- AWS Amplify: 15-20 minutes
- AWS EC2: 30-45 minutes

**Recommended for Beginners:** Vercel (easiest, fastest, free tier)
