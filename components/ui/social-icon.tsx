import { motion } from "framer-motion";
import {ReactNode} from "react";

interface SocialIconInterface {
    href?: string;
    children: ReactNode;
}

export const FooterSocialIcon = ({ href, children }: SocialIconInterface) => (
    <motion.a
        whileHover={{ scale: 1.15, rotate: 3 }}
        whileTap={{ scale: 0.9 }}
        href={href}
        target="_blank"
        className="flex items-center justify-center w-10 h-10 bg-primary dark:bg-secondary text-background/90 dark:text-background/70 transition rounded-full"
    >
        {children}
    </motion.a>
);