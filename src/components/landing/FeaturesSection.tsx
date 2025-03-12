import { BookOpen, FileText, MessageSquare, Shield } from "lucide-react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure Access",
      description:
        "Role-based permissions with two-factor authentication for maximum security.",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Document Repository",
      description:
        "Centralized storage for all company documents with version control.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Knowledge Base",
      description:
        "Comprehensive manuals and tutorials for franchise operations.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Communication Tools",
      description:
        "Integrated forums, chat, and notification system for team collaboration.",
    },
  ];

  return (
    <section className="py-12 md:py-24 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Platform Features
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage your insurance franchise operations in
          one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
