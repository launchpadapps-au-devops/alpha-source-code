import { createBoard } from '@wixc3/react-board';
import { CareTeam } from '../../../components/pages/care-team/care-team';

export default createBoard({
    name: 'CareTeam',
    Board: () => <CareTeam />,
    isSnippet: true,
});
