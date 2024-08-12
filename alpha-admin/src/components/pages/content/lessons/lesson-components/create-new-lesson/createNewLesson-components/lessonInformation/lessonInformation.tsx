import React, { useEffect, useState } from 'react';
import styles from './lessonInformation.module.scss';
import { Add as AddIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import LessonTags from '../lesson-tags/lessonTag';
import { useNavigate } from 'react-router-dom';
import { SelectTheme } from '../add-to-theme/addToTheme';
import { useAppSelector } from '../../../../../../../../app/hooks';

type DropdownState = {
    [key: string]: boolean;
};

export interface LessonInformationProps {
    data: any;
    setData: any;
    theme: any;
    setTheme: any;
    selectedTheme: any;
    setSelectedTheme: any;
}

export const LessonInformation = ({
    data,
    setData,
    theme,
    setTheme,
    selectedTheme,
    setSelectedTheme,
}: LessonInformationProps) => {
    const [isOpen, setIsOpen] = useState<DropdownState>({
        category: false,
        duration: false,
        points: false,
    });
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const categories = useAppSelector((state) => state.categories.categories.categories);

    const handleDropdownClick = (dropdown: string) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
    };

    const handleclick = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className={styles.lessonForm}>
            <h3>Lesson information</h3>
            <div className={styles.section}>
                <label>Lesson Code</label>
                <input
                    type="text"
                    placeholder="Add lesson code"
                    className={styles.lessonCodeInput}
                    value={data.lessonCode}
                    onChange={(e) => setData({ ...data, lessonCode: e.target.value })}
                />
            </div>

            <div className={styles.section} onClick={handleclick}>
                <label>Assign Theme (optional)</label>
                <div className={styles.inputWithIcon}>
                    <input
                        type="text"
                        placeholder="Add to theme"
                        readOnly
                        className={styles.inputWithPlusIcon}
                        value={selectedTheme.name}
                    />
                    <AddIcon className={styles.plusIcon} />
                </div>
            </div>

            <div className={styles.section}>
                <label>Category</label>
                <div
                    className={styles.customSelectWrapper}
                    onClick={() => handleDropdownClick('category')}
                >
                    <select
                        className={styles.customSelect}
                        onChange={(e) =>
                            setData({
                                ...data,
                                categoryId: e.target.value,
                            })
                        }
                    >
                        <option hidden disabled selected>
                            Select category
                        </option>
                        {categories.map((category: any) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <FontAwesomeIcon
                        icon={isOpen.category ? faCaretUp : faCaretDown}
                        className={styles.caretIcon}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <label>Lesson Duration</label>
                <div
                    className={styles.customSelectWrapper}
                    onClick={() => handleDropdownClick('duration')}
                >
                    <select
                        className={styles.customSelect}
                        onChange={(e) =>
                            setData({
                                ...data,
                                duration: e.target.value,
                            })
                        }
                    >
                        <option hidden disabled selected>
                            Select duration
                        </option>
                        <option value={10}>10 minutes</option>
                        <option value={5}>5 minutes</option>
                        <option value={3}>3 minutes</option>
                        {/* Add your options here */}
                    </select>
                    <FontAwesomeIcon
                        icon={isOpen.duration ? faCaretUp : faCaretDown}
                        className={styles.caretIcon}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <label>Points Allocation</label>
                <div
                    className={styles.customSelectWrapper}
                    onClick={() => handleDropdownClick('points')}
                >
                    <select
                        className={styles.customSelect}
                        onChange={(e) =>
                            setData({
                                ...data,
                                points: e.target.value,
                            })
                        }
                    >
                        <option hidden disabled selected>
                            Select points
                        </option>
                        <option value={200}>200 points</option>
                        <option value={150}>150 points</option>
                        <option value={100}>100 points</option>
                        <option value={50}>50 points</option>
                        {/* Add your options here */}
                    </select>
                    <FontAwesomeIcon
                        icon={isOpen.points ? faCaretUp : faCaretDown}
                        className={styles.caretIcon}
                    />
                </div>
            </div>
            <LessonTags data={data} setData={setData} />
            <SelectTheme
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                data={data}
                setData={setData}
                theme={theme}
                setTheme={setTheme}
                setSelectedTheme={setSelectedTheme}
            />
        </div>
    );
};
