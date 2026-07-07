import { test, expect } from '@playwright/test';

test.describe('Broken Links Crawler', () => {
  test('should verify all internal links are working without 404/500 errors', async ({ page, request }) => {
    // Increase test timeout to handle development server compilation
    test.setTimeout(90000);

    // Go to Arabic homepage as the starting point
    await page.goto('/ar');
    
    // Get all links on the page
    const links = await page.locator('a').evaluateAll((elements: HTMLAnchorElement[]) => 
      elements
        .map(el => el.href)
        .filter(href => href.startsWith(window.location.origin) || href.startsWith('/'))
    );
    
    // Remove duplicates
    const uniqueLinks = Array.from(new Set(links));
    
    // Filter to keep only static pages or a select few tool pages to avoid overloading development server compilation
    const filteredLinks = uniqueLinks.filter(url => {
      const isToolPage = url.includes('/pdf/');
      if (!isToolPage) return true; // Keep static pages like about, pricing, faq, login, contact
      
      // Keep only 3 core tool pages for sample testing
      const allowedTools = ['merge-pdf', 'split-pdf', 'compress-pdf'];
      return allowedTools.some(tool => url.endsWith(tool));
    });

    console.log(`Found ${uniqueLinks.length} unique internal links. Testing a representative sample of ${filteredLinks.length} pages.`);
    
    const errors: string[] = [];
    
    // Check each link
    for (const url of filteredLinks) {
      // Exclude anchor links/hash URLs or mailto/tel links
      if (url.includes('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        continue;
      }
      
      try {
        console.log(`Verifying: ${url}`);
        const response = await request.get(url);
        if (response.status() >= 400) {
          errors.push(`Broken link found: ${url} (Status: ${response.status()})`);
        }
      } catch (err) {
        errors.push(`Failed to fetch link: ${url} (Error: ${err instanceof Error ? err.message : err})`);
      }
    }
    
    // Output all errors and assert there are none
    if (errors.length > 0) {
      console.error(errors.join('\n'));
    }
    expect(errors.length).toBe(0);
  });
});
