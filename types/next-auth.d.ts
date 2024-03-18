// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        error?: "RefreshAccessTokenError";
        user: {
            id: string;
            role: string | undefined | null;
        } & DefaultSession["user"];
    }

    interface JWT {
        access_token: string;
        expires_at: number;
        refresh_token: string;
        error?: "RefreshAccessTokenError";
    }

    interface User {
        id: string;
        role: string;
    }
}
