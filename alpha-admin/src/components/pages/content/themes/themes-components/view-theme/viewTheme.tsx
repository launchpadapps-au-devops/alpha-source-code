import classNames from 'classnames';
import {
    Box,
    Typography,
    Button,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
} from '@mui/material';
import styles from './viewTheme.module.scss';
import { AppButton } from '../../../../../app-button/app-button';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../../content-components/sidebar/Sidebar';
import { useEffect, useState } from 'react';
import ThemeInformation from './viewTheme-components/theme-information/theme-information';
import AssignedLessons from './viewTheme-components/theme-tags/themeTags';
import { HabitAssigned } from './viewTheme-components/habit-assigned/habitAssigned';
import { EditButton } from '../../../content-components/edit-button/edit-button';
import { PublishButton } from '../../../content-components/publish-button/publishButton';
import { useAppDispatch } from '../../../../../../app/hooks';
import { fetchThemeByIdThunk, updateThemeThunk } from '../themeSlice';
import { updateTheme } from '../themeAPI';

export interface ContentProps {
    className?: string;
}

export const ViewThemes = ({ className }: ContentProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isPublished } = location.state || {};
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<any>({});
    const params = useParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchThemeByIdThunk(params.id)).then((response: any) => {
            setTheme(response.payload.data);
            console.log(response.payload.data);
        });
    }, []);

    const handlePublish = () => {
        console.log('Publish');
        const newData = {
            themeData: {
                isPublished: !theme.isPublished,
            },
        };
        dispatch(updateThemeThunk({ id: params.id, theme: newData }))
            .then((response: any) => {
                navigate('/content/themes');
            })
            .catch((error: any) => {
                console.log('Response ERROR ', error);
                alert('Error updating theme');
            });
    };

    return (
        <div className={classNames(styles.container, className, { 'blur-effect': isSidebarOpen })}>
            <Sidebar />
            <div className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.leftButtonContainer}>
                        <Typography variant="h5">View themes</Typography>
                        {isPublished ? (
                            <PublishButton
                                buttonText="Published"
                                onButtonClick={() => handlePublish()}
                            />
                        ) : (
                            <PublishButton buttonText="Unpublished" isUnpublished />
                        )}
                    </div>
                    <div className={styles.rightButtonContainer}>
                        <div className={styles.buttonContainer}>
                            <EditButton
                                showLeftIcon
                                buttonText="Edit"
                                onButtonClick={() =>
                                    navigate(`/content/themes/editTheme/${params.id}`)
                                }
                            />
                            {!isPublished && (
                                <AppButton
                                    buttonText="Publish"
                                    onButtonClick={() => handlePublish()}
                                />
                            )}
                        </div>
                    </div>
                </header>
                <ThemeInformation theme={theme} />
                <AssignedLessons theme={theme} />
                <HabitAssigned theme={theme} />
            </div>
        </div>
    );
};
