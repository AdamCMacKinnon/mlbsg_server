import { Logger } from '@nestjs/common';
import { format } from 'date-fns';

export const dateForApi = async function () {
  try {
    const date = format(new Date(), 'yyyy-LL-dd');
    return date;
  } catch (error) {
    Logger.warn('Error Getting Date!');
    return error;
  }
};
