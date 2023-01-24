import { format } from 'date-fns';
import { User } from 'src/auth/user.entity';

export const getPickId = async function (user: User) {
  const userInfo = user.id.slice(0, 8);
  const dateSec = await format(new Date(), 'yyyymmddhhmmss');
  const finalId = userInfo + '-' + dateSec;
  return finalId;
};
