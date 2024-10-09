import classNames from 'classnames';
import styles from './privacy-policy.module.scss';
import { AppButton } from '../../app-button/app-button';
import { Accordion } from '../../accordion/accordion';
import AppButton_module from '../../app-button/app-button.module.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { getPolicyThunk, postPolicyThunk } from '../terms-and-condition/privacyPolicySlice'; // Import the postPolicyThunk

export interface PrivacyPolicyProps {
    className?: string;
}

// Define the type for the content item
interface ContentItem {
    heading: string;
    body: string;
}

export const PrivacyPolicy = ({ className }: PrivacyPolicyProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableContent, setEditableContent] = useState<ContentItem[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.policy);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(getPolicyThunk('privacy_policy'));
    }, [dispatch]);

    useEffect(() => {
        if (data?.data?.content) {
            // Initialize editable content with fetched content
            setEditableContent(
                data.data.content.map((item: any) => ({
                    heading: item.heading,
                    body: item.body,
                }))
            );
        }
    }, [data]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        // Prepare the content to match the expected format
        const accordionData = editableContent.map((item) => ({
            heading: item.heading,
            body: item.body,
        }));

        // Log the payload to ensure correct structure
        console.log('Payload to be sent:', { type: 'privacy_policy', content: accordionData });

        // Ensure the content is not empty
        if (
            accordionData.length === 0 ||
            accordionData.some((item) => !item.heading || !item.body)
        ) {
            console.error('Content cannot be empty.');
            return;
        }

        // Dispatch the postPolicyThunk with the correct payload structure
        dispatch(
            postPolicyThunk({
                type: 'privacy_policy',
                content: accordionData,
            })
        );

        // Exit edit mode after saving
        setIsEditing(false);
    };

    const handleContentChange = (index: number, key: string, value: string) => {
        const updatedContent = [...editableContent];
        updatedContent[index][key as keyof ContentItem] = value;
        setEditableContent(updatedContent);
    };

    return (
        <>
            <div className={styles['main-wrapper']}>
                <div className={styles['terms-header']}>
                    <span>View & update Privacy Policy for Patient Application</span>
                    {!isEditing && (
                        <AppButton
                            buttonText="Edit"
                            icon="edit"
                            showLeftIcon
                            onButtonClick={handleEditClick}
                        />
                    )}
                    {isEditing && (
                        <div className={styles['save-buttons-wrapper']}>
                            <AppButton
                                className={classNames(AppButton_module['button-blue-outlined'])}
                                buttonText="Cancel"
                                onButtonClick={handleCancelClick}
                            />
                            <AppButton buttonText="Save" onButtonClick={handleSaveClick} />
                        </div>
                    )}
                </div>
                <span className={styles['terms-detail']}>
                    Review the latest Privacy Policy or make any necessary updates.
                </span>
                <div className={styles.divider} />
                <span className={styles['accordion-list-heading']}>
                    Last updated{' '}
                    {data?.data?.updatedAt
                        ? new Date(data.data.updatedAt).toLocaleDateString()
                        : 'No updates available'}
                </span>

                <ul className={styles['accordion-list-wrapper']}>
                    {editableContent.map((item, index) => (
                        <li key={index}>
                            <Accordion
                                accordionNumber={`${index + 1}`}
                                accordionText={item.heading}
                                accordionContent={item.body}
                                isEditing={isEditing}
                                onContentChange={(key, value) =>
                                    handleContentChange(index, key, value)
                                }
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
