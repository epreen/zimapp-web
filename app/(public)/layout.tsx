import {ReactNode} from "react";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

const PublicLayout = ({children} : {children: ReactNode}) => {
  return (
    <>
        <Header />
        {children}
        <Footer />
    </>
  )
}

export default PublicLayout;