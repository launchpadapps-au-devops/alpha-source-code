import { createBoard } from '@wixc3/react-board';
import { SettingDashboard } from '../../../components/setting-dashboard/setting-dashboard';

export default createBoard({
    name: 'SettingDashboard',
    Board: () => <SettingDashboard />,
    isSnippet: true,
});