import React, { useEffect, useState } from 'react';
import { List, Pagination } from '@mui/material';
import CategoryItem from '../categoryItem/categoryItem';
import styles from './viewCategories.module.scss';
import { PublishCategoryModal } from '../publish-category-modal/PublishCategoryModal';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchCategoriesThunk, updateCategoryThunk } from '../categorySlice';

interface Category {
    id: number;
    name: string;
    isPublished: boolean;
    status: string;
}

export const ViewCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const dispatch = useAppDispatch();

    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(fetchCategoriesThunk()).then((response: any) => {
            if (response.payload) {
                console.log('Response ', response);
                setCategories(response.payload.data);
            }
        });
    }, [dispatch]);

    const handleToggle = (category: Category, index: number) => {
        const newCategory = {
            ...category,
            isPublished: !category.isPublished, // Toggle the isPublished flag
        };

        dispatch(updateCategoryThunk({ id: category.id, data: newCategory })).then(
            (response: any) => {
                if (response.payload) {
                    dispatch(fetchCategoriesThunk()).then((response: any) => {
                        if (response.payload) {
                            console.log('Response ', response);
                            setCategories(response.payload.data);
                        }
                    });
                }
            }
        );
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.categories}>
            <div className={styles.header}>
                <span className={styles.headerText}>Categories</span>
                <span className={styles.headerText}>Published</span>
            </div>
            <List>
                {currentCategories.map((category, index) => (
                    <CategoryItem
                        key={index}
                        name={category.name}
                        published={category.isPublished}
                        onToggle={() => handleToggle(category, index)}
                    />
                ))}
            </List>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <Pagination
                    count={Math.ceil(categories.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                />
            </div>
            {openModal && (
                <PublishCategoryModal
                    open={openModal}
                    descriptionText={`Are you sure you wish to publish this category?
                      All lessons and themes tagged with this category will now be visible to patients.`}
                    title="Publish Category"
                    closeModal={handleCloseModal}
                />
            )}
        </div>
    );
};
