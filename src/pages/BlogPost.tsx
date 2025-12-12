import React from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/shared/SEO";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { usePost } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePost(slug!);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post not found
          </h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt || ""}
        type="article"
        image={post.featured_image || undefined}
      />

      <main className="flex-1 py-12">
        <article className="container max-w-4xl">
          <Link
            to="/blog"
            className="text-primary-600 hover:text-primary-700 mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <time className="text-gray-600 dark:text-gray-400">
              {formatDate(post.publish_date)}
            </time>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>

          <MarkdownRenderer content={post.content} />
        </article>
      </main>
    </>
  );
};
