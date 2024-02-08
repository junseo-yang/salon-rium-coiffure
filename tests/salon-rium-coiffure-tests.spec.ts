import { test, expect } from "@playwright/test";

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
        .fill(process.env.USERNAME as string);

    // Click Next
    await page.locator("#identifierNext").click();

    // Login with Google Password
    await page
        .getByLabel("Enter your password")
        .fill(process.env.PASSWORD as string);

    // Click Next
    await page.locator("#passwordNext").click();

    // Wait for Redirection
    await page.waitForURL("http://localhost:3000/");

    // Expect a title "Salon Rium Coiffure" a substring.
    await expect(page).toHaveTitle(/Salon Rium Coiffure/);

    // Click the user icon to open the dropdown menu
    await page.getByAltText(process.env.USERNAME as string).click();

    // Expect a username to be visible
    await expect(page.getByText(process.env.USERNAME as string)).toBeVisible();

    // Click the Logout button
    await page.getByText("Logout", { exact: true }).click();

    // Expect the Sign In button to be visible
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});
