import React, { useState } from "react";
import { Users, Book, Building2, UserCog, History, ClipboardList } from "lucide-react";
import { getCurrentUser } from "../utils/auth.storage";
import AuthorsSection from "../components/authors/AuthorsSection";
import PublishersSection from "../components/publishers/PublishersSection";

const AdminDashboard = () => {
  const currentUser = getCurrentUser();
  const [activeSection, setActiveSection] = useState("authors");

  if (!currentUser) return null;

  const sections = [
    { id: "authors", label: "Authors", icon: Users },
    { id: "publishers", label: "Publishers", icon: Building2 },
    { id: "users", label: "Users", icon: UserCog },
    { id: "books", label: "Books", icon: Book },
    { id: "loans", label: "Loans", icon: ClipboardList },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="p-6 ml-0 lg:ml-80">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenido, {currentUser.fullname}. Gestión administrativa de la biblioteca.
        </p>
      </div>

      {/* Internal Navigation */}
      <div className="flex flex-wrap gap-3 mb-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isActive
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {activeSection === "authors" && <AuthorsSection />}
        {activeSection === "publishers" && <PublishersSection />}
        {activeSection === "users" && <div>CRUD Users aquí</div>}
        {activeSection === "books" && <div>CRUD Books aquí</div>}
        {activeSection === "loans" && <div>CRUD Loans aquí</div>}
        {activeSection === "history" && <div>CRUD History aquí</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
