import classNames from 'classnames';
import styles from './assessment-card.module.scss';
import { AssessmentBadge } from '../../assessment-badge/assessment-badge';

export interface AssessmentCardProps {
    className?: string;
    question: string;
    answers: string[];
}

export const AssessmentCard = ({ className, question, answers }: AssessmentCardProps) => {
    return (
        <div className={classNames(styles['assessment-card-wrapper'], className)}>
            <div className={styles['question-text']}>{question}</div>
            <div className={styles['answer-block']}>
                {answers.map((answer, index) => (
                    <AssessmentBadge key={index} text={answer} />
                ))}
            </div>
        </div>
    );
};
