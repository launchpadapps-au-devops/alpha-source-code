import React, { useEffect, useState } from 'react';
import { List, Pagination } from '@mui/material';
import CategoryItem from '../categoryItem/categoryItem';
import styles from './viewCategories.module.scss';
import { PublishCategoryModal } from '../publish-category-modal/PublishCategoryModal';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchCategoriesThunk, updateCategoryThunk } from '../categorySlice';
import TableFooter from '../../../content-components/table-footer/TableFooter';

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
    // const [categories, setCategories] = useState<Category[]>([]);
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

    console.log('Active categories',activeCategories)

    useEffect(() => {
        dispatch(fetchCategoriesThunk(1)).then((response: any) => {
            if (response.payload) {
                setTotalPages(response.payload.meta.totalPages);
                setTotalRecords(response.payload.meta.totalRecords);
                // setCategories(activeCategories);
            }
        });
    }, [dispatch]);
    

    const handleNextPage = () => {
        console.log('currentPage', currentPage);
        dispatch(fetchCategoriesThunk(currentPage + 1)).then((res: any) => {
            console.log('res', res);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const handlePreviousPage = () => {
        dispatch(fetchCategoriesThunk(currentPage - 1)).then((res: any) => {
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage - 1, totalPages));
    };

    const handleToggle = (category: Category, index: number) => {
        const newCategory = {
            ...category,
            isPublished: !category.isPublished, // Toggle the isPublished flag
        };

        dispatch(updateCategoryThunk({ id: category.id, data: newCategory })).then(
            (response: any) => {
                if (response.payload) {
                    dispatch(fetchCategoriesThunk(1)).then((response: any) => {
                        if (response.payload) {
                            console.log('Response ', response);
                            // setCategories(response.payload.data);
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
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.categories}>
            <div className={styles.header}>
                <span className={styles.headerText}>Categories</span>
                <span className={styles.headerText}>Published</span>
            </div>
            <List>
                {activeCategories.map((category: Category, index: number) => (
                    <CategoryItem
                        key={index}
                        name={category.name}
                        published={category.isPublished}
                        onToggle={() => handleToggle(category, index)}
                    />
                ))}
            </List>
            <div className={styles.pagination}>
                <TableFooter
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
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
