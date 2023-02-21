import { Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { User } from '../auth/user.entity';

export const getPickId = async function (user: User) {
  try {
    const userInfo = user.id.slice(0, 8);
    const dateSec = await format(new Date(), 'yyyymmddhhmmss');
    const finalId = userInfo + '-' + dateSec;
    Logger.log(`Pick ID Generated Successfully`);
    return finalId;
  } catch (error) {
    Logger.error(`An ERROR OCCURED: ${error}`);
    return error;
  }
};
