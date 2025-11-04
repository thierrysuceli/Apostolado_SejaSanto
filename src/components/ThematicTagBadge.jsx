import React from 'react';

const ThematicTagBadge = ({ tag, size = 'sm' }) => {
  if (!tag) return null;

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-1.5',
    lg: 'text-lg px-5 py-2'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]}`}
      style={{
        backgroundColor: tag.color + '20',
        color: tag.color,
        border: `1px solid ${tag.color}40`
      }}
      title={tag.description || tag.name}
    >
      {tag.name}
    </span>
  );
};

export default ThematicTagBadge;
