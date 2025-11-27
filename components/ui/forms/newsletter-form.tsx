"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Newsletter = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center bg-foreground/5 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-foreground/5 ring ring-foreground/10"
        >
            <Input
                type="email"
                placeholder="Enter your email address"
                variant="ghost"
                className="flex-1 pl-5 bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none"
            />

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2"
            >
                <Button className="font-medium px-7 py-3 rounded-full transition text-background dark:bg-secondary">
                    Get Updates
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default Newsletter;