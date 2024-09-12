import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from "axios";

export async function middleware(request: NextRequest) {
    const isAuthenticated = await checkAuth(request);

    const protectPaths = ['/view']

    let path: string = request.nextUrl.pathname;

    if (path === '/') {
        path = "/login";
    }
    if (path === "/view") {
        path = "/view/calendar";
    }
    console.log(request);

    if (!isAuthenticated && protectPaths.some(prefix => path.startsWith(prefix))) {
        path = "/login";
    }

    console.log("request: " + request.nextUrl.pathname);
    console.log("path:" + path);

    if (!(path === request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL(path, request.url));
    }

    return NextResponse.next();
}

async function checkAuth(request: NextRequest): Promise<boolean> {
    const cookies = request.cookies.toString()
    // Check if the user is authenticated
    try {
        console.log(cookies);
        const response = await axios.get('http://127.0.0.1:5000/check-auth', { headers: {Cookie: cookies} });
        if (response.status === 200) {
            console.log(response.data);
            return true;
        } else {
            throw new Error("User is not authenticated");
        }
    } catch (error) {
        // console.error("Authentication error:", error); // Log any errors
    }
    return false;
}

export const config = {
  matcher: ['/', '/view/:path*'],
}