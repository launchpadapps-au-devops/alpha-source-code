import React, { useEffect, useState } from 'react';
import styles from './CategoryList.module.scss';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import TableFooter from '../../../content-components/table-footer/TableFooter';
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

interface Category {
    id: number;
    name: string;
    status: string; // Added status field to the Category interface
}

const CategoryList: React.FC = () => {
    const categories = useAppSelector((state: any) => state.categories.categories.categories); // Directly access categories
    const [newCategory, setNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const dispatch = useAppDispatch();

    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        // Fetch categories
        if (location.pathname === '/content/createcategories') {
            setNewCategory(true);
        }
    }, []);

    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const handleEditClick = (category: Category) => {
        setEditId(category.id);
        setEditName(category.name);
    };

    const handleSaveAndAddMoreClick = (category: any) => {
        const updatedCategory = { ...category, name: editName }; // Create a shallow copy and update the name
        dispatch(updateCategoryThunk({ id: updatedCategory.id, data: updatedCategory }));
        setEditName('');
    };

    const handleSaveClick = (category: any) => {
        const updatedCategory = { ...category, name: editName }; // Create a shallow copy and update the name
        dispatch(updateCategoryThunk({ id: updatedCategory.id, data: updatedCategory }));
        setEditId(null);
        setEditName('');
    };

    const handleNewCategory = () => {
        dispatch(addCategoryThunk(newCategoryName));
        setNewCategory(false);
        setNewCategoryName('');
    };

    const handleDeleteClick = (id: number | null) => {
        if (id !== null) {
            dispatch(deleteCategoryThunk({ id, name: editName }));
            setEditId(null);
            setEditName('');
        }
        setOpenModal(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(e.target.value);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
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
                                <input
                                    type="text"
                                    className={styles.editInput}
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required
                                />
                                    <AppButton
                                        buttonText="Add"
                                        onButtonClick={handleNewCategory}
                                    />
                                </div>
                            </td>
                        </tr>
                    )}
                    {categories &&
                        categories.length > 0 &&
                        categories.filter(
                            (category: { status: string }) =>
                                category.status.toLowerCase() == 'active'
                        ).length > 0 &&
                        categories
                            .filter(
                                (category: { status: string }) =>
                                    category.status.toLowerCase() == 'active'
                            )
                            .map((category: Category) => (
                                <tr key={category.id}>
                                    <td className={styles.categoryCell}>
                                        {editId === category.id ? (
                                            <div className={styles.editContainer}>
                                                <input
                                                    className={styles.editInput}
                                                    type="text"
                                                    value={editName}
                                                    onChange={handleNameChange}
                                                    required
                                                />
                                                <div className={styles.buttonContainer}>
                                                    <EditButton
                                                        className={styles.smallButton}
                                                        buttonText="Save"
                                                        onButtonClick={() =>
                                                            handleSaveClick(category)
                                                        }
                                                    />

                                                    <DeleteButton
                                                        className={styles.smallButton}
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
            <div className={styles.pagination}>
                <TableFooter
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {openModal && (
                <DeleteCategoryModal
                    open={openModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to delete this Category?</p> <br />
                            <p>
                                If you delete this Category, all Themes and Lessons tagged to it
                                will lose their tags.
                            </p><br />
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
                    handleDelete={() => handleDeleteClick(editId)}  // Pass handleDeleteClick here
                />
            )}
        </div>
    );
};

export default CategoryList;
