# Ultimate ICO Drops Scraper 🚀

This actor reliably scrapes project details, fundraising data, and all associated social media links from **icodrops.com**, overcoming the site's advanced anti-bot systems that block most generic scrapers.

## The Problem This Actor Solves

Scraping `icodrops.com` is notoriously difficult due to:
- Sophisticated anti-bot services (Cloudflare)
- Timeouts and CAPTCHA challenges
- Block pages for automated access
- Dynamic content loading mechanisms

This custom-built actor navigates the site like a real human user using advanced browser automation techniques.

## Key Features

### Anti-Blocking & Reliability
*   **🛡️ Advanced Anti-Blocking:** Defeats tough anti-bot measures
*   **🚀 Cloud-Optimized:** Handles slow loading and security checks
*   **⚙️ Dual Mode Support:**  
    `headless: true` - Silent cloud execution  
    `headless: false` - Visible browser for local debugging

### Data Extraction Capabilities
*   **📊 Comprehensive Project Details:** Names, descriptions, fundraising data
*   **🔗 Complete Social Link Discovery:** Uncovers links hidden behind "more" buttons/modals
*   **🌐 Multi-Platform Coverage:** Websites, whitepapers, social media, GitHub repos

## Output Structure

Each project returns clean JSON:

| Property      | Type   | Description                                                                 |
|---------------|--------|-----------------------------------------------------------------------------|
| `projectName` | String | Official project name                                                       |
| `description` | String | Project overview                                                            |
| `socialLinks` | Object | Key-value pairs of platform names and URLs                                  |
| `source`      | String | Always `"ICODrops"`                                                         |
| `url`         | String | Direct link to project's ICO Drops page                                     |

### Supported Social Links
`website`, `whitepaper`, `dropstab`, `twitter`, `medium`, `telegram chat`, `github`

### Example Output
```json
[{
  "projectName": "t3rn",
  "description": "t3rn is a hosting platform for smart contracts...",
  "socialLinks": {
    "website": "https://www.t3rn.io/",
    "whitepaper": "https://docs.t3rn.io/intro",
    "dropstab": "https://dropstab.com/coins/t3rn",
    "twitter": "https://x.com/t3rn_io",
    "medium": "https://www.t3rn.io/blog",
    "telegram chat": "https://t.me/T3RN_official",
    "github": "https://github.com/t3rn/t3rn"
  },
  "source": "ICODrops",
  "url": "https://icodrops.com/t3rn/"
}]