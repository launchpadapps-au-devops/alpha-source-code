import { createBoard } from '@wixc3/react-board';
import { SavePassword } from '../../../components/pages/create-account/create-account-components/save-password/save-password';

export default createBoard({
    name: 'SavePassword',
    Board: () => <SavePassword />,
    isSnippet: true,
});