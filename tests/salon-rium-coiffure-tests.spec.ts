/* eslint-disable @typescript-eslint/naming-convention */
import { test, expect, Page } from "@playwright/test";
import fs from "fs";
import moment from "moment";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mails/mail";
import { sendTwilio } from "@/lib/twilio/twilio";
import { Duration, Interval, Roles, ServiceCategory } from "@prisma/client";

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

    // Click Continue
    await page.getByText("Continue", { exact: true }).click();

    await page.waitForTimeout(4000);

    // Click Continue
    await page.getByText("Continue", { exact: true }).click();

    await page.waitForTimeout(4000);

    // Click Continue
    await page.getByText("Continue", { exact: true }).click();

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
    await login(page);

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

test("Get All Services", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Services")).toBeVisible();
});

test("Create Service", async ({ page }) => {
    // Login
    await login(page);

    // create service
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });

    // Create a service
    await page.goto("/admin/services");

    await page.locator("#btnAddService").click();

    const testServiceName = `Test Service ${Date.now()}`;
    await page.locator("#name-input").fill(testServiceName);
    await page.locator("#price-input").fill("13.99");

    await page.getByText(testStaffName).click();

    await page.locator("#start-date-button").click();
    await page.locator(".react-datepicker__week").first().first().click();
    await page.locator("#end-date-button").click();
    await page.locator(".react-datepicker__week").last().last().click();

    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testServiceName)).toBeVisible();

    // Cleanup: Delete the service
    await page.goto("/admin/services");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testServiceName })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });

    // Logout
    await logout(page);
});

test("Update Service", async ({ page }) => {
    // Login
    await login(page);

    // create test staff first
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });

    // Create a service to update
    await page.goto("/admin/services");

    await page.locator("#btnAddService").click();

    const testServiceName = `Test Service ${Date.now()}`;
    await page.locator("#name-input").fill(testServiceName);
    await page.locator("#price-input").fill("13.99");

    await page.getByText(testStaffName).click();

    await page.locator("#start-date-button").click();
    await page.locator(".react-datepicker__week").first().first().click();
    await page.locator("#end-date-button").click();
    await page.locator(".react-datepicker__week").last().last().click();

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

    const testServiceNameUpdated = `Test Perm Service ${Date.now()}`;
    await page.locator("#name-input").fill(testServiceNameUpdated);
    await page.locator("#price-input").fill("99.99");
    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testServiceNameUpdated)).toBeVisible();
    await expect(page.getByText("99.99")).toBeVisible();

    // Cleanup: Delete the service
    await page.goto("/admin/services");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testServiceNameUpdated })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });

    // Logout
    await logout(page);
});

test("Delete Service", async ({ page }) => {
    // Login
    await login(page);

    // create test staff first
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });

    // Create a service to update
    await page.goto("/admin/services");

    await page.locator("#btnAddService").click();

    const testServiceName = `Test Service ${Date.now()}`;
    await page.locator("#name-input").fill(testServiceName);
    await page.locator("#price-input").fill("13.99");

    await page.getByText(testStaffName).click();

    await page.locator("#start-date-button").click();
    await page.locator(".react-datepicker__week").first().first().click();
    await page.locator("#end-date-button").click();
    await page.locator(".react-datepicker__week").last().last().click();

    await page.locator("#submit-button").click();

    await page.waitForTimeout(1000);

    // Delete the service
    await page.goto("/admin/services");
    page.on("dialog", (dialog) => {
        dialog.accept();
    });
    await page
        .locator("li")
        .filter({ hasText: testServiceName })
        .getByRole("button")
        .nth(1)
        .click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testServiceName)).toBeHidden();

    // Logout
    await logout(page);

    await prisma.staff.delete({
        where: { id: testStaff.id }
    });
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
    const testStaffName = `Test Staff ${Date.now()}`;
    await page.locator("#name-input").fill(testStaffName);
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testStaffName)).toBeVisible();

    // Cleanup: Delete the staff
    await page.goto("/admin/staffs");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testStaffName })
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
    const testStaffName = `Test Staff ${Date.now()}`;
    await page.locator("#name-input").fill(testStaffName);
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Update the staff
    await page
        .locator("li")
        .filter({ hasText: testStaffName })
        .getByRole("button")
        .first()
        .click();
    const testStaffNameUpdated = `John Doe ${Date.now()}`;
    await page.locator("#name-input").fill(testStaffNameUpdated);
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testStaffNameUpdated)).toBeVisible();

    // Cleanup: Delete the staff
    await page.goto("/admin/staffs");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testStaffNameUpdated })
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
    const testStaffName = `Test Staff ${Date.now()}`;
    await page.locator("#name-input").fill(testStaffName);
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    // Delete the staff
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testStaffName })
        .getByRole("button")
        .nth(1)
        .click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testStaffName)).toBeHidden();

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
    const testPopupName = `Test Popup ${Date.now()}`;
    await page.locator("#title-input").fill(testPopupName);
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testPopupName)).toBeVisible();

    // Cleanup: Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testPopupName })
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
    const testPopupName = `Test Popup ${Date.now()}`;
    await page.locator("#title-input").fill(testPopupName);
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Update the pop-up
    await page
        .locator("li")
        .filter({ hasText: testPopupName })
        .getByRole("button")
        .first()
        .click();

    const testPopupNameUpdated = `Test Popup Updated ${Date.now()}`;
    await page.locator("#title-input").fill(testPopupNameUpdated);
    await page.locator("#description-input").fill("Now up to 60% off!");
    await page.locator("#update-pop-up-button").click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testPopupNameUpdated)).toBeVisible();

    // Cleanup: Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testPopupNameUpdated })
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
    const testPopupName = `Test Popup ${Date.now()}`;
    await page.locator("#title-input").fill(testPopupName);
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
        .filter({ hasText: testPopupName })
        .getByLabel("Delete Pop-Up")
        .click();
    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testPopupName)).toBeHidden();

    // Logout
    await logout(page);
});

