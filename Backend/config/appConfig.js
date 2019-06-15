
let appConfig = {
    port: 3000,
    version: '/api/v1',
    allowedCorsOrigin : "*",
    env: 'dev',
    db:{
        uri: 'mongodb://127.0.0.1:27017/AssignmentDB'
    }
}



module.exports={
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db: appConfig.db,
    apiVersion: appConfig.version
}