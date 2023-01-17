/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

// @ts-ignore
import extension from 'extensionizer';

export default class ExtensionPlatform {
  //
  // Public
  //
  reload() {
    extension.runtime.reload();
  }

  openTab(options: any) {
    return new Promise((resolve, reject) => {
      extension.tabs.create(options, (newTab: any) => {
        return resolve(newTab);
      });
    });
  }

  openWindow(options: any) {
    return new Promise((resolve, reject) => {
      extension.windows.create(options, (newWindow: any) => {
        return resolve(newWindow);
      });
    });
  }

  focusWindow(windowId: any) {
    return new Promise((resolve, reject) => {
      extension.windows.update(windowId, { focused: true }, () => {
        return resolve(true);
      });
    });
  }

  updateWindowPosition(windowId: any, left: any, top: any) {
    return new Promise((resolve, reject) => {
      extension.windows.update(windowId, { left, top }, () => {
        return resolve(true);
      });
    });
  }

  getLastFocusedWindow() {
    return new Promise((resolve, reject) => {
      extension.windows.getLastFocused((windowObject: any) => {
        return resolve(windowObject);
      });
    });
  }

  closeCurrentWindow() {
    return extension.windows.getCurrent((windowDetails: any) => {
      return extension.windows.remove(windowDetails.id);
    });
  }

  getVersion() {
    return extension.runtime.getManifest().version;
  }

  getAllWindows() {
    return new Promise((resolve, reject) => {
      extension.windows.getAll((windows: any) => {
        return resolve(windows);
      });
    });
  }

  getActiveTabs() {
    return new Promise((resolve, reject) => {
      extension.tabs.query({ active: true }, (tabs: any) => {
        return resolve(tabs);
      });
    });
  }

  currentTab() {
    return new Promise((resolve, reject) => {
      extension.tabs.getCurrent((tab: any) => {
        resolve(tab);
      });
    });
  }

  switchToTab(tabId: any) {
    return new Promise((resolve, reject) => {
      extension.tabs.update(tabId, { highlighted: true }, (tab: any) => {
        resolve(tab);
      });
    });
  }
}
