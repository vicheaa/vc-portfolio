import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Public Pages
import { Home } from "@/pages/Home";
import { Projects } from "@/pages/Projects";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { Hobbies } from "@/pages/Hobbies";
import { About } from "@/pages/About";

// Admin Pages
import { Login } from "@/pages/admin/Login";
import { Dashboard } from "@/pages/admin/Dashboard";
import { ProjectsManager } from "@/pages/admin/ProjectsManager";
import { PostsManager } from "@/pages/admin/PostsManager";
import { HobbiesManager } from "@/pages/admin/HobbiesManager";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Header />
                        <Home />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <>
                        <Header />
                        <Projects />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/projects/:slug"
                    element={
                      <>
                        <Header />
                        <ProjectDetail />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/blog"
                    element={
                      <>
                        <Header />
                        <Blog />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/blog/:slug"
                    element={
                      <>
                        <Header />
                        <BlogPost />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/hobbies"
                    element={
                      <>
                        <Header />
                        <Hobbies />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <>
                        <Header />
                        <About />
                        <Footer />
                      </>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/projects"
                    element={
                      <ProtectedRoute>
                        <ProjectsManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/posts"
                    element={
                      <ProtectedRoute>
                        <PostsManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/hobbies"
                    element={
                      <ProtectedRoute>
                        <HobbiesManager />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
