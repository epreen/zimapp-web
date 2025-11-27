import { motion } from "framer-motion";
import Link from "next/link";
import { ComponentType } from "react";

interface FooterSectionInterface {
    title: string;
    links: {
        label: string;
        href: string;
        icon?: ComponentType<{ className?: string }>;
     }[];
}

export const FooterSection = ({ title, links }: FooterSectionInterface) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
    >
        <h3 className="font-medium md:mb-5 mb-3 text-foreground uppercase">{title}</h3>
        <ul className="space-y-2.5 text-foreground/60">
            {links.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                    {item.icon && <item.icon className="text-primary dark:text-secondary" />}
                    <Link href={item.href} className="text-primary dark:text-secondary hover:text-primary dark:hover:text-secondary hover:underline transition">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    </motion.div>
);