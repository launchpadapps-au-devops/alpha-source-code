import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './lifestyleTable.module.scss';
import { useAppDispatch } from '../../../../../app/hooks';
import { fetchPlansThunk, updatePlanThunk } from '../lifeStyleSlice';

const initialLifeStyles = [
    { code: 1, name: 'Heart health', dateCreated: '26/06/2024', published: false },
    { code: 2, name: 'Healthy Plan', dateCreated: '26/06/2024', published: false },
    { code: 3, name: 'Pregnancy', dateCreated: '26/06/2024', published: true },
];

export interface lifeStyleProps {
    plans: any;
    setPlans: any;
}

export const LifestyleTable: React.FC<lifeStyleProps> = ({ plans, setPlans }) => {
    const [LifeStyles, setLifeStyles] = useState(initialLifeStyles);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleToggle = (theme: any) => {
        const newTheme = {
            planData: {
                planCode: theme.code,
                name: theme.name,
                image: theme.image,
                description: theme.description,
                internalNotes: theme.internalNotes,
                status: theme.status,
                isPublished: !theme.isPublished,
                id: theme.id,
            },
            themes: theme.themes,
        };
        dispatch(updatePlanThunk({ id: theme.id, plan: newTheme })).then((data: any) => {
            dispatch(fetchPlansThunk()).then((data: any) => {
                if (data.payload) {
                    setPlans(data.payload.data);
                }
            });
        });
    };

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            setLifeStyles((prevLifeStyles) =>
                prevLifeStyles.map((theme, i) =>
                    i === selectedThemeIndex ? { ...theme, published: true } : theme
                )
            );
        }
        setOpenPublishModal(false);
    };

    const handleUnpublish = () => {
        if (selectedThemeIndex !== null) {
            setLifeStyles((prevLifeStyles) =>
                prevLifeStyles.map((theme, i) =>
                    i === selectedThemeIndex ? { ...theme, published: false } : theme
                )
            );
        }
        setOpenUnpublishModal(false);
    };

    const handleCloseModal = () => {
        setOpenPublishModal(false);
        setOpenUnpublishModal(false);
    };

    const handleRowClick = (id: any) => {
        navigate(`/lifestyle-plan/view/${id}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={styles['key-contacts-table']}>
                    <TableHead>
                        <TableRow
                            style={{
                                textTransform: 'none',
                                fontFamily: 'Public Sans',
                                fontSize: '14px',
                            }}
                        >
                            <TableCell className={styles['code']}>Plan name</TableCell>
                            <TableCell className={styles['date']}>Date created</TableCell>
                            <TableCell className={styles['published']}>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((theme: any, index: any) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(theme.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['code']}>{theme.name}</TableCell>
                                <TableCell>{theme.createdAt}</TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={theme.isPublished}
                                        onChange={() => handleToggle(theme)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <Pagination
                    count={Math.ceil(plans.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                />
            </div>
            {/* {openPublishModal && selectedThemeIndex !== null && (
                <PublishLessonModal
                    open={openPublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to publish this lesson?</p>
                            <br />
                            <p>This lesson will be made available to patients.</p>
                        </>
                    }
                    title="Publish lesson"
                    closeModal={handleCloseModal}
                    handlePublish={handlePublish}
                />
            )} */}
            {/* {openUnpublishModal && selectedThemeIndex !== null && (
                <UnpublishLessonModal
                    open={openUnpublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to unpublish this lesson?</p>
                            <br />
                            <p>
                                This lesson will be saved to ‘Drafts’ and won’t be visible to
                                patients.
                            </p>
                        </>
                    }
                    title="Unpublish lesson"
                    closeModal={handleCloseModal}
                    handleunpublish={handleUnpublish}
                />
            )} */}
        </>
    );
};
