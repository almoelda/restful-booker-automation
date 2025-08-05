import { test, expect } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';

test.describe('Authentication API Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test.describe('POST /auth', () => {
    test('should authenticate with valid credentials', async ({ request }) => {
      const credentials = {
        username: 'admin',
        password: 'password123'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('token');
      expect(typeof responseBody.token).toBe('string');
      expect(responseBody.token.length).toBeGreaterThan(10);
    });

    test('should reject invalid username', async ({ request }) => {
      const credentials = {
        username: 'invaliduser',
        password: 'password123'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      // API returns 200 but with reason for invalid credentials
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should reject invalid password', async ({ request }) => {
      const credentials = {
        username: 'admin',
        password: 'wrongpassword'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should reject empty credentials', async ({ request }) => {
      const credentials = {
        username: '',
        password: ''
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should reject missing username field', async ({ request }) => {
      const credentials = {
        password: 'password123'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should reject missing password field', async ({ request }) => {
      const credentials = {
        username: 'admin'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should handle malformed JSON', async ({ request }) => {
      const response = await request.post('https://automationintesting.online/auth', {
        data: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // API should handle malformed JSON gracefully
      expect([400, 500]).toContain(response.status());
    });

    test('should handle SQL injection attempts', async ({ request }) => {
      const credentials = {
        username: "admin'; DROP TABLE users; --",
        password: 'password123'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should handle XSS attempts in credentials', async ({ request }) => {
      const credentials = {
        username: '<script>alert("xss")</script>',
        password: 'password123'
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });

    test('should handle very long credential strings', async ({ request }) => {
      const longString = 'a'.repeat(10000);
      
      const credentials = {
        username: longString,
        password: longString
      };

      const response = await request.post('https://automationintesting.online/auth', {
        data: credentials,
      });

      // API should handle long strings gracefully
      expect([200, 400, 413]).toContain(response.status());
      
      if (response.status() === 200) {
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('reason');
        expect(responseBody.reason).toBe('Bad credentials');
      }
    });
  });

  test.describe('Token Usage', () => {
    test('should use valid token for authenticated operations', async () => {
      // First authenticate
      const token = await apiHelper.authenticate({
        username: 'admin',
        password: 'password123'
      });

      // Create a booking to have something to update
      const bookingData = {
        firstname: 'Auth',
        lastname: 'Test',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-12-01',
          checkout: '2024-12-03'
        }
      };

      const createdBooking = await apiHelper.createBooking(bookingData);
      
      // Try to update using the token
      const updatedData = { ...bookingData, firstname: 'Updated' };
      const updatedBooking = await apiHelper.updateBooking(
        createdBooking.bookingid, 
        updatedData, 
        token
      );

      expect(updatedBooking.firstname).toBe('Updated');

      // Cleanup
      await apiHelper.deleteBooking(createdBooking.bookingid, token);
    });

    test('should reject operations with invalid token', async ({ request }) => {
      const invalidToken = 'invalid-token-12345';
      
      // Try to delete a booking with invalid token
      const bookings = await apiHelper.getAllBookings();
      const bookingId = bookings[0].bookingid;

      const response = await request.delete(`https://automationintesting.online/booking/${bookingId}`, {
        headers: {
          'Cookie': `token=${invalidToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should reject operations with expired/missing token', async ({ request }) => {
      // Try to delete without any token
      const bookings = await apiHelper.getAllBookings();
      const bookingId = bookings[0].bookingid;

      const response = await request.delete(`https://automationintesting.online/booking/${bookingId}`);

      expect(response.status()).toBe(403);
    });
  });
});