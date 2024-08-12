import React, { useEffect, useState } from 'react';
import { List } from '@mui/material';
import CategoryItem from '../categoryItem/categoryItem';
import styles from './viewCategories.module.scss';
import { PublishCategoryModal } from '../publish-category-modal/PublishCategoryModal';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import { fetchCategoriesThunk, updateCategoryThunk } from '../categorySlice';

interface Category {
    name: string;
    published: boolean;
}

export const ViewCategories: React.FC = () => {
    var [categories, setCategories] = useState<any>([]);
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
    }, []);

    const handleToggle = (category: any, index: number) => {
        // Create a new copy of the category object
        const newCategory = { ...category, isPublished: !category.isPublished };

        // Update the categories state with the new category object
        setCategories((prevCategories: any) => {
            const newCategories = [...prevCategories];
            newCategories[index] = newCategory;
            return newCategories;
        });

        // Dispatch the thunk to update the category
        dispatch(updateCategoryThunk({ id: category.id, data: newCategory }));
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div className={styles.categories}>
            <div className={styles.header}>
                <span className={styles.headerText}>Categories</span>
                <span className={styles.headerText}>Published</span>
            </div>
            <List>
                {categories &&
                    categories.length > 0 &&
                    categories.filter(
                        (category: { status: string }) => category.status.toLowerCase() === 'active'
                    ).length > 0 &&
                    categories
                        .filter(
                            (category: { status: string }) =>
                                category.status.toLowerCase() === 'active'
                        )
                        .map((category: any, index: any) => (
                            <CategoryItem
                                key={index}
                                name={category.name}
                                published={category.isPublished}
                                onToggle={() => handleToggle(category, index)}
                            />
                        ))}
            </List>
            {openModal && (
                <PublishCategoryModal
                    open={openModal}
                    descriptionText={`Are you sure you wish to publish this category?
          All lessons and themes tagged with this category will now be visible to patients.`}
                    title="Publish category"
                    closeModal={handleCloseModal}
                    // handlePublish={handlePublish}
                />
            )}
        </div>
    );
};
