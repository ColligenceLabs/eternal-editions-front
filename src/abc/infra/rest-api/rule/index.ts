/******************************************************************************
 *
 *  (C) 2022 AhnLab Blockchain Company, Inc. All rights reserved.
 *  Any part of this source code can not be copied with any method without
 *  prior written permission from the author or authorized person.
 *
 ******************************************************************************/

import {
  AddAutoconfirmDto,
  AddFavoriteDto,
  DeleteAutoconfirmDto,
  DeleteFavoriteDto,
  UpdateFavoriteDto,
} from '../../../schema/account';
import {apiClient} from '../../../utils/axios';

const getFuncSignature = async hash => {
  hash = hash.toString(16);
  const url =
    'https://www.4byte.directory/api/v1/signatures/?hex_signature=' + hash;
  try {
    const res = await fetch(url).then(data => {
      return data.json();
    });
    if (res.count > 0) {
      return res.results[0].text_signature;
    } else {
      return '';
    }
  } catch (err) {
    throw err;
  }
};

const addAutoconfirm = async (dto: AddAutoconfirmDto) => {
  try {
    const res = await apiClient.post('/v1/rule/auto-confirms/add', dto);

    if (res.status !== 200) {
      throw new Error(res.data.error);
    }

    if (!res.data.user) {
      throw new Error('No user in data');
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
};

const deleteAutoconfirm = async (dto: DeleteAutoconfirmDto) => {
  try {
    const res = await apiClient.post('/v1/rule/auto-confirms/delete', dto);

    if (res.status !== 200) {
      throw new Error(res.data.error);
    }

    if (!res.data.user) {
      throw new Error('No user in data');
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
};

const addFavorite = async (dto: AddFavoriteDto, accToken: string) => {
  try {
    const res = await apiClient.post('/v1/rule/favorite/add', dto, {
      headers: {
        authorization: 'Bearer ' + accToken,
      },
    });
    if (!res?.data?.user) {
      throw new Error('No user data');
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
};

const updateFavorite = async (dto: UpdateFavoriteDto, accessToken: string) => {
  try {
    const res = await apiClient.post('/v1/rule/favorite/update', dto, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
    });
    if (!res.data.user) {
      throw new Error('No user data');
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
};

const deleteFavorite = async (dto: DeleteFavoriteDto, accessToken: string) => {
  try {
    const res = await apiClient.post('/v1/rule/favorite/delete', dto, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
    });
    if (!res.data.user) {
      throw new Error('No user data');
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
};

// const resetTwofactorRetryCount = async accessToken => {
//   log.debug('resetTwofactorRetryCount');
//   try {
//     const res = await apiClient.post(
//       '/v1/rule/twofactor-reset-retry',
//       {},
//       {
//         headers: {
//           authorization: 'Bearer ' + accessToken,
//         },
//       }
//     );
//     if (!res.data.user) {
//       throw new Error('No user data');
//     }

//     return res.data.user;
//   } catch (error) {
//     throw error;
//   }
// };

export default {
  getFuncSignature,
  addAutoconfirm,
  deleteAutoconfirm,
  addFavorite,
  updateFavorite,
  deleteFavorite,
  // resetTwofactorRetryCount,
};
