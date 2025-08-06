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
    });
    expect(response.status()).toBe(200);
  }

  async getBrandingDetails() {
  const url = "https://automationintesting.online/api/branding";

  const response = await this.request.get(url);
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const expectedResponse = {
    name: "Shady Meadows B&B",
    map: {
      latitude: 52.6351204,
      longitude: 1.2733774,
    },
    logoUrl: "/images/rbp-logo.jpg",
    description:
      "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.",
    directions:
      "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.",
    contact: {
      name: "Shady Meadows B&B",
      phone: "012345678901",
      email: "fake@fakeemail.com",
    },
    address: {
      line1: "Shady Meadows B&B",
      line2: "Shadows valley",
      postTown: "Newingtonfordburyshire",
      county: "Dilbery",
      postCode: "N1 1AA",
    },
  };
  expect(response.status()).toBe(200);
  expect(responseBody).toEqual(expectedResponse);
}


  
}
