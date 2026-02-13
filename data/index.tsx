import {
    Home,
    ShoppingBag,
    ShoppingCart,
    BookOpen,
    Flame,
    User,
    Package,
    Tag,
    Phone,
    HelpCircle,
    Info,
    Grid3X3,
    Heart
} from "lucide-react";
import { ReactNode } from "react";

interface MenuItem {
    title: string;
    href: string;
    icon?: ReactNode;
}

export const headerMenuItems: MenuItem[] = [
    { title: "Home", href: "/", icon: <Home size={18} /> },
    { title: "Shop", href: "/products", icon: <ShoppingBag size={18} /> },
    // { title: "Categories", href: "/categories", icon: <Grid3X3 size={18} /> },
    { title: "Local Stores", href: "/store-list", icon: <ShoppingCart size={18} /> },
    { title: "Blog", href: "/blog", icon: <BookOpen size={18} /> },
    { title: "Contact", href: "/contact", icon: <Phone size={18} /> }
];

export const headerMenuAdditionalItems: MenuItem[] = [
    { title: "Hot Deal", href: "/deal", icon: <Flame size={20} /> },
    { title: "Brands", href: "/brands", icon: <Tag size={20} /> }
];

export const userProfileMenuItems: MenuItem[] = [
    {
        title: "My Profile",
        href: "/account/profile",
        icon: <User size={18} />
    },
    {
        title: "My Orders",
        href: "/account/orders",
        icon: <Package size={18} />
    },
    {
        title: "My Wishlist",
        href: "/account/wishlist",
        icon: <Heart size={18} />
    }
];

export const userProfileMenuAdditionalItems: MenuItem[] = [
{ title: "My Address Book", href: "/account/addresses" },
{ title: "My Payment Methods", href: "/account/payments" }
];

export const supportMenuItems: MenuItem[] = [
{ title: "Help Center", href: "/help", icon: <HelpCircle size={20} /> },
{ title: "Customer Service", href: "/support", icon: <Phone size={20} /> },
{ title: "About Us", href: "/about", icon: <Info size={20} /> }
];
