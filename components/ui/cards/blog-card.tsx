"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/lib/image";
import { GET_ALL_BLOGResult, SINGLE_BLOG_QUERYResult } from "@/sanity.types";
import { ArrowRight, Calendar, Clock, Eye } from "lucide-react";
import dayjs from "dayjs";
import { Separator } from "../separator";

/* =====================================================
   Types (Aligned with FILTERED_blog_PROJECTION)
===================================================== */

type BlogCardBlog = GET_ALL_BLOGResult[number] | NonNullable<SINGLE_BLOG_QUERYResult>;

interface BlogCardProps {
  blog: BlogCardBlog;
  style?: React.CSSProperties;
}

/* =====================================================
   Component
===================================================== */

export function BlogCard({ blog, style }: BlogCardProps) {
  const calculateReadingTime = (title: string) => {
    const wordsPerMinute = 200;
    const wordCount = title.split(" ").length * 20; // Estimate based on title
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const extractDescription = (
    body: BlogCardBlog["body"],
    maxLength: number = 150
  ) => {
    if (!body || !Array.isArray(body))
      return "Discover insights and stories that matter.";

    let description = "";
    for (const block of body) {
      if (block._type === "block" && block.children) {
        for (const child of block.children) {
          if (child.text && child._type === "span") {
            description += child.text + " ";
            if (description.length > maxLength) {
              return description.substring(0, maxLength).trim() + "...";
            }
          }
        }
      }
    }

    return (
      description.trim() ||
      "Read our latest insights and discover new perspectives."
    );
  };

  return (
    <Card
      className="group bg-background/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 rounded-none pt-0"
      style={style}
    >
      {blog?.mainImage && (
        <div className="relative overflow-hidden aspect-16/10">
          <Image
            src={urlFor(blog.mainImage).url()}
            alt={blog?.title || "Blog image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          {blog?.blogcategories && blog.blogcategories.length > 0 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/40 hover:bg-primary/20 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                {blog.blogcategories[0]?.title}
              </Badge>
            </div>
          )}

          {/* Overlay Link */}
          <Link
            href={`/blog/${blog?.slug?.current}`}
            className="absolute inset-0 z-10"
            aria-label={`Read ${blog?.title}`}
          />
        </div>
      )}

      <CardContent className="p-0">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-background0 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {dayjs(blog?.publishedAt).format("MMM D, YYYY")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {calculateReadingTime(blog?.title || "")} min read
            </span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/blog/${blog?.slug?.current}`}
          className="block group/title mb-3"
        >
          <h3 className="text-lg sm:text-lg font-bold text-foreground/60 group-hover/title:text-foreground/60 transition-colors duration-200 line-clamp-2 leading-snug hover:text-foreground">
            {blog?.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-foreground/60 text-xs leading-relaxed mb-4 line-clamp-3">
          {extractDescription(blog?.body || [])}
        </p>

        <Separator className="my-4" />

        {/* Footer with Read More */}
        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${blog?.slug?.current}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary/20 hover:text-primary/60 transition-colors duration-200 group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
          <div className="flex items-center gap-1 text-xs text-foreground/40">
            <Eye className="w-3.5 h-3.5" />
            <span>{Math.floor(Math.random() * 500) + 100}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}