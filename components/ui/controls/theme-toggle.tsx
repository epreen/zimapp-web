"use client";

import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";

const ThemeToggle = () => {
    const {theme, setTheme} = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <Button onClick={toggleTheme} className="bg-transparent border-none rounded-full">
            <Sun className="block dark:hidden" />
            <Moon className="hidden dark:block" />
        </Button>
    )
}

export default ThemeToggle;