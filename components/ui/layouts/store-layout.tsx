// 'use client'
// import {ReactNode, useEffect, useState} from "react"
// import Link from "next/link"
// import { ArrowRightIcon } from "lucide-react"
// import Loading from "@/components/ui/controls/loading";
// import StoreNavbar from "@/components/ui/navbars/store-navbar";
// import StoreSidebar from "@/components/ui/sidebars/store-sidebar";
// import {storesDummyData} from "@/data/dummy/stores";
// import {dummyUserData} from "@/data/dummy/users";
// import {StaticImageData} from "next/image";
// import {CartState} from "@/utils/slices/cart";

// export interface Store {
//     id: string;
//     userId: string;
//     name: string;
//     description: string;
//     username: string;
//     address: string;
//     status: string;
//     isActive: boolean;
//     logo: StaticImageData;
//     email: string;
//     contact: string;
//     createdAt: string;
//     updatedAt: string;
//     user: {
//         id: string;
//         name: string;
//         email: string;
//         image: StaticImageData;
//         cart: { productId: string; quantity: number }[];
//     };
// }

// interface StoreLayoutInterface {
//     children: ReactNode
// }

// const StoreLayout = ({ children }: StoreLayoutInterface) => {


//     const [isSeller, setIsSeller] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const [storeInfo, setStoreInfo] = useState<Store | null>(null)

//     const fetchIsSeller = async () => {
//         const store = storesDummyData.find((s) => s.userId === dummyUserData.id)
//         if (store) {
//             setStoreInfo(store)
//             setIsSeller(true)
//         } else {
//             setIsSeller(false)
//         }
//         setLoading(false)
//     }

//     useEffect(() => {
//         fetchIsSeller()
//     }, [])

//     return loading ? (
//         <Loading />
//     ) : isSeller && storeInfo ? (
//         <div className="flex flex-col h-screen">
//             <StoreNavbar />
//             <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
//                 <StoreSidebar storeInfo={storeInfo} />
//                 <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     ) : (
//         <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
//             <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
//             <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
//                 Go to home <ArrowRightIcon size={18} />
//             </Link>
//         </div>
//     )
// }

// export default StoreLayout