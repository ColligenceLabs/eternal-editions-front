/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

const MAX = Number.MAX_SAFE_INTEGER;

let idCounter = Math.round(Math.random() * MAX);
export default function createRandomId() {
  idCounter %= MAX;
  // eslint-disable-next-line no-plusplus
  return idCounter++;
}
