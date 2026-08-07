import { useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const formatSegment = (segment: string): string => {
  if (!segment) return '';
  // Handle specific IDs or UUIDs (often long or numeric)
  if (segment.length > 20 || /^\d+$/.test(segment)) {
    return 'Details';
  }
  // Convert kebab-case or snake_case to Title Case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useBreadcrumbs = (customMapping?: Record<string, string>): BreadcrumbItem[] => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  let currentPath = '';

  pathnames.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Check if there is a custom override for this specific path segment
    const label = customMapping?.[currentPath] || formatSegment(segment);
    
    // Don't add a link to the last item
    const isLast = index === pathnames.length - 1;

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    });
  });

  return breadcrumbs;
};
