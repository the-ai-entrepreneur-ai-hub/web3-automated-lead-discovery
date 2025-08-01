# Web3Radar (rawfreedomai.com) – UX and Bug Audit (July 29 2025)

## Site Overview
Web3Radar is positioned as an AI-powered Web3 lead generation platform. The site uses a dark theme, navigation bar (Home, Our Services, Who We Are, Success Stories, Sign In, Get Started) and multiple call-to-action buttons. Navigation uses hash-based URLs (e.g., /#/services/…). During the audit several serious usability defects and missing elements were uncovered, many of which could undermine trust and conversions.

## 1 Missing Essential Elements

| Element                          | Evidence and Description                                                                                                                                                                                                 | Potential Impact                                                                 |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| Contact page/information         | The "Contact" link in the footer and the "Contact our sales team" link in the pricing section lead to a 404 page not found (/#contact) instead of a contact form or information. The 404 page offers only a Return to Home link. | Customers cannot reach the company for questions, demos, or support; this damages trust and lowers conversion. |
| Help Center / Documentation / API | Links labelled "Help Center," "Documentation," and "API" in the footer all redirect to pages under /#help, /#documentation etc., but these paths also return the 404 error page.                                              | Lack of support resources undermines legitimacy and discourages technical users from trying the product. |
| Blog, Careers, Integrations, Pricing (dedicated page) | Footer links to "Blog," "Careers," and "Integrations" were unreachable because the root domain rawfreedomai.com started returning a 502 Bad Gateway error after leaving the home page. Even before the error, there was no dedicated blog content or careers page visible. The only pricing information appears on the home page; there is no dedicated pricing or checkout page. | Without company news or job postings, visitors question the product's maturity. A 502 error is a critical reliability issue. |
| Demo / trial sign-up             | The hero section invites users to "See Demo," but the button simply scrolls down to a section showcasing sample projects; there is no video or interactive demo. On the Lead Discovery service page, a "Watch Demo" button appears but it is non-functional. Calls to action like "Schedule Demo" at the bottom of the page do not trigger any booking form or calendar. | Prospects cannot see the product in action or schedule a call, so they are less likely to sign up. |
| Legal information                | Links to "Terms of Service" and "Privacy Policy" exist, but due to the site's 404/502 issues they were inaccessible. There was no company address, phone number or regulatory information. | Missing or inaccessible legal docs are red flags for B2B buyers and may violate regulations. |

## 2 Broken/Non-functional Links

| Broken or Non-functional Element | Description and Evidence                                                                                                                                                                                                 | Impact |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| Root domain (rawfreedomai.com)   | Navigating to the bare domain or to /#/ eventually triggered a 502 Bad Gateway error page, suggesting server misconfiguration.                                                                                             | If the site intermittently fails, ads and referrals will drop visitors on an error page instead of the product, dramatically reducing conversions. |
| Contact form links               | Footer "Contact," pricing section "Contact our sales team," and other call-to-contact links all lead to the 404 page.                                                                                                     | Prevents customer engagement; visitors may assume the company is unresponsive or fraudulent. |
| Help Center, Documentation, API, Blog, Careers, Integrations | These footer links also return the 404 error page or the 502 Bad Gateway error (when hitting the root domain).                                                                                                       | Users cannot find support or developer resources. |
| Demo/CTA buttons                 | Buttons labelled "View Details" and "Add to Pipeline" in the sample project cards on the home page appear interactive but do nothing when clicked. Similarly, the "Watch Demo" button on the Lead Discovery page and the "Schedule Demo" button at the bottom of that page are non-functional. | Creates frustration and reduces trust; visitors may assume the product is vaporware. |
| Navigation links                 | In the footer, links to "Help Center," "Documentation," etc. use plain anchor tags, but there is no router mapping, so the navigation does not update the page.                                                              | Broken navigation indicates poor quality control and may cause visitors to abandon the site. |

## 3 UI/UX Inconsistencies and Friction Points

- **"Coming soon" services without clear timeline**: Pages for Market Intelligence, Competitor Analysis, and Contact Enrichment are labelled "Coming Soon" and contain "Join the Waitlist" forms. While transparency about road-map is good, the site lacks clear messaging on when these features will be available. Visitors may assume the product is incomplete.

- **Non-interactive project cards**: The "See Web3Radar in Action" section lists example Web3 projects. Each card has "View Details" and "Add to Pipeline" buttons, but they are disabled. Users expecting to click through to project details or try adding to a pipeline will be confused.

- **Color contrast and readability**: The dark background with bright neon accents looks modern, but some text (e.g., small grey sub-headings) lacks sufficient contrast against the dark background, which may not meet accessibility standards.

- **No feedback on button clicks**: Many CTA buttons do not provide any visual or loading feedback when clicked. For example, pressing "Watch Demo" or "Schedule Demo" simply has no effect. Users might click repeatedly or think their browser is broken.

- **Hidden header at scroll**: On some service pages, the sticky navigation covers part of the hero heading when first loaded, causing the top of the headline to be obscured (observed on the Lead Discovery page). This makes the page look unpolished.

- **Misleading CTA placement**: The hero section invites users to start a free trial but there is no immediate sign-up form; clicking "Get Started" just scrolls or routes the user to another page where the trial sign-up still isn't available. Without a clear sign-up flow, conversions will suffer.

## 4 Navigation Flow and Content Clarity

- **Fragmented navigation**: The "Our Services" menu offers four services; however, three are not yet available. Visitors must click into each service page only to be told to join a waitlist. This interruptive flow wastes users' time.

- **Lack of on-page explanations**: The site claims to offer AI-powered prospecting, but does not clearly explain how it works or provide screenshots of the actual platform. The features lists are generic ("AI-powered scanning," "Smart filtering") without supporting visuals or examples. Prospects may not understand the value proposition.

- **Missing success stories**: The top navigation includes a "Success Stories" dropdown, but no case studies were found (the link was not tested because of the 502 error). Case studies are important for credibility.

- **No sign-up flow**: The "Get Started" and "Start Free Trial" buttons do not lead to a clear sign-up or onboarding form. Without a registration path, interested users cannot try the product.

## 5 Other Observations and Potential Improvements

- **Server reliability**: The site intermittently served a 502 Bad Gateway error when navigating to the root domain. This suggests hosting or configuration problems that must be addressed to avoid losing traffic.

- **Contact and legal transparency**: Provide a working contact form, email address, physical address and company registration details. Without these, potential customers may suspect the site is not legitimate.

- **Functional demo**: Embed a short video or interactive demo illustrating how Web3Radar discovers projects, scrapes data, and generates leads. Replace non-functional "Watch Demo" buttons with actual content.

- **Clear onboarding**: When users click Get Started or Start Free Trial, direct them to a registration form with pricing options. Use modal windows or dedicated pages to collect necessary information.

- **Remove or revise unavailable services**: Instead of listing "coming soon" pages in the primary navigation, place them in a roadmap section and clearly indicate they are future features. This reduces friction and expectations.

- **Fix broken links**: Create functioning pages for Help Center, Documentation, API, Blog, Careers, Terms of Service and Privacy Policy. If these resources are not ready, remove the links until they are.

- **Improve accessibility**: Adjust text sizes and contrast ratios, provide alt text for images, and test the site with screen readers.

- **Performance and analytics**: Implement analytics to track click events on CTA buttons; this will help identify where users drop off and allow data-driven UX improvements.

## Conclusion
Web3Radar's marketing site has a modern aesthetic, but severe functional problems—missing contact information, broken links, non-functional demos and CTAs, and even server errors—undermine credibility. Before investing in further marketing, the team should prioritise fixing broken links, providing real ways to contact and sign up, and delivering a working demo or trial. Addressing these issues will improve user experience, build trust and increase conversions.