# CoinMarketCap New Coins & Socials Scraper

This Apify Actor performs a powerful two-step crawl to gather comprehensive data on newly listed cryptocurrencies from CoinMarketCap.

## How It Works

1.  **Discovery Phase:** The actor first visits the "New Cryptocurrencies" page and efficiently extracts the complete list of new coins by parsing the page's embedded data. This avoids slow, visual scraping and is extremely reliable.
2.  **Enrichment Phase:** For each new coin discovered, the actor adds its unique detail page to a queue. It then visits each of these pages to extract all available social media and website links (e.g., Website, Twitter, Discord, Github, etc.), again by parsing the page's embedded data for maximum speed and accuracy.
3.  **Final Output:** The actor then combines the basic information with the scraped social links and saves a complete, enriched record for each coin into the dataset.

## Features

- **Robust 2-Step Crawling:** Ensures all data is captured reliably.
- **Efficient Data Extraction:** Pulls data directly from the website's JSON data islands, bypassing visual scraping and making it immune to most UI changes and blockers.
- **Dynamic Input:** Easily configure the number of items to scrape directly from the Apify Console.
- **Memory Safe:** Built to handle hundreds of pages without overloading memory.

---

## How to Run

1.  Navigate to the **Input** tab in the Apify Console.
2.  Set your desired `maxItems` to scrape.
3.  Click the **Start** button.

The actor will run and save the results to the **Dataset** tab.

---

## Output Example

The final dataset will contain items in the following format:

```json
{
  "name": "Palm Economy",
  "symbol": "PALM",
  "url": "https://coinmarketcap.com/currencies/palm-economy/",
  "socials": {
    "Website": "https://palmeconomy.io/",
    "Twitter": "https://twitter.com/palmeconomy",
    "Github": "https://github.com/zenGate-Global",
    "Discord": "https://discord.gg/Vu4ky6WwDH",
    "YouTube": "https://youtube.com/@zengateglobal?feature=shared"
  }
}