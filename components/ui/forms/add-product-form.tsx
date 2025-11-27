'use client'

import { useState } from "react"
import Image from "next/image"
import { toast } from "react-hot-toast" // <-- adjust this path based on your project setup
import { assets } from "@/data/assets"
import { Input } from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

interface ImageMap {
    [key: number]: File | null
}

export default function AddProductForm() {

    const categories = [
        'Electronics', 'Clothing', 'Home & Kitchen',
        'Beauty & Health', 'Toys & Games', 'Sports & Outdoors',
        'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others'
    ]

    const [images, setImages] = useState<ImageMap>({
        1: null,
        2: null,
        3: null,
        4: null
    })

    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: ""
    })

    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProductInfo(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const onImageChange = (key: number, fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return
        const file = fileList[0]
        setImages(prev => ({ ...prev, [key]: file }))
    }

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success("Product added successfully!")
        setLoading(false)
    }

    return (
        <form
            onSubmit={(e) =>
                toast.promise(onSubmitHandler(e), {
                    loading: "Adding Product..."
                })
            }
            className="text-foreground/60 mb-28"
        >
            <p className="mt-7">Product Images</p>

            <div className="flex flex-wrap justify-between gap-3 mt-4 max-w-sm">
                {Object.keys(images).map((key) => {
                    const index = Number(key)
                    const file = images[index]

                    return (
                        <label key={key} htmlFor={`images${key}`}>
                            <Image
                                width={300}
                                height={300}
                                className="h-15 w-20 border border-foreground/10 rounded cursor-pointer object-cover"
                                src={
                                    file
                                        ? URL.createObjectURL(file)
                                        : assets.upload_area
                                }
                                alt=""
                            />

                            <input
                                type="file"
                                accept="image/*"
                                id={`images${key}`}
                                hidden
                                onChange={(e) => onImageChange(index, e.target.files)}
                            />
                        </label>
                    )
                })}
            </div>

            <div className="flex flex-col gap-4 mt-6 max-w-sm">
                <Input
                    name="name"
                    value={productInfo.name}
                    required
                    onChange={onChangeHandler}
                    placeholder="Enter product name"
                />
                <Textarea
                    name="description"
                    value={productInfo.description}
                    required
                    onChange={onChangeHandler}
                    placeholder="Enter product description"
                    rows={5}
                />

            </div>

            <div className="flex gap-5 max-w-sm text-sm mt-4">
                <div className="flex flex-col gap-2">
                    <Label>Actual Price (MWK)</Label>
                    <Input
                        type="number"
                        name="mrp"
                        value={productInfo.mrp}
                        required
                        onChange={onChangeHandler}
                        placeholder="0"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Offer Price (MWK)</Label>
                    <Input
                        type="number"
                        name="price"
                        value={productInfo.price}
                        required
                        onChange={onChangeHandler}
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="max-w-sm mt-6">
                <Select
                    value={productInfo.category}
                    onValueChange={(value: string) =>
                        setProductInfo(prev => ({ ...prev, category: value }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="mt-8 max-w-sm w-full bg-primary dark:bg-secondary text-background"
            >
                Add Product
            </Button>

        </form>
    )
}