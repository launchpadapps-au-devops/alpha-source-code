import classNames from 'classnames';
import styles from './content.module.scss';
import { AppButton } from '../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from './content-components/sidebar/Sidebar';
// import ContentTab from './content-components/content-tab/ContentTab';
// import Categories from './content-components/categories/Categories';

export interface ContentProps {
    className?: string;
}

export const Content = ({ className }: ContentProps) => {
    const navigate = useNavigate();

    return (
        <div className={classNames(styles.container, className)}>
            <Sidebar />
            <div className={styles.content}>
                {/* <header className={styles.header}>
                <h3>Categories</h3>
                    <AppButton buttonText="+ Create content" onButtonClick={() => navigate('/careteam/createcontent')} />
                </header> */}
                {/* <ContentTab />
                <Categories/> */}
            </div>
        </div>
    );
};
