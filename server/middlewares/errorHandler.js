const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
}

const errHandler = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        // Lấy message đầu tiên từ lỗi validation
        const firstError = Object.values(error.errors)[0];
        const message = firstError?.message || firstError?.properties?.message;
        
        return res.status(400).json({
            success: false,
            mes: message
        });
    }
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        success: false,
        mes: error?.message
    })
}

module.exports = {
    notFound,
    errHandler
}