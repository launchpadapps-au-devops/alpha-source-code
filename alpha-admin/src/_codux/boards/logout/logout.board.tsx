import { createBoard } from '@wixc3/react-board';
import { Logout } from '../../../components/pages/logout/logout';

export default createBoard({
    name: 'Logout',
    Board: () => <Logout />,
    isSnippet: true,
    environmentProps: {
        canvasWidth: 5,
    },
});
