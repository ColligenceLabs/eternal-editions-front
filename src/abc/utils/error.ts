/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

export class CustomError extends Error {
  name: string;
  timestamp: number;

  constructor({name, message}) {
    super();
    this.name = name;
    this.message = message;
  }

  toString() {
    return this.message;
  }
}

export const checkErrorInUI = (error, type) => {
  return error?.data?.originalError?.name === type;
};

export const makeAbcErrorDescription = error => {
  const foundCode = [
    400, 401, 404, 412, 422, 500, 600, 601, 602, 603, 604, 605, 606, 607, 608,
    609, 610, 611, 612, 613, 614, 615, 616, 800, 900,
  ].find(code => code === error?.data?.originalError?.code);
  if (!foundCode) {
    return;
  }
  return `txt_error_${foundCode}_desc`;
};
