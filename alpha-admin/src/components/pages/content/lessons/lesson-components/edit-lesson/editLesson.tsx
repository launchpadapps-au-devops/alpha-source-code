// import classNames from 'classnames';
// import {
//     Box,
//     Typography,
//     Button,
//     Switch,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Tabs,
//     Tab,
// } from '@mui/material';
// import styles from './editLesson.module.scss';
// import { AppButton } from '../../../../../app-button/app-button';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../../../content-components/sidebar/Sidebar';
// import { EditButton } from '../../../content-components/edit-button/edit-button';
// import { LessonInformation } from '../create-new-lesson/createNewLesson-components/lessonInformation/lessonInformation';
// import { InternalNotes } from '../create-new-lesson/createNewLesson-components/InternalNotes/internalNotes';
// import DashboardCardDetails from '../create-new-lesson/createNewLesson-components/dashboardcarddetails/dashBoardCardDetails';
// import LessonContent from '../create-new-lesson/createNewLesson-components/lessonContent/lessonContent';
// import { DeleteButton } from '../../../content-components/delete-button/delete-button';
// import React from 'react';

// export interface ContentProps {
//     className?: string;
// }

// export const EditLesson = ({ className }: ContentProps) => {
//     const [notes, setNotes] = React.useState<string>('');
//     const navigate = useNavigate();

//     return (
//         <div className={classNames(styles.container, className)}>
//             <Sidebar />
//             <div className={styles.content}>
//                 <header className={styles.header}>
//                     <Typography variant="h5">Edit lesson</Typography>
//                     <div className={styles.leftButtonContainer}>
//                         <DeleteButton showLeftIcon />
//                         <EditButton
//                             buttonText="Cancel"
//                             onButtonClick={() => navigate('/careteam/createcontent')}
//                         />
//                     </div>
//                     <div className={styles.buttonContainer}>
//                         <div className={styles.rightButtonContainer}>
//                             <EditButton
//                                 buttonText="Save"
//                                 onButtonClick={() => navigate('/careteam/createcontent')}
//                             />
//                             <AppButton
//                                 buttonText="Preview"
//                                 onButtonClick={() => navigate('/careteam/createcontent')}
//                             />
//                         </div>
//                     </div>
//                 </header>
//                 <div className={styles.mainContent}>
//                     <LessonInformation />
//                     <div className={styles.rightContent}>
//                         <InternalNotes notes={notes} setNotes={setNotes} />
//                         <DashboardCardDetails />
//                         <LessonContent />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
