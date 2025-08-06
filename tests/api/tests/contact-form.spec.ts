import { test, expect } from '@playwright/test';

test.describe('Contact API Tests', () => {

  test('should submit contact form', async ({ request }) => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'Test Message',
      description: 'This is a test message'
    };

    const response = await request.post('https://automationintesting.online/message', {
      data: contactData,
    });

    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    expect(responseBody.name).toBe(contactData.name);
    expect(responseBody.subject).toBe(contactData.subject);
  });

  test('should get all messages with admin token', async ({ request }) => {
    // First authenticate as admin
    const authResponse = await request.post('https://automationintesting.online/auth', {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });

    const authBody = await authResponse.json();
    const token = authBody.token;

    // Get all messages
    const messagesResponse = await request.get('https://automationintesting.online/message', {
      headers: {
        'Cookie': `token=${token}`
      }
    });

    expect(messagesResponse.status()).toBe(200);
    
    const messages = await messagesResponse.json();
    expect(Array.isArray(messages)).toBeTruthy();
  });

  test('should reject contact form with missing fields', async ({ request }) => {
    const incompleteData = {
      name: 'Test User'
      // Missing required fields
    };

    const response = await request.post('https://automationintesting.online/message', {
      data: incompleteData,
    });

    expect([400, 422]).toContain(response.status());
  });
});