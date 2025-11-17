import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const extractContext = (context: ExecutionContext) => {
  const isGraphql = context.getType<GqlContextType>() === 'graphql';
  let req;
  let args;
  if (isGraphql) {
    const gql = GqlExecutionContext.create(context);
    req = gql.getContext().req;
    args = gql.getArgs();
  } else {
    const http = context.switchToHttp();
    req = http.getRequest();
    args = { ...req.body, ...req.params };
  }

  return { req, args };
};
