type CategoryType = 'workshop' | 'charity' | 'social' | 'networking' | 'conference' | 'other';

interface CategoryBadgeProps {
  category: CategoryType;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const categoryStyles: Record<CategoryType, string> = {
    workshop: 'bg-blue-100 text-blue-800',
    charity: 'bg-green-100 text-green-800',
    social: 'bg-purple-100 text-purple-800',
    networking: 'bg-yellow-100 text-yellow-800',
    conference: 'bg-indigo-100 text-indigo-800',
    other: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`category-badge ${categoryStyles[category]}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
};

export default CategoryBadge;