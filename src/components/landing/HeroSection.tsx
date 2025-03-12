import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export default function HeroSection({ isLoggedIn = false }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-6"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Insurance Franchise{" "}
            <span className="text-primary">Intranet Platform</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground">
            A modern, intuitive platform that centralizes company content,
            manuals, tutorials, and internal communication.
          </p>

          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div className="pt-4">
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="absolute -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
            alt="Insurance Professionals"
            className="rounded-lg shadow-xl w-full object-cover max-h-[500px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
