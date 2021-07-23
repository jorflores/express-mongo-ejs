const config = {

    app: {
        port: process.env.PORT || // add the local port here 
    }, 

    db: {
        connectionUrl: process.env.MONGO_URL || // add the local url here
    }
}

module.exports = config;