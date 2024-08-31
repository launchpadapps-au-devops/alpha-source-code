import classNames from 'classnames';
import { Typography } from '@mui/material';
import styles from './create-category.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import { DeleteButton } from '../../../content-components/delete-button/delete-button';
import CategoryList from '../categoryList/CategoryList';
import { useState } from 'react';
import { DeleteCategoryModal } from '../../../content-components/delete-category-modal/DeleteCategoryModal';
import { useDispatch } from 'react-redux';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../../../back-button/backButton';
export interface CreateContentProps {
    className?: string;
}

export const CreateCategories = ({ className }: CreateContentProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);

    const handleDeleteModal = () => {
        const data = {
            firstName: 'asdf',
            lastName: 'aad',
            fullName: 'asdsfsf',
            email: 'adad@gmail.com',
            password: '',
            roleIds: [2],
            isStaffAdmin: true,
        };
        // dispatch(editStaffThunk({,data}));
        // navigate('/careteam');

        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <BackButton/>
            <div className={classNames(styles.container, className)}>
                <Sidebar />
                <div className={styles.content}>
                    <header className={styles.header}>
                        <Typography variant="h5">Create category</Typography>
                        <div className={styles.leftButtonContainer}>
                            <DeleteButton showLeftIcon onButtonClick={handleDeleteModal} />
                            <EditButton
                                buttonText="Cancel"
                                onButtonClick={() => navigate('/content')}
                            />
                        </div>
                        <div className={styles.rightButtonContainer}>
                            <AppButton
                                buttonText="Save updates"
                                onButtonClick={() => navigate('/content')}
                            />
                        </div>
                    </header>
                    <CategoryList />
                </div>
                {openModal && (
                    <DeleteCategoryModal
                        open={openModal}
                        descriptionText="Are you sure you wish to delete this Category?
                    If you delete this Category, all Themes and Lessons tagged to it will lose their tags.
                    However, the Lessons and Themes will remain available under ‘Lessons’ and ‘Themes’."
                        title="Delete category"
                        closeModal={handleCloseModal}
                        // handleButton={() => navigate('/careteam')}
                    />
                )}
            </div>
        </>
    );
};
