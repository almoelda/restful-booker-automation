import { test } from "@playwright/test";
import { APIHelper } from "../helprs/api-helper";

test.describe("Room Booking API Tests", () => {
  test("contact form - should successfully submit a contact message", async ({
    request,
  }) => {
    const apiHelper = new APIHelper(request);

    await apiHelper.sendContactMessage(
      "Israel",
      "israelisraeli@example.com",
      "1234567890333",
      "Booking ",
      "I want to book a room, but I want to check what your cancellation policy is. Please contact me as soon as possible."
    );
  });
});
