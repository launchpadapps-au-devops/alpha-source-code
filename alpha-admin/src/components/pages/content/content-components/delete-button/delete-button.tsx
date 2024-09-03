import classNames from 'classnames';
import styles from './delete-button.module.scss';
import { Glyph, Icon } from '../../../../icon/icon';

export interface DeleteButtonProps {
    className?: string;
    buttonText?: string;
    onButtonClick?: (e: any) => void;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    icon?: Glyph;
}

export const DeleteButton = ({
    className,
    buttonText,
    onButtonClick,
    showLeftIcon,
    showRightIcon,
    icon,
    ...props
}: DeleteButtonProps) => {
    return (
        <>
            <button
                {...props}
                className={classNames(styles['button-primary'], className)}
                onClick={onButtonClick}
            >
                {showLeftIcon && (
                    <Icon
                        glyph={icon || 'delete'}
                        currentColor="red" // Updated icon color to red
                        width={20}
                        height={20}
                    />
                )}
                {buttonText}
                {showRightIcon && (
                    <Icon
                        glyph={icon || 'delete'}
                        currentColor="red" // Updated icon color to red
                        width={20}
                        height={20}
                    />
                )}
            </button>
        </>
    );
};
