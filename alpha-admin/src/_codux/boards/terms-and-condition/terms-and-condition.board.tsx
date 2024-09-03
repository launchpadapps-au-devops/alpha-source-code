import { createBoard } from '@wixc3/react-board';
import { TermsAndCondition } from '../../../components/pages/terms-and-condition/terms-and-condition';

export default createBoard({
    name: 'TermsAndCondition',
    Board: () => <TermsAndCondition />,
    isSnippet: true,
});