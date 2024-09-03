import classNames from 'classnames';
import styles from './buttontest.module.scss';

export interface ButtontestProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const Buttontest = ({ className }: ButtontestProps) => {
    return <div className={classNames(styles.root, className)}>Buttontest</div>;
};
