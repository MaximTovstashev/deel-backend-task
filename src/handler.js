const {getProfileMiddleware} = require("./middleware/getProfileMiddleware");
const route = (options) => {
    const { app, method, route, handler } = options

    app[method.toLowerCase()](
        route,
        getProfileMiddleware,
        async (req, res) => {
            try {
                const result = await handler(req, res)

                if (result?.error) {

                    console.error({
                        url: req.originalUrl,
                        error: result.error,
                    })

                    res.status(result.error.code || 400)
                    return res.json({
                        error: result.error.message || 'Something went terribly wrong',
                    }).end()
                }
                res.json(result)
            } catch (error) {

                console.error({
                    url: req.originalUrl,
                    error,
                })

                res.status(error.code || 500)
                return res.json({ error: error.message || 'Something went terribly wrong' }).end()
            }
        },
    )
}

module.exports = {route}
