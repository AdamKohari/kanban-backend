const auth = require('../other/auth').authAssistant;

const getProjects = (req, res) => {
    try {
        const userId = auth(req);
        if (!userId) {
            res.json({status: 'FAIL', error: 'UNAUTHORIZED'});
            return;
        }
        const userProjectsTable = global.kanban.collection('userProjects');

        userProjectsTable.find({users: {$elemMatch: {userId: userId}}}, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                data.toArray((err, result) => {
                    const toSend = result.map(proj => ({
                        id: proj._id,
                        name: proj.name,
                        shortName: proj.shortName,
                        addedPeople: proj.users
                    }));
                    if (err) {
                        res.json({ status: 'FAIL', error: err });
                    } else {
                        res.json({status: 'OK', data: toSend});
                    }
                });
            }
        });
    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
};


const createProject = (req, res) => {
    try {
        const userId = auth(req);
        if (!userId) {
            res.json({status: 'FAIL', error: 'UNAUTHORIZED'});
            return;
        }
        const userProjectsTable = global.kanban.collection('userProjects');
        const usersTable = global.kanban.collection('users');

        const usersArray = [{userId: userId}];
        const memberEmails = req.body.emails;

        usersTable.find({email: {$in: memberEmails}}, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                data.toArray((err, result) => {
                    if (err) {
                        res.json({ status: 'FAIL', error: err });
                    } else {
                        result.forEach(user => {
                            usersArray.push({
                                userId: user._id.toString(),
                                fullName: user.fullName,
                                email: user.email
                            });
                        });

                        if (usersArray.length !== memberEmails.length + 1) {
                            res.json({status: 'FAIL', error: 'INVALID_EMAILS'});
                        } else {
                            userProjectsTable.insertOne({
                                users: usersArray,
                                name: req.body.name,
                                shortName: req.body.shortName
                            });
                    
                            res.json({status: 'OK', data: 'PROJECT_CREATION_SUCCESS'});
                        }
                    }
                });
            }
        });
    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
};

exports.getProjects = getProjects;
exports.createProject = createProject;