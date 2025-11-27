"use client"

import { motion } from "framer-motion"

interface SelectionGridProps {
    label: string
    options: string[]
    active: string
    onSelect: (value: any) => void
}

export function SelectionGrid({ label, options, active, onSelect }: SelectionGridProps) {
    return (
        <div className="space-y-2">
            <p className="font-medium">{label}</p>

            <div className="grid grid-cols-2 gap-3">
                {options.map((option) => (
                    <motion.div
                        key={option}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(option)}
                        className={`
              p-4 rounded-xl border cursor-pointer text-center
              ${active === option
                            ? "bg-primary dark:bg-secondary text-background"
                            : "bg-muted"}
            `}
                    >
                        {option}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
