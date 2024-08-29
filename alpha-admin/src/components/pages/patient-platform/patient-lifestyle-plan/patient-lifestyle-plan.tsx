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
import { useLocation, useNavigate } from 'react-router-dom';

export interface PatientLifeStyle {
    className?: string;
}

export const PatientLifeStyle = ({ className }: PatientLifeStyle) => {
    const location = useLocation();
    const patientId = location.state?.patientId; // This is the userId in your API call
    const navigate = useNavigate();

    const [isInProgress, setIsInProgress] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // Change to planId
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        console.log('Patient ID useeffect: ', patientId);
        const fetchPlans = async () => {
            if (loading || !hasMore) return;

            setLoading(true);
            try {
                const response = await getLifestylePlans(page);
                if (response.data.length > 0) {
                    setPlans((prevPlans) => [...prevPlans, ...response.data]);
                    setPage((prevPage) => prevPage + 1);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [page, hasMore, loading]);

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
        if (loading || !hasMore) return;
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
            await assignLifestylePlan(patientId, selectedPlanId); // Use selectedPlanId
            setIsAssignModalOpen(true); // Open modal on success
        } catch (error) {
            console.error('Error assigning plan to patient:', error);
            // Handle error, possibly show a message or modal
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const handleRemoveButtonClick = () => {
        setIsRemoveModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        //setIsAssignModalOpen(false);
        navigate('/patient-dashboard');
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
                        selectedPlan={selectedPlanId || ''}
                        onPlanSelect={() => handlePlanSelect(plan.id)} // Pass plan.id
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
