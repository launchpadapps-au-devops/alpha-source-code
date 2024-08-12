import classNames from 'classnames';
import styles from './terms-and-condition.module.scss';
import { AppButton } from '../../app-button/app-button';
import { Accordion } from '../../accordion/accordion';
import AppButton_module from '../../app-button/app-button.module.scss';
import React, { useState } from 'react';

export interface TermsAndConditionProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const TermsAndCondition = ({ className }: TermsAndConditionProps) => {
    const [saveModal, setSaveModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        // Save changes logic
        setIsEditing(false);
    };

    function handleSaveModalOpen() {
        setSaveModal(!saveModal);
    }


    return (
        <>
            <div className={styles['main-wrapper']}>
                <div className={styles['terms-header']}>
                    <span>View & update Terms and Conditions for Patient Application</span>
                    {!isEditing && (
                        <AppButton buttonText="Edit" icon="edit" showLeftIcon onButtonClick={handleEditClick} />
                    )}
                    {isEditing && (
                        <div className={styles['save-buttons-wrapper']}>
                            <AppButton className={classNames(AppButton_module['button-blue-outlined'])} buttonText="Cancel" onButtonClick={handleCancelClick} />
                            <AppButton
                                buttonText="Save" onButtonClick={handleSaveClick} />
                        </div>
                    )}
                </div>
                <span className={styles['terms-detail']}>
                    Review the latest Terms and Conditions or make any necessary updates.
                </span>
                <div className={styles.divider} />
                <span className={styles['accordion-list-heading']}>Last updated xx/xx/xx</span>
                <li className={styles['accordion-list-wrapper']}>
                    <Accordion
                        accordionNumber='1'
                        accordionText='Heading'
                        accordionContent='You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. '
                        isEditing={isEditing}
                    />
                    <Accordion
                        accordionNumber='2'
                        accordionText='Heading'
                        accordionContent='You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. '
                        isEditing={isEditing}
                    />
                </li>
            </div>
        </>
    );
};
