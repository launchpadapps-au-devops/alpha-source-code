import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../../app/hooks';
import { fetchPlansThunk, updatePlanThunk } from '../lifeStyleSlice';
import { CustomPagination } from '../../../content/content-components/custom-pagination/customPagination';
import { PublishLessonModal } from '../../../content/lessons/lesson-components/publish-lesson-modal/publishLessonModal';
import { UnpublishLessonModal } from '../../../content/lessons/lesson-components/unpublish-lesson-modal/unpublishLessonModal';
import styles from './lifestyleTable.module.scss';

export interface lifeStyleProps {
    plans: any[];
    setPlans: React.Dispatch<React.SetStateAction<any[]>>;
    totalPages: number;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    onPageChange: (newPage: number) => void;
}

export const LifestyleTable: React.FC<lifeStyleProps> = ({
    plans,
    setPlans,
    totalPages,
    setTotalPages,
    currentPage,
    setCurrentPage,
    onPageChange,
}) => {
    const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Fetch data when the component mounts or when the page changes
    useEffect(() => {
        fetchPlans(currentPage);
    }, [currentPage]);

    const fetchPlans = (page: number) => {
        // API call to fetch the plans for the current page
        dispatch(fetchPlansThunk(page)).then((res: any) => {
            if (res.payload) {
                setPlans(res.payload.data); // Store the fetched plans
                setTotalPages(res.payload.meta.totalPages); // Update total pages
            }
        });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleToggle = (plan: any) => {
        const updatedPlan = {
            planData: {
                isPublished: !plan.isPublished,
            },
            themes: plan.themes.map((t: any) => t.id),
        };

        dispatch(updatePlanThunk({ id: plan.id, plan: updatedPlan })).then(() => {
            fetchPlans(currentPage); // Refresh the data after update
        });
    };

    const handlePublish = () => {
        if (selectedPlanIndex !== null) {
            setOpenPublishModal(false);
            const selectedPlan = plans[selectedPlanIndex];
            handleToggle(selectedPlan);
        }
    };

    const handleUnpublish = () => {
        if (selectedPlanIndex !== null) {
            setOpenUnpublishModal(false);
            const selectedPlan = plans[selectedPlanIndex];
            handleToggle(selectedPlan);
        }
    };

    const handleRowClick = (id: any, index: number) => {
        setSelectedPlanIndex(index);
        navigate(`/lifestyle-plan/view/${id}`);
    };

    const formatDate = (data: any) => {
        const date = new Date(data);
        return `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}/${
            date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        }/${date.getFullYear()}`;
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={styles['key-contacts-table']}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles['code']}>Plan name</TableCell>
                            <TableCell className={styles['date']}>Date created</TableCell>
                            <TableCell className={styles['published']}>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan: any, index: any) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(plan.id, index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['code']}>{plan.name}</TableCell>
                                <TableCell>{formatDate(plan.createdAt)}</TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={plan.isPublished}
                                        onChange={() => {
                                            setSelectedPlanIndex(index);
                                            plan.isPublished
                                                ? setOpenUnpublishModal(true)
                                                : setOpenPublishModal(true);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={onPageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {openPublishModal && selectedPlanIndex !== null && (
                <PublishLessonModal
                    open={openPublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to publish this plan?</p>
                            <br />
                            <p>This plan will be made available to patients.</p>
                        </>
                    }
                    title="Publish Plan"
                    closeModal={() => setOpenPublishModal(false)}
                    handlePublish={handlePublish}
                />
            )}
            {openUnpublishModal && selectedPlanIndex !== null && (
                <UnpublishLessonModal
                    open={openUnpublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to unpublish this plan?</p>
                            <br />
                            <p>
                                This plan will be saved to ‘Drafts’ and won’t be visible to patients.
                            </p>
                        </>
                    }
                    title="Unpublish Plan"
                    closeModal={() => setOpenUnpublishModal(false)}
                    handleunpublish={handleUnpublish}
                />
            )}
        </>
    );
};
