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

    console.log('location', location.pathname); // Logs the current path, e.g., "/about"
    console.log(location.search); // Logs the query string, e.g., "?name=harshavardhan"
    console.log(location.hash);

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
        // Keep the edit mode active and clear the edit name field for the user to add a new one
        setEditName('');
    };

    const handleSaveClick = (category: any) => {
        const updatedCategory = { ...category, name: editName }; // Create a shallow copy and update the name
        dispatch(updateCategoryThunk({ id: updatedCategory.id, data: updatedCategory }));
        // Exit the edit mode and clear the edit name field
        setEditId(null);
        setEditName('');
    };

    const handleNewCategory = () => {
        dispatch(addCategoryThunk(newCategoryName));
        setNewCategory(false);
        setNewCategoryName('');
    };

    const handleDeleteClick = (id: number) => {
        dispatch(deleteCategoryThunk({ id, name: editName }));
        setEditId(null);
        setEditName('');
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
                                <input
                                    type="text"
                                    className={styles.editInput}
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                            </td>
                            <td>
                                <AppButton
                                    buttonText="Add"
                                    onButtonClick={() => handleNewCategory()}
                                />
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
                                                />
                                                <div className={styles.buttonContainer}>
                                                    {/* <AppButton
                                                        buttonText="Save & add more"
                                                        onButtonClick={() =>
                                                            handleSaveAndAddMoreClick(category)
                                                        }
                                                    /> */}
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
                                                        onButtonClick={() =>
                                                            handleDeleteClick(category.id)
                                                        }
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
        </div>
    );
};

export default CategoryList;
