"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { OTHERS_BLOG_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowRight } from "lucide-react";

type Props = {
  blogs: OTHERS_BLOG_QUERYResult;
};

export function RelatedBlogSection({ blogs }: Props) {
  if (!blogs?.length) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 border-t border-foreground/10">
      <div>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-light">More Related Stories</h2>
        </div>

        <Swiper
          spaceBetween={30}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            720: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {blogs.map((item) => {
            if (!item?._id) return null;

            return (
              <SwiperSlide key={item._id}>
                <Card className="overflow-hidden group transition-all duration-300 border-none bg-background">
                  {item.mainImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={urlFor(item.mainImage)
                          .width(1600)
                          .height(1000)
                          .url()}
                        alt={item.title ?? "Blog image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <CardContent className="p-0 space-y-3">
                    {item.publishedAt && (
                      <p className="text-sm text-muted-foreground">
                        {dayjs(item.publishedAt).format("MMM D, YYYY")}
                      </p>
                    )}

                    <h3 className="font-semibold line-clamp-2 truncate">
                      {item.title}
                    </h3>

                    {item.slug?.current && (
                      <Link className="flex text-sm items-center gap-1.5" href={`/blog/${item.slug.current}`}>
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}