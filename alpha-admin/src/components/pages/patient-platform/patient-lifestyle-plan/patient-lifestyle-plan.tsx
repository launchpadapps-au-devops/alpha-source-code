import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './patient-lifestyle-plan.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { InProgress } from './patent-lifestyle-components/in-progress-plan/in-progress-plan';
import { DailogModal } from './patent-lifestyle-components/dialog-modal/dialog-modal';
import { RemoveLifestyle } from './patent-lifestyle-components/remove-lifestyle-modal/remove-lifestyle-modal';
import { Plan } from '../../lifestyle-plan/components/lifeStyleSlice';
import { getLifestylePlans } from './patientLifeStyleAPI';
import { SelectLifeStylePlan } from './patent-lifestyle-components/select-lifestyle-plan-list/select-lifestyle-plan';
import { SidebarPatient } from '../../patient-Management/patient-sidebar/patientSidebar';



export interface PatientLifeStyle {
    className?: string;
}

export const PatientLifeStyle = ({ className }: PatientLifeStyle) => {
    const [isInProgress, setIsInProgress] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]); // State for storing plans
    const [loading, setLoading] = useState<boolean>(false); // State for loading
    const [page, setPage] = useState<number>(1); // State for pagination
    const [hasMore, setHasMore] = useState<boolean>(true); // State to check if more data is available

    useEffect(() => {
        // Function to fetch plans and handle pagination
        const fetchPlans = async () => {
            if (loading || !hasMore) return; // Prevent multiple fetches or fetching if no more data

            setLoading(true); // Set loading to true while fetching data
            try {
                const response = await getLifestylePlans(page);
                if (response.data.length > 0) {
                    setPlans((prevPlans) => [...prevPlans, ...response.data]); // Append new data
                    setPage((prevPage) => prevPage + 1); // Increment page for next fetch
                } else {
                    setHasMore(false); // No more data available
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchPlans();
    }, [page, hasMore, loading]); // Dependencies to trigger fetch

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 50 >=
                document.documentElement.scrollHeight
            ) {
                // Check if the user is at the bottom of the page
                fetchMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean up on unmount
    }, []);

    const fetchMoreData = () => {
        if (loading || !hasMore) return;
        setPage((prevPage) => prevPage + 1); // Increment page to trigger fetch
    };

    const handleAssignButtonClick = () => {
        setIsAssignModalOpen(true);
    };

    const handleRemoveButtonClick = () => {
        setIsRemoveModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
    };

    const handleCloseRemoveModal = () => {
        setIsRemoveModalOpen(false);
    };

    const handlePlanSelect = (plan: string) => {
        setSelectedPlan(plan);
    };

    return (
        <>
        <SidebarPatient/>
            <main className={classNames(styles['lifestyle-outer-wrapper'], className)}>
                <header>
                    <h1>Lifestyle plan</h1>
                    {isInProgress && (
                        <AppButton
                            buttonText="Remove lifestyle plan"
                            showLeftIcon
                            icon="deleteWhite"
                            onButtonClick={handleRemoveButtonClick}
                        />
                    )}
                    <AppButton
                        buttonText="Assign plan to patient"
                        onButtonClick={handleAssignButtonClick}
                        disabled={!selectedPlan}
                    />
                </header>
                {isInProgress && <InProgress />}
                {/* Map through the fetched plans and render each using SelectLifeStylePlan */}
                {plans.map((plan) => (
                    <SelectLifeStylePlan
                        key={plan.id}
                        selectedPlan={selectedPlan || ''}
                        onPlanSelect={handlePlanSelect}
                        title={plan.name}
                        description={plan.description}
                    />
                ))}
                {loading && <div>Loading more plans...</div>}
                {!hasMore && <div>No more plans to load</div>}
                <DailogModal
                    open={isAssignModalOpen}
                    closeModal={handleCloseAssignModal}
                    title="Plan assigned to patient."
                    descriptionText="The plan was successfully assigned to the patients."
                />
                <RemoveLifestyle open={isRemoveModalOpen} closeModal={handleCloseRemoveModal} />
            </main>
        </>
    );
};
