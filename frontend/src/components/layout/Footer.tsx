import * as React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Shield, HelpCircle, FileText, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border-subtle mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-border-subtle">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight text-gradient font-sans">
                CampusLens
              </span>
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              India's premier college discovery, prediction, and comparison platform helping students make informed higher education decisions.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/colleges" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold">
                  Search Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold">
                  Compare Matrices
                </Link>
              </li>
              <li>
                <Link href="/predictor" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold">
                  Exam Predictors
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold">
                  Q&A Discussion Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Support
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-on-surface-variant font-semibold">
                <HelpCircle size={16} />
                <Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link>
              </li>
              <li className="flex items-center gap-2 text-sm text-on-surface-variant font-semibold">
                <Shield size={16} />
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li className="flex items-center gap-2 text-sm text-on-surface-variant font-semibold">
                <FileText size={16} />
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li className="flex items-center gap-2 text-sm text-on-surface-variant font-semibold">
                <Info size={16} />
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm text-on-surface-variant font-semibold">
                <Mail size={16} className="text-outline" />
                <a href="mailto:support@campuslens.in" className="hover:text-primary transition-colors">
                  support@campuslens.in
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-on-surface-variant font-semibold">
                <Phone size={16} className="text-outline" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-on-surface-variant font-semibold">
                <MapPin size={16} className="text-outline" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-xs text-outline font-semibold">
            &copy; {new Date().getFullYear()} CampusLens. All rights reserved.
          </p>
          <p className="text-xs text-outline font-semibold">
            Handcrafted with bold Inter font aesthetics · India
          </p>
        </div>
      </div>
    </footer>
  );
};
