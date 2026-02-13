import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RelatedBlogSection } from "@/components/ui/sections/related-blog-section";
import {
  SINGLE_BLOG_QUERYResult,
} from "@/sanity.types";
import { getOthersBlog, getSingleBlog } from "@/sanity/functions/blog";
import { urlFor } from "@/sanity/lib/image";
import dayjs from "dayjs";
import {
  Calendar,
  Clock,
  Eye,
  User,
  Share2
} from "lucide-react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-10">
        <Image
          src={urlFor(value).width(1200).height(800).url()}
          alt={value.alt || "Blog image"}
          width={1200}
          height={800}
          className="rounded-2xl shadow-lg object-cover"
        />
        {value.caption && (
          <p className="text-center text-sm text-muted-foreground mt-3 italic">
            {value.caption}
          </p>
        )}
      </div>
    ),

    gallery: ({ value }: any) => (
      <div className="my-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {value.images?.map((img: any, i: number) => (
          <Image
            key={i}
            src={urlFor(img).width(800).height(600).url()}
            alt="Gallery image"
            width={800}
            height={600}
            className="rounded-xl object-cover hover:scale-105 transition"
          />
        ))}
      </div>
    ),
  },

  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-12 mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold mt-10 mb-4 border-b pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-sm leading-relaxed text-foreground/60 text-justify mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-6 italic text-sm my-8 text-foreground bg-muted/40 py-4 rounded-r-xl">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-primary">
        {children}
      </em>
    ),
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-primary hover:text-primary transition"
      >
        {children}
      </a>
    ),
    code: ({ value }: any) => (
      <pre className="bg-black text-green-500 p-6 rounded-2xl overflow-x-auto my-8 text-sm">
        <code>{value.code}</code>
      </pre>
    ),    
  },
};

const SingleBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = (await getSingleBlog(slug)) as SINGLE_BLOG_QUERYResult | null;
  if (!blog) return notFound();

  const relatedBlogs = await getOthersBlog(slug, 8);

  // Calculate reading time based on content length
  const calculateReadingTime = (body: unknown[]) => {
    if (!body) return 5;
    let wordCount = 0;
    body.forEach((block: unknown) => {
      if (typeof block === "object" && block !== null && "children" in block) {
        const blockObj = block as { _type?: string; children?: unknown[] };
        if (blockObj._type === "block" && blockObj.children) {
          blockObj.children.forEach((child: unknown) => {
            if (
              typeof child === "object" &&
              child !== null &&
              "text" in child
            ) {
              const childObj = child as { text?: string };
              if (childObj.text) {
                wordCount += childObj.text.split(" ").length;
              }
            }
          });
        }
      }
    });
    return Math.ceil(wordCount / 200); // 200 words per minute
  };

  const readingTime = calculateReadingTime(blog?.body || []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border">
        {blog?.mainImage && (
          <div className="relative w-full h-[50vh] min-h-[300px] max-h-[600px]">
            <Image
              src={urlFor(blog.mainImage).width(4000).height(2400).url()}
              alt={blog.title || ""}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-10 text-white">
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {blog?.blogcategories?.map((cat, i) => (
                <Badge key={i} className="bg-white/80 text-black backdrop-blur">
                  {cat.title}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl text-center md:text-6xl lg:text-5xl font-bold leading-tight">
              {blog.title}
            </h1>

            <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-white/80">
              <span className="flex gap-1.5 items-center">
                <Calendar className="w-4.5 h-4.5" />
                {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
              </span>
              <span className="flex gap-1.5 items-center">
                <Clock className="w-4.5 h-4.5" />
                {readingTime} min read
              </span>
              <span className="flex gap-1.5 items-center">
                <Eye className="w-4.5 h-4.5" />
                2.5K views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 gap-12">
        {/* Article */}
        <article className="mx-auto w-full">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={blog.body ?? []} components={components} />
          </div>
        </article>
      </section>

      {/* Author Section */}
      <section className="max-w-7xl mx-auto mt-10 border-t border-foreground/10 pt-12">
        {blog.author?.image ? (
          <div className="flex items-center gap-4">
            <div className="rounded-full border-2 border-primary overflow-hidden h-14 w-14">
              <Image
                src={urlFor(blog.author?.image).width(1000).height(1000).url()}
                alt={blog.author?.name || ""}
                width={1000}
                height={1000}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5 justify-center">
              <h3 className="text-sm font-semibold">
                {blog.author?.name}
              </h3>
              <p className="text-foreground/60 text-xs">
                Passionate writer sharing insights and stories.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4" />
            <h3 className="text-sm font-medium">
              {blog.author?.name}
            </h3>
          </div>
        )}
      </section>

      {/* Social Share Section */}
      <section className="max-w-3xl mx-auto my-10 text-center space-y-4">
        <h4 className="font-semibold flex gap-2 items-center justify-center text-lg">
          Share this article
          <Share2 className="w-5 h-5" />
        </h4>
        <div className="flex justify-center gap-4">
          <Button variant="outline">Twitter</Button>
          <Button variant="outline">LinkedIn</Button>
          <Button variant="outline">Facebook</Button>
        </div>
      </section>

      {/* Related Blogs Section */}
      <RelatedBlogSection blogs={relatedBlogs} />
    </div>
  );
};

export default SingleBlogPage;
