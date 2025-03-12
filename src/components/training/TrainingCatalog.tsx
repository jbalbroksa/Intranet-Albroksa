import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  completionRate?: number;
  isRequired?: boolean;
}

const MOCK_COURSES: TrainingCourse[] = [
  {
    id: "1",
    title: "Insurance Policy Fundamentals",
    description: "Learn the basics of insurance policies and coverage types",
    category: "Fundamentals",
    duration: "2 hours",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80",
    isRequired: true,
    completionRate: 100,
  },
  {
    id: "2",
    title: "Advanced Claims Processing",
    description: "Master the process of handling complex insurance claims",
    category: "Claims",
    duration: "4 hours",
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&q=80",
    completionRate: 45,
  },
  {
    id: "3",
    title: "Customer Service Excellence",
    description: "Techniques for providing exceptional customer service",
    category: "Customer Service",
    duration: "3 hours",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80",
    isRequired: true,
    completionRate: 0,
  },
  {
    id: "4",
    title: "Insurance Sales Strategies",
    description: "Effective techniques for selling insurance products",
    category: "Sales",
    duration: "5 hours",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80",
    completionRate: 75,
  },
  {
    id: "5",
    title: "Regulatory Compliance Training",
    description: "Stay up-to-date with insurance regulations and compliance",
    category: "Compliance",
    duration: "6 hours",
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80",
    isRequired: true,
    completionRate: 20,
  },
  {
    id: "6",
    title: "Digital Marketing for Insurance",
    description: "Learn how to market insurance products in the digital age",
    category: "Marketing",
    duration: "4 hours",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=500&q=80",
    completionRate: 0,
  },
];

const CATEGORIES = [
  "All Categories",
  "Fundamentals",
  "Claims",
  "Customer Service",
  "Sales",
  "Compliance",
  "Marketing",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function TrainingCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [courses, setCourses] = useState(MOCK_COURSES);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === "All Levels" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Training Catalog</h1>
        <Button>My Learning Dashboard</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full md:w-[150px]">
            <Award className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No courses found. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              />
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}
                  >
                    {course.level}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                {course.isRequired && (
                  <Badge className="mt-2 bg-red-100 text-red-800 hover:bg-red-100">
                    Required
                  </Badge>
                )}
                {typeof course.completionRate === "number" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  {course.completionRate === 0
                    ? "Start Course"
                    : course.completionRate === 100
                      ? "Review Course"
                      : "Continue Course"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
