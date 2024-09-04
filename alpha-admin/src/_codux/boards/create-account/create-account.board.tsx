import { createBoard } from '@wixc3/react-board';
import { CreateAccount } from '../../../components/pages/create-account/create-account';

export default createBoard({
    name: 'CreateAccount',
    Board: () => <CreateAccount />,
    isSnippet: true,
});