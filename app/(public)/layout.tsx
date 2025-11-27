import {ReactNode} from "react";
import HomeNavbar from "@/components/ui/navbars/home-navbar";
import Footer from "@/components/ui/footer";

const PublicLayout = ({children} : {children: ReactNode}) => {
  return (
    <>
        <HomeNavbar />
        {children}
        <Footer />
    </>
  )
}

export default PublicLayout;