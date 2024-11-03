import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from "axios";

export async function middleware(request: NextRequest) {
    const isAuthenticated = await checkAuth(request);

    const protectPaths = ['/view'];

    let path: string = request.nextUrl.pathname;

    if (path === '/') {
        path = "/login";
    }
    if (path === "/view") {
        path = "/view/calendar";
    }

    if (!isAuthenticated && protectPaths.some(prefix => path.startsWith(prefix))) {
        path = "/login";
    }

    if (path !== request.nextUrl.pathname) {
        return NextResponse.redirect(new URL(path, request.url));
    }

    return NextResponse.next();
}

async function checkAuth(request: NextRequest): Promise<boolean> {
    const cookie = request.headers.get('cookie') || '';

    try {
        const response = await axios.get('https://strawhatsvit-3.onrender.com/check-auth', { headers: { Cookie: cookie } });

        if (response.status >= 200 && response.status < 300) {
            console.log("Authenticated");
            return true;
        }
    } catch (error) {
        console.error("Authentication error:", error);
    }

    console.log("Not authenticated");
    return false;
}

export const config = {
  matcher: ['/', '/view/:path*'],
};
