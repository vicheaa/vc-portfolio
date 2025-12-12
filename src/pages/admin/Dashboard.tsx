import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { usePosts } from "@/hooks/usePosts";
import { useHobbies } from "@/hooks/useHobbies";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SEO } from "@/components/shared/SEO";

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { data: projects } = useProjects();
  const { data: posts } = usePosts({ status: undefined }); // Get all posts including drafts
  const { data: hobbies } = useHobbies();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <SEO title="Admin Dashboard" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Projects
                </h3>
                <p className="text-4xl font-bold text-primary-600">
                  {projects?.length || 0}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Blog Posts
                </h3>
                <p className="text-4xl font-bold text-primary-600">
                  {posts?.length || 0}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Hobbies
                </h3>
                <p className="text-4xl font-bold text-primary-600">
                  {hobbies?.length || 0}
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Quick Links */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/projects">
                <Button className="w-full">Manage Projects</Button>
              </Link>
              <Link to="/admin/posts">
                <Button className="w-full">Manage Blog Posts</Button>
              </Link>
              <Link to="/admin/hobbies">
                <Button className="w-full">Manage Hobbies</Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    </>
  );
};
