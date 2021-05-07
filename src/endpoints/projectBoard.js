const auth = require('../other/auth').authAssistant;

const getBoard = (req, res) => {
    try {
        const userId = auth(req);
        if (!userId) {
            res.json({status: 'FAIL', error: 'UNAUTHORIZED'});
            return;
        }

        const projectId = req.query.projectId;

        const projectCardsTable = global.kanban.collection('projectCards');
        
        projectCardsTable.find({projectId: projectId}, (err, data) => {
            if (err) {
                res.json({ status: 'FAIL', error: err });
            } else {
                data.toArray((err, result) => {
                    const toSend = result.reduce((output, actual) => {
                        output[actual.col].push({
                            id: actual.id,
                            title: actual.title,
                            desc: actual.desc,
                            user: actual.user,
                            index: actual.index
                        });
                        return output;
                    }, {
                        toDo: [],
                        inProgress: [],
                        done: []
                    });
                    toSend['projectId'] = projectId;
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


const createCard = (req, res) => {
    try {
        const userId = auth(req);
        if (!userId) {
            res.json({status: 'FAIL', error: 'UNAUTHORIZED'});
            return;
        }

        const projectCardsTable = global.kanban.collection('projectCards');

        const {projectId, id, user, title, desc, index, notifiedPeople} = req.body;
        projectCardsTable.insertOne({
            projectId: projectId,
            id: id,
            col: 'toDo',
            user: user,
            title: title,
            desc: desc,
            index: index
        });

        notifiedPeople.forEach(person => {
            global.authedSessions.find(session => session.userId === person.userId)
                .socket.send({messageType: 'UPDATE', message: ''});
        });

        res.json({status: 'OK', data: 'CARD_CREATION_SUCCESS'});
    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
};


exports.getBoard = getBoard;
exports.createCard = createCard;