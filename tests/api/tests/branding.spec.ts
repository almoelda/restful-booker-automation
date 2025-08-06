import { test as base, request } from "@playwright/test";
import { APIHelper } from "../helprs/api-helper";

const test = base.extend<{ apiHelper: APIHelper }>({
  apiHelper: async ({}, use) => {
    const requestContext = await request.newContext();
    const helper = new APIHelper(requestContext);
    await use(helper);
    await requestContext.dispose();
  },
});

test("GET /api/branding returns expected branding data", async ({ apiHelper }) => {
  await apiHelper.getBrandingDetails();
});
