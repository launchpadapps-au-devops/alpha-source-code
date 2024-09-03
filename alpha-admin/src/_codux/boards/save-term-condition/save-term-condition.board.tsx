import { createBoard } from '@wixc3/react-board';
import { SaveTermCondition } from '../../../components/pages/terms-and-condition/terms-components/save-term-condition/save-term-condition';

export default createBoard({
    name: 'SaveTermCondition',
    Board: () => <SaveTermCondition />,
    isSnippet: true,
});