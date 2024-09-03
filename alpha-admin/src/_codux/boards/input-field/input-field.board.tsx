import { createBoard } from '@wixc3/react-board';
import { InputField } from '../../../components/input-field/input-field';

export default createBoard({
    name: 'InputField',
    Board: () => <InputField />,
    isSnippet: true,
});