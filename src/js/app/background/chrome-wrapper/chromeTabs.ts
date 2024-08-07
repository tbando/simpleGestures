import Tab = chrome.tabs.Tab;

export const chromeTabs = {
  activate(tab: Tab): void {
    chrome.tabs.update(tab.id, {active: true});
  },
  async activateOrCreate(url: null|string = null) {
    const extensionTab: null|Tab = await chromeTabs.findSameUrlInCurrentWindow(url);

    if (extensionTab) {
      chromeTabs.activate(extensionTab);
    } else {
      chromeTabs.createLast(url);
    }
  },
  close(tab: Tab|Tab[]): void {
    if (Array.isArray(tab)) {
      const removeTabIds: number[] = tab.map((tab) => tab.id);
      chrome.tabs.remove(removeTabIds);
    } else {
      chrome.tabs.remove(tab.id);
    }
  },
  move(tab: Tab|Tab[], pos: number): void {
    if (Array.isArray(tab)) {
      const moveTabIds: number[] = tab.map((tab) => tab.id);
      chrome.tabs.move(moveTabIds, {index: pos});
    } else {
      chrome.tabs.move(tab.id, {index: pos});
    }
  },
  async createActiveRight(url: null|string = null, active = true) {
    const activeTab: Tab = await chromeTabs.getActiveTab();
    const indexOfAppendingTab: number = activeTab.index + 1;

    chrome.tabs.create({
      active: active,
      index: indexOfAppendingTab,
      url: url,
    });
  },
  createLast(url: null|string = null, active = true) {
    chrome.tabs.create({
      active: active,
      url: url,
    });
  },
  async findSameUrlInCurrentWindow(url: string): Promise<Tab|undefined> {
    const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
    return tabsInCurrentWindow.find((tab) => tab.url === url);
  },
  getActiveTab(): Promise<Tab> {
    return new Promise((resolve) => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs: Tab[]) {
        resolve(tabs[0]);
      });
    });
  },
  getCurrentWindowTabs(): Promise<Tab[]> {
    return new Promise((resolve) => {
      chrome.tabs.query({currentWindow: true}, (tabsInCurrentWindow: Tab[]) => {
        resolve(tabsInCurrentWindow);
      });
    });
  },
  reload(tab: Tab, discardCache = false): void {
    chrome.tabs.reload(tab.id, {bypassCache: discardCache});
  },
};
