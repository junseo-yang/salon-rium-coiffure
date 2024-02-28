import { test, expect, Page } from "@playwright/test";
import fs from "fs";

test.describe.configure({ mode: "serial" });

const login = async (page: Page) => {
    await page.goto("/");

    // Click the Sign In button
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForTimeout(1000);

    // Click the Sign In with Google button
    await page.getByText("Sign In with Google", { exact: true }).click();

    // Wait for opening google login
    await page.waitForTimeout(1000);

    // Expect a title "Sign in - Google Accounts" a substring.
    await expect(page).toHaveTitle(/Sign in - Google Accounts/);

    // Login with Google Email
    await page
        .getByLabel("Email or Phone")
        .fill(process.env.GOOGLE_USERNAME as string);

    // Click Next
    await page.locator("#identifierNext").click();

    // Login with Google Password
    await page
        .getByLabel("Enter your password")
        .fill(process.env.GOOGLE_PASSWORD as string);

    // Click Next
    await page.locator("#passwordNext").click();

    // Wait for Redirection
    await page.waitForURL("http://localhost:3000/");
};

const logout = async (page: Page) => {
    // Click the user icon to open the dropdown menu
    await page.getByAltText(process.env.GOOGLE_USERNAME as string).click();

    // Click the Logout button
    await page.getByText("Logout", { exact: true }).click();
};

test("Sign In with Google", async ({ page }) => {
    await page.goto("/");

    // Click the Sign In button
    await page.getByRole("button", { name: "Sign In" }).click();

    // Click the Sign In with Google button
    await page.getByText("Sign In with Google", { exact: true }).click();

    // Wait for opening google login
    await page.waitForTimeout(1000);

    // Expect a title "Sign in - Google Accounts" a substring.
    await expect(page).toHaveTitle(/Sign in - Google Accounts/);

    // Login with Google Email
    await page
        .getByLabel("Email or Phone")
        .fill(process.env.GOOGLE_USERNAME as string);

    // Click Next
    await page.locator("#identifierNext").click();

    // Login with Google Password
    await page
        .getByLabel("Enter your password")
        .fill(process.env.GOOGLE_PASSWORD as string);

    // Click Next
    await page.locator("#passwordNext").click();

    // Wait for Redirection
    await page.waitForURL("http://localhost:3000/");

    // Expect a title "Salon Rium Coiffure" a substring.
    await expect(page).toHaveTitle(/Salon Rium Coiffure/);

    // Click the user icon to open the dropdown menu
    await page.getByAltText(process.env.GOOGLE_USERNAME as string).click();

    // Expect a username to be visible
    await expect(
        page.getByText(process.env.GOOGLE_USERNAME as string)
    ).toBeVisible();

    // Click the Logout button
    await page.getByText("Logout", { exact: true }).click();

    // Expect the Sign In button to be visible
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("Blocked with no authentication", async ({ page }) => {
    await page.goto("/admin/services");

    await expect(page.getByText("Access Denied")).toBeVisible();
});

test("Get All Services", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Services")).toBeVisible();
});

test("Create Service", async ({ page }) => {
    // Login
    await login(page);

    // Create a service
    await page.goto("/admin/services");

    await page.locator("#btnAddService").click();

    await page.locator("#name-input").fill("Test Service");
    await page.locator("#price-input").fill("13.99");
    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Test Service")).toBeVisible();

    // Cleanup: Delete the service
    await page.goto("/admin/services");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Test Service" })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Update Service", async ({ page }) => {
    // Login
    await login(page);

    // Create a service to update
    await page.goto("/admin/services");

    await page.locator("#btnAddService").click();

    await page.locator("#name-input").fill("Test Service");
    await page.locator("#price-input").fill("13.99");
    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // Update the service
    await page.goto("/admin/services");

    await page
        .locator("li")
        .filter({ hasText: "Test Service" })
        .getByRole("button")
        .first()
        .click();

    await page.locator("#name-input").fill("Test's Perm");
    await page.locator("#price-input").fill("99.99");
    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Test's Perm")).toBeVisible();
    await expect(page.getByText("99.99")).toBeVisible();

    // Cleanup: Delete the service
    await page.goto("/admin/services");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Test's Perm" })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Delete Service", async ({ page }) => {
    // Login
    await login(page);

    // Create a service to delete
    await page.goto("/admin/services");

    await page.locator("#btnAddService").click();

    await page.locator("#name-input").fill("Test Service");
    await page.locator("#price-input").fill("13.99");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Delete the service
    await page.goto("/admin/services");
    page.on("dialog", (dialog) => {
        dialog.accept();
    });
    await page
        .locator("li")
        .filter({ hasText: "Test Service" })
        .getByRole("button")
        .nth(1)
        .click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Test Service")).toBeHidden();

    // Logout
    await logout(page);
});

test("Get All Staffs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Our Staff")).toBeVisible();
});

