'use client'

import { useState } from "react"
import { toast } from "react-hot-toast"
import { XIcon } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface AddressModalInterface {
    setShowAddressModal: (show: boolean) => void
}

const AddressModal = ({ setShowAddressModal }: AddressModalInterface) => {
    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    const handleAddressChange = (e: any) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setShowAddressModal(false)
    }

    return (
        <Dialog open onOpenChange={setShowAddressModal}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="uppercase mb-4">Add New Address</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) =>
                        toast.promise(handleSubmit(e), {
                            loading: "Adding Address...",
                        })
                    }
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <Input
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={address.name}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={address.email}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Input
                            id="street"
                            name="street"
                            placeholder="Street"
                            value={address.street}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-1 w-full">
                            <Input
                                id="city"
                                name="city"
                                placeholder="City"
                                value={address.city}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                        <div className="space-y-1 w-full">
                            <Input
                                id="country"
                                name="country"
                                placeholder="Country"
                                value={address.country}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                    </div>


                    <div className="space-y-1">
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="Phone"
                            value={address.phone}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="text-background bg-primart dark:bg-secondary">Save Address</Button>
                    </DialogFooter>
                </form>

                <DialogClose asChild>
                    <XIcon
                        size={24}
                        className="absolute top-3 right-3 text-muted-foreground cursor-pointer"
                    />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default AddressModal