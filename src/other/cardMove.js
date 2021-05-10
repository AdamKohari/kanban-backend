// handles the case when the user moves a card on the kanban table
const moveCard = ({projectId, source, destination, id, notifiedPeople}) => {
    try {
        const projectCardsTable = global.kanban.collection('projectCards');
        projectCardsTable.updateOne({projectId: projectId, id: id}, [
            {$set: {col: destination.droppableId}}
        ]);

        // sends notificaion for team members on sockets
        notifiedPeople.forEach(person => {
            global.authedSessions.find(session => session.userId === person.userId)
                .socket.send({messageType: 'UPDATE', message: ''});
        });
    } catch (ex) {
        console.log(ex);
    }
};

exports.moveCard = moveCard;