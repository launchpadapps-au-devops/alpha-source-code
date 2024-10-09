import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Pagination } from '@mui/material';
import styles from './viewCategories.module.scss';
import { PublishCategoryModal } from '../publish-category-modal/PublishCategoryModal';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchCategoriesThunk, updateCategoryThunk } from '../categorySlice';
// import {TableFooter} from '../../../content-components/table-footer/TableFooter';
import { CustomPagination } from '../../../content-components/custom-pagination/customPagination';
import ToggleSwitch from '../../../content-components/toggle/toggle';

interface Category {
    id: number;
    name: string;
    isPublished: boolean;
    status: string;
    totalPages: number;
    setTotalPages: any;
    totalRecords: number;
    setTotalRecords: any;
}

export const ViewCategories: React.FC = () => {
    const categories = useAppSelector((state: any) => state.categories.categories.categories);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const dispatch = useAppDispatch();

    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const activeCategories = categories.filter(
        (category: Category) => category.status.toLowerCase() === 'active'
    );

    useEffect(() => {
        dispatch(fetchCategoriesThunk(1)).then((response: any) => {
            if (response.payload) {
                setTotalPages(response.payload.meta.totalPages);
                setTotalRecords(response.payload.meta.totalRecords);
            }
        });
    }, [dispatch]);

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

    const handleToggle = (category: Category, index: number) => {
        const newCategory = {
            ...category,
            isPublished: !category.isPublished, // Toggle the isPublished flag
        };

        if (!category.isPublished) {
            // Only open the modal if the category is being published
            setOpenModal(true);
            setSelectedCategoryIndex(index);
        } else {
            // If unpublishing, proceed without showing the modal
            dispatch(updateCategoryThunk({ id: category.id, data: newCategory })).then(
                (response: any) => {
                    if (response.payload) {
                        dispatch(fetchCategoriesThunk(1));
                    }
                }
            );
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCategoryIndex(null);
    };

    const handlePublish = () => {
        if (selectedCategoryIndex !== null) {
            const categoryToPublish = activeCategories[selectedCategoryIndex];
            const newCategory = {
                ...categoryToPublish,
                isPublished: true,
            };

            dispatch(updateCategoryThunk({ id: categoryToPublish.id, data: newCategory })).then(
                (response: any) => {
                    if (response.payload) {
                        dispatch(fetchCategoriesThunk(1));
                    }
                }
            );
        }
        handleCloseModal();
    };

    return (
        <div className={styles.categories}>
            <div className={styles.header}>
                <span className={styles.headerText}>Categories</span>
                <span className={styles.headerText}>Published</span>
            </div>
            <List>
                {activeCategories.map((category: Category, index: number) => (
                    <ListItem className={styles.list}>
                        <ListItemText>
                        {category.name}
                        </ListItemText>
                        <ToggleSwitch
                            isPublished={category.isPublished} // Pass the isPublished state
                            onToggle={(e) => handleToggle(category, index)}
                        />
                    </ListItem>
                ))}
            </List>
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {openModal && selectedCategoryIndex !== null && (
                <PublishCategoryModal
                    open={openModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to publish this category?</p>
                            <br />
                            <p>
                                All lessons and themes tagged with this category will now be visible
                                to patients.
                            </p>
                        </>
                    }
                    title="Publish Category"
                    closeModal={handleCloseModal}
                    handlePublish={handlePublish}
                />
            )}
        </div>
    );
};
