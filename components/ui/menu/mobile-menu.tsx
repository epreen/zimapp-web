import { AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenuActions } from "@/components/providers/menu-store-provider";

const MobileMenu = () => {
    const { toggleMenu } = useMenuActions();

    return (
        <>
            <Button
                variant="icon"
                size="icon"
                onClick={toggleMenu}
            >
                <AlignLeft className="w-6 h-6" />
            </Button>
        </>
    );
};

export default MobileMenu;