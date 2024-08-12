import { createBoard } from '@wixc3/react-board';
import { CreateNewPassword } from '../../../components/pages/create-account/create-account-components/create-new-password/create-new-password';

export default createBoard({
    name: 'CreateNewPassword',
    Board: () => <CreateNewPassword />,
    isSnippet: true,
});