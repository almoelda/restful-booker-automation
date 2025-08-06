import { test } from "@playwright/test";
import { APIHelper } from "../helprs/api-helper";

test.describe("Room Booking API Tests", () => {
  test("createRoomBooking - should successfully book a double room", async ({
    request,
  }) => {
    const apiHelper = new APIHelper(request);

    await apiHelper.createRoomBooking(
      3,
      "Israel",
      "Israeli",
      { checkin: "2025-08-06", checkout: "2025-08-07" },
      "israelisraeli@example.com",
      "1234567890333"
    );
  });
});
