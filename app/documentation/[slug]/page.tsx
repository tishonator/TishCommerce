import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDocumentationPageBySlug,
  getDocumentationPages,
  getDocumentationSlugs,
} from "../../utils/getDocumentation";
import { getLocalization } from "../../utils/getLocalization";

const localeData = getLocalization();

// Generate static paths for all documentation pages
export function generateStaticParams() {
  const slugs = getDocumentationSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for each documentation page
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = getDocumentationPageBySlug(params.slug);

  if (!page) {
    return {
      title: `Page Not Found - ${localeData.siteName}`,
    };
  }

  return {
    title: `${page.title} - Documentation - ${localeData.siteName}`,
    description: page.description,
  };
}

export default async function DocumentationDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = getDocumentationPageBySlug(params.slug);
  const allPages = getDocumentationPages();

  // If page not found, show 404
  if (!page) {
    notFound();
  }

  // Find current page index for navigation
  const currentIndex = allPages.findIndex((p) => p.slug === params.slug);
  const previousPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link
            href="/documentation"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Documentation
          </Link>
        </nav>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Page Header */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {page.title}
            </h1>
            <p className="text-lg text-gray-600">{page.description}</p>
          </header>

          {/* Markdown Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{
              __html: convertMarkdownToHtml(page.content),
            }}
          />
        </article>

        {/* Navigation: Previous/Next */}
        {(previousPage || nextPage) && (
          <nav className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousPage ? (
              <Link
                href={`/documentation/${previousPage.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
              >
                <div className="text-sm text-gray-500 mb-2">← Previous</div>
                <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {previousPage.title}
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            {nextPage && (
              <Link
                href={`/documentation/${nextPage.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-right group"
              >
                <div className="text-sm text-gray-500 mb-2">Next →</div>
                <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {nextPage.title}
                </div>
              </Link>
            )}
          </nav>
        )}

        {/* All Pages Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Documentation Pages
          </h2>
          <ul className="space-y-2">
            {allPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/documentation/${p.slug}`}
                  className={`block py-2 px-3 rounded transition-colors ${
                    p.slug === params.slug
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

/**
 * Simple markdown to HTML converter
 * Supports: headings, paragraphs, links, bold, italic, code blocks, inline code, lists
 */
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Code blocks (```...```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic (*text*)
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Unordered lists - wrap consecutive <li> tags in <ul>
  html = html.replace(/^\- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>(?:\n<li>[\s\S]*?<\/li>)*)/gm, "<ul>$1</ul>");

  // Ordered lists - wrap consecutive <li> tags in <ol>
  html = html.replace(/^\d+\. (.+)$/gm, "<li-ordered>$1</li-ordered>");
  html = html.replace(/(<li-ordered>[\s\S]*?<\/li-ordered>(?:\n<li-ordered>[\s\S]*?<\/li-ordered>)*)/gm, "<ol>$1</ol>");
  html = html.replace(/<li-ordered>/g, "<li>").replace(/<\/li-ordered>/g, "</li>");

  // Paragraphs (lines separated by blank lines)
  html = html.split("\n\n").map((para) => {
    para = para.trim();
    // Don't wrap if already wrapped in a tag
    if (para.startsWith("<") || para === "") {
      return para;
    }
    return `<p>${para.replace(/\n/g, "<br>")}</p>`;
  }).join("\n");

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
