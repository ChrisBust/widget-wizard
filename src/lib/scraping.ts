import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style').remove();

    // Get the text content of the body
    const textContent = $('body').text();
    
    // Clean up the text: remove extra whitespace and newlines
    const cleanedText = textContent.replace(/\s+/g, ' ').trim();
    
    return cleanedText;
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    throw new Error('Could not scrape the website.');
  }
}
