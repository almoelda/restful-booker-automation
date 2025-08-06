// api/helpers/api-helper.ts
import { APIRequestContext, expect } from "@playwright/test";

export class APIHelper {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createRoomBooking(
    roomid: number,
    firstname: string,
    lastname: string,
    bookingdates: { checkin: string; checkout: string },
    email: string,
    phone: string
  ) {
    const bookingData = {
      roomid,
      firstname,
      lastname,
      depositpaid: false,
      bookingdates,
      email,
      phone,
    };

    const url = `https://automationintesting.online/reservation/${roomid}?checkin=${bookingdates.checkin}&checkout=${bookingdates.checkout}/api/booking`;

    const response = await this.request.post(url, {
      data: bookingData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.status()).toBe(200);
  }

  async sendContactMessage(
    name: string,
    email: string,
    phone: string,
    subject: string,
    description: string
  ) {
    const messageData = {
      name,
      email,
      phone,
      subject,
      description,
    };

    const url = "https://automationintesting.online/api/message";

    const response = await this.request.post(url, {
      data: messageData,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    expect(response.status()).toBe(200);
  }
}
