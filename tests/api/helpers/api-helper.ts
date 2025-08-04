import { APIRequestContext, expect } from '@playwright/test';
import { Logger } from '../../../utils/logger';

export interface BookingData {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingData;
}

export class ApiHelper {
  private apiContext: APIRequestContext;
  private baseURL: string;
  private logger: Logger;
  private authToken?: string;

  constructor(apiContext: APIRequestContext, baseURL: string = 'https://automationintesting.online') {
    this.apiContext = apiContext;
    this.baseURL = baseURL;
    this.logger = new Logger('ApiHelper');
  }

  /**
   * Authenticate and get auth token
   */
  async authenticate(credentials: AuthCredentials): Promise<string> {
    this.logger.info('Authenticating user', { username: credentials.username });
    
    const response = await this.apiContext.post(`${this.baseURL}/auth`, {
      data: credentials,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    expect(responseBody).toHaveProperty('token');
    this.authToken = responseBody.token;
    
    this.logger.info('Authentication successful');
    return this.authToken || '';
  }

  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<any[]> {
    this.logger.info('Getting all bookings');
    
    const response = await this.apiContext.get(`${this.baseURL}/booking`);
    
    expect(response.status()).toBe(200);
    const bookings = await response.json();
    
    this.logger.info(`Retrieved ${bookings.length} bookings`);
    return bookings;
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: number): Promise<BookingData> {
    this.logger.info('Getting booking by ID', { bookingId });
    
    const response = await this.apiContext.get(`${this.baseURL}/booking/${bookingId}`);
    
    expect(response.status()).toBe(200);
    const booking = await response.json();
    
    this.logger.info('Booking retrieved successfully', { bookingId });
    return booking;
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    this.logger.info('Creating new booking', { firstname: bookingData.firstname });
    
    const response = await this.apiContext.post(`${this.baseURL}/booking`, {
      data: bookingData,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    expect(responseBody).toHaveProperty('bookingid');
    expect(responseBody).toHaveProperty('booking');
    
    this.logger.info('Booking created successfully', { bookingId: responseBody.bookingid });
    return responseBody;
  }

  /**
   * Update booking (full update)
   */
  async updateBooking(bookingId: number, bookingData: BookingData, token?: string): Promise<BookingData> {
    const authToken = token || this.authToken;
    if (!authToken) {
      throw new Error('Authentication token required for updating booking');
    }

    this.logger.info('Updating booking', { bookingId });
    
    const response = await this.apiContext.put(`${this.baseURL}/booking/${bookingId}`, {
      data: bookingData,
      headers: {
        'Cookie': `token=${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);
    const updatedBooking = await response.json();
    
    this.logger.info('Booking updated successfully', { bookingId });
    return updatedBooking;
  }

  /**
   * Partially update booking
   */
  async partialUpdateBooking(bookingId: number, partialData: Partial<BookingData>, token?: string): Promise<BookingData> {
    const authToken = token || this.authToken;
    if (!authToken) {
      throw new Error('Authentication token required for updating booking');
    }

    this.logger.info('Partially updating booking', { bookingId });
    
    const response = await this.apiContext.patch(`${this.baseURL}/booking/${bookingId}`, {
      data: partialData,
      headers: {
        'Cookie': `token=${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);
    const updatedBooking = await response.json();
    
    this.logger.info('Booking partially updated successfully', { bookingId });
    return updatedBooking;
  }

  /**
   * Delete booking
   */
  async deleteBooking(bookingId: number, token?: string): Promise<void> {
    const authToken = token || this.authToken;
    if (!authToken) {
      throw new Error('Authentication token required for deleting booking');
    }

    this.logger.info('Deleting booking', { bookingId });
    
    const response = await this.apiContext.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${authToken}`,
      },
    });

    expect(response.status()).toBe(201);
    this.logger.info('Booking deleted successfully', { bookingId });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<string> {
    this.logger.info('Performing health check');
    
    const response = await this.apiContext.get(`${this.baseURL}/ping`);
    
    expect(response.status()).toBe(201);
    const responseText = await response.text();
    
    this.logger.info('Health check successful', { response: responseText });
    return responseText;
  }

  /**
   * Get bookings with filters
   */
  async getBookingsWithFilters(filters: { firstname?: string; lastname?: string; checkin?: string; checkout?: string }): Promise<any[]> {
    this.logger.info('Getting bookings with filters', filters);
    
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const response = await this.apiContext.get(`${this.baseURL}/booking?${searchParams.toString()}`);
    
    expect(response.status()).toBe(200);
    const bookings = await response.json();
    
    this.logger.info(`Retrieved ${bookings.length} filtered bookings`);
    return bookings;
  }

  /**
   * Validate booking data structure
   */
  validateBookingStructure(booking: any): void {
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('depositpaid');
    expect(booking).toHaveProperty('bookingdates');
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');
    
    // Type validations
    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.lastname).toBe('string');
    expect(typeof booking.totalprice).toBe('number');
    expect(typeof booking.depositpaid).toBe('boolean');
    expect(typeof booking.bookingdates.checkin).toBe('string');
    expect(typeof booking.bookingdates.checkout).toBe('string');
  }

  /**
   * Generate valid booking dates
   */
  static generateBookingDates(daysFromNow: number = 7, stayDuration: number = 3): { checkin: string; checkout: string } {
    const checkinDate = new Date();
    checkinDate.setDate(checkinDate.getDate() + daysFromNow);
    
    const checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkoutDate.getDate() + stayDuration);
    
    return {
      checkin: checkinDate.toISOString().split('T')[0],
      checkout: checkoutDate.toISOString().split('T')[0],
    };
  }
}