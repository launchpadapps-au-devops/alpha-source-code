import { createBoard } from '@wixc3/react-board';
import { CreateCareTeam } from '../../../components/pages/care-team/care-team-components/create-care-team/create-care-team';

export default createBoard({
    name: 'CreateCareTeam',
    Board: () => <CreateCareTeam />,
    isSnippet: true,
});
