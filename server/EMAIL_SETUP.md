# Email Configuration for Web3Radar

This document explains how to configure email sending for password reset functionality.

## Quick Start (Development)

For development and testing, the system will automatically use **Ethereal Email** (fake SMTP service) if no other email configuration is provided. This creates temporary email accounts that work for testing purposes.

## Email Service Options

### 1. Gmail (Recommended for Development)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Add to your `.env` file:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### 2. Generic SMTP (Production)

For production, use services like:
- **SendGrid** (recommended)
- **Mailgun**
- **AWS SES**
- **Postmark**

Add to your `.env` file:

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

### 3. SendGrid Example (Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## Additional Configuration

```env
# Email branding
FROM_EMAIL="Web3Radar <noreply@web3radar.com>"

# Client URL for reset links
CLIENT_URL="https://yourdomain.com"
```

## Features

- **Professional Email Template**: HTML email with responsive design
- **Security**: 1-hour token expiration
- **Fallback**: Text version for email clients that don't support HTML
- **Development Mode**: Automatic test email accounts with preview URLs
- **Error Handling**: Graceful fallback if email sending fails

## Testing

The system will automatically:
1. Generate test email accounts for development
2. Log preview URLs to console
3. Handle email sending errors gracefully
4. Provide security-focused user feedback

## Security Features

- Tokens expire in 1 hour
- No email address enumeration
- Secure token generation
- Rate limiting ready
- Production-ready error handling

## Template Customization

Edit `/src/emailTemplates.js` to customize:
- Email subject lines
- HTML template design
- Branding and colors
- Security messaging
- Footer information