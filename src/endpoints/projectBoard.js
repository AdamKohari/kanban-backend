const auth = require('../other/auth').authAssistant;

// ?op=getBoard
const getBoard = (req, res) => {
    try {
        const userId = auth(req);
        if (!userId) {
            res.json({status: 'FAIL', error: 'UNAUTHORIZED'});
            return;
        }

        const projectCardsTable = global.kanban.collection('projectCards');
        


    } catch (ex) {
        res.json({status: 'FAIL', error: ex.toString()});
    }
};

// projectId => 
// projectId, 
// cols: {
//     toDo: [{title, id, user(fullName), desc}], 
//     inProgress: [], 
//     done: []
// }, 
// addedPeople: [{fullName, email}]


// ?op=createCard
const createCard = (req, res) => {

};

// (title, id, user, desc) => {OK}


exports.getBoard = getBoard;
exports.createCard = createCard;