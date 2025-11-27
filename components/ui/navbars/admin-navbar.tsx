'use client'
import Link from "next/link"
import React from "react";

const AdminNavbar = () => {


    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-foreground/10 transition-all">
            <Link href="/home" className="relative flex items-center font-semibold text-3xl text-foreground hover:text-foreground">
                <span className="text-primary dark:text-secondary">zim</span>app
                <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-background bg-primary dark:bg-secondary">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p>Hi, Admin</p>
            </div>
        </div>
    )
}

export default AdminNavbar