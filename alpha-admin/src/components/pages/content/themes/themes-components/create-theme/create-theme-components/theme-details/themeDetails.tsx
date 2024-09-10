import React, { useEffect, useState } from 'react';
import styles from './themeDetails.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../../../../../app/hooks';
import { fetchCategoriesForLessonsThunk, fetchCategoriesThunk } from '../../../../../categories/category-component/categorySlice';

interface ThemeDetailsProps {
    onCategoryChange: (category: string) => void; // Prop to pass selected category
    data: any;
    setData: any;
}

const ThemeDetails: React.FC<ThemeDetailsProps> = ({ onCategoryChange, data, setData }) => {
    const [category, setCategory] = useState<string>(data.themeData.category?.id || '');

    // const categories = useAppSelector((state) => state.categories.categories.categories);
    const [categories,setCategories] = useState([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCategoriesForLessonsThunk(100)).then((response: any) => {
            if (response.payload) {
                const activeCategories = response.payload.data.filter((cat: { status: string; })=>cat.status.toLowerCase() === 'active');
                setCategories(activeCategories);
            }
        }
        );
        }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCategoriesThunk(1));
    }, [dispatch]);

    useEffect(() => {
        onCategoryChange(category);
    }, [category, onCategoryChange]);

    useEffect(() => {
        // Sync local state with data prop
        setCategory(data.themeData.category?.id || '');
    }, [data.themeData.category]);

    return (
        <div className={styles.themeDetails}>
            <h5>Theme details</h5>
            <div className={styles.formGroup}>
                <label htmlFor="themeCode">Theme code</label>
                <input
                    type="number"
                    id="themeCode"
                    value={data.themeData.themeCode}
                    onChange={(e) => {
                        setData({
                            ...data,
                            themeData: {
                                ...data.themeData,
                                themeCode: e.target.value,
                            },
                        });
                    }}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => {
                        const selectedCategoryId = e.target.value;
                        setCategory(selectedCategoryId);
                        setData({
                            ...data,
                            themeData: {
                                ...data.themeData,
                                category: { id: parseInt(selectedCategoryId, 10) }, // assuming category is an object with id and other properties
                            },
                        });
                    }}
                    required
                >
                    <option value="">Select category</option>
                    {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ThemeDetails;
