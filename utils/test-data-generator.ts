import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateBookingData() {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 50, max: 500 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: faker.date.future().toISOString().split('T')[0],
        checkout: faker.date.future().toISOString().split('T')[0]
      },
      additionalneeds: faker.lorem.words(3)
    };
  }

  static generateUserData() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number()
    };
  }

  static generateValidEmail(): string {
    return faker.internet.email();
  }

  static generateInvalidEmail(): string {
    return faker.lorem.word();
  }

  static generateFutureDate(daysFromNow: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  static generatePastDate(daysAgo: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }
}