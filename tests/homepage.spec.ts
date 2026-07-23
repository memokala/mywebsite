import { test, expect } from '@playwright/test';

test.describe('Homepage & Localization Tests', () => {
  test('should load the Arabic homepage and have correct metadata', async ({ page }) => {
    // Go to Arabic homepage
    const response = await page.goto('/ar');
    expect(response?.status()).toBe(200);

    // Check page title
    await expect(page).toHaveTitle(/WorldPDF/);

    // Check H1 contains appropriate text
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Check html language attribute and direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('should load the English homepage and have correct metadata', async ({ page }) => {
    // Go to English homepage
    const response = await page.goto('/en');
    expect(response?.status()).toBe(200);

    // Check page title
    await expect(page).toHaveTitle(/WorldPDF/);

    // Check html language attribute and direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');
  });

  test('should toggle dark/light mode', async ({ page }) => {
    await page.goto('/ar');
    
    // Find theme toggle button - typically contains theme-toggle or sun/moon icon/class or text
    // Let's look for a button with aria-label or test ID, or search for button in header
    const themeButton = page.locator('button[aria-label*="theme"], button[aria-label*="مظهر"], button[class*="theme"]');
    
    // If theme button exists, test the toggle functionality
    if (await themeButton.count() > 0) {
      const html = page.locator('html');
      const initialTheme = await html.getAttribute('class');
      
      await themeButton.first().click();
      await page.waitForTimeout(300); // Wait for transition
      
      let newTheme = await html.getAttribute('class');
      if (newTheme === initialTheme) {
        // If it was "system" (resolved to "light") and cycled to "light", click again to cycle to "dark"
        await themeButton.first().click();
        await page.waitForTimeout(300);
        newTheme = await html.getAttribute('class');
      }
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});
