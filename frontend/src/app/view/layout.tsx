import React from "react"
import NavBar from "./navbar"

export default function ViewLayout(
    { children }: { children: React.ReactNode}
) {
    return (
        <div>
            <NavBar></NavBar>
            <section>{children}</section>
        </div>
    )
}