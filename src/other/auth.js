exports.authAssistant = (req) => {
    // the authToken should be sent in the Authorization HTTP header
    const authToken = req.header('Authorization');
    const authedSession = global.authedSessions.find(session => session.authToken === authToken);
    // returns the userId of a logged in user from the global authed sessions array
    return authedSession ? authedSession.userId : null;
};