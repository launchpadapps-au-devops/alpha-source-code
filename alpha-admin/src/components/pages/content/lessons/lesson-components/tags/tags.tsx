import React from 'react';
import './tags.scss';

interface TagProps {
    label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
    return <span className="tag">{label}</span>;
};

interface Category {
    [key: string]: string[] | undefined; // Allow undefined for flexibility
}

interface TagsComponentProps {
    categories: Category[];
}

const TagsComponent: React.FC<TagsComponentProps> = ({ categories }) => {
    return (
        <div className="tags-component">
            {categories.map((category, index) => (
                <div key={index} className="tag-category">
                    {Object.entries(category).map(([title, tags], idx) => (
                        <div key={idx}>
                            <div className="category-title">{title}</div>
                            <div className="tags">
                                {(tags || []).map(
                                    (
                                        tag,
                                        tagIdx // Use default empty array if tags are undefined
                                    ) => (
                                        <Tag key={tagIdx} label={tag} />
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TagsComponent;
