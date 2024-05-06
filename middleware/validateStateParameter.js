const statesData = require('../model/states.json');

const validateStateParameter = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    const stateExists = statesData.some(state => state.code === stateCode);

    if (!stateExists) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    next();
};

module.exports = validateStateParameter;
