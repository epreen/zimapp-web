import Link from 'next/link'
import React from 'react'

const HeaderBadge = () => {
  return (
    <div className='bg-primary text-background text-center py-2 px-4'>
        <div className="flex items-center justify-center gap-2 text-sm">
            <span className='font-medium'>🎉 Get your Best Deals</span>
            <Link
                href={"/products"}
                className='underline text-background/60 font-light hover:text-secondary transition-colors'
            >
                Buy Now →
            </Link>
        </div>
    </div>
  )
}

export default HeaderBadge