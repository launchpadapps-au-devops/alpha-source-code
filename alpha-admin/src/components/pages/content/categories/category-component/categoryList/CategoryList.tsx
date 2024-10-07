import React, { useEffect, useState } from 'react';
import styles from './CategoryList.module.scss';
import { EditButton } from '../../../content-components/edit-button/edit-button';
// import {TableFooter} from '../../../content-components/table-footer/TableFooter';
import { AppButton } from '../../../../../app-button/app-button';
import { DeleteButton } from '../../../content-components/delete-button/delete-button';
import { useDispatch } from 'react-redux';
import {
    addCategoryThunk,
    deleteCategoryThunk,
    fetchCategoriesThunk,
    updateCategoryThunk,
} from '../categorySlice';
import { useAppSelector, useAppDispatch } from '../../../../../../app/hooks';
import { useLocation } from 'react-router-dom';
import { DeleteCategoryModal } from '../../../content-components/delete-category-modal/DeleteCategoryModal';
import { PublishCategoryModal } from '../publish-category-modal/PublishCategoryModal';
import { CustomPagination } from '../../../content-components/custom-pagination/customPagination';
import { AppDispatch } from '../../../../../../app/store';
import NotificationBanner from '../../../../notification-banner/notificationBanner';

interface Category {
    id: number;
    name: string;
    status: string; // Added status field to the Category interface
    totalPages: number;
    setTotalPages: any;
    totalRecords: number;
    setTotalRecords: any;
}

const CategoryList: React.FC = () => {
    const categories = useAppSelector((state: any) => state.categories.categories.categories); // Directly access categories
    const [newCategory, setNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);

    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [errors, setErrors] = React.useState<any>({});
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'delete', // Add the 'delete' type
    });

    useEffect(() => {
        // Fetch categories
        dispatch(fetchCategoriesThunk(1)).then((response: any) => {
            setTotalPages(response.payload.meta.totalPages);
            setTotalRecords(response.payload.meta.totalRecords);
            if (location.pathname === '/content/createcategories') {
                setNewCategory(true);
            }
        });
    }, [dispatch, location.pathname]);

    const fetchStaffData = (page: number) => {
        dispatch(fetchCategoriesThunk(page)).then((res: any) => {
            if (res.payload) {
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
            }
        });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            fetchStaffData(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchStaffData(currentPage - 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        fetchStaffData(pageNumber);
    };

    useEffect(() => {
        fetchStaffData(1);
    }, [dispatch]);

    const handleEditClick = (category: Category) => {
        setEditId(category.id);
        setEditName(category.name);
    };

    const validateFields = (isNew: boolean) => {
        let fieldErrors: any = {};
        if (isNew && !newCategoryName) {
            fieldErrors.newCategoryName = 'Name is required';
        }
        if (!isNew && !editName) {
            fieldErrors.editName = 'Name is required';
        }
        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const handleSaveClick = (category: Category) => {
        if (validateFields(false)) {
            const updatedCategory = { ...category, name: editName };
            dispatch(updateCategoryThunk({ id: updatedCategory.id, data: updatedCategory })).then(
                (res: any) => {
                    if (res.payload) {
                        // Show success notification
                        setNotification({
                            isVisible: true,
                            message: 'Category updated successfully!',
                            type: 'success',
                        });
                    } else {
                        // Show error notification
                        setNotification({
                            isVisible: true,
                            message: 'Failed to update category. Please try again.',
                            type: 'error',
                        });
                    }

                    // Hide notification after 3 seconds
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, isVisible: false }));
                    }, 3000);

                    // Clear edit state
                    setEditId(null);
                    setEditName('');
                }
            );
        }
    };

    const handleNewCategory = () => {
        if (validateFields(true)) {
            dispatch(addCategoryThunk(newCategoryName)).then((res: any) => {
                if (res.payload) {
                    // Show success notification
                    setNotification({
                        isVisible: true,
                        message: 'New category added successfully!',
                        type: 'success',
                    });
                } else {
                    // Show error notification
                    setNotification({
                        isVisible: true,
                        message: 'Failed to add category. Please try again.',
                        type: 'error',
                    });
                }

                // Hide notification after 3 seconds
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, isVisible: false }));
                }, 3000);

                // Reset new category input
                setNewCategory(false);
                setNewCategoryName('');
            });
        }
    };

    const handleDeleteClick = (id: number | null) => {
        if (id !== null) {
            dispatch(deleteCategoryThunk({ id, name: editName })).then((res: any) => {
                if (res.payload) {
                    // Show delete success notification
                    setNotification({
                        isVisible: true,
                        message: 'Category deleted successfully!',
                        type: 'delete',
                    });
                } else {
                    // Show error notification
                    setNotification({
                        isVisible: true,
                        message: 'Failed to delete category. Please try again.',
                        type: 'error',
                    });
                }

                // Hide notification after 3 seconds
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, isVisible: false }));
                }, 3000);

                // Reset edit state after deletion
                setEditId(null);
                setEditName('');
            });
        }
        setOpenModal(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(e.target.value);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleClosePublishModal = () => {
        setPublishModalOpen(false);
    };

    function handleSaveAndAddMoreClick(tips: any): void {
        throw new Error('Function not implemented.');
    }

    const activeCategories = categories.filter(
        (category: Category) => category.status.toLowerCase() === 'active'
    );

    return (
        <>
            <NotificationBanner
                isVisible={notification.isVisible}
                message={notification.message}
                onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
                type={notification.type}
            />
            <div className={styles.categoryList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.categoriesHeader}>Categories</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {newCategory && (
                            <tr>
                                <td>
                                    <div className={styles.categoryCell}>
                                        <div className={styles.editContainer}>
                                            <input
                                                type="text"
                                                className={`${styles.contentInput} ${
                                                    errors.newCategoryName ? styles.errorBorder : ''
                                                }`}
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                required
                                            />
                                            {errors.newCategoryName && (
                                                <span className={styles.errorText}>
                                                    {errors.newCategoryName}
                                                </span>
                                            )}
                                            <div className={styles.buttonContainer}>
                                                <AppButton
                                                    buttonText="Save & add more"
                                                    className={styles.button}
                                                    onButtonClick={handleNewCategory}
                                                />
                                                <EditButton
                                                    buttonText="Save"
                                                    className={styles.button}
                                                    onButtonClick={handleNewCategory}
                                                />
                                                <DeleteButton
                                                    buttonText="Delete"
                                                    className={styles.button}
                                                    onButtonClick={() => setNewCategory(false)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {activeCategories.map((category: Category) => (
                            <tr key={category.id}>
                                <td className={styles.categoryCell}>
                                    {editId === category.id ? (
                                        <div className={styles.editContainer}>
                                            <input
                                                className={`${styles.contentInput} ${
                                                    errors.editName ? styles.errorBorder : ''
                                                }`}
                                                type="text"
                                                value={editName}
                                                onChange={handleNameChange}
                                                required
                                            />
                                            {errors.editName && (
                                                <span className={styles.errorText}>
                                                    {errors.editName}
                                                </span>
                                            )}
                                            <div className={styles.buttonContainer}>
                                                <AppButton
                                                    buttonText="Save & add more"
                                                    className={styles.button}
                                                    onButtonClick={() => handleSaveClick(category)}
                                                />
                                                <EditButton
                                                    className={styles.button}
                                                    buttonText="Save"
                                                    onButtonClick={() => handleSaveClick(category)}
                                                />
                                                <DeleteButton
                                                    className={styles.button}
                                                    buttonText="Delete"
                                                    onButtonClick={() => setOpenModal(true)}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span>{category.name}</span>
                                            <EditButton
                                                buttonText="Edit"
                                                onButtonClick={() => handleEditClick(category)}
                                                className={styles.editButton}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {openModal && (
                    <DeleteCategoryModal
                        open={openModal}
                        descriptionText={
                            <>
                                <p>Are you sure you wish to delete this Category?</p> <br />
                                <p>
                                    If you delete this Category, all Themes and Lessons tagged to it
                                    will lose their tags.
                                </p>
                                <br />
                                <p>
                                    However, the Lessons and Themes will remain available under
                                    ‘Lessons’ and ‘Themes’.
                                </p>
                            </>
                        }
                        title="Delete category"
                        closeModal={handleCloseModal}
                        cancelButtonText="Cancel"
                        deleteButtonText="Yes, delete category"
                        handleDelete={() => handleDeleteClick(editId)} // Pass handleDeleteClick here
                    />
                )}
                {publishModalOpen && (
                    <PublishCategoryModal
                        open={publishModalOpen}
                        descriptionText="Are you sure you wish to publish this Category?"
                        title="Publish category"
                        closeModal={handleClosePublishModal}
                        // handlePublish={() => console.log('Category Published')} // Implement your publish logic here
                    />
                )}
            </div>
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
};

export default CategoryList;
