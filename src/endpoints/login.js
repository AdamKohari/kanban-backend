var md5 = require('md5');


const login = (req, res) => {
    try {
        const usersTable = global.kanban.collection('users');
        const username = req.body.username;
        const password = md5(req.body.password);

        usersTable.findOne({ username: username, password: password }, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                if (data === null) {
                    res.json({status: 'FAIL', error: 'USERNAME_OR_PASSWORD_INVALID'});
                } else {
                    let token;
                    const alreadyAuthed = global.authedSessions.find(session => session.username === req.body.username);
                    if (alreadyAuthed) {
                        token = alreadyAuthed.authToken;
                    } else {
                        token = Math.random().toString(36).substr(2);
                        global.authedSessions.push({
                            userId: data._id,
                            username: data.username,
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
        res.json({status: 'FAIL', error: ex.toString()});
    }
}

exports.login = login;