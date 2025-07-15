import { PlaywrightCrawler } from 'crawlee';
import { Actor } from 'apify';

await Actor.init();

// Configure the crawler to run with settings we know work
const crawler = new PlaywrightCrawler({
    requestHandlerTimeoutSecs: 180,
    headless: true, // Set to true for running in the cloud, false for local testing

    async requestHandler({ page, request, log }) {
        log.info(`Processing ${request.url}...`);

        try {
            // Wait for the main project title to be visible. This confirms the page is ready.
            await page.waitForSelector('h1.Project-Page-Header__name', { timeout: 150000 });
            log.info('SUCCESS: Project page loaded and is ready for scraping.');
        } catch (e) {
            throw new Error(`The page loaded, but the title selector was not found. The website structure may have changed. Error: ${e.message}`);
        }

        // --- FINAL DATA EXTRACTION ---
        const extractedData = await page.evaluate(() => {
            const data = {
                projectName: null,
                description: null,
                socialLinks: {},
            };

            // Extract Project Name
            data.projectName = document.querySelector('h1.Project-Page-Header__name')?.textContent.trim() || null;

            // Extract Description
            data.description = document.querySelector('.Overview-Section-Description__text')?.textContent.trim().replace('...Show More', '').trim() || null;
            
            // Extract Social Links
            const socialLinkElements = document.querySelectorAll('.Project-Page-Header__links-list a');
            socialLinkElements.forEach(link => {
                const textElement = link.querySelector('.capsule__text');
                if (textElement) {
                    const text = textElement.textContent.trim().toLowerCase();
                    const url = link.href;

                    // Map the found text to our desired keys
                    if (text.includes('twitter')) {
                        data.socialLinks.twitter = url;
                    } else if (text.includes('medium')) {
                        data.socialLinks.medium = url;
                    } else if (text.includes('telegram')) {
                        // Avoid duplicates by checking if it already exists
                        if (!data.socialLinks.telegram) {
                           data.socialLinks.telegram = url;
                        }
                    } else if (text.includes('github')) {
                        data.socialLinks.github = url;
                    } else if (text.includes('website')) {
                        data.socialLinks.website = url;
                    } else if (text.includes('whitepaper')) {
                        data.socialLinks.whitepaper = url;
                    }
                }
            });

            return data;
        });

        // Add metadata to the results
        extractedData.source = 'ICODrops';
        extractedData.url = request.url;

        // Save the final, complete data object
        await Actor.pushData(extractedData);
        log.info('🎉 --- SCRAPING COMPLETE! Data saved successfully. --- 🎉');
    },

    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed. This is the final error after all retries.`);
    },
});

// --- DYNAMIC URLS SECTION ---
// Get the input for this actor run, which will contain the URLs.
const input = await Actor.getInput();
const { startUrls } = input;

// Check if startUrls were provided in the input.
if (!startUrls || !Array.isArray(startUrls) || startUrls.length === 0) {
    // Use the log object from the crawler if available, otherwise console.log
    const log = crawler.log || console;
    log.error('Input is missing or invalid. Please provide a "startUrls" array in the actor input.');
    await Actor.fail();
} else {
    // Run the crawler with the dynamic URLs from the input.
    await crawler.run(startUrls);
}

// Exit gracefully
await Actor.exit();