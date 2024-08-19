import classNames from 'classnames';
import { Typography } from '@mui/material';
import styles from './viewLifestyle.module.scss';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from '../../../content/content-components/sidebar/Sidebar';
import { PublishButton } from '../../../content/content-components/publish-button/publishButton';
import { EditButton } from '../../../content/content-components/edit-button/edit-button';
import { AppButton } from '../../../../app-button/app-button';
import LifestyleInformation from './viewLifestyle-components/lifestyle-information/lifestyle-information';
import AssignedThemes from './viewLifestyle-components/assigned-themes/AssignedThemes';
import { useAppDispatch } from '../../../../../app/hooks';
import { fetchPlanByIdThunk, fetchPlansThunk } from '../lifeStyleSlice';
import { fetchThemeByIdThunk } from '../../../content/themes/themes-components/themeSlice';

export interface ContentProps {
    className?: string;
}

export const ViewLifeStyle = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isPublished } = location.state || {};
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [plan, setPlan] = useState<any>({});
    const [themes, setThemes] = useState<any>([]);
    const dispatch = useAppDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchPlanByIdThunk(id)).then((data: any) => {
            console.log('data', data);
            if (data.payload) {
                var plan = data.payload.data.data;
                setPlan(data.payload.data.data);
            }
        });
    }, []);

    return (
        <div className={classNames(styles.container, className, { 'blur-effect': isSidebarOpen })}>
            {/* <Sidebar /> */}
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.leftButtonContainer}>
                        <Typography variant="h5">Lifestyle plan</Typography>
                        {isPublished ? (
                            <PublishButton buttonText="Published" />
                        ) : (
                            <PublishButton buttonText="Unpublished" isUnpublished />
                        )}
                    </div>
                    <div className={styles.rightButtonContainer}>
                        <div className={styles.buttonContainer}>
                            {!isPublished && (
                                <AppButton
                                    buttonText="Publish"
                                    onButtonClick={() => navigate('/careteam/createcontent')}
                                />
                            )}

                            <EditButton
                                showLeftIcon
                                buttonText={
                                    isPublished == true ? 'Edit Plan' : 'Edit Lifestyle plan'
                                }
                                onButtonClick={() => navigate(`/lifestyle-plan/edit/${id}`)}
                            />
                        </div>
                    </div>
                </header>
                <LifestyleInformation
                    plan={plan}
                    setPlan={setPlan}
                    // planName="Heart health"
                    // planDuration="90 Days"
                    // planDescription="Heart health is a transformative theme designed to help individuals achieve optimal heart health and wellness. Participants will learn evidence-based strategies and practical techniques to enhance their heart health, leading to better overall health and well-being."
                    // internalNotes="Internal notes go here"
                />

                {plan && plan.id && <AssignedThemes plan={plan} />}
            </div>
        </div>
    );
};
