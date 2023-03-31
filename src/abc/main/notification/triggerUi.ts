/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import NotificationManager from '../notification';
import ExtensionPlatform from '../../background/platforms/extension';

const platform = new ExtensionPlatform();
const notificationManager = new NotificationManager();

let uiIsTriggering = false;

async function triggerUi(url: string) {
  // close existing popups
  const tabs: any = await platform.getActiveTabs();
  // const popups = tabs.slice(1);
  // popups.forEach(item => extension.windows.remove(item.windowId));

  // const currentlyActiveMetamaskTab = Boolean(
  //   tabs.find(tab => openMetamaskTabsIDs[tab.id])
  // );
  // if (!popupIsOpen && !currentlyActiveMetamaskTab) {
  if (!uiIsTriggering) {
    uiIsTriggering = true;
    try {
      await notificationManager.showPopup(url);
    } finally {
      uiIsTriggering = false;
    }
  }
}

export default triggerUi;
