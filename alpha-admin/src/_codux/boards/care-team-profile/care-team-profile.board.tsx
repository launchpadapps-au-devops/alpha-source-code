import { createBoard } from '@wixc3/react-board';
import { CareTeamProfile } from '../../../components/pages/care-team/care-team-components/care-team-profile/care-team-profile';

export default createBoard({
    name: 'CareTeamProfile',
    Board: () => <CareTeamProfile />,
    isSnippet: true,
});
