import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="age"]', '25');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to shows page
    await expect(page).toHaveURL(/\/shows/);
  });

  test('should login with existing user', async ({ page }) => {
    // First register
    await page.goto('/register');
    await page.fill('input[name="email"]', 'login@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="age"]', '30');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/shows/);
    
    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL(/\/login/);
    
    // Login
    await page.fill('input[name="email"]', 'login@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to shows page
    await expect(page).toHaveURL(/\/shows/);
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/shows');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

