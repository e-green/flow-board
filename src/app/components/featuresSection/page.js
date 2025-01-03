"use client";
import React from 'react';
import {
  Calendar,
  Binary,
  ListTodo,
  ClipboardList,
  Github,
  Users,
  Image as ImageIcon,
  FileText,
  UserPlus,
  GitBranch,
  MessageSquare,
  Bot
} from 'lucide-react';
import Header from "../../Header.js";
import Footer from "../../footer";

const FeaturesPage = () => {
  const features = [
    {
      title: "FlowBoard AI",
      icon: <Bot className="w-12 h-12 text-blue-900" />,
      description: "Intelligent task management powered by AI. Get smart suggestions for task prioritization, automated task categorization, and predictive analytics for better project planning.",
      subFeatures: [
        "Smart task prioritization",
        "Automated categorization",
        "Predictive project analytics",
        "AI-powered insights"
      ]
    },
    {
      title: "Weekly To-Do List",
      icon: <ListTodo className="w-12 h-12 text-blue-900" />,
      description: "Organize your week effectively with our intuitive to-do list. Track priorities, set deadlines, and manage your weekly goals all in one place.",
      subFeatures: [
        "Priority tracking",
        "Weekly goal setting",
        "Progress tracking",
        "Deadline management"
      ]
    },
    {
      title: "Personal Calendar Notes",
      icon: <Calendar className="w-12 h-12 text-blue-900" />,
      description: "Keep track of your personal notes and reminders with our calendar integration. Add detailed notes to specific dates and set reminders for important events.",
      subFeatures: [
        "Date-specific notes",
        "Event reminders",
        "Personal annotations",
        "Calendar sync"
      ]
    },
    {
      title: "Advanced Task Management",
      icon: <ClipboardList className="w-12 h-12 text-blue-900" />,
      description: "Comprehensive task management with multiple viewing options and rich media support.",
      subFeatures: {
        sections: [
          {
            title: "Multiple Views",
            items: ["List view", "Board view", "Gantt chart view"]
          },
          {
            title: "Rich Media Support",
            items: [
              "Image uploads",
              "File attachments",
              "Task assignees"
            ]
          }
        ]
      }
    },
    {
      title: "GitHub Integration",
      icon: <Github className="w-12 h-12 text-blue-900" />,
      description: "Seamlessly connect with your GitHub repositories. Monitor branches, commits, and team contributions directly within FlowBoard.",
      subFeatures: [
        "Repository overview",
        "Branch management",
        "Commit history",
        "Contributor tracking"
      ]
    },
    {
      title: "Collaboration Tools",
      icon: <Users className="w-12 h-12 text-blue-900" />,
      description: "Enhanced team collaboration features for effective communication and project management.",
      subFeatures: [
        "Real-time chat",
        "File sharing",
        "Team notifications",
        "Collaborative editing"
      ]
    }
  ];

  const renderSubFeatures = (subFeatures) => {
    if (Array.isArray(subFeatures)) {
      return (
        <ul className="space-y-2">
          {subFeatures.map((subFeature, idx) => (
            <li key={idx} className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {subFeature}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {subFeatures.sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="font-medium text-blue-800">{section.title}</h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Features Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">FlowBoard Features</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h2 className="text-xl font-semibold text-blue-900 ml-4">{feature.title}</h2>
                </div>
                
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                <div className="space-y-3">
                  {renderSubFeatures(feature.subFeatures)}
                </div>

                <button className="mt-6 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;