"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/components/providers/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/components/providers/chat-store-provider";
import { useAuthStore } from "@/lib/store/auth-store";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/ui/layout/search-bar";
import ProfileDropdown from "@/components/ui/dropdowns/profile-dropdown";
import { HeaderUserSkeleton } from "@/components/ui/skeletons/header-user-skeleton";

const HeaderLayoutClient = () => {
    const { openCart } = useCartActions();
    const { openChat } = useChatActions();

    const isChatOpen = useIsChatOpen();
    const totalItems = useTotalItems();
      
    const { user, loading } = useAuthStore();

    const [ isMounted, setIsMounted ] = useState(false);
    const [ isVisible, setIsVisible ] = useState(true);
    const [ lastScrollY, setLastScrollY ] = useState(0);
    const [ isBusiness, setIsBusiness ] = useState(false);

    const params = useSearchParams();
    const router = useRouter();
    
    const userId = user?.uid || "";

    const isSignedIn = !!user && !loading;

    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
  
        // Show header when scrolling up or at the top
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
          setIsVisible(true);
        }
        // Hide header when scrolling down and past threshold
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        }
  
        setLastScrollY(currentScrollY);
      };
  
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);
  
    // Handle redirect after successful login
    useEffect(() => {
      if (isSignedIn && user && isMounted && typeof window !== "undefined") {
        const redirectTo = params.get("redirectTo");
        if (redirectTo) {
          // Clean up the URL and redirect
          const cleanUrl = decodeURIComponent(redirectTo);
          router.push(cleanUrl);
          // Remove the redirectTo param from current URL
          const currentPath = window.location.pathname;
          router.replace(currentPath);
        }
      }
    }, [isSignedIn, user, params, router, isMounted]);
  
    // Check vendor status
    useEffect(() => {
      const checkVendorStatus = async () => {
        if (!user) return;
  
        try {
          const statusResponse = await fetch("/api/user/status");
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            setIsBusiness(
              statusData.userProfile?.isVendor &&
                statusData.userProfile?.vendorStatus === "active"
            );
          }
        } catch (error) {
          console.error("Error checking vendor status:", error);
        }
      };
  
      checkVendorStatus();
    }, [user]);
  
    const getSignInUrl = () => {
      if (!isMounted || typeof window === "undefined") return "/sign-in";
      const currentPath = window.location.pathname + window.location.search;
      return `/sign-in?redirectTo=${encodeURIComponent(currentPath)}`;
    };
  
    const getSignUpUrl = () => {
      if (!isMounted || typeof window === "undefined") return "/sign-up";
      const currentPath = window.location.pathname + window.location.search;
      return `/sign-up?redirectTo=${encodeURIComponent(currentPath)}`;
    };

    return (
        <div className={`mx-auto flex h-16 justify-between max-w-7xl items-center gap-3 px-4 xl:px-0`}>
            {/* Logo */}
            {!isChatOpen && (
                <Link
                    href="/"
                    className="flex shrink-0 items-center text-2xl font-semibold text-foreground"
                >
                    <span className="font-light text-primary">zim</span>app
                </Link>              
            )}

            {/* Searchbar */}
            {!isChatOpen && (
                <div className="hidden flex-1 max-w-2xl sm:block">
                    <SearchBar />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* AI Shopping Assistant */}
                {!isChatOpen && (
                    <Button
                        onClick={openChat}
                        size={user ? "icon" : "default"}
                        className="bg-primary text-background text-center sm:size-default sm:gap-2 flex items-center justify-center"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm font-medium">
                          {!user && "Ask"}
                        </span>
                    </Button>
                )}

                {loading && user ? (
                    <HeaderUserSkeleton />
                ) : user ? (
                    <>
                      {!isChatOpen && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative"
                          onClick={openCart}
                        >
                          <ShoppingBag className="h-5 w-5" />
                          {totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                              {totalItems > 99 ? "99+" : totalItems}
                            </span>
                          )}
                        </Button>
                      )}
                      <ProfileDropdown />
                    </>                  
                ) : (
                    <Link href={"/sign-in"} >
                      <Button variant="outline" className="sm:size-sm">
                          <User className="h-5 w-5" />
                          <span className="hidden sm:inline text-sm font-medium">
                            Sign in
                          </span>
                      </Button>
                    </Link>
                  )}                  
            </div>
        </div>
    )
}

export default HeaderLayoutClient