import "./globals.css";

import cx from "classnames";
import Nav from "@/components/Layout/Nav";
import Footer from "@/components/Layout/Footer";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/DarkMode/theme-provider";
import { sfPro, inter } from "../fonts";

export const metadata: Metadata = {
    title: "Salon Rium Coiffure",
    description: "The Best Hair Salon in Montreal."
};

export default async function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(sfPro.variable, inter.variable)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="fixed h-screen w-full " />
                    <Nav />
                    <main className="flex min-h-screen w-full flex-col items-center py-32">
                        {children}
                    </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
