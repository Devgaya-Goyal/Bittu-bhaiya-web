# Employee Bridge Solutions - Website

A professional hiring solutions website built with HTML, CSS, and JavaScript.

## 🚀 Vercel Deployment

This website is optimized for Vercel deployment. Simply connect your GitHub repository to Vercel and it will automatically deploy.

### Quick Deploy

1. **Fork/Clone this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📱 Features

- **Responsive Design** - Works perfectly on mobile and desktop
- **Job Listings** - Dynamic job loading from Google Sheets
- **Google Forms Integration** - Direct application submission
- **Modern UI/UX** - Clean, professional design
- **Accessibility** - WCAG compliant
- **Performance Optimized** - Fast loading and smooth animations

## 🔧 Configuration

### Google Forms

The website uses two Google Forms:

1. **Job Application Form:** `https://forms.gle/UA4834R8C5tLg7Fk6`
2. **HR Consultation Form:** `https://forms.gle/381dttWURPx2Rdyh8`

### Google Sheets Integration

Jobs are loaded from a Google Sheet. Update the Sheet ID in `js/jobs.js`:

```javascript
const sheetId = 'YOUR_GOOGLE_SHEET_ID_HERE';
```

## 📁 File Structure

```
├── index.html              # Home page
├── placement.html          # Job listings page
├── services.html           # Services page
├── hr-solutions.html       # HR solutions page
├── contact.html            # Contact page
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   ├── main.js            # Main functionality
│   └── jobs.js            # Job management
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimizations

- Touch-friendly interface
- Responsive navigation
- Optimized viewport handling
- iOS Safari compatibility fixes
- Android Chrome optimizations

## 🚀 Performance Features

- Lazy loading animations
- Optimized scroll events
- Debounced search functionality
- Efficient DOM manipulation
- CSS performance optimizations

## 🔒 Security

- XSS protection
- CSRF protection headers
- Secure form handling
- Input validation

## 📞 Support

For support or questions, contact:
- Email: HR.employeebrige@gmail.com
- Phone: +919680836457

## 📄 License

© 2025 Employee Bridge Solutions. All rights reserved. 