var md5 = require('md5');


const register = (req, res) => {
    try {
        const usersTable = global.kanban.collection('users');
        const email = req.body.email;
        const password = md5(req.body.password);
        const fullName = req.body.fullName;

        usersTable.findOne({ email: email, password: password, fullName: fullName }, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                if (data === null) {
                    usersTable.insertOne({
                        email: email,
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
};

exports.register = register;