import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ContactFormData } from "@/types";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const About: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // TODO: Implement Supabase Edge Function for contact form
    console.log("Contact form data:", data);
    alert("Thank you for your message! (Form submission to be implemented)");
    reset();
  };

  return (
    <>
      <SEO
        title="About"
        description="Learn more about me, my skills, and how to get in touch"
      />

      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            About Me
          </h1>

          {/* Bio Section */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <p>
                Hi! I'm a passionate full-stack developer with expertise in
                modern web technologies. I love building elegant solutions to
                complex problems and sharing my knowledge with the community.
              </p>
              <p>
                With years of experience in web development, I specialize in
                creating responsive, user-friendly applications using React,
                TypeScript, and modern backend technologies.
              </p>
            </motion.div>
          </section>

          {/* Skills Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "React",
                "TypeScript",
                "Node.js",
                "PostgreSQL",
                "Tailwind CSS",
                "Next.js",
              ].map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {skill}
                  </h3>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Resume Download */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Resume
            </h2>
            <Button>Download Resume (PDF)</Button>
          </section>

          {/* Contact Form */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-2xl space-y-6"
            >
              <Input
                {...register("name")}
                label="Name"
                error={errors.name?.message}
                placeholder="Your name"
              />
              <Input
                {...register("email")}
                type="email"
                label="Email"
                error={errors.email?.message}
                placeholder="your.email@example.com"
              />
              <Textarea
                {...register("message")}
                label="Message"
                error={errors.message?.message}
                placeholder="Your message..."
                rows={6}
              />
              <Button type="submit" loading={isSubmitting}>
                Send Message
              </Button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
};
