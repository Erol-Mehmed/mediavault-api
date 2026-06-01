export function createAuthMocks() {
  return {
    usersService: {
      findByEmail: jest.fn(),
    },

    refreshTokensRepository: {
      create: jest.fn(),
      findByUserId: jest.fn(),
      revoke: jest.fn(),
    },

    jwtService: {
      sign: jest.fn(),
      verify: jest.fn(),
    },

    configService: {
      getOrThrow: jest.fn(),
    },
  };
}
