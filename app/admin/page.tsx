import { getServerSession } from "next-auth";
import AccessDenied from "@/components/Shared/AccessDenied";
import Dashboard from "@/components/Dashboard/Dashboard";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function Page() {
    const session = await getServerSession(authOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        return AccessDenied();
    }

    return (
        <>
            <Dashboard />
        </>
    );
}
