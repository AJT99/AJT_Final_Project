const States = require('../model/states.js');
const statesData = require('../model/states.json');

const getAllStates = async (req, res) => {
    try {
        const contig = req.query.contig;

        if (contig === 'false') {
            const alaskaHawaii = statesData.filter(state => state.code === 'AK' || state.code === 'HI');
            res.json(alaskaHawaii);
        } else if (contig === 'true') {
            const contiguousStates = statesData.filter(state => state.code !== 'AK' && state.code !== 'HI');
            res.json(contiguousStates);
        } else {
            res.json(statesData);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStateByCode = async (req, res) => {
    try {
        const state = statesData.find(state => state.code === req.params.state);
        console.log(state)
        if (state) {
            res.json(state);
        } else {
            res.status(404).json({ error: 'State not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRandomFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        console.log('State Code:', stateCode);

        // Retrieve state data from MongoDB
        const state = await States.findOne({ stateCode: stateCode });
        console.log('State:', state);

        if (!state) {
            console.log('State not found in database');
            return res.status(404).json({ error: 'State not found' });
        }

        // Ensure that funfacts array exists and is not empty
        if (!state.funfacts || state.funfacts.length === 0) {
            console.log('No fun facts found for the state');
            return res.status(404).json({ error: 'No fun facts found for the state' });
        }

        // Select a random fun fact
        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        const randomFunFact = state.funfacts[randomIndex];

        // Return the random fun fact
        res.status(200).json({ state: stateCode, funfact: randomFunFact });
    } catch (error) {
        console.error('Error retrieving random fun fact:', error);
        res.status(500).json({ error: error.message });
    }
};



const getCapital = async (req, res) => {
    try {
        const state = statesData.find(state => state.code === req.params.state);
        
        if (state) {
            res.json({ state: state.state, capital: state.capital_city });
        } else {
            res.status(404).json({ error: 'State not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getNickname = async (req, res) => {
    try {
        const state = statesData.find(state => state.code === req.params.state);
        if (state) {
            res.json({ state: state.name, nickname: state.nickname });
        } else {
            res.status(404).json({ error: 'State not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPopulation = async (req, res) => {
    try {
        const state = statesData.find(state => state.code === req.params.state);
        if (state) {
            res.json({ state: state.name, population: state.population });
        } else {
            res.status(404).json({ error: 'State not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAdmission = async (req, res) => {
    try {
        const stateCode = req.params.state;

        // Find the state by its code
        const state = statesData.find(state => state.code === stateCode);

        if (state) {
            res.json({ state: state.state, admitted: state.admission_date });
        } else {
            res.status(404).json({ error: 'State not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addFunFacts = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const funFacts = req.body.funfacts;

        if (!stateCode || !funFacts || !Array.isArray(funFacts)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        let state = await States.findOne({ stateCode: stateCode });

        console.log("State:", state);

        if (!state) {
            state = await States.create({ stateCode: stateCode, funfacts: funFacts });
            return res.status(201).json(state);
        }

        state.funfacts = state.funfacts || [];

        state.funfacts.push(...funFacts);

        state = await state.save();

        return res.status(200).json(state);
    } catch (error) {
        console.error('Error adding fun facts:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const updateFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const { index, funfact } = req.body;

        if (!index || !funfact || typeof index !== 'number' || typeof funfact !== 'string' || index < 1) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const adjustedIndex = index - 1;

        let state = await States.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        if (adjustedIndex >= state.funfacts.length) {
            return res.status(400).json({ error: "Index out of bounds" });
        }

        state.funfacts[adjustedIndex] = funfact;

        state = await state.save();

        return res.status(200).json(state);
    } catch (error) {
        console.error('Error updating fun fact:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const removeFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const index = req.body.index;

        if (!stateCode || !index) {
            return res.status(400).json({ error: "State code and index are required" });
        }

        let state = await States.findOne({ stateCode: stateCode });

        if (!state) {
            return res.status(404).json({ error: "State not found" });
        }

        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ error: "No fun facts found for the state" });
        }

        const adjustedIndex = index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(400).json({ error: "Invalid index" });
        }

        state.funfacts.splice(adjustedIndex, 1);

        state = await state.save();

        return res.status(200).json(state);
    } catch (error) {
        console.error('Error removing fun fact:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllStates,
    getStateByCode,
    getRandomFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    addFunFacts,
    updateFunFact,
    removeFunFact
};
