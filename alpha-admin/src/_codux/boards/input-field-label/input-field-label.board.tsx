import { createBoard } from '@wixc3/react-board';
import { InputFieldLabel } from '../../../components/input-field-label/input-field-label';

export default createBoard({
    name: 'InputFieldLabel',
    Board: () => <InputFieldLabel />,
    isSnippet: true,
});