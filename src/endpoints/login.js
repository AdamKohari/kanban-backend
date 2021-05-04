var md5 = require('md5');


const login = (req, res) => {
    try {
        const usersTable = global.kanban.collection('users');
        const email = req.body.email;
        const password = md5(req.body.password);

        usersTable.findOne({ email: email, password: password }, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                if (data === null) {
                    res.json({status: 'FAIL', error: 'EMAIL_OR_PASSWORD_INVALID'});
                } else {
                    let token;
                    const alreadyAuthed = global.authedSessions.find(session => session.email === req.body.email);
                    if (alreadyAuthed) {
                        token = alreadyAuthed.authToken;
                    } else {
                        token = Math.random().toString(36).substr(2);
                        global.authedSessions.push({
                            userId: data._id.toString(),
                            email: data.email,
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
};

exports.login = login;