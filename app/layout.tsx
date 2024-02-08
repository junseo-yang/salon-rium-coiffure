import "./globals.css";
import cx from "classnames";
import Nav from "@/components/Layout/Nav";
import Footer from "@/components/Layout/Footer";
import { Suspense } from "react";
import { Metadata } from "next";
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
        <html lang="en">
            <body className={cx(sfPro.variable, inter.variable)}>
                <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
                <Suspense fallback="...">
                    <Nav />
                </Suspense>
                <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
