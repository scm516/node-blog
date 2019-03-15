const statusCode = {
    SUCCESS_200: (msg, data) => {
        return {
            code: 200,
            msg,
            data,
        }
    },
    SUCCESS_204: (msg, data) => {
        return {
            code: 204,
            msg,
            data,
        }
    },
    ERROR_203: (msg, data) => {
        return {
            code: 203,
            msg,
            data,
        }
    },
    ERROR_204: (msg, data) => {
        return {
            code: 204,
            msg,
            data,
        }
    },
    ERROR_401: (msg, data) => {
        return {
            code: 401,
            msg,
            data,
        }
    }
}

module.exports = statusCode