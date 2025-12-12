import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useProjects } from "@/hooks/useProjects";
import { usePosts } from "@/hooks/usePosts";
import { useHobbies } from "@/hooks/useHobbies";
import {
  ProjectCardSkeleton,
  BlogCardSkeleton,
} from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";

export const Home: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useProjects({
    featured: true,
  });
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: hobbies, isLoading: hobbiesLoading } = useHobbies();

  const featuredProjects = projects?.slice(0, 3) || [];
  const featuredPosts = posts?.slice(0, 2) || [];
  const featuredHobbies = hobbies?.slice(0, 2) || [];

  return (
    <>
      <SEO
        title="Home"
        description="Welcome to my portfolio showcasing my projects, blog posts, and hobbies"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-5xl font-bold">
                  P
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Hi, I'm Your Name
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Full Stack Developer | Tech Enthusiast | Creative Thinker
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                I build innovative web applications and share my knowledge
                through writing. Explore my work, read my thoughts, and discover
                my passions.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  View Projects
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  About Me
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Projects
              </h2>
              <Link
                to="/projects"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                View All →
              </Link>
            </div>

            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Link to={`/projects/${project.slug}`}>
                      <Card hover className="h-full p-6">
                        {project.images[0] && (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="primary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest Blog Posts
              </h2>
              <Link
                to="/blog"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                View All →
              </Link>
            </div>

            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BlogCardSkeleton />
                <BlogCardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card hover className="h-full overflow-hidden">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {formatDate(post.publish_date)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Hobbies */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Hobbies
              </h2>
              <Link
                to="/hobbies"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                View All →
              </Link>
            </div>

            {hobbiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BlogCardSkeleton />
                <BlogCardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredHobbies.map((hobby) => (
                  <Card key={hobby.id} hover className="p-6">
                    {hobby.images[0] && (
                      <img
                        src={hobby.images[0]}
                        alt={hobby.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {hobby.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {hobby.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
