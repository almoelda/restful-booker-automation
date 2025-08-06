import { APIRequestContext, expect } from '@playwright/test';

export class ApiHelper {
  private request: APIRequestContext;
  private baseURL = 'https://automationintesting.online';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async authenticate(credentials: { username: string; password: string }): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: credentials,
    });
    
    const responseBody = await response.json();
    return responseBody.token;
  }

  async getAllBookings(): Promise<any[]> {
    const response = await this.request.get(`${this.baseURL}/booking`);
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async createBooking(bookingData: any): Promise<any> {
    const response = await this.request.post(`${this.baseURL}/booking`, {
      data: bookingData,
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async updateBooking(bookingId: number, bookingData: any, token: string): Promise<any> {
    const response = await this.request.put(`${this.baseURL}/booking/${bookingId}`, {
      data: bookingData,
      headers: { 'Cookie': `token=${token}` }
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async deleteBooking(bookingId: number, token: string): Promise<void> {
    const response = await this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: { 'Cookie': `token=${token}` }
    });
    expect(response.status()).toBe(201);
  }
}