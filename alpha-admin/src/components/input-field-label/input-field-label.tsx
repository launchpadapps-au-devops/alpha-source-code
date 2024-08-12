import classNames from 'classnames';
import styles from './input-field-label.module.scss';

export interface InputFieldLabelProps {
    className?: string;
    labelText?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const InputFieldLabel = ({ className, labelText }: InputFieldLabelProps) => {
    return (
        <>
            <div className={styles['input-label-wrapper']}>{labelText}</div>
        </>
    );
};
