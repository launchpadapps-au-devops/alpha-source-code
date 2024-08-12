import React, { FC, useRef, useEffect, useState } from 'react';
import styles from './lessonManagement.module.scss';
import { EditButton } from '../../../../../content-components/edit-button/edit-button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Menu, MenuItem } from '@mui/material';
import { Lesson } from '../select-lessons/selectLessons';
import { Delete } from '../../../../../../../icon/glyps/delete';
import { Vector } from '../../../../../../../icon/glyps/vector';
import { useNavigate } from 'react-router-dom';

interface LessonManagementProps {
  selectedLessons: Lesson[];
  onRemoveLesson: (lessonCode: number) => void;
  onAddLessons: () => void;
}

export const LessonManagement: FC<LessonManagementProps> = ({ selectedLessons, onRemoveLesson, onAddLessons }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddExistingLesson = () => {
    onAddLessons();
    handleClose();
  };

  const handleCreateNewLesson = () => {
    navigate('/content/createlesson');
    handleClose();
  };

  useEffect(() => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef.current]);

  return (
    <div className={styles.section}>
      <h3>Lessons <Vector /></h3>
      {selectedLessons.length > 0 && (
        <table className={styles.lessonsTable}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Lesson name</th>
              <th>Category</th>
              <th>Quiz</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {selectedLessons.map((lesson, index) => (
              <tr key={index}>
                <td>{lesson.code}</td>
                <td>{lesson.title}</td>
                <td>{lesson.category}</td>
                <td>{lesson.quiz ? <CheckCircleOutlineIcon /> : ''}</td>
                <td><Delete onClick={() => onRemoveLesson(lesson.code)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <EditButton ref={buttonRef} buttonText='Add Lesson' onButtonClick={handleButtonClick} />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: menuWidth,
            },
          },
        }}
      >
        <MenuItem onClick={handleAddExistingLesson}>
          Add existing lesson
        </MenuItem>
        <MenuItem onClick={handleCreateNewLesson}>
          Create new lesson
        </MenuItem>
      </Menu>
    </div>
  );
};
