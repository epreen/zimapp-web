import { motion } from "framer-motion";
import {FooterSocialIcon} from "@/components/ui/social-icon";
import {IconWrapper} from "@/components/ui/wrappers/icon-wrapper";
import Link from "next/link";
import {FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn} from "react-icons/fa6";

export const FooterBrand = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
    >
        <Link href={'/home'} className="text-4xl font-semibold text-foreground hover:text-foreground">
            <span className="text-primary dark:text-secondary">zim</span>app<span className="text-primary dark:text-secondary text-5xl leading-0">.</span>
        </Link>
        <p className="max-w-[410px] mt-6 text-sm text-foreground/70">
            Discover a seamless way to shop, sell, and stay connected — all in one
            beautifully crafted platform.
        </p>

        <div className="flex items-center gap-3 mt-5">
            <FooterSocialIcon href="#">
                <IconWrapper>
                    <FaFacebookF />
                </IconWrapper>
            </FooterSocialIcon>

            <FooterSocialIcon href="#">
                <IconWrapper>
                    <FaXTwitter />
                </IconWrapper>
            </FooterSocialIcon>

            <FooterSocialIcon href="#">
                <IconWrapper>
                    <FaInstagram />
                </IconWrapper>
            </FooterSocialIcon>

            <FooterSocialIcon href="#">
                <IconWrapper>
                    <FaLinkedinIn />
                </IconWrapper>
            </FooterSocialIcon>
        </div>
    </motion.div>
);