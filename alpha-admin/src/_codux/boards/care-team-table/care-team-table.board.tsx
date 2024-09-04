import { createBoard } from '@wixc3/react-board';
import { CareTeamTable } from '../../../components/pages/care-team/care-team-components/care-team-table/care-team-table';

export default createBoard({
    name: 'CareTeamTable',
    Board: () => <CareTeamTable />,
    isSnippet: true,
});
