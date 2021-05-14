const getBoard = (req, res) => {
    try {
        const projectId = req.query.projectId;

        const projectCardsTable = global.kanban.collection('projectCards');
        
        projectCardsTable.find({projectId: projectId}, (err, data) => {
            if (err) {
                res.status(500).json({ status: 'FAIL', error: err });
            } else {
                data.toArray((err, result) => {
                    // mapping the db results
                    const toSend = result.reduce((output, actual) => {
                        output[actual.col].push({
                            id: actual.id,
                            title: actual.title,
                            desc: actual.desc,
                            user: actual.user
                        });
                        return output;
                    }, {
                        toDo: [],
                        inProgress: [],
                        done: []
                    });
                    toSend['projectId'] = projectId;
                    if (err) {
                        res.status(500).json({ status: 'FAIL', error: err });
                    } else {
                        res.json({status: 'OK', data: toSend});
                    }
                });
            }
        });

    } catch (ex) {
        res.status(500).json({status: 'FAIL', error: ex.toString()});
    }
};


const createCard = (req, res) => {
    try {
        const projectCardsTable = global.kanban.collection('projectCards');

        const {projectId, id, user, title, desc, notifiedPeople} = req.body;
        projectCardsTable.insertOne({
            projectId: projectId,
            id: id,
            col: 'toDo',
            user: user,
            title: title,
            desc: desc
        });

        // notify team members using sockets
        notifiedPeople.forEach(person => {
            global.authedSessions.find(session => session.userId === person.userId)
                .socket.send({messageType: 'UPDATE', message: ''});
        });

        res.json({status: 'OK', data: 'CARD_CREATION_SUCCESS'});
    } catch (ex) {
        res.status(500).json({status: 'FAIL', error: ex.toString()});
    }
};


exports.getBoard = getBoard;
exports.createCard = createCard;