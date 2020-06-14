import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const tabsInCurrentWindow = await chromeTabs.getCurrentWindowTabs();
  const activeTab = tabsInCurrentWindow.find((tab) => tab.active);
  if (!activeTab) {
    return;
  }

  const lastTabIndex = tabsInCurrentWindow.length - 1;
  const setActiveTab = (activeTab.index === 0) ?
      tabsInCurrentWindow[lastTabIndex] :
      tabsInCurrentWindow[activeTab.index - 1];

  chromeTabs.activate(setActiveTab);
};