test("Create Staff", async ({ page }) => {
    // Login
    await login(page);

    // Create a Staff
    await page.goto("/admin/staffs");
    await page.locator("#btnAddStaff").click();
    await page.locator("#name-input").fill("Test Staff");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Test Staff")).toBeVisible();

    // Cleanup: Delete the staff
    await page.goto("/admin/staffs");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Test Staff" })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Update Staff", async ({ page }) => {
    // Login
    await login(page);

    // Create a staff to update
    await page.goto("/admin/staffs");
    await page.locator("#btnAddStaff").click();
    await page.locator("#name-input").fill("Test Staff");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Update the staff
    await page
        .locator("li")
        .filter({ hasText: "Test Staff" })
        .getByRole("button")
        .first()
        .click();
    await page.locator("#name-input").fill("John Doe");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("John Doe")).toBeVisible();

    // Cleanup: Delete the staff
    await page.goto("/admin/staffs");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "John Doe" })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Delete Staff", async ({ page }) => {
    // Login
    await login(page);

    // Create a staff to delete
    await page.goto("/admin/staffs");
    await page.locator("#btnAddStaff").click();
    await page.locator("#name-input").fill("Test Staff");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Delete the staff
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Test Staff" })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Test Staff")).toBeHidden();

    // Logout
    await logout(page);
});

test("Upload Image", async ({ page }) => {
    // Login
    await login(page);

    // Navigate to Ai Virtual Hairstyle
    await page.goto("/ai-virtual-hairstyle");

    // Upload Image from test-assets
    await page
        .locator("input[name='image']")
        .setInputFiles("tests/test-assets/woman.jpg");

    // Verify Image is uploaded
    await expect(page.getByAltText("Before image")).toBeVisible();

    // Logout
    await logout(page);
});

test("Ai Virtual Hairstyle", async ({ page }) => {
    // Login
    await login(page);

    // Navigate to Ai Virtual Hairstyle
    await page.goto("/ai-virtual-hairstyle");

    // Select Params for request
    await page.getByText("Select a Hairstyle").click();
    await page
        .getByText("Short Pixie With Shaved Sides", { exact: true })
        .click();
    await page.getByText("Select a Color").click();
    await page.getByText("Blue Hair", { exact: true }).click();

    // Upload Image from test-assets
    await page
        .locator("input[name='image']")
        .setInputFiles("tests/test-assets/woman.jpg");

    // Click Try the Hairstyle Button
    await page.getByRole("button", { name: "Try the Hairstyle" }).click();

    // Verify Image is uploaded
    await expect(page.getByAltText("After image")).toBeVisible({
        timeout: 70000
    });

    // Logout
    await logout(page);
});

test("Download Image", async ({ page }) => {
    // Login
    await login(page);

    // Navigate to Ai Virtual Hairstyle
    await page.goto("/ai-virtual-hairstyle");

    // Select Params for request
    await page.getByText("Select a Hairstyle").click();
    await page
        .getByText("Short Pixie With Shaved Sides", { exact: true })
        .click();
    await page.getByText("Select a Color").click();
    await page.getByText("Blue Hair", { exact: true }).click();

    // Upload Image from test-assets
    await page
        .locator("input[name='image']")
        .setInputFiles("tests/test-assets/woman.jpg");

    // Click Try the Hairstyle Button
    await page.getByRole("button", { name: "Try the Hairstyle" }).click();

    // Verify Image is uploaded
    await expect(page.getByAltText("After image")).toBeVisible({
        timeout: 70000
    });

    // Verify Download
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    // Wait for the download process to complete and save the downloaded file somewhere.
    await download.saveAs(`../test-results/${download.suggestedFilename()}`);

    // Verify Downloaded file
    expect(
        (await fs.promises.stat((await download.path()) as string)).size
    ).toBeGreaterThan(1);

    // Logout
    await logout(page);
});

test("Create Pop-up", async ({ page }) => {
    // Login
    await login(page);

    // Create a pop-up
    await page.goto("/admin/popups");
    await page.locator("#btnAddPopUp").click();
    await page.locator("#title-input").fill("Holiday Sale");
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Holiday SaleUp to 50% off!")).toBeVisible();

    // Cleanup: Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Holiday Sale" })
        .getByLabel("Delete Pop-Up")
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Update Pop-up", async ({ page }) => {
    // Login
    await login(page);

    // Create a pop-up
    await page.goto("/admin/popups");
    await page.locator("#btnAddPopUp").click();
    await page.locator("#title-input").fill("Holiday Sale");
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Update the pop-up
    await page
        .locator("li")
        .filter({ hasText: "Holiday Sale" })
        .getByRole("button")
        .first()
        .click();
    await page.locator("#title-input").fill("Holiday Sale Updated");
    await page.locator("#description-input").fill("Now up to 60% off!");
    await page.locator("#update-pop-up-button").click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(
        page.getByText("Holiday Sale UpdatedNow up to 60% off!")
    ).toBeVisible();

    // Cleanup: Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Holiday Sale Updated" })
        .getByLabel("Delete Pop-Up")
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Delete Pop-up", async ({ page }) => {
    // Login
    await login(page);

    // Create a pop-up to delete
    await page.goto("/admin/popups");
    await page.locator("#btnAddPopUp").click();
    await page.locator("#title-input").fill("Holiday Sale");
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Holiday Sale" })
        .getByLabel("Delete Pop-Up")
        .click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Holiday Sale")).toBeHidden();

    // Logout
    await logout(page);
});

test("Display Pop-up", async ({ page }) => {
    // Login
    await login(page);

    // Create a pop-up to display
    await page.goto("/admin/popups");
    await page.locator("#btnAddPopUp").click();
    await page.locator("#title-input").fill("Holiday Sale");
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText("Holiday SaleUp to 50% off!")).toBeVisible();

    // Cleanup: Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: "Holiday Sale" })
        .getByLabel("Delete Pop-Up")
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});
