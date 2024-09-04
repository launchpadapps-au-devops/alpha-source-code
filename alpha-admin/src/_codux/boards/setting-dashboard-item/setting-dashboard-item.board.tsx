import { createBoard } from '@wixc3/react-board';
import { SettingDashboardItem } from '../../../components/setting-dashboard/setting-components/setting-dashboard-item/setting-dashboard-item';

export default createBoard({
    name: 'SettingDashboardItem',
    Board: () => <SettingDashboardItem />,
    isSnippet: true,
});