import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { usePosts } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Moon, SquareCode, Sun } from "lucide-react";

export const Home: React.FC = () => {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"writing" | "favorites">("writing");

  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <>
      <SEO
        title="Home"
        description="Welcome to Saro Sereyvichea's portfolio - Full Stack Developer from Cambodia building beautiful web applications"
        keywords={["portfolio", "home", "developer portfolio"]}
      />

      <main className="flex-1 py-12">
        <div className="container max-w-2xl mx-auto px-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                  {/* <span>V</span> */}
                  <SquareCode className="w-6 h-6" />
                </div>
              </div>

              {/* Name */}
              <div>
                <h1 className="khmer-font text-xl font-medium text-gray-900 dark:text-white mb-1">
                  សារូ សិរីវិជ្ជា
                </h1>
                <h1>SARO SEREYVICHEA</h1>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-6 mt-6 mb-10">
              <button
                onClick={() => setActiveTab("writing")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "writing"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Writing
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "favorites"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={toggleTheme}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>}
              </button>
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] text-justify">
              <p>
                I'm a full-stack developer building{" "}
                <a href="#" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  web applications
                </a>{" "}
                and{" "}
                <a href="#" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  digital products
                </a>
                . Over the past years, I've focused on creating beautiful software that people love to use.
              </p>

              <p>
                I regularly{" "}
                <Link to="/blog" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  write
                </Link>{" "}
                about my development philosophy, approach to building products, and hard-won lessons from my journey as a developer. These essays are my way of thinking through challenges and sharing what I've learned along the way.
              </p>

              <p>
                When I'm not coding, I love exploring{" "}
                <Link to="/hobbies" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  photography
                </Link>{" "}
                and capturing everyday moments. There's something special about slowing down and observing the world around us.
              </p>

              <p>
                Always open to interesting conversations about design, startups, and technology.{" "}
                <Link to="/about" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  Say hello
                </Link>{" "}
                or follow me on{" "}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  GitHub
                </a>
                ,{" "}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  X
                </a>
                , or{" "}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white underline decoration-1 underline-offset-2 italic font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  LinkedIn
                </a>
                .
              </p>
            </div>

            {/* Colored Dots Divider */}
            <div className="flex justify-center gap-2 my-12">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>

            {/* Blog Posts List */}
            {activeTab === "writing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="flex justify-between items-start gap-4 py-3 group"
                    >
                      <span className="text-gray-900 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
                        {post.title}
                      </span>
                      <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0 text-right">
                        {formatDate(post.publish_date)}
                      </span>
                    </Link>
                  ))
                )}

                {recentPosts.length > 0 && (
                  <Link
                    to="/blog"
                    className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    View all posts →
                  </Link>
                )}
              </motion.div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Link
                  to="/projects"
                  className="flex justify-between items-center py-2 group"
                >
                  <span className="text-gray-900 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    My Projects
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
                </Link>
                <Link
                  to="/hobbies"
                  className="flex justify-between items-center py-2 group"
                >
                  <span className="text-gray-900 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    My Hobbies
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
                </Link>
                <Link
                  to="/about"
                  className="flex justify-between items-center py-2 group"
                >
                  <span className="text-gray-900 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    About Me
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
};
