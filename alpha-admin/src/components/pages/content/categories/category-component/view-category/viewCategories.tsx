import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import styles from './viewCategories.module.scss';
import { PublishCategoryModal } from '../publish-category-modal/PublishCategoryModal';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchCategoriesThunk, updateCategoryThunk } from '../categorySlice';
import { CustomPagination } from '../../../content-components/custom-pagination/customPagination';
import ToggleSwitch from '../../../content-components/toggle/toggle';
import { resetInitializer, setLoggedOut } from '../../../../login/loginSlice';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const activeCategories = categories.filter(
        (category: Category) => category.status.toLowerCase() === 'active'
    );

    const checkUnauthorized = (status: number) => {
        if (status === 401) {
            // dispatch(setLoggedOut());
            dispatch(resetInitializer())
            navigate('/');
        }
    };

    useEffect(() => {
        dispatch(fetchCategoriesThunk(1)).then((response: any) => {
            if (response.payload) {
                setTotalPages(response.payload.meta.totalPages);
                setTotalRecords(response.payload.meta.totalRecords);
            } else if (response.error && response.error.status === 401) {
                checkUnauthorized(response.error.status);
            }
        });
    }, [dispatch]);

    const fetchCategoriesData = (page: number) => {
        dispatch(fetchCategoriesThunk(page)).then((res: any) => {
            if (res.payload) {
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
            } else if (res.error && res.error.status === 401) {
                checkUnauthorized(res.error.status);
            }
        });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            fetchCategoriesData(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchCategoriesData(currentPage - 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        fetchCategoriesData(pageNumber);
    };

    const handleToggle = (category: Category, index: number) => {
        const newCategory = {
            ...category,
            isPublished: !category.isPublished,
        };

        if (!category.isPublished) {
            setOpenModal(true);
            setSelectedCategoryIndex(index);
        } else {
            dispatch(updateCategoryThunk({ id: category.id, data: newCategory })).then(
                (response: any) => {
                    if (response.payload) {
                        dispatch(fetchCategoriesThunk(1));
                    } else if (response.error && response.error.status === 401) {
                        checkUnauthorized(response.error.status);
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
                    <ListItem className={styles.list} key={category.id}>
                        <ListItemText>{category.name}</ListItemText>
                        <ToggleSwitch
                            isPublished={category.isPublished}
                            onToggle={() => handleToggle(category, index)}
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
