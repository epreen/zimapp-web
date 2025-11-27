'use client'


import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface TitleProps {
    title: string,
    description: string,
    visibleButton: boolean,
    href?: string
}

const Title = ({ title, description, visibleButton = true, href = '' }: TitleProps) => {

    return (
        <div className='flex flex-col items-center'>
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
            >
                {title}
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='flex items-center justify-center'>
                <p className='flex gap-5 mt-2 text-sm text-slate-400 max-w-lg text-center'>
                    {description}
                    {
                        visibleButton && (
                            <Link href={'/marketplace'}>
                                <button className='cursor-pointer text-primary/50 hover:text-primary dark:text-secondary/50 dark:hover:text-secondary flex items-center gap-1'>
                                    View more
                                    <ArrowRight size={14}/>
                                </button>
                            </Link>
                        )
                    }
                </p>
            </motion.div>
        </div>
    )
}

export default Title