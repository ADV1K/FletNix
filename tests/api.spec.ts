import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000/api';

test.describe('API Tests', () => {
  let authToken: string;
  let userId: string;

  test('should register a new user via API', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `apitest${Date.now()}@example.com`,
        password: 'password123',
        age: 25,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.user).toBeDefined();
    expect(body.token).toBeDefined();
    authToken = body.token;
    userId = body.user.id;
  });

  test('should login via API', async ({ request }) => {
    // First register
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `loginapi${Date.now()}@example.com`,
        password: 'password123',
        age: 30,
      },
    });
    const registerBody = await registerResponse.json();

    // Then login
    const loginResponse = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: registerBody.user.email,
        password: 'password123',
      },
    });

    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    expect(loginBody.user).toBeDefined();
    expect(loginBody.token).toBeDefined();
  });

  test('should get current user', async ({ request }) => {
    // Register first
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `me${Date.now()}@example.com`,
        password: 'password123',
        age: 28,
      },
    });
    const registerBody = await registerResponse.json();
    const token = registerBody.token;

    // Get current user
    const response = await request.get(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.email).toBeDefined();
    expect(body.age).toBe(28);
  });

  test('should get shows with pagination', async ({ request }) => {
    // Register first
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `shows${Date.now()}@example.com`,
        password: 'password123',
        age: 25,
      },
    });
    const registerBody = await registerResponse.json();
    const token = registerBody.token;

    // Get shows
    const response = await request.get(`${API_URL}/shows?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.shows).toBeDefined();
    expect(Array.isArray(body.shows)).toBeTruthy();
    expect(body.pagination).toBeDefined();
    expect(body.pagination.page).toBe(1);
    expect(body.pagination.limit).toBe(15);
  });

  test('should search shows', async ({ request }) => {
    // Register first
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `search${Date.now()}@example.com`,
        password: 'password123',
        age: 25,
      },
    });
    const registerBody = await registerResponse.json();
    const token = registerBody.token;

    // Search shows
    const response = await request.get(`${API_URL}/shows?q=House&page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.shows).toBeDefined();
    expect(Array.isArray(body.shows)).toBeTruthy();
  });

  test('should filter shows by type', async ({ request }) => {
    // Register first
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `filter${Date.now()}@example.com`,
        password: 'password123',
        age: 25,
      },
    });
    const registerBody = await registerResponse.json();
    const token = registerBody.token;

    // Filter by type
    const response = await request.get(`${API_URL}/shows?type=Movie&page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    if (body.shows.length > 0) {
      expect(body.shows[0].type).toBe('Movie');
    }
  });

  test('should get show by ID', async ({ request }) => {
    // Register first
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `detail${Date.now()}@example.com`,
        password: 'password123',
        age: 25,
      },
    });
    const registerBody = await registerResponse.json();
    const token = registerBody.token;

    // Get shows list first
    const showsResponse = await request.get(`${API_URL}/shows?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const showsBody = await showsResponse.json();

    if (showsBody.shows.length > 0) {
      const showId = showsBody.shows[0]._id || showsBody.shows[0].show_id;

      // Get show detail
      const response = await request.get(`${API_URL}/shows/${showId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.title).toBeDefined();
    }
  });

  test('should get recommendations', async ({ request }) => {
    // Register first
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `recs${Date.now()}@example.com`,
        password: 'password123',
        age: 25,
      },
    });
    const registerBody = await registerResponse.json();
    const token = registerBody.token;

    // Get shows list first
    const showsResponse = await request.get(`${API_URL}/shows?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const showsBody = await showsResponse.json();

    if (showsBody.shows.length > 0) {
      const showId = showsBody.shows[0]._id || showsBody.shows[0].show_id;

      // Get recommendations
      const response = await request.get(`${API_URL}/shows/${showId}/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.recommendations).toBeDefined();
      expect(Array.isArray(body.recommendations)).toBeTruthy();
    }
  });
});

