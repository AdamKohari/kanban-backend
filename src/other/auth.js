exports.authAssistant = (req) => {
    const authToken = req.header('Authorization');
    const authedSession = global.authedSessions.find(session => session.authToken === authToken);
    return authedSession ? authedSession.userId : null;
};