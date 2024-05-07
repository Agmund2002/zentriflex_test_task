export const AuthResponseExample = {
  headers: {
    'Set-Cookie': {
      description: 'Refresh token',
      schema: {
        type: 'string'
      }
    }
  },
  content: {
    'application/json': {
      example: {
        user: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Tom',
          email: 'test@gmail.com'
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTc5OTFlOWNiMDQ4MWM0NmUzNjE0NiIsImlhdCI6MTcwOTY3NjgzMCwiZXhwIjoxNzA5NjgwNDMwfQ.jCQulMoUbRdq1DLJz4wRSAh1kGGRiJ1ARHs2cnHzfxk'
      }
    }
  }
}
