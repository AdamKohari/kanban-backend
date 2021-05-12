const auth = require('../other/auth').authAssistant;
const ObjectId = require('mongodb').ObjectId; 

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

        const self = global.authedSessions.find(session => session.userId === userId);
        // pre-fill the project team array with the user's data
        const usersArray = [{userId: self.userId, email: self.email, fullName: self.fullName}];
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
                            // push the selected team members' user data to the project team array
                            usersArray.push({
                                userId: user._id.toString(),
                                fullName: user.fullName,
                                email: user.email
                            });
                        });

                        // if a team member's account is not found, throw error
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

const checkEmail = (req, res) => {
    try {
        const email = req.body.email;
        const usersTable = global.kanban.collection('users');

        usersTable.findOne({email: email}, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                if (data === null) {
                    res.json({status: 'OK', data: 'NO_USER_FOUND'});
                } else {
                    res.json({status: 'OK', data: data.fullName});
                }
            }
        });

    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
};

const getDetails = (req, res) => {
    const projectId = req.query.id;
    if (!auth(req)) {
        res.json({status: 'FAIL', error: 'UNAUTHORIZED'});
        return;
    }

    const userProjectsTable = global.kanban.collection('userProjects');
    const projectCardsTable = global.kanban.collection('projectCards');

    const respObj = {
        toDoCount: 0,
        inProgressCount: 0,
        doneCount: 0
    };

    userProjectsTable.findOne({_id: new ObjectId(projectId)}, (err, data) => {
        if (err) {
            res.json({ status: 'FAIL', error: err });
        } else {
            if (data === null) {
                res.json({status: 'OK', data: 'NO_PROJECT_FOUND'});
            } else {
                respObj['name'] = data.name;
                respObj['members'] = data.users;

                projectCardsTable.find({projectId: projectId}, (err, data) => {
                    if (err) {
                        res.json({ status: 'FAIL', error: err });
                    } else {
                        if (data === null) {
                            res.json({status: 'OK', data: respObj});
                        } else {
                            data.toArray((err, cards) => {
                                res.json({status: 'OK', data: cards.reduce((acc, curr) => {
                                    return {
                                        ...acc,
                                        [curr['col'] + 'Count']: acc[curr['col'] + 'Count'] + 1
                                    }
                                }, respObj)});
                            })
                        }
                    }
                });
            }
        }
    });
};

exports.getProjects = getProjects;
exports.createProject = createProject;
exports.checkEmail = checkEmail;
exports.getDetails = getDetails;