import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './nutrition.module.scss';
import { DataCard } from '../../../data-card/data-card';
import { EmptyComponent } from '../../../empty-state-component/empty-component';
import { SidebarPatient } from '../../patient-Management/patient-sidebar/patientSidebar';
import { nutritionAPI } from './nutritionAPI';
import { format } from 'date-fns';

export interface NutritionProps {
    className?: string;
}

interface NutritionData {
    energy: number;
    protein: number;
    fats: number;
    carbs: number;
    calories: number;
    date: string;
}

export const Nutrition = ({ className }: NutritionProps) => {
    const patientId = localStorage.getItem('selectedPatientId');
    const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNutritionData = async () => {
            try {
                if (patientId) {
                    const today = format(new Date(), 'dd/MM/yyyy'); // Format today's date as dd/MM/yyyy
                    const response = await nutritionAPI(patientId, today, today); // Pass the same date for fromDate and toDate
                    setNutritionData({
                        energy: response.data.energy || 0,
                        protein: response.data.nutritionData.protein || 0,
                        fats: response.data.nutritionData.fats || 0,
                        carbs: response.data.nutritionData.carbs || 0,
                        calories: response.data.calories || 0,
                        date: today,
                    });
                }
            } catch (error) {
                setError('Failed to fetch nutrition data');
            } finally {
                setLoading(false);
            }
        };

        fetchNutritionData();
    }, [patientId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <SidebarPatient />
            <div className={classNames(styles['nutrition-wrapper'], className)}>
                <h1>Nutrition for {nutritionData?.date}</h1>
                {nutritionData ? (
                    <div className={styles['grid-layout']}>
                        <DataCard>
                            <span className={styles['label-text']}>Energy</span>
                            <div className={styles['data-value']}>
                                <span>{nutritionData.energy} kJ</span>
                                <span>/ per day</span>
                            </div>
                        </DataCard>
                        <DataCard>
                            <span className={styles['label-text']}>Calories</span>
                            <div className={styles['data-value']}>
                                <span>{nutritionData.calories} J</span>
                                <span>/ per day</span>
                            </div>
                        </DataCard>
                        <DataCard>
                            <span className={styles['label-text']}>Protein</span>
                            <div className={styles['data-value']}>
                                <span>{nutritionData.protein} g</span>
                                <span>/ per day</span>
                            </div>
                        </DataCard>
                        <DataCard>
                            <span className={styles['label-text']}>Fats</span>
                            <div className={styles['data-value']}>
                                <span>{nutritionData.fats} g</span>
                                <span>/ per day</span>
                            </div>
                        </DataCard>
                        <DataCard>
                            <span className={styles['label-text']}>Carbohydrates</span>
                            <div className={styles['data-value']}>
                                <span>{nutritionData.carbs} g</span>
                                <span>/ per day</span>
                            </div>
                        </DataCard>
                        <DataCard>
                            <span className={styles['label-text']}>Calories</span>
                            <div className={styles['data-value']}>
                                <span>{nutritionData.calories}</span>
                                <span>/ per day</span>
                            </div>
                        </DataCard>
                    </div>
                ) : (
                    <EmptyComponent
                        title="No nutrition data available"
                        description="The patient has not yet completed any food logging.
                        They can easily log their food intake through the patient app. 
                        Once completed, the food logging will be available here."
                    />
                )}
            </div>
        </>
    );
};
