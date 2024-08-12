import classNames from 'classnames';
import styles from './save-term-condition.module.scss';
import { CustomDialog, CustomDialogContent, CustomDialogTitle } from '../../../../mui-dialog-style';
import { Icon } from '../../../../icon/icon';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../../../app-button/app-button';

export interface SaveTermConditionProps {
    className?: string;
    open?: boolean;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SaveTermCondition = ({ className, open = false }: SaveTermConditionProps) => {
    return <>
        <CustomDialog
            //onClose={closeModal}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
                maxWidth: '300px !important',
            }}
        >
            <CustomDialogTitle id="customized-dialog-title">
                <div className={styles['save-password-header']}>
                    <div className={styles['icon-wrapper']}>
                        <Icon glyph={'check'} width={24} height={24} />
                    </div>
                    <div className={styles['save-password-heading-wrapper']}>
                        Saved
                        <span>Terms and conditions successfully updated.</span>
                    </div>

                </div>
            </CustomDialogTitle>
            <CustomDialogContent>
                <div className={styles['form-input-flex-block']}>
                    <div className={styles['input-wrapper']}>
                        <AppButton buttonText='Continue'
                            showLeftIcon={false}
                            showRightIcon={false}

                        />
                    </div>
                </div>
            </CustomDialogContent>
        </CustomDialog>
    </>;
};
