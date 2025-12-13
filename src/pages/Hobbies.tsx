import React from "react";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { Card } from "@/components/ui/Card";
import { useHobbies } from "@/hooks/useHobbies";
import { formatDate } from "@/lib/utils";

export const Hobbies: React.FC = () => {
  const { data: hobbies, isLoading } = useHobbies();

  return (
    <>
      <SEO
        title="Hobbies"
        description="Discover Vichea's personal interests, hobbies, and creative pursuits beyond coding"
        keywords={["hobbies", "interests", "photography", "creative"]}
      />

      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            My Hobbies
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {hobbies?.map((hobby, index) => (
                <motion.div
                  key={hobby.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Card hover className="p-6">
                    {hobby.images[0] && (
                      <img
                        src={hobby.images[0]}
                        alt={hobby.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {hobby.title}
                    </h2>
                    {hobby.date && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {formatDate(hobby.date)}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                      {hobby.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {hobbies && hobbies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No hobbies to display yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
