"use client";

import { Card } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Image, {StaticImageData} from "next/image";
import { motion } from "framer-motion";

interface PromoCardProps {
    title: string;
    subtitle: string;
    image: string | StaticImageData;
    gradient: string;
    delay?: number;
}

export function PromoCard({
                              title,
                              subtitle,
                              image,
                              gradient,
                              delay = 0,
                          }: PromoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group
    bg-gradient-to-br border-none shadow-none ${gradient}`}
        >
            <div>
                <h2 className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary dark:from-secondary
                       to-black dark:to-white max-w-40">
                    {title}
                </h2>
                <p className="flex items-center gap-1 mt-4">
                    {subtitle}{" "}
                    <ArrowRightIcon
                        size={18}
                        className="group-hover:translate-x-2 transition-all"
                    />
                </p>
            </div>
            <Image className="w-32 sm:w-36" src={image} alt={title} />
        </motion.div>
    );
}