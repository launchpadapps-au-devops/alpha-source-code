import classNames from 'classnames';
import styles from './accordion.module.scss';
import customStyles from './custom-accordion.module.scss';
import { CustomAccordion, CustomAccordionDetails, CustomAccordionSummary } from '../mui-accordion-style';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InputField } from '../input-field/input-field';

export interface CustomAccordionProps {
    className?: string;
    accordionText?: string;
    accordionContent?: string;
    accordionNumber?: string;
    isEditing?: boolean;

}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Accordion = ({ className, accordionText, accordionContent, accordionNumber, isEditing }: CustomAccordionProps) => {
    return <>
        <CustomAccordion>
            <CustomAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <div className={styles['accordion-header']}>
                    <div className={styles['number-wrapper']}>{accordionNumber}</div>
                    {!isEditing && accordionText}
                    {isEditing && (
                        <div className={styles['edit-accordion-wrapper']}>
                            <div className={styles['edit-accordion-header']}>
                                Heading
                                <InputField placeholder="Current heading" />
                            </div>
                            <div className={styles['edit-accordion-body']}>
                                Body
                                <InputField placeholder='InCurrent body text Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />
                            </div>
                        </div>
                    )}
                </div>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
                {accordionContent}
            </CustomAccordionDetails>
        </CustomAccordion>
    </>
};
