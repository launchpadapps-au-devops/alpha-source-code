import { createBoard } from '@wixc3/react-board';
import { Dashboard } from '../../../components/pages/dashboard/dashboard';

export default createBoard({
    name: 'Dashboard',
    Board: () => <Dashboard />,
    isSnippet: true,
});