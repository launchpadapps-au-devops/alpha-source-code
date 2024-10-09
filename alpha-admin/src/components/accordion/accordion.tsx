import classNames from 'classnames';
import styles from './accordion.module.scss';
import customStyles from './custom-accordion.module.scss';
import {
    CustomAccordion,
    CustomAccordionDetails,
    CustomAccordionSummary,
} from '../mui-accordion-style';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InputField } from '../input-field/input-field';

export interface CustomAccordionProps {
    className?: string;
    accordionText?: string;
    accordionContent?: string;
    accordionNumber?: string;
    isEditing?: boolean;
    onContentChange?: (key: string, value: string) => void; // Callback for content change
}

export const Accordion = ({
    className,
    accordionText,
    accordionContent,
    accordionNumber,
    isEditing,
    onContentChange,
}: CustomAccordionProps) => {
    return (
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
                                <InputField
                                    value={accordionText}
                                    onChange={(e) => onContentChange?.('heading', e.target.value)} // Optional chaining
                                    placeholder="Current heading"
                                />
                            </div>
                            <div className={styles['edit-accordion-body']}>
                                Body
                                <InputField
                                    value={accordionContent}
                                    onChange={(e) => onContentChange?.('body', e.target.value)} // Optional chaining
                                    placeholder="Current body"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CustomAccordionSummary>
            <CustomAccordionDetails aria-labelledby={`panel-${accordionNumber}-header`}>
                {!isEditing && accordionContent}
            </CustomAccordionDetails>
        </CustomAccordion>
    );
};
