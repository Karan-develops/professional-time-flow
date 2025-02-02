import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border-t border-gray-700 py-4 mt-8">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Time Flow Task Manager. All rights
          reserved. By Karan Aggarwal
        </p>
        <Link
          href="https://github.com/Karan-develops/professional-time-flow"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <Github className="w-6 h-6" />
        </Link>
      </div>
    </footer>
  );
}
