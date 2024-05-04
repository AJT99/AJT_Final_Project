const statesData = require('../model/states.json');

const validateStateParameter = (req, res, next) => {
    const stateCode = req.params.state;

    const stateCodes = statesData.map(state => state.abbreviation);

    if (stateCodes.includes(stateCode.toUpperCase())) {
        req.body.stateCode = stateCode.toUpperCase(); 
        next(); 
    } else {
        res.status(400).json({ error: 'Invalid state abbreviation code' });
    }
};

module.exports = validateStateParameter;
