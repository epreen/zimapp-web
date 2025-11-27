"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    onSubmit?: () => void;
    onReset?: () => void;
    children?: React.ReactNode;
}

/**
 * A reusable animated filtering modal using shadcn Dialog, GSAP, and Framer Motion.
 * Designed for ZiMAPP’s filtering UI across marketplace, dashboard, or listings.
 */
const FilterModal: React.FC<FilterModalProps> = ({
                                                     open,
                                                     onOpenChange,
                                                     title = "Filters",
                                                     onSubmit,
                                                     onReset,
                                                     children,
                                                 }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && modalRef.current) {
            gsap.fromTo(
                modalRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <DialogContent
                        ref={modalRef}
                        className="max-w-xl w-full p-0 overflow-hidden rounded-2xl bg-white dark:bg-[#23224E] shadow-lg"
                    >
                        {/* Header */}
                        <DialogHeader className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {title}
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onOpenChange(false)}
                                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </Button>
                        </DialogHeader>

                        {/* Body */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="p-5 space-y-6 max-h-[70vh] overflow-y-auto"
                        >
                            {children ? (
                                children
                            ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Add your filtering sections here as children components.
                                </p>
                            )}
                        </motion.div>

                        {/* Footer */}
                        <DialogFooter className="flex items-center justify-end gap-4 p-5 border-t border-gray-100 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={onReset}
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={onSubmit}
                                className="bg-[#23224E] hover:bg-[#1d1c3f] text-white"
                            >
                                Apply Filters
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    );
};

export default FilterModal;