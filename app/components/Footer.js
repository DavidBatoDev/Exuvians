'use client';

import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';

export default function Footer() {
  return (
    <footer className="bg-[#05184A] text-white py-8">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/browse-barangay" className="hover:underline">
                Browse Barangay
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:underline">
                Signup
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Information</h3>
          <p className="text-sm">
            Barangay Office
            <br />
            City, State, ZIP
            <br />
            Philippines
          </p>
          <p className="mt-2 text-sm">
            Email: <a href="mailto:info@barangay.gov" className="hover:underline">info@barangay.gov</a>
          </p>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Social Media</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75"
            >
              <FacebookIcon fontSize="large" />
            </a>
            <a
              href="https://www.website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75"
            >
              <LanguageIcon fontSize="large" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Barangay System. All rights reserved.
      </div>
    </footer>
  );
}
