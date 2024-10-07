import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import './dropDown.scss';

interface DropdownProps {
    label: string;
    options: string[];
    selectedValue?: string[]; // Optional selectedValue prop
    setData: any;
    isEditMode?: boolean;
    data?: any;
    className?: string; // Add className prop to accept custom styles
    setErrors?: (errors: any) => void; // Add setter for errors
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    setData,
    isEditMode,
    data,
    className,
    setErrors,
    selectedValue = [], // Default value to an empty array if no selectedValue is passed
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValue);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Populate selectedOptions in edit mode from selectedValue
    useEffect(() => {
        if (isEditMode && selectedValue) {
            setSelectedOptions(selectedValue);
        }
    }, [isEditMode, selectedValue]);

    const handleOptionChange = (option: string) => {
        // Update selected options
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );

        // Update the data object with the new selections
        setData((prev: { lessonTags: { [key: string]: string[] }[] }) => {
            const updatedLessonTags = prev.lessonTags.map((tagObj) => {
                const [key, value] = Object.entries(tagObj)[0];
                if (key === label) {
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

        // Clear the error for this tag if it exists
        setErrors &&
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [`tag-${label}`]: '', // Clear error specific to this tag
            }));
    };

    const handleRemoveTag = (option: string) => {
        // Remove the tag from selectedOptions
        setSelectedOptions((prev) => prev.filter((item) => item !== option));

        // Also update the parent data object to reflect removal
        setData((prev: { lessonTags: { [key: string]: string[] }[] }) => {
            const updatedLessonTags = prev.lessonTags.map((tagObj) => {
                const [key, value] = Object.entries(tagObj)[0];
                if (key === label) {
                    return {
                        [key]: value.filter((item) => item !== option),
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

    return (
        <div className="dropdown-container">
            <div className={`dropdown-header ${className}`} onClick={toggleDropdown}>
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
                        <input type="text" placeholder={label} readOnly className={className} />
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
