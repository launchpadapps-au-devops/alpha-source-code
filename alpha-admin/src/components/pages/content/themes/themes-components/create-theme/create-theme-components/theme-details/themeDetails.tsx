import React, { useEffect, useState } from 'react';
import styles from './themeDetails.module.scss';
import { useAppDispatch } from '../../../../../../../../app/hooks';
import { fetchCategoriesForLessonsThunk, fetchCategoriesThunk } from '../../../../../categories/category-component/categorySlice';

interface ThemeDetailsProps {
    onCategoryChange: (category: string) => void;
    data: any;
    setData: any;
    errors: any;
    setErrors: (errors: any) => void;
}

const ThemeDetails: React.FC<ThemeDetailsProps> = ({ onCategoryChange, data, setData, errors, setErrors }) => {
    const [category, setCategory] = useState<string>(data.themeData.category?.id || '');

    const [categories, setCategories] = useState([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCategoriesForLessonsThunk(100)).then((response: any) => {
            if (response.payload) {
                const activeCategories = response.payload.data.filter(
                    (cat: { status: string }) => cat.status.toLowerCase() === 'active'
                );
                setCategories(activeCategories);
            }
        });
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCategoriesThunk(1));
    }, [dispatch]);

    useEffect(() => {
        onCategoryChange(category);
    }, [category, onCategoryChange]);

    useEffect(() => {
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
                    placeholder='Enter theme code'
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
                    className={errors.themeCode ? styles.errorBorder : ''}
                    required
                />
                {errors.themeCode && <span className={styles.errorText}>{errors.themeCode}</span>}
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
                                category: { id: parseInt(selectedCategoryId, 10) }, 
                            },
                        });
                    }}
                    className={errors.categoryId ? styles.errorBorder : ''}
                    required
                >
                    <option value="">Select category</option>
                    {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {/* {errors.categoryId && <span className={styles.errorText}>{errors.category}</span>} */}
                {errors.categoryId && <span className={styles.errorText}>{errors.categoryId}</span>}
            </div>
        </div>
    );
};

export default ThemeDetails;
