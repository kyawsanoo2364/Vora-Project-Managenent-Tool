export type JWTPayload = {
  sub: string;
  email: string;
};

export type GenerateTokenOptions = {
  isContainsRefreshToken?: boolean;
};
