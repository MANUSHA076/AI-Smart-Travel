import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // ඔයාගේ app එක run වෙන URL එක (Localhost:3000)
    baseURL: process.env.NEXT_PUBLIC_APP_URL 
});