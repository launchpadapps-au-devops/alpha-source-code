import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './patient-lifestyle-plan.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { InProgress } from './patent-lifestyle-components/in-progress-plan/in-progress-plan';
import { DailogModal } from './patent-lifestyle-components/dialog-modal/dialog-modal';
import { RemoveLifestyle } from './patent-lifestyle-components/remove-lifestyle-modal/remove-lifestyle-modal';
import { Plan } from '../../lifestyle-plan/components/lifeStyleSlice';
import { getLifestylePlans, assignLifestylePlan } from './patientLifeStyleAPI'; 
import { SelectLifeStylePlan } from './patent-lifestyle-components/select-lifestyle-plan-list/select-lifestyle-plan';
import { SidebarPatient } from '../../patient-Management/patient-sidebar/patientSidebar';
import { useLocation } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';

export interface PatientLifeStyle {
    className?: string;
}

export const PatientLifeStyle = ({ className }: PatientLifeStyle) => {
    const patientId =  localStorage.getItem('selectedPatientId');

    const [isInProgress, setIsInProgress] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<any>(null); // Store planId instead of name
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [initialLoading, setInitialLoading] = useState<boolean>(true); // Track initial loading state
    const [loadingMore, setLoadingMore] = useState<boolean>(false); // Track loading more data

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getLifestylePlans(page);
                if (response.data.length > 0) {
                    setPlans((prevPlans) => [...prevPlans, ...response.data]);
                    setPage((prevPage) => prevPage + 1);
                } else {
                    setHasMore(false); // No more plans to load
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setInitialLoading(false); // Stop initial loader after first fetch
                setLoadingMore(false); // Stop "loading more" loader
            }
        };

        fetchPlans();
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 50 >=
                document.documentElement.scrollHeight
            ) {
                fetchMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchMoreData = () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true); // Start "loading more" loader
        setPage((prevPage) => prevPage + 1);
    };

    const handleAssignButtonClick = async () => {
        if (!selectedPlanId || !patientId) {
            console.log('Selected Plan Id: ', selectedPlanId);
            console.log('Patient Id: ', patientId);
            return;
        }
        setLoading(true); // Show loading state
        try {
            await assignLifestylePlan(patientId, selectedPlanId);
            setIsAssignModalOpen(true); // Open modal on success
        } catch (error) {
            console.error('Error assigning plan to patient:', error);
        } finally {
            setLoading(false); // Hide loading state
        }
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

    const handlePlanSelect = (planId: any) => {
        setSelectedPlanId(planId); // Store planId
    };

    return (
        <>
            <SidebarPatient />
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
                        disabled={!selectedPlanId}
                    />
                </header>
                {isInProgress && <InProgress />}
                {plans.map((plan) => (
                    <SelectLifeStylePlan
                        key={plan.id}
                        planId={plan.id}  // Pass planId here
                        selectedPlanId={selectedPlanId} // Pass selectedPlanId to handle the selected state
                        onPlanSelect={handlePlanSelect} // Update the function signature
                        title={plan.name}
                        description={plan.description}
                    />
                ))}

                {initialLoading && (
                    <div className={styles.loaderOverlay}>
                        <PuffLoader color="#007bff" />
                    </div>
                )}

                {/* Loading more spinner for infinite scroll */}
                {loadingMore && (
                    <div className={styles.loaderWrapper}>
                        <PuffLoader color="#007bff" />
                    </div>
                )}


                <DailogModal
                    open={isAssignModalOpen}
                    closeModal={handleCloseAssignModal}
                    title="Plan assigned to patient."
                    descriptionText="The plan was successfully assigned to the patient."
                />
                <RemoveLifestyle open={isRemoveModalOpen} closeModal={handleCloseRemoveModal} />
            </main>
        </>
    );
};
