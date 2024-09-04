import classNames from 'classnames';
import styles from './create-new-password.module.scss';
import { InputFieldLabel } from '../../../../input-field-label/input-field-label';
import { InputField } from '../../../../input-field/input-field';
import { AppButton } from '../../../../app-button/app-button';
import { useState } from 'react';
import { SavePassword } from '../save-password/save-password';

export interface CreateNewPasswordProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CreateNewPassword = ({ className }: CreateNewPasswordProps) => {
    const [saveModal, setSaveModal] = useState(false);


    function handleSaveModalOpen() {
        setSaveModal(!saveModal);
    }

    return <>
        <div className={styles['password-main-wrapper']}>
            <div className={styles['page-padding']}>
                <div className={styles['container']}>
                    <div className={styles['password-content-main-wrapper']}>
                        <h2 className={styles['password-heading']}>Create new password</h2>
                        <div className={styles['input-field-wrapper']}>
                            <InputFieldLabel labelText="Enter new password" />
                            <InputField placeholder="Enter new password"
                                isTypePassword
                                type="password" />
                        </div>
                        <div className={styles['input-field-wrapper']}>
                            <InputFieldLabel labelText="Confirm new password" />
                            <InputField placeholder="Confirm new password"
                                isTypePassword
                                type="password" />
                        </div>
                        <AppButton
                            buttonText='Save new password'
                            showLeftIcon={false}
                            showRightIcon={false} onButtonClick={handleSaveModalOpen} />
                        {saveModal && <SavePassword open={saveModal} />}
                    </div>
                </div>
            </div>
        </div>
    </>;
};
