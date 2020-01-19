const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = 
{
    // uri: 'mongodb://localhost/meanstack',
    uri: 'mongodb+srv://miordache93:DreamBig93@cluster0-krwxr.mongodb.net/test?retryWrites=true&w=majority',
    secret: crypto
}