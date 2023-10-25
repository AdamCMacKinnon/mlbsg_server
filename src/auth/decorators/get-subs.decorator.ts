import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SubLeagues } from '../../subs/subs.entity';

export const GetSubLeagues = createParamDecorator(
  (_data, ctx: ExecutionContext): SubLeagues => {
    const req = ctx.switchToHttp().getRequest();
    return req.subLeagues;
  },
);
