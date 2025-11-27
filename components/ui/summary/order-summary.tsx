'use client'

import {PlusIcon, SquarePenIcon, XIcon} from 'lucide-react'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import toast from 'react-hot-toast'
import {useRouter} from 'next/navigation'
import AddressModal from "@/components/ui/modals/address-modal"
import {RootState} from "@/lib/store"
import type { Address } from '@/lib/types'

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"

interface OrderSummaryInterface {
    totalPrice: number,
    items?: any[]
}

interface Coupon {
    code: string
    description: string
    discount: number
}

const OrderSummary = ({totalPrice, items}: OrderSummaryInterface) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MWK'
    const router = useRouter()

    const addressList = useSelector((state: RootState) => state.address.list)

    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [couponCodeInput, setCouponCodeInput] = useState('')
    const [coupon, setCoupon] = useState<Coupon | null>(null);

    const discountAmount = coupon ? totalPrice * (coupon.discount / 100) : 0

    const handleCouponCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        router.push('/marketplace/products/orders')
    }

    return (
        <div
            className="w-full max-w-lg lg:max-w-[340px] bg-foreground/10 border border-foreground/20 text-foreground/60 text-sm rounded-xl p-7">
            <h2 className="text-xl font-medium text-foreground/80">Payment Summary</h2>

            <p className="text-foreground/40 text-xs my-4">Payment Method</p>

            {/* Payment Methods */}
            <RadioGroup
                value={paymentMethod}
                onValueChange={(value: string) => {
                    setPaymentMethod(value);
                }}
            >
                <div className="flex gap-2 items-center">
                    <RadioGroupItem value="COD" id="COD"/>
                    <Label htmlFor="COD">COD</Label>
                </div>

                <div className="flex gap-2 items-center mt-1">
                    <RadioGroupItem value="STRIPE" id="STRIPE"/>
                    <Label htmlFor="STRIPE">Stripe Payment</Label>
                </div>
            </RadioGroup>            {/* Address Section */}
            <div className="py-4 text-foreground/40">
                <p>Address</p>

                {selectedAddress ? (
                    <div className="flex gap-2 items-center mt-2">
                        <p>
                            {selectedAddress.name}, {selectedAddress.city}, {selectedAddress.country}
                        </p>
                        <SquarePenIcon
                            onClick={() => setSelectedAddress(null)}
                            className="cursor-pointer"
                            size={18}
                        />
                    </div>
                ) : (
                    <div className="mt-2">
                        {addressList.length > 0 && (
                            <Select
                                onValueChange={(value: string) =>
                                    setSelectedAddress(addressList[Number(value)])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Address"/>
                                </SelectTrigger>

                                <SelectContent>
                                    {addressList.map((address: Address, index: number) => (
                                        <SelectItem key={index} value={`${index}`}>
                                            {address.name}, {address.city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        <Button
                            variant="ghost"
                            className="flex items-center gap-1 text-primary/40 dark:text-secondary/40 mt-2 p-0 hover:bg-primary/5 dark:hover:bg-secondary/5 cursor-pointer"
                            onClick={() => setShowAddressModal(true)}
                        >
                            Add Address <PlusIcon size={18}/>
                        </Button>
                    </div>
                )}
            </div>

            <Separator className="my-4"/>

            {/* Totals */}
            <div className="pb-4 border-b border-foreground/20">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1 text-foreground/40">
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>

                    <div className="flex flex-col gap-1 font-medium text-right">
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Free</p>
                        {coupon && (
                            <p>
                                -{currency}
                                {discountAmount.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>

                {!coupon ? (
                    <form
                        onSubmit={(e) =>
                            toast.promise(handleCouponCode(e), {
                                loading: 'Checking Coupon...',
                            })
                        }
                        className="flex justify-center gap-3 mt-3"
                    >
                        <Input
                            placeholder="Coupon Code"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value)}
                            className="w-full"
                        />
                        <Button type="submit" className="bg-primary dark:bg-secondary text-background">
                            Apply
                        </Button>
                    </form>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
                        <p>
                            Code:{" "}
                            <span className="font-semibold ml-1">
                                {coupon.code.toUpperCase()}
                            </span>
                        </p>

                        <p>{coupon.description}</p>

                        <XIcon
                            size={18}
                            onClick={() => setCoupon(null)}
                            className="hover:text-red-700 transition cursor-pointer"
                        />
                    </div>
                )}
            </div>

            {/* Final Total */}
            <div className="flex justify-between py-4">
                <p>Total:</p>

                <p className="font-medium text-right">
                    {currency}
                    {coupon ? (totalPrice - discountAmount).toFixed(2) : totalPrice.toLocaleString()}
                </p>
            </div>

            <Button
                onClick={(e) =>
                    toast.promise(handlePlaceOrder(e), {
                        loading: 'Placing Order...',
                    })
                }
                className="w-full bg-primary dark:bg-secondary text-background"
            >
                Place Order
            </Button>

            {showAddressModal && (
                <AddressModal setShowAddressModal={setShowAddressModal}/>
            )}
        </div>
    )
}

export default OrderSummary