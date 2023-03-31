/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import log from 'loglevel';

import ExtensionPlatform from '../../background/platforms/extension';

let NOTIFICATION_HEIGHT: any = null;
let NOTIFICATION_WIDTH: any = null;

if (typeof window !== 'undefined') {
  NOTIFICATION_HEIGHT = navigator.platform.toLocaleLowerCase().includes('mac') ? 600 : 640;
  NOTIFICATION_WIDTH = navigator.platform.toLocaleLowerCase().includes('mac') ? 360 : 376;
}

export default class NotificationManager {
  platform;
  _popupId: any;

  constructor() {
    this.platform = new ExtensionPlatform();
  }

  async showPopup(url: string) {
    log.debug(`showPopup url: ${url}`);

    const popup = await this._getPopup();

    // Bring focus to chrome popup
    if (popup) {
      // bring focus to existing chrome popup
      await this.platform.focusWindow(popup.id);
    } else {
      let left = 0;
      let top = 0;
      try {
        const lastFocused: any = await this.platform.getLastFocusedWindow();
        // Position window in top right corner of lastFocused window.
        top = lastFocused.top;
        left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
      } catch (_) {
        // The following properties are more than likely 0, due to being
        // opened from the background chrome process for the extension that
        // has no physical dimensions
        const { screenX, screenY, outerWidth } = window;
        top = Math.max(screenY, 0);
        left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0);
      }

      // create new notification popup
      const popupWindow: any = await this.platform.openWindow({
        url,
        type: 'popup',
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left,
        top: top + 80,
      });

      // Firefox currently ignores left/top for create, but it works for update
      if (popupWindow.left !== left && popupWindow.state !== 'fullscreen') {
        log.debug('update popup');
        await this.platform.updateWindowPosition(popupWindow.id, left - 10, top + 80);
      }
      this._popupId = popupWindow.id;
    }
  }

  async _getPopup() {
    const windows = await this.platform.getAllWindows();
    return this._getPopupIn(windows);
  }

  _getPopupIn(windows: any) {
    return windows
      ? windows.find((win: any) => {
          // Returns notification popup
          return win && win.type === 'popup' && win.id === this._popupId;
        })
      : null;
  }
}
