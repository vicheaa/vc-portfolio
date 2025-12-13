import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePosts } from "@/hooks/usePosts";
import { BlogCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate, truncateText } from "@/lib/utils";

export const Blog: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: posts, isLoading } = usePosts({
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  const allTags = Array.from(new Set(posts?.flatMap((p) => p.tags) || []));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Read Vichea's thoughts on web development, programming tutorials, Laravel, React, and technology insights"
        keywords={["blog", "programming", "tutorials", "Laravel", "React", "TypeScript"]}
      />

      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Blog
          </h1>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Filter by tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="transition-opacity hover:opacity-80"
                  >
                    <Badge
                      variant={
                        selectedTags.includes(tag) ? "primary" : "default"
                      }
                    >
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blog Posts */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <Card hover className="h-full overflow-hidden">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {formatDate(post.publish_date)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt || truncateText(post.content, 150)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {posts && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No blog posts found.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
