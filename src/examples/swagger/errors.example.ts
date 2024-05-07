export const ConflictResponseExample = {
  content: {
    'application/json': {
      example: {
        message: 'User already exists',
        error: 'Conflict',
        statusCode: 409
      }
    }
  }
}

export const NotFoundResponseExample = {
  content: {
    'application/json': {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404
      }
    }
  }
}

export const UnauthorizedResponseExample = {
  content: {
    'application/json': {
      example: {
        message: 'Reason not authorized',
        error: 'Unauthorized',
        statusCode: 401
      }
    }
  }
}

export const BadRequestResponseExample = {
  content: {
    'application/json': {
      example: {
        message: ['class validator error massage'],
        error: 'Bad Request',
        statusCode: 400
      }
    }
  }
}
