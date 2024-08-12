// src/components/TagsComponent.tsx
import React from 'react';
import './tags.scss';

interface TagProps {
  label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return <span className="tag">{label}</span>;
};

interface TagsComponentProps {
  categories: {
    title: string;
    tags: string[];
  }[];
}

const TagsComponent: React.FC<TagsComponentProps> = ({ categories }) => {
  return (
    <div className="tags-component">
      {categories.map((category, index) => (
        <div key={index} className="tag-category">
          <div className="category-title">{category.title}</div>
          <div className="tags">
            {category.tags.map((tag, idx) => (
              <Tag key={idx} label={tag} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagsComponent;
