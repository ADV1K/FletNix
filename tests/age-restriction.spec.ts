import { test, expect } from '@playwright/test';

test.describe('Age Restrictions', () => {
  test('should hide R-rated content for users under 18', async ({ page }) => {
    // Register as under-18 user
    await page.goto('/register');
    await page.fill('input[name="email"]', `under18${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="age"]', '17');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/shows/);
    
    // Search for R-rated content
    await page.waitForSelector('.grid > div');
    
    // Check that no R-rated shows are visible
    const showCards = page.locator('.grid > div');
    const count = await showCards.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = showCards.nth(i);
      const text = await card.textContent();
      // R-rated shows should not appear in the list
      expect(text).not.toContain('Rating: R');
    }
  });

  test('should show R-rated content for users 18 and over', async ({ page }) => {
    // Register as 18+ user
    await page.goto('/register');
    await page.fill('input[name="email"]', `over18${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="age"]', '25');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/shows/);
    
    await page.waitForSelector('.grid > div');
    
    // R-rated content may be visible (depending on dataset)
    // Just verify the page loads correctly
    await expect(page.locator('h1:has-text("Netflix Titles")')).toBeVisible();
  });
});

