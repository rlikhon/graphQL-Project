const { GraphQLError } = require('graphql');

// 1. Validation Error (Bad User Input)
class ValidationError extends GraphQLError {
    constructor(message, details = []) {
        super(message, {
            extensions: {
                code: 'BAD_USER_INPUT',
                http: { status: 400 },
                details // Useful for passing validation fields like: [{ field: 'email', error: 'Invalid format' }]
            }
        });
    }
}

// 2. Resource Not Found Error
class NotFoundError extends GraphQLError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, {
            extensions: {
                code: 'NOT_FOUND',
                http: { status: 404 }
            }
        });
    }
}

// 3. Authentication Error (Missing or Expired Token)
class AuthenticationError extends GraphQLError {
    constructor(message = 'Authentication required') {
        super(message, {
            extensions: {
                code: 'UNAUTHENTICATED', // Standard Apollo V4 code
                http: { status: 401 }
            }
        });
    }
}

// 4. Forbidden Error (Authenticated but lacks correct permissions)
class ForbiddenError extends GraphQLError {
    constructor(message = 'You do not have permission to perform this action') {
        super(message, {
            extensions: {
                code: 'FORBIDDEN',
                http: { status: 403 }
            }
        });
    }
}

// 5. Duplicate Conflict Error (e.g., Email already exists)
class DuplicateError extends GraphQLError {
    constructor(message = 'Resource already exists') {
        super(message, {
            extensions: {
                code: 'ALREADY_EXISTS',
                http: { status: 409 }
            }
        });
    }
}

// 6. Generic Internal System Failure
class InternalServerError extends GraphQLError {
    constructor(message = 'An unexpected internal server error occurred') {
        super(message, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                http: { status: 500 }
            }
        });
    }
}

module.exports = {
    ValidationError,
    NotFoundError,
    AuthenticationError,
    ForbiddenError,
    DuplicateError,
    InternalServerError
};
