import classNames from 'classnames';
import styles from './uploadButton.module.scss';
import { Glyph, Icon } from '../../../../icon/icon';
import React, { useRef } from 'react';
import { useAppDispatch } from '../../../../../app/hooks';
import { uploadFile } from '../../../../fileUpload/fileUploadSlice';

export interface UploadButtonProps {
    className?: string;
    buttonText?: string;
    onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    icon?: Glyph;
    isDeleteButton?: boolean;
    data: any;
    setData: any;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadButton = React.forwardRef<HTMLButtonElement, UploadButtonProps>(
    (
        {
            className,
            buttonText,
            onButtonClick,
            showLeftIcon,
            showRightIcon,
            icon,
            isDeleteButton,
            data,
            setData,
            handleFileChange,
            ...props
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const fileInputRef = useRef<HTMLInputElement | null>(null);

        const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
            if (onButtonClick) {
                onButtonClick(e);
            }
        };

        return (
            <>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <button
                    {...props}
                    ref={ref}
                    className={classNames(
                        styles['button-primary'],
                        {
                            [styles['button-delete']]: isDeleteButton, // Apply delete button styles if true
                        },
                        className
                    )}
                    onClick={handleButtonClick}
                >
                    {showLeftIcon && (
                        <Icon
                            glyph={icon || 'upload'} // Use icon to determine the icon
                            currentColor="blue"
                            width={20}
                            height={20}
                        />
                    )}
                    {buttonText}
                    {showRightIcon && (
                        <Icon
                            glyph={icon || 'upload'} // Use icon to determine the icon
                            currentColor="blue"
                            width={20}
                            height={20}
                        />
                    )}
                </button>
            </>
        );
    }
);

UploadButton.displayName = 'UploadButton';