test("Display Pop-up", async ({ page }) => {
    // Login
    await login(page);

    // Create a pop-up to display
    await page.goto("/admin/popups");
    await page.locator("#btnAddPopUp").click();
    const testPopupName = `Test Popup ${Date.now()}`;
    await page.locator("#title-input").fill(testPopupName);
    await page.locator("#description-input").fill("Up to 50% off!");
    await page.locator("#start-date-button").click();

    await page.locator('role=option[name="00:15"]').click();
    await page.locator("#create-pop-up-button").click();

    await page.waitForTimeout(1000);

    // Assert
    await page.goto("/");
    await expect(page.getByText(testPopupName)).toBeVisible();

    // Cleanup: Delete the pop-up
    await page.goto("/admin/popups");
    page.on("dialog", (dialog) => dialog.accept());
    await page
        .locator("li")
        .filter({ hasText: testPopupName })
        .getByLabel("Delete Pop-Up")
        .click();
    await page.waitForTimeout(1000);

    // Logout
    await logout(page);
});

test("Create Appointment", async ({ page }) => {
    // create staff and service
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testServiceName = `Test Service ${Date.now()}`;
    const testService = await prisma.service.upsert({
        where: { name: testServiceName },
        update: {},
        create: {
            name: testServiceName,
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            interval: Interval.M60,
            duration: Duration.M60,
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

test("Update Appointment", async ({ page }) => {
    // create staff and service
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testServiceName = `Test Service ${Date.now()}`;
    const testService = await prisma.service.upsert({
        where: { name: testServiceName },
        update: {},
        create: {
            name: testServiceName,
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            interval: Interval.M60,
            duration: Duration.M60,
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
    await page.selectOption("select#status", "pending");
    await page.locator("#submit-button").click();
    await page.waitForTimeout(1000);

    const updatedAppointment = await prisma.appointment.findFirst({
        where: {
            staffId: testStaff.id
        }
    });

    expect(updatedAppointment?.status).toBe("pending");

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

test("Delete Appointment", async ({ page }) => {
    // create staff and service
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testServiceName = `Test Service ${Date.now()}`;
    const testService = await prisma.service.upsert({
        where: { name: testServiceName },
        update: {},
        create: {
            name: testServiceName,
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            startTime: "09:00",
            endTime: "19:00",
            interval: Interval.M60,
            duration: Duration.M60,
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

test("Calendar Appointment", async ({ page }) => {
    // create staff and service
    const testStaffName = `Test Staff ${Date.now()}`;
    const testStaff = await prisma.staff.upsert({
        where: { name: testStaffName },
        update: {},
        create: {
            name: testStaffName,
            role: Roles.Designer
        }
    });
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const testServiceName = `Test Service ${Date.now()}`;
    const testService = await prisma.service.upsert({
        where: { name: testServiceName },
        update: {},
        create: {
            name: testServiceName,
            price: "70",
            category: ServiceCategory.Women,
            startDate,
            interval: Interval.M60,
            duration: Duration.M60,
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

test("Get All Breaks", async ({ page }) => {
    // login
    await login(page);
    await page.goto("/admin/breaks");

    await expect(page.getByText("Break", { exact: true })).toBeVisible();

    // Logout
    await logout(page);
});

test("Create Break", async ({ page }) => {
    // Put default staff on the db
    const testStaffName = `Test Staff ${Date.now()}`;
    const createdStaff = await prisma.staff.create({
        data: {
            name: testStaffName,
            role: Roles.Designer
        }
    });

    try {
        // Login
        await login(page);

        // Create a Break
        await page.goto("/admin/breaks");
        await page.locator("#btnAddBreak").click();
        const testBreakName = `Test break ${Date.now()}`;
        await page.locator("#name-input").fill(testBreakName);

        await page.selectOption("select#staff", testStaffName);
        await page.locator("#start-date-button").click();
        await page.locator('role=option[name="00:00"]').click();
        await page.locator("#end-date-button").click();
        await page.locator('role=option[name="03:00"]').click();

        await page.locator("#submit-button").click();

        await page.waitForTimeout(1000);

        // Assert
        await page.goto("/admin/breaks");
        await expect(page.getByText(testBreakName)).toBeVisible();

        // Cleanup: Delete the break
        await page.goto("/admin/breaks");
        page.on("dialog", (dialog) => dialog.accept());
        await page
            .locator("li")
            .filter({ hasText: testBreakName })
            .getByRole("button")
            .nth(1)
            .click();
        await page.waitForTimeout(1000);

        // Logout
        await logout(page);
    } finally {
        // delete the created test staff
        await prisma.staff.delete({
            where: {
                id: createdStaff.id
            }
        });
    }
});

test("Update Break", async ({ page }) => {
    // Put default staff on the db
    const testStaffName = `Test Staff ${Date.now()}`;
    const createdStaff = await prisma.staff.create({
        data: {
            name: testStaffName,
            role: Roles.Designer
        }
    });

    try {
        // Login
        await login(page);

        // Create a Break
        await page.goto("/admin/breaks");
        await page.locator("#btnAddBreak").click();
        const testBreakName = `Test Break ${Date.now()}`;
        await page.locator("#name-input").fill(testBreakName);

        await page.selectOption("select#staff", testStaffName);
        await page.locator("#start-date-button").click();
        await page.locator('role=option[name="00:00"]').click();
        await page.locator("#end-date-button").click();
        await page.locator('role=option[name="03:00"]').click();

        await page.locator("#submit-button").click();

        await page.waitForTimeout(1000);

        // Update the break
        await page
            .locator("li")
            .filter({ hasText: testBreakName })
            .getByRole("button")
            .first()
            .click();

        const testBreakNameUpdated = `Test Break Updated ${Date.now()}`;
        await page.locator("#name-input").fill(testBreakNameUpdated);
        await page.locator("#submit-button").click();

        await page.waitForTimeout(1000);

        // Assert
        await page.goto("/admin/breaks");
        await expect(page.getByText(testBreakNameUpdated)).toBeVisible();

        // Cleanup: Delete the break
        await page.goto("/admin/breaks");
        page.on("dialog", (dialog) => dialog.accept());
        await page
            .locator("li")
            .filter({ hasText: testBreakNameUpdated })
            .getByRole("button")
            .nth(1)
            .click();
        await page.waitForTimeout(1000);

        // Logout
        await logout(page);
    } finally {
        // delete the created test staff
        await prisma.staff.delete({
            where: {
                id: createdStaff.id
            }
        });
    }
});

test("Delete Break", async ({ page }) => {
    // Put default staff on the db
    const testStaffName = `Test Staff ${Date.now()}`;
    const createdStaff = await prisma.staff.create({
        data: {
            name: testStaffName,
            role: Roles.Designer
        }
    });

    try {
        // Login
        await login(page);

        // Create a break
        await page.goto("/admin/breaks");
        await page.locator("#btnAddBreak").click();
        const testBreakName = `Test Break ${Date.now()}`;
        await page.locator("#name-input").fill(testBreakName);

        await page.selectOption("select#staff", testStaffName);
        await page.locator("#start-date-button").click();
        await page.locator('role=option[name="00:00"]').click();
        await page.locator("#end-date-button").click();
        await page.locator('role=option[name="03:00"]').click();

        await page.locator("#submit-button").click();

        await page.waitForTimeout(1000);

        // Delete break
        await page.goto("/admin/breaks");
        page.on("dialog", (dialog) => dialog.accept());
        await page
            .locator("li")
            .filter({ hasText: testBreakName })
            .getByRole("button")
            .nth(1)
            .click();
        await page.waitForTimeout(1000);

        // Assert
        await page.goto("/admin/breaks");
        await expect(page.getByText(testBreakName)).toBeHidden();

        // Logout
        await logout(page);
    } finally {
        // delete the created test staff
        await prisma.staff.delete({
            where: {
                id: createdStaff.id
            }
        });
    }
});

test("Get Total Revenue", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#totalRevenue")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Total Users", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#totalUsers")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Monthly Revenue", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#monthlyRevenue")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Revenue Growth Chart", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Wait for loading
    await page.waitForTimeout(1000);

    // Assert
    await expect(page.locator("#revenueGrowthChart")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Appointments Growth Chart", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Wait for loading
    await page.waitForTimeout(1000);

    // Assert
    await expect(page.locator("#appointmentsGrowthChart")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Upcoming Appointments", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#upcomingAppointments")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Total Appointments", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Click the "Analytics" tab
    await page.getByRole("tab", { name: "Analytics" }).click();

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#totalAppointments")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Completed Appointments", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Click the "Analytics" tab
    await page.getByRole("tab", { name: "Analytics" }).click();

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#completedAppointments")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Cancelled Appointments", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Click the "Analytics" tab
    await page.getByRole("tab", { name: "Analytics" }).click();

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#cancelledAppointments")).toBeVisible();

    // Logout
    await logout(page);
});

test("Get Revenue by Category", async ({ page }) => {
    // Login
    await login(page);

    // Navigates to the dashboard
    await page.goto("/admin");

    // Click the "Analytics" tab
    await page.getByRole("tab", { name: "Analytics" }).click();

    // Wait for loading
    await page.waitForTimeout(5000);

    // Assert
    await expect(page.locator("#menRevenue")).toBeVisible();
    await expect(page.locator("#womenRevenue")).toBeVisible();
    await expect(page.locator("#kidRevenue")).toBeVisible();

    // Logout
    await logout(page);
});

test("Toggle Dark Mode", async ({ page }) => {
    // Navigates to the home page
    await page.goto("/");

    // Set theme to light in case the system theme is dark
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Light" }).click();

    // Get the background color before toggling dark mode
    const bgColorBeforeToggle = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor
    );

    // Toggle dark mode
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // Get the background color after toggling dark mode
    const bgColorAfterToggle = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor
    );

    // Assert that the background color has changed
    expect(bgColorBeforeToggle).not.toBe(bgColorAfterToggle);

    // Reset theme to system
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "System" }).click();
});

test("Send Gmail Notification", async () => {
    // Arrange
    const { TEST_EMAIL } = process.env;

    // Act
    const response = await sendMail({
        to: TEST_EMAIL!,
        subject: `Test Subject ${Date.now()}`,
        body: `Test Body ${Date.now()}`
    });

    // Assert
    expect(response.messageId).toBeDefined();
});

test("Send Twilio Notification", async () => {
    // Arrange
    const { TEST_NUMBER } = process.env;

    // Act
    const response = await sendTwilio({
        to: TEST_NUMBER!,
        body: `Test Body ${Date.now()}`
    });

    // Assert
    expect(response.errorCode).toBeNull();
});

test("Google Calendar Sync", async () => {
    // Arrange
    const { TEST_EMAIL } = process.env;

    const GOOGLE_CALENDAR_URL =
        "https://www.googleapis.com/calendar/v3/calendars/primary/events";

    const user = await prisma.user.findFirst({
        where: {
            email: TEST_EMAIL
        }
    });

    const account = await prisma.account.findFirst({
        where: {
            userId: user!.id
        }
    });

    const summary = `Test Summary ${Date.now()}`;
    const from_date = new Date();
    from_date.setMinutes(0, 0, 0);
    const to_date = from_date;
    to_date.setHours(to_date.getHours() + 1);

    // Act
    const response = await fetch(GOOGLE_CALENDAR_URL, {
        headers: {
            Authorization: `Bearer ${account?.access_token}`
        },
        method: "POST",
        body: JSON.stringify({
            summary,
            start: {
                dateTime: from_date
            },
            end: {
                dateTime: to_date
            }
        })
    });

    const data = await response.json();

    // Assert
    expect(data.id).toBeTruthy();

    // Cleanup
    if (data.id) {
        const resp = await fetch(`${GOOGLE_CALENDAR_URL}/${data.id}`, {
            headers: {
                Authorization: `Bearer ${account?.access_token}`
            },
            method: "DELETE"
        });

        if (!resp.ok) {
            const json = await resp.json();
            throw new Error(json.error.message);
        }
    }
});
