/**
 * Created by gregoirelafitte on 6/29/16.
 */

"use strict";

class TwinderError extends Error {
    constructor (message, httpStatusCode) {
        super(message);
        this.message = message || 'An error occurred';
        this.name = this.constructor.name;
        this.httpStatusCode = httpStatusCode || 500;
    }
}


class NotFoundError extends TwinderError {
    constructor (message) {
        super(message || 'Page not found', 404);
    }
}


class MissingParameterError extends TwinderError {
    constructor (message) {
        super(message || 'A mandatory request parameter is missing', 422);
    }
}

class InvalidParameterError extends TwinderError {
    constructor (message) {
        super(message || 'Parameter is invalid', 422);
    }
}

class InvalidEntityError extends TwinderError {
    constructor (error) {
        super('Entity is invalid, validation failed', 422);
        if (error instanceof Error) {
            if (error.name == 'SequelizeValidationError') {
                this.errors = [];
                for (let i = 0 ; i < error.errors.length ; i++) {
                    this.errors.push(error.errors[i].message);
                }
            } else {
                this.errors = [error.message];
            }
        } else {
            this.errors = error;
        }
    }
}


class InvalidTokenError extends TwinderError {
    constructor (message) {
        super(message || 'Invalid token', 401)
    }
}


class NotAuthenticatedError extends TwinderError {
    constructor (message) {
        super(message || 'You need to authenticate for the requested action', 401)
    }
}


class PermissionDeniedError extends TwinderError {
    constructor (message) {
        super(message || 'You don\'t have sufficient privileges for the requested action', 403)
    }
}

class DatabaseError extends TwinderError {
    constructor (message) {
        super(message || 'A database error occurred', 500)
    }
}


class ServerError extends TwinderError {
    constructor (message) {
        super(message || 'A internal error occurred', 500)
    }
}

class AuthenticationError extends TwinderError {
    constructor (message) {
        super(message || 'Authentication error', 401)
    }
}

class EventValidationError extends TwinderError {
    constructor (message) {
        super(message || 'Event validation error', 200);
    }
}

module.exports = {
    TwinderError: TwinderError,
    NotFoundError: NotFoundError,
    MissingParameterError: MissingParameterError,
    InvalidEntityError: InvalidEntityError,
    InvalidTokenError: InvalidTokenError,
    NotAuthenticatedError: NotAuthenticatedError,
    PermissionDeniedError: PermissionDeniedError,
    DatabaseError: DatabaseError,
    ServerError: ServerError,
    AuthenticationError: AuthenticationError,
    InvalidParameterError: InvalidParameterError,
    EventValidationError: EventValidationError
};