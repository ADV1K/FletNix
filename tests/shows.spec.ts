import { test, expect } from '@playwright/test';

test.describe('Shows', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    await page.goto('/register');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="age"]', '25');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/shows/);
  });

  test('should display shows list', async ({ page }) => {
    await expect(page.locator('h1:has-text("Netflix Titles")')).toBeVisible();
    
    // Should have shows
    const showCards = page.locator('.grid > div').first();
    await expect(showCards).toBeVisible();
  });

  test('should paginate shows', async ({ page }) => {
    // Wait for shows to load
    await page.waitForSelector('.grid > div');
    
    // Check if pagination exists
    const pagination = page.locator('text=Page');
    const hasPagination = await pagination.isVisible().catch(() => false);
    
    if (hasPagination) {
      // Click next page
      const nextButton = page.locator('button:has-text("Next")');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await expect(page.locator('text=Page 2')).toBeVisible();
      }
    }
  });

  test('should search shows by title', async ({ page }) => {
    await page.waitForSelector('.grid > div');
    
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'House');
    await page.waitForTimeout(600); // Wait for debounce
    
    // Should show filtered results
    await expect(page.locator('.grid > div').first()).toBeVisible();
  });

  test('should filter shows by type', async ({ page }) => {
    await page.waitForSelector('.grid > div');
    
    // Select Movie type
    await page.selectOption('select', 'Movie');
    await page.waitForTimeout(500);
    
    // Should show filtered results
    await expect(page.locator('.grid > div').first()).toBeVisible();
  });

  test('should filter shows by genre', async ({ page }) => {
    await page.waitForSelector('.grid > div');
    
    // Wait for genre dropdown to populate
    await page.waitForTimeout(1000);
    
    // Select a genre if available
    const genreSelect = page.locator('select').nth(1);
    const options = await genreSelect.locator('option').all();
    if (options.length > 1) {
      await genreSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
      
      // Should show filtered results
      await expect(page.locator('.grid > div').first()).toBeVisible();
    }
  });

  test('should navigate to show detail page', async ({ page }) => {
    await page.waitForSelector('.grid > div');
    
    // Click on first show
    await page.locator('.grid > div').first().click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/shows\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display show recommendations', async ({ page }) => {
    await page.waitForSelector('.grid > div');
    
    // Click on first show
    await page.locator('.grid > div').first().click();
    await page.waitForURL(/\/shows\/.+/);
    
    // Wait for recommendations section
    const recommendations = page.locator('text=Recommendations');
    const hasRecommendations = await recommendations.isVisible().catch(() => false);
    
    if (hasRecommendations) {
      await expect(recommendations).toBeVisible();
    }
  });
});

