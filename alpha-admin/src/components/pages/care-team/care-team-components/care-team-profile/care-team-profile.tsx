import classNames from 'classnames';
import styles from './care-team-profile.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import Avatar from '@mui/material/Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { useEffect } from 'react';
import { getStaffRoleThunk, staffThunk } from '../create-care-team/create-care-teamSlice';
import { Filter } from '@mui/icons-material';
import React from 'react';

export interface CareTeamProfileProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CareTeamProfile = ({ className }: CareTeamProfileProps) => {
    const navigate = useNavigate();
    const { staff, loading, errorMessage } = useSelector((state: RootState) => state.staff.staff);
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();

    const [member, setMember] = React.useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        fullName: '',
        phone: '',
        role: {
            id: '',
            name: '',
        },
        permissions: [
            {
                id: '',
                name: '',
            },
        ],
    });

    useEffect(() => {
        console.log('dddd', dispatch(getStaffRoleThunk(params.id)));
        dispatch(getStaffRoleThunk(params.id)).then((response: any) => {
            setMember(response.payload.data);
        });
    }, [dispatch]);

    // const dummydata =  {
    //     "id": 6,
    //     "email": "akshatha@launchpadapps.co",
    //     "firstName": "Smith",
    //     "lastName": "Jane",
    //     "fullName": "Smith undefined Jane",
    //     "roles": [
    //         {
    //             "id": 1,
    //             "name": "Practice Manager"
    //         }
    //     ]
    // }

    const handleEditClick = (memberId: string) => {
        navigate(`/careteam/editteamcare/${memberId}`);
    };
    return (
        <>
            {' '}
            {member && (
                <div className={classNames(styles['care-team-profile'], className)}>
                    <div className={classNames(styles['top-header-block'])}>
                        <h2>Create new care team member</h2>
                        <AppButton
                            buttonText="Edit profile"
                            showLeftIcon
                            icon="edit"
                            onButtonClick={() => handleEditClick(member.id)}
                        />
                    </div>
                    <div className={classNames(styles['profile-detail-wrapper'])}>
                        <div className={styles['left-profile-block']}>
                            <Avatar
                                className={styles['profile-image']}
                                // alt="Remy Sharp"
                                src="/static/images/avatar/1.jpg"
                            />
                            <div className={styles['profile-info']}>
                                <span className={styles['profile-name']}>
                                    {member.firstName}
                                    {member.lastName}
                                </span>
                                <span className={styles['profile-role']}>{member.role.name}</span>
                            </div>
                            <div className={styles['profile-info']}>
                                <span className={styles['profile-workplace']}>Healthicare</span>
                                <span className={styles['profile-status']}>
                                    {member.permissions.length > 0
                                        ? member.permissions[0].name
                                        : null}
                                </span>
                            </div>
                        </div>
                        <div className={styles['right-profile-block']}>
                            <h3>Personal details</h3>
                            <div className={styles['details-block']}>
                                <div className={styles['profile-details-wrapper']}>
                                    <span className={styles['label']}>Email</span>
                                    <span className={styles['details']}>{member.email}</span>
                                </div>
                                <div className={styles['profile-details-wrapper']}>
                                    <span className={styles['label']}>Phone</span>
                                    <span className={styles['details']}>{member.phone}</span>
                                </div>
                                {/* <div className={styles['profile-details-wrapper']}>
                            <span className={styles['label']}>Address</span>
                            <span className={styles['details']}>
                                10 Gumtree court, Sydney, NSW, 2001
                            </span>
                        </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
