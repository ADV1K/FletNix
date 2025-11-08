import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should allow a user to log in', async ({ page }) => {
    await page.goto('http://localhost:8080/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Mock the API response
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: '1', email: 'test@example.com', age: 30 },
          token: 'test-token',
        }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:8080/shows');
  });

  test('should show an error on failed login', async ({ page }) => {
    await page.goto('http://localhost:8080/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Mock the API response
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      });
    });

    await page.click('button[type="submit"]');

    const error = page.locator('.text-red-600');
    await expect(error).toHaveText('Invalid credentials');
  });
});
