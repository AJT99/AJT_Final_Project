const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.get('/', statesController.getAllStates);

router.get('/:state', statesController.getStateByCode);

router.get('/:state/funfact', statesController.getRandomFunFact);

router.get('/:state/capital', statesController.getCapital);

router.get('/:state/nickname', statesController.getNickname);

router.get('/:state/population', statesController.getPopulation);

router.get('/:state/admission', statesController.getAdmission);

router.get('/:state/funfact', statesController.getRandomFunFact);

router.post('/:state/funfact', statesController.addFunFacts);

router.patch('/:state/funfact', statesController.updateFunFact);

router.delete('/:state/funfact', statesController.removeFunFact);

module.exports = router;
