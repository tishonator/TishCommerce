import type { Metadata } from "next";
import Link from "next/link";
import { getDocumentationPages } from "../utils/getDocumentation";
import { getLocalization } from "../utils/getLocalization";

const localeData = getLocalization();

// Set page metadata
export const metadata: Metadata = {
  title: `Documentation - ${localeData.siteName}`,
  description: "Browse TishCommerce documentation and guides",
};

export default function DocumentationPage() {
  const documentationPages = getDocumentationPages();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about setting up and customizing TishCommerce
          </p>
        </div>

        {/* Documentation Pages List */}
        {documentationPages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">
              No documentation pages found. Add pages to{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                configs/documentation-pages.json
              </code>
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {documentationPages.map((page) => (
              <Link
                key={page.slug}
                href={`/documentation/${page.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 block group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {page.title}
                    </h2>
                    <p className="text-gray-600">{page.description}</p>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
