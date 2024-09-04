import React from "react";
import Link from "next/link"

export default function NavBar() {
    return(
        <div>
            <Link href="/calendar">calendar</Link>
            <Link href="/buildings">buildings</Link>
            <Link href="/courses">courses</Link>
            <Link href="/students">students</Link>
        </div>
    );
}