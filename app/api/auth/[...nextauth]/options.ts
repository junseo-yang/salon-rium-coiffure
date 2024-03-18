/* eslint-disable no-console */
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                url: "https://accounts.google.com/o/oauth2/v2/auth",
                params: {
                    access_type: "offline",
                    prompt: "consent",
                    scope: "openid email profile https://www.googleapis.com/auth/calendar"
                }
            }
        })
    ],
    callbacks: {
        async session({ session, user }) {
            session.user.role = user.role;

            const [google] = await prisma.account.findMany({
                where: { userId: user.id, provider: "google" }
            });

            if (google.expires_at! <= Date.now()) {
                // If the access token has expired, try to refresh it
                try {
                    // https://accounts.google.com/.well-known/openid-configuration
                    // We need the `token_endpoint`.
                    const response = await fetch(
                        "https://oauth2.googleapis.com/token",
                        {
                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams({
                                client_id: process.env.GOOGLE_CLIENT_ID!,
                                client_secret:
                                    process.env.GOOGLE_CLIENT_SECRET!,
                                grant_type: "refresh_token",
                                refresh_token: google.refresh_token!
                            }),
                            method: "POST"
                        }
                    );

                    const tokens = await response.json();

                    if (!response.ok) throw tokens;

                    await prisma.account.update({
                        data: {
                            access_token: tokens.access_token,
                            expires_at: Date.now() + tokens.expires_in * 1000,
                            refresh_token:
                                tokens.refresh_token ?? google.refresh_token
                        },
                        where: {
                            provider_providerAccountId: {
                                provider: "google",
                                providerAccountId: google.providerAccountId
                            }
                        }
                    });
                } catch (error) {
                    console.error("Error refreshing access token", error);
                    // The error property will be used client-side to handle the refresh token error
                    session.error = "RefreshAccessTokenError";
                }
            }
            return session;
        }
    }
};

export default authOptions;
