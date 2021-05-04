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
                    if (err) {
                        res.json({ status: 'FAIL', error: err });
                    } else {
                        res.json({status: 'OK', data: result});
                    }
                });
            }
        });
    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
};


const createProject = (req, res) => {
};

exports.getProjects = getProjects;
exports.createProject = createProject;