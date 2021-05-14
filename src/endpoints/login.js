var md5 = require('md5');


const login = (req, res) => {
    try {
        const usersTable = global.kanban.collection('users');
        const email = req.body.email;
        const password = md5(req.body.password);

        usersTable.findOne({ email: email, password: password }, (err, data) => {
            if (err) {
                res.status(500).json({ status: 'FAIL', error: err });
            } else {
                if (data === null) {
                    res.status(401).json({status: 'FAIL', error: 'EMAIL_OR_PASSWORD_INVALID'});
                } else {
                    let token;
                    const alreadyAuthed = global.authedSessions.find(session => session.email === req.body.email);
                    // if user has a valid live session, send the existing auth token
                    if (alreadyAuthed) {
                        token = alreadyAuthed.authToken;
                    } else {
                        // else generate a new one, send it, and also store it in the authedSessions global array
                        token = Math.random().toString(36).substr(2);
                        global.authedSessions.push({
                            userId: data._id.toString(),
                            email: data.email,
                            fullName: data.fullName,
                            authToken: token
                        });
                    }

                    res.json({
                        status: 'OK',
                        data: { authToken: token }
                    });
                }
            }
        });
    } catch (ex) {
        res.status(500).json({status: 'FAIL', error: ex.toString()});
    }
};

exports.login = login;