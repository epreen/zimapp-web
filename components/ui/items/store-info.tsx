'use client'
import Image, {StaticImageData} from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

interface Store {
    id: string
    userId: string
    name: string
    description: string
    username: string
    address: string
    status: "approved" | "pending" | "rejected"
    isActive: boolean
    logo: StaticImageData
    email: string
    contact: string
    createdAt: string
    updatedAt: string
    user: {
        id: string
        name: string
        email: string
        image: StaticImageData
        cart: Record<string, unknown>
    }
}

const StoreInfo = ({ store }: { store: Store }) => {
    return (
        <div className="flex-1 space-y-2 text-sm">
            <Image width={100} height={100} src={store.logo} alt={store.name} className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto" />
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h3 className="text-xl font-semibold text-foreground"> {store.name} </h3>
                <span className="text-sm">@{store.username}</span>

                {/* Status Badge */}
                <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full ${store.status === 'pending'
                        ? 'bg-yellow-600/20 text-yellow-600'
                        : store.status === 'rejected'
                        ? 'bg-red-600/20 text-red-600'
                        : 'bg-green-600/20 text-green-600'
                        }`}
                >
                    {store.status}
                </span>
            </div>

            <p className="text-foreground/60 my-5 max-w-2xl">{store.description}</p>
            <p className="flex items-center gap-2"> <MapPin size={16} /> {store.address}</p>
            <p className="flex items-center gap-2"><Phone size={16} /> {store.contact}</p>
            <p className="flex items-center gap-2"><Mail size={16} />  {store.email}</p>
            <p className="text-foreground/80 mt-5">Applied  on <span className="text-xs">{new Date(store.createdAt).toLocaleDateString()}</span> by</p>
            <div className="flex items-center gap-2 text-sm ">
                <Image width={100} height={100} src={store.user.image} alt={store.user.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                    <p className="text-foreground/60 font-medium">{store.user.name}</p>
                    <p className="text-foreground/40 text-xs">{store.user.email}</p>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo