const AppError =  require("../utils/appError")
const log =  require("signale")

const handleCastDBError =  err => {
    const message =  `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}

const handleDuplicateDBFieldsError = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationDBError = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message =  `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const sendErrorsDev = (err, req, res) => {

    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }
}

const sendErrorsprod = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // trusted error
        if(err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // programming error
        log.error("Error ", err)
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!"
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode =  err.statusCode || 500
    err.status =  err.status || "error"

    if(process.env.NODE_ENV === "development") {
        sendErrorsDev(err, req, res)
    } else if(process.env.NODE_ENV === "production") {
        let error = { ...err }
        error.message =  err.message

        if(err.name === "CastError") error = handleCastDBError(error)
        if(err.code === 11000) error = handleDuplicateDBFieldsError(error)
        if(err.name === "ValidationError") error =  handleValidationDBError(error) 
        
        sendErrorsprod(error, req, res)
    }
}