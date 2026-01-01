/**
 * Convert a category name to a URL-friendly slug
 * Examples:
 * - "WordPress Themes" → "wordpress-themes"
 * - "Forms" → "forms"
 * - "eCommerce Plugins" → "ecommerce-plugins"
 */
export function categoryToSlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

/**
 * Convert a slug back to a category name
 * This tries to match against actual category names from products
 * Examples:
 * - "wordpress-themes" → "WordPress Themes"
 * - "forms" → "Forms"
 */
export function slugToCategory(slug: string, categories: string[]): string | null {
  // Convert slug to lowercase for comparison
  const normalizedSlug = slug.toLowerCase();

  // Find the matching category by comparing slugified versions
  const matchedCategory = categories.find(
    (category) => categoryToSlug(category) === normalizedSlug
  );

  return matchedCategory || null;
}

/**
 * Get all unique category slugs from a list of category names
 */
export function getAllCategorySlugs(categories: string[]): string[] {
  return categories.map((category) => categoryToSlug(category));
}
