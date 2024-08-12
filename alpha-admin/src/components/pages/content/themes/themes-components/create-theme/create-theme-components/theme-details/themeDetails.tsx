import React, { useEffect, useState } from 'react';
import styles from './themeDetails.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../../../../../app/hooks';
import { fetchCategoriesThunk } from '../../../../../categories/category-component/categorySlice';

interface ThemeDetailsProps {
    onCategoryChange: (category: string) => void; // Prop to pass selected category
    data: any;
    setData: any;
}

const ThemeDetails: React.FC<ThemeDetailsProps> = ({ onCategoryChange, data, setData }) => {
    const [themeCode, setThemeCode] = useState<string>('1');
    const [category, setCategory] = useState<string>('');

    const categories = useAppSelector((state) => state.categories.categories.categories);
    console.log(categories, 'categories');
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCategoriesThunk());
    }, []);

    useEffect(() => {
        onCategoryChange(category);
    }, [category, onCategoryChange]);

    return (
        <div className={styles.themeDetails}>
            <h5>Theme details</h5>
            <div className={styles.formGroup}>
                <label htmlFor="themeCode">Theme code</label>
                <input
                    type="text"
                    id="themeCode"
                    value={data.themeData.themeCode}
                    onChange={(e) => {
                        setData({
                            ...data,
                            themeData: { ...data.themeData, themeCode: e.target.value },
                        });
                    }}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={data.themeData.categoryId}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setData({
                            ...data,
                            themeData: { ...data.themeData, categoryId: e.target.value },
                        });
                    }}
                >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                    {/* {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))} */}
                </select>
            </div>
        </div>
    );
};

export default ThemeDetails;
