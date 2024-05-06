const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const validateStateParameter = require('../../middleware/validateStateParameter');


router.get('/', statesController.getAllStates);

router.get('/:state', validateStateParameter, statesController.getStateByCode);

router.get('/:state/funfact', validateStateParameter, statesController.getRandomFunFact);

router.get('/:state/capital', validateStateParameter, statesController.getCapital);

router.get('/:state/nickname', validateStateParameter, statesController.getNickname);

router.get('/:state/population', validateStateParameter, statesController.getPopulation);

router.get('/:state/admission', validateStateParameter, statesController.getAdmission);

router.get('/after/:year', statesController.getStatesAdmittedAfterYear);

router.get('/before/:year', statesController.getStatesAdmittedBeforeYear);

router.post('/:state/funfact', validateStateParameter, statesController.addFunFacts);

router.patch('/:state/funfact', validateStateParameter, statesController.updateFunFact);

router.delete('/:state/funfact', validateStateParameter, statesController.removeFunFact);

module.exports = router;
