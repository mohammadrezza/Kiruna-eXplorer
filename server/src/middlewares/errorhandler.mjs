export function errorHandler(router) {
    router.use((err, req, res, next) => {
        return res.status(err.customCode || 503).json({
            success: false,
            error: err.customMessage || "Internal Server Error",
            status: err.customCode || 503
        });
    })
}