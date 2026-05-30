import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtClaims } from './jwt.strategy';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtClaims => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as JwtClaims;
});

