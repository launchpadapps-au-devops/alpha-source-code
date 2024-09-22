import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import './dropDown.scss';


interface DropdownProps {
    label: string;
    options: string[];
    setData: any;
    isEditMode?: boolean;
    data?: any;
    className?: string; // Add className prop to accept custom styles
    setErrors?: (errors: any) => void; // Add setter for errors
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, setData, isEditMode, data, className ,setErrors }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isEditMode) {
            const lessonTags = data.lessonTags.find((tagObj: { [key: string]: string[] }) =>
                Object.keys(tagObj)[0].includes(label.toLowerCase())
            );

            if (lessonTags) {
                setSelectedOptions(lessonTags[label]);
            }
        }
    }, [isEditMode, data, label]);

    const handleOptionChange = (option: string) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
        setData((prev: { lessonTags: { [key: string]: string[] }[] }) => {
            const updatedLessonTags = prev.lessonTags.map((tagObj) => {
                const [key, value] = Object.entries(tagObj)[0];

                const normalizedLabel = label;
                if (key === normalizedLabel) {
                    return {
                        [key]: value.includes(option)
                            ? value.filter((item) => item !== option)
                            : [...value, option],
                    };
                }

                return tagObj;
            });

            setErrors &&setErrors((prevErrors: any) => ({
                ...prevErrors,
                [`tag-${label}`]: '', // Clear the specific error for this tag
            }));

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
                                required
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
