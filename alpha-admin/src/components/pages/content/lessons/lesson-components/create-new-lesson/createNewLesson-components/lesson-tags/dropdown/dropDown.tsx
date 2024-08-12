import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import './dropDown.scss';

interface DropdownProps {
    label: string;
    options: string[];
    setData: any;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, setData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionChange = (option: string) => {
        console.log('option', option);
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
        setData((prev: { lessonTags: { [key: string]: string[] }[] }) => {
            const updatedLessonTags = prev.lessonTags.map((tagObj) => {
                const [key, value] = Object.entries(tagObj)[0];

                // Make sure 'label' is in the correct format
                const normalizedLabel = label.toLowerCase().replace(/ /g, '_');
                console.log('normalizedLabel', normalizedLabel, key);

                if (key === normalizedLabel) {
                    return {
                        [key]: value.includes(option)
                            ? value.filter((item) => item !== option)
                            : [...value, option],
                    };
                }

                return tagObj;
            });

            return {
                ...prev,
                lessonTags: updatedLessonTags,
            };
        });
    };

    const handleRemoveTag = (option: string) => {
        setSelectedOptions((prev) => prev.filter((item) => item !== option));
    };

    return (
        <div className="dropdown-container">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <div className="selected-tags">
                    {selectedOptions.map((option) => (
                        <div key={option} className="tag">
                            <CloseIcon
                                className="remove-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(option);
                                }}
                            />
                            {option}
                        </div>
                    ))}
                    {selectedOptions.length < 1 && (
                        <input type="text" placeholder={label} readOnly />
                    )}
                </div>
                <AddIcon className="add-icon" />
            </div>
            {isOpen && (
                <div className="dropdown">
                    {options.map((option) => (
                        <label key={option} className="dropdown-option">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionChange(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
