import { test, expect, Page } from "@playwright/test";
import fs from "fs";
import moment from "moment";
import prisma from "@/lib/prisma";
import { Roles, ServiceCategory } from "@prisma/client";

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

test("Create appointment", async ({ page }) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Create a booking
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    const currentDay = moment().format("ddd");
    await page.getByText(currentDay).click();

    await page.getByText("09:00 ~ 10:00").click();
    await page.getByText("Book Now").click();

    await page.locator("#name-input").fill("Customer_test_name");
    await page.locator("#phone-number-input").fill("123-123-1234");
    await page.locator("#email-input").fill("test@example.com");
    await page.locator("#submit-button").click();

    // assert
    await page.waitForTimeout(1000);

    await expect(page.getByText(testService.name)).toBeVisible();
    await expect(page.getByText(testStaff.name)).toBeVisible();
    await expect(page.getByText("9:00")).toBeVisible();
    await expect(page.getByText("10:00")).toBeVisible();

    // delete appointment, staff and service
    await prisma.appointment.delete({
        where: {
            staffId: testStaff.id
        }
    });

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });
});

test("Delete appointment", async ({ page }) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Create a booking
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    const currentDay = moment().format("ddd");
    await page.getByText(currentDay).click();

    await page.getByText("09:00 ~ 10:00").click();
    await page.getByText("Book Now").click();

    await page.locator("#name-input").fill("Customer_test_name");
    await page.locator("#phone-number-input").fill("123-123-1234");
    await page.locator("#email-input").fill("test@example.com");
    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // assert
    await login(page);

    // Delete a appointment to delete
    await page.goto("/admin/appointments");

    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testService.name })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // assert
    await page.goto("/admin/appointments");
    await expect(page.getByText(testService.name)).toBeHidden();

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });

    await logout(page);
});

test("Update appointment", async ({ page }) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Create a booking
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    const currentDay = moment().format("ddd");
    await page.getByText(currentDay).click();

    await page.getByText("09:00 ~ 10:00").click();
    await page.getByText("Book Now").click();

    await page.locator("#name-input").fill("Customer_test_name");
    await page.locator("#phone-number-input").fill("123-123-1234");
    await page.locator("#email-input").fill("test@example.com");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // update only status on appointment
    await login(page);

    await page.goto("admin/appointments");
    await page
        .locator("li")
        .filter({ hasText: testService.name })
        .getByRole("button")
        .first()
        .click();
    await page.selectOption("select#status", "disapproved");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    const updatedAppointment = await prisma.appointment.findFirst({
        where: {
            staffId: testStaff.id
        }
    });

    expect(updatedAppointment?.status).toBe("disapproved");

    // delete appointment, staff and service
    await prisma.appointment.delete({
        where: {
            staffId: testStaff.id
        }
    });

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });

    await logout(page);
});

test("Create appointment and check it from admin calendar", async ({
    page
}) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Create a booking
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    const currentDay = moment().format("ddd");
    await page.getByText(currentDay).click();

    await page.getByText("09:00 ~ 10:00").click();
    await page.getByText("Book Now").click();

    await page.locator("#name-input").fill("Customer_test_name");
    await page.locator("#phone-number-input").fill("123-123-1234");
    await page.locator("#email-input").fill("test@example.com");
    await page.locator("#submit-button").click();

    // assert
    await login(page);
    await page.goto("/admin/calendar");

    await expect(page.getByText(testService.name)).toBeVisible();
    await expect(page.getByText(testStaff.name)).toBeVisible();
    await expect(page.getByText("9:00")).toBeVisible();
    await expect(page.getByText("10:00")).toBeVisible();

    await logout(page);

    // delete appointment, staff and service
    await prisma.appointment.delete({
        where: {
            staffId: testStaff.id
        }
    });

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });
});

test("Block unavailable Time", async ({ page }) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() + 1);
    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Create a booking
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).isHidden();

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });
});

test("Block unavailable Time from week calendar", async ({ page }) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            endDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Assert
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    const dayAfter2 = moment();
    dayAfter2.add(2, "days");
    await page.getByText(dayAfter2.format("ddd")).click();

    page.on("dialog", async (d) => {
        expect(d.message()).toEqual("Service is not available on the date");
    });

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });
});

test("Filter not available time schedule", async ({ page }) => {
    // create staff and service
    const testStaff = await prisma.staff.upsert({
        where: { name: "Test Staff" },
        update: {},
        create: {
            name: "Test Staff",
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testService = await prisma.service.upsert({
        where: { name: "Test Haircut" },
        update: {},
        create: {
            name: "Test Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: testStaff.id
                }
            }
        }
    });

    // Create a booking
    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    const currentDay = moment().format("ddd");
    await page.getByText(currentDay).click();

    await page.getByText("09:00 ~ 10:00").click();
    await page.getByText("Book Now").click();

    await page.locator("#name-input").fill("Customer_test_name");
    await page.locator("#phone-number-input").fill("123-123-1234");
    await page.locator("#email-input").fill("test@example.com");
    await page.locator("#submit-button").click();

    // assert
    await page.waitForTimeout(1000);

    await page.goto("/booking");
    await page.getByText("Select Service").click();
    await page.getByText(testService.name).click();

    await page.getByText("Select Designer").click();
    await page.getByText(testStaff.name).click();

    await page.getByText(currentDay).click();

    await expect(page.getByText("09:00 ~ 10:00")).toBeHidden();

    // delete appointment, staff and service
    await prisma.appointment.delete({
        where: {
            staffId: testStaff.id
        }
    });

    await prisma.service.delete({
        where: { id: testService.id }
    });

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });
});
