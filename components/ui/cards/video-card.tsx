'use client'

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface VideoCardProps {
    video: {
        id: string;
        name: string;
        thumbnail: string;
        duration: string;
        views: number;
    };
    onClick?: (id: string) => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
    return (
        <motion.div
            layout
            whileHover={{ scale: 1.03, zIndex: 10 }}
            whileTap={{ scale: 0.97 }}
            className="video-card break-inside-avoid p-0 mx-[8px] my-[10px]"
        >
            <Card
                className="overflow-hidden cursor-pointer shadow-lg rounded-md hover:shadow-2xl transition-shadow duration-300"
                onClick={() => onClick?.(video.id)}
            >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video">
                    <Image
                        src={video.thumbnail}
                        alt={video.name}
                        fill
                        className="object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
                </div>

                {/* Details */}
                <CardContent className="p-3 space-y-1">
                    <h3 className="text-sm font-semibold line-clamp-2 text-foreground">
                        {video.name}
                    </h3>
                    <p className="text-xs text-foreground/60">
                        {video.views.toLocaleString()} views
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}