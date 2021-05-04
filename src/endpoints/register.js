var md5 = require('md5');


const register = (req, res) => {
    try {
        const usersTable = global.kanban.collection('users');
        const username = req.body.username;
        const password = md5(req.body.password);

        usersTable.findOne({ username: username, password: password }, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                if (data === null) {
                    usersTable.insertOne({
                        username: username,
                        password: password
                    });
                    res.json({status: 'OK', data: 'REGISTER_SUCCESS'});
                } else {
                    res.json({ status: 'FAIL', error: 'USER_EXISTS' });
                }
            }
        });
    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
}

exports.register = register;