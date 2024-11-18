class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.customCode = 400;
        this.customMessage = 'UnauthorizedError';
    }
}

class IncorrectCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.customCode = 401;
        this.customMessage = 'IncorrectCredentialsError';
    }

}

export {
    IncorrectCredentialsError,
    UnauthorizedError
};