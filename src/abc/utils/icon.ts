/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import Identicon from 'identicon.js';

export function makeIcon(checksumAddress: string) {
  try {
    const data = new Identicon(checksumAddress, 64).toString();
    return `data:image/png;base64,${data}`;
  } catch (error) {}
}
