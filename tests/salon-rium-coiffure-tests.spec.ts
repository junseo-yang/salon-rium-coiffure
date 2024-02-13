import { test, expect, Page } from "@playwright/test";

const login = async (page: Page) => {
    await page.goto("/");

    // Click the Sign In button
    await page.getByRole("button", { name: "Sign In" }).click();

    // Click the Sign In with Google button
    await page.getByText("Sign In with Google", { exact: true }).click();

    // Expect a title "Sign in - Google Accounts" a substring.
    await expect(page).toHaveTitle(/Sign in - Google Accounts/);

    // Login with Google Email
    await page
        .getByLabel("Email or Phone")
        .fill(process.env.USERNAME_P as string);

    // Click Next
    await page.locator("#identifierNext").click();

    // Login with Google Password
    await page
        .getByLabel("Enter your password")
        .fill(process.env.PASSWORD_P as string);

    // Click Next
    await page.locator("#passwordNext").click();

    // Wait for Redirection
    await page.waitForURL("http://localhost:3000/");
}

test("sign in with google", async ({ page }) => {
    await page.goto("/");

    // Click the Sign In button
    await page.getByRole("button", { name: "Sign In" }).click();

    // Click the Sign In with Google button
    await page.getByText("Sign In with Google", { exact: true }).click();

    // Expect a title "Sign in - Google Accounts" a substring.
    await expect(page).toHaveTitle(/Sign in - Google Accounts/);

    // Login with Google Email
    await page
        .getByLabel("Email or Phone")
        .fill(process.env.USERNAME_P as string);

    // Click Next
    await page.locator("#identifierNext").click();

    // Login with Google Password
    await page
        .getByLabel("Enter your password")
        .fill(process.env.PASSWORD_P as string);

    // Click Next
    await page.locator("#passwordNext").click();

    // Wait for Redirection
    await page.waitForURL("http://localhost:3000/");

    // Expect a title "Salon Rium Coiffure" a substring.
    await expect(page).toHaveTitle(/Salon Rium Coiffure/);

    // Click the user icon to open the dropdown menu
    await page.getByAltText(process.env.USERNAME_P as string).click();

    // Expect a username to be visible
    await expect(page.getByText(process.env.USERNAME_P as string)).toBeVisible();

    // Click the Logout button
    await page.getByText("Logout", { exact: true }).click();

    // Expect the Sign In button to be visible
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("Get all service categories", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole('heading', { name: 'Men', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Women', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Kid', exact: true })).toBeVisible()
});

test("Get services from seed data", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Men's Haircut - $45")).toBeVisible()
    await expect(page.getByText("Men's Perm")).toBeVisible()
    await expect(page.getByText("Women's Bangcut")).toBeVisible()
});

test("Blocked with no authentication", async ({ page }) => {
    await page.goto("/admin/services");

    await expect(page.getByText("Access Denied")).toBeVisible()
});

test("add service", async ({ page }) => {
    await login(page)

    await page.goto("/admin/services");

    await page.locator('#btnAddService').click()

    await page.locator('#name-input').fill('Test Service')
    await page.locator('#price-input').fill('13.99')
    await page.locator('#submit-button').click()

    await page.waitForTimeout(1000);


    await page.goto("/");
    await expect(page.getByText("Test Service")).toBeVisible()
});

test("update service", async ({ page }) => {
    await login(page)

    await page.goto("/admin/services");

    await page.locator('li').filter({ hasText: "Men's Perm" }).getByRole('button').first().click()
    
    await page.locator('#price-input').fill('99.99')
    await page.locator('#submit-button').click()

    await page.waitForTimeout(1000);


    await page.goto("/");
    await expect(page.getByText("99.99")).toBeVisible()
});

test("delete service", async ({ page }) => {
    await login(page)

    await page.goto("/admin/services");
    page.on('dialog', dialog => {
        dialog.accept()
    })
    await page.locator('li').filter({ hasText: "Women's Root Colour" }).getByRole('button').nth(1).click()
    
    await page.waitForTimeout(1000);


    await page.goto("/");
    await expect(page.getByText("Women’s Cut - $")).toBeHidden()
});


