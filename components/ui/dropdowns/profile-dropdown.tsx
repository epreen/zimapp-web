import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LogOut,
  UserCircle,
  Store,
  Moon,
  Sun,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { userIsAdmin } from "@/lib/admin-utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUserDataStore } from "@/lib/store/user-store";
import { useThemeStore } from "@/lib/store/theme-store";
import Image from "next/image";

const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);

  const ordersCount = useUserDataStore((state) => state.ordersCount);
  const walletBalance = useUserDataStore((state) => state.walletBalance);
  const isLoadingOrders = useUserDataStore((state) => state.isLoading);
  const refreshUserData = useUserDataStore((state) => state.refreshUserData);

  const isAdmin = userIsAdmin(user?.email, user?.uid);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;

      try {
        const statusResponse = await fetch("/api/user/status");
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setIsBusiness(
            statusData.userProfile?.isBusiness &&
              statusData.userProfile?.businessStatus === "active"
          );
        }
      } catch (error) {
        // silent fail
      }
    };

    checkUserStatus();
  }, [user]);

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen && user) {
      await refreshUserData(user.uid);

      try {
        const statusResponse = await fetch("/api/user/status");
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setIsBusiness(
            statusData.userProfile?.isBusiness &&
              statusData.userProfile?.businessStatus === "active"
          );
        }
      } catch (error) {
        // silent fail
      }
    }
  };

  if (!user) return null;

  const handleSignOut = async () => {
    await logout();
    setOpen(false);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          onClick={() => handleOpenChange(!open)}
          className="flex items-center justify-center gap-2.5 py-1 px-4 rounded-md group cursor-pointer"
        >
          <div className="relative">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "user"}
                width={400}
                height={400}
                className="w-9 h-9 rounded-full shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-foreground flex items-center justify-center shadow-sm">
                <UserCircle className="w-6 h-6 text-background" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-background dark:border-black shadow-sm ring-1 ring-primary/20" />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 shadow-xl border-primary/20"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-primary">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "user"}
                width={400}
                height={400}
                className="w-10 h-10 rounded-full border-2 border-background"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-foreground flex items-center justify-center border-2 border-background">
                <UserCircle className="w-6 h-6 text-background" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-background text-sm truncate">
                {user.displayName?.split(" ")[0] || "Google"}  {user.displayName?.split(" ")[1] || "User"}
              </h3>
              <p className="text-xs text-background/80 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 bg-background">
          {walletBalance > 0 && (
            <div className="mb-2 p-2">
              <div className="flex items-center gap-3">
                {/* <Wallet className="w-5 h-5 text-primary" /> */}
                <div>
                  <span className="text-xs font-medium text-primary block">
                    Wallet Balance
                  </span>
                  <span className="text-xl font-bold text-primary/60">
                    ${walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <nav>
            <Link
              href="/user/profile"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5"
            >
              {/* <User className="w-4 h-4 text-primary/60" /> */}
              Profile
            </Link>

            <Link
              href="/user/orders"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5"
            >
              {/* <Package className="w-4 h-4 text-primary/60" /> */}
              Orders
              {isLoadingOrders ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-auto" />
              ) : (
                ordersCount > 0 && (
                  <span className="ml-auto bg-primary text-background text-xs px-2 py-1 rounded-full">
                    {ordersCount}
                  </span>
                )
              )}
            </Link>

            {/* <Link
              href="/wishlist"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5"
            >
              <Heart className="w-4 h-4 text-primary/60" />
              Wishlist
            </Link> */}

            <Link
              href="/user/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5"
            >
              {/* <Settings className="w-4 h-4 text-primary/60" /> */}
              Settings
            </Link>
          </nav>

          {(isBusiness || isAdmin) && (
            <div className="mt-3 border-t pt-2">
              {isBusiness && (
                <Link
                  href="/business"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5 text-primary font-semibold"
                >
                  <Store className="w-4 h-4" />
                  Business Dashboard
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5 text-primary font-semibold"
                >
                  {/* <Shield className="w-4 h-4" /> */}
                  Admin
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-background">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-primary/5 w-full text-left"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-primary" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>

        <div className="p-3 border-t bg-background">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-600/5 text-red-600 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDropdown;