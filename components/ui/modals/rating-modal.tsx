'use client'

import { Star, XIcon } from 'lucide-react';
import React, { useState, Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

interface RatingModalData {
    orderId: string;
    productId: string;
}

interface RatingModalInterface {
    ratingModal: RatingModalData | null;
    setRatingModal: Dispatch<SetStateAction<RatingModalData | null>>;
}

const RatingModal = ({ ratingModal, setRatingModal }: RatingModalInterface) => {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            throw new Error('Please select a rating');
        }
        if (review.length < 5) {
            throw new Error('Write a short review');
        }

        // Simulate async call
        await new Promise(res => setTimeout(res, 600));

        // Close modal
        setRatingModal(null);
    };

    if (!ratingModal) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-xs">
            <div className="bg-background p-8 rounded-lg shadow-lg w-96 relative">

                <button
                    onClick={() => setRatingModal(null)}
                    className="absolute top-3 right-3 text-foreground/60 hover:text-foreground/80"
                >
                    <XIcon size={20} />
                </button>

                <h2 className="text-xl font-light text-foreground mb-4">
                    Rate Product
                </h2>

                <div className="flex items-center justify-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${
                                rating > i
                                    ? "text-primary dark:text-secondary fill-current"
                                    : "text-foreground/40"
                            }`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>

                <textarea
                    className="w-full p-2 border border-foreground/20 rounded-md mb-4 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-secondary"
                    placeholder="Write your review"
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />

                <button
                    onClick={() =>
                        toast.promise(
                            handleSubmit(),
                            {
                                loading: 'Submitting...',
                                success: 'Thank you for your rating!',
                                error: (err) => err.message,
                            }
                        )
                    }
                    className="w-full bg-primary dark:bg-secondary text-background py-2 rounded-md transition"
                >
                    Submit Rating
                </button>

            </div>
        </div>
    );
};

export default RatingModal;