"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#308970] border-t border-[#F2F1EE]/30 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#F2F1EE] rounded-lg flex items-center justify-center">
                <span className="text-[#308970] font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-[#F2F1EE]">
                LegalEagle
              </span>
            </div>
            <p className="text-sm font-bold text-[#F2F1EE] mb-4 max-w-md">
              Professional-grade AI forensic analysis for legal documents. Don't
              sign what you don't understand.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-[#F2F1EE] hover:opacity-80 transition-opacity"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#F2F1EE] hover:opacity-80 transition-opacity"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#F2F1EE] hover:opacity-80 transition-opacity"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#F2F1EE] hover:opacity-80 transition-opacity"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-[#F2F1EE] mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/analyze"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Document Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-[#F2F1EE] mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F2F1EE]/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-bold text-[#F2F1EE] mb-4 md:mb-0">
            © {new Date().getFullYear()} LegalEagle. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm font-bold text-[#F2F1EE] hover:underline transition-all"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
