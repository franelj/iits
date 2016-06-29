/**
 * Created by gregoirelafitte on 6/29/16.
 */

"use strict";

class RewindError extends Error {
    constructor (message, httpStatusCode) {
        super(message);
        this.message = message || 'An error occured';
        this.name = this.constructor.name;
        this.httpStatusCode = httpStatusCode || 500;
    }
}


class NotFoundError extends RewindError {
    constructor (message) {
        super(message || 'Page not found', 404)
    }
}


class MissingParameterError extends RewindError {
    constructor (message) {
        super(message || 'A mandatory request parameter is missing', 422)
    }
}


class InvalidEntityError extends RewindError {
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


class InvalidTokenError extends RewindError {
    constructor (message) {
        super(message || 'Invalid token', 401)
    }
}


class NotAuthenticatedError extends RewindError {
    constructor (message) {
        super(message || 'You need to authenticate for the requested action', 401)
    }
}


class PermissionDeniedError extends RewindError {
    constructor (message) {
        super(message || 'You don\'t have sufficient privileges for the requested action', 403)
    }
}


class DatabaseError extends RewindError {
    constructor (message) {
        super(message || 'A database error occurred', 500)
    }
}


class ServerError extends RewindError {
    constructor (message) {
        super(message || 'A internal error occurred', 500)
    }
}


module.exports = {
    RewindError: RewindError,
    NotFoundError: NotFoundError,
    MissingParameterError: MissingParameterError,
    InvalidEntityError: InvalidEntityError,
    InvalidTokenError: InvalidTokenError,
    NotAuthenticatedError: NotAuthenticatedError,
    PermissionDeniedError: PermissionDeniedError,
    OutOfSpaceError: OutOfSpaceError,
    DatabaseError: DatabaseError,
    ServerError: ServerError
};