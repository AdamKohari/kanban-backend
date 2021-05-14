exports.authMiddleware = (req, res, next) => {
    // check whether auth needed at all
    const noAuthNeeded = [
        '/rest/login', 
        '/rest/register'
    ];

    if (noAuthNeeded.includes(req.path)) {
        next();
        return;
    }

    // the authToken should be sent in the Authorization HTTP header
    const authToken = req.header('Authorization');
    const authedSession = global.authedSessions.find(session => session.authToken === authToken);
    // gets the userId of a logged in user from the global authed sessions array, passes to next middleware
    res.locals.userId = authedSession ? authedSession.userId : null;

    if (!res.locals.userId) {
        res.status(401)
            .json({status: 'FAIL', error: 'UNAUTHORIZED'});
    } else {
        next();
    }
};