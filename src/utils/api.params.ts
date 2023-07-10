import { format } from 'date-fns';

export const dateForApi = async function () {
  try {
    const date = format(new Date(), 'yyyy-LL-dd');
    console.log(date);
    return date;
  } catch (error) {
    console.log('error getting date');
    return error;
  }
};
