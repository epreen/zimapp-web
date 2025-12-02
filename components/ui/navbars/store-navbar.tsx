// 'use client'
// import Link from "next/link"
// import ThemeToggle from "@/components/ui/controls/theme-toggle";
// import { Id } from "@/convex/_generated/dataModel";
// import { FC } from "react";

// interface Store {
//   _id: Id<"stores">;
//   name: string;
//   description: string;
//   logo?: string;
//   category: string;
//   isActive: boolean;
//   verificationStatus: string;
//   createdAt: number;
//   _creationTime: number;
//   userId: string;
//   aiHealthScore?: number;
// }

// interface StoreNavbarProps {
//   stores: Store[];
// }

// const StoreNavbar: FC<StoreNavbarProps> = ({ stores }) => {


//     return (
//         <div className="flex items-center justify-between px-12 py-3 border-b border-foreground/10 transition-all">
//             <Link href="/home" className="relative flex items-center font-semibold text-3xl text-foreground hover:text-foreground">
//                 <span className="text-primary dark:text-secondary">zim</span>app
//                 <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-background bg-primary dark:bg-secondary">
//                     Store
//                 </p>
//             </Link>
//             <div className="flex items-center gap-3">
//                 {stores.map((store) => (
//                     <div key={store._id} className="p-2 border-b">
//                     {store.logo ? <img src={store.logo} alt={store.name} className="w-8 h-8 rounded" /> : store.name}
//                     </div>
//                 ))}
//                 <ThemeToggle />
//             </div>
//         </div>
//     )
// }

// export default StoreNavbar