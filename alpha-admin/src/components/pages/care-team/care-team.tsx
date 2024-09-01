import classNames from 'classnames';
import styles from './care-team.module.scss';
import { CreateCareTeam } from './care-team-components/create-care-team/create-care-team';
import { CareTeamProfile } from './care-team-components/care-team-profile/care-team-profile';
import { AppButton } from '../../app-button/app-button';
import { CareTeamTable } from './care-team-components/care-team-table/care-team-table';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../back-button/backButton';

export interface CareTeamProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CareTeam = ({ className }: CareTeamProps) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
            <BackButton  onClick={handleBackClick}/>
            <div className={classNames('page-padding', className, styles['care-team-block'])}>
                <section className={styles['care-team-main-wrapper']}>
                    <header>
                        <h2>Care team members</h2>
                        <AppButton
                            buttonText="Add new care team member"
                            onButtonClick={() => navigate('/careteam/addcareteam')}
                        />
                    </header>
                    <CareTeamTable />
                </section>
            </div>
        </>
    );
};
