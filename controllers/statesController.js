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
            const statesFromDB = await States.find({});

            const combinedStates = statesData.map(state => {
                const stateFromDB = statesFromDB.find(dbState => dbState.stateCode === state.code);
                const combinedState = { ...state };
                
                if (stateFromDB && stateFromDB.funfacts && stateFromDB.funfacts.length > 0) {
                    combinedState.funfacts = stateFromDB.funfacts;
                }
                
                return combinedState;
            });

            res.json(combinedStates);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStatesAdmittedAfterYear = async (req, res) => {
    try {
        const yearPrefix = req.params.year.substring(0, 4);

        const states = statesData.filter(state => {
            const admissionYear = state.admission_date.substring(0, 4);
            return admissionYear >= yearPrefix;
        });

        res.json(states);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStatesAdmittedBeforeYear = async (req, res) => {
    try {
        const yearPrefix = req.params.year.substring(0, 4);

        const states = statesData.filter(state => {
            const admissionYear = state.admission_date.substring(0, 4);
            return admissionYear <= yearPrefix;
        });

        res.json(states);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStateByCode = async (req, res) => {
    try {      
        let stateCode = req.params.state.toLowerCase();

        const stateFromJSON = statesData.find(state => state.code.toLowerCase() === stateCode);

        const stateFromDB = await States.findOne({ stateCode: stateCode.toUpperCase() });


        let state = {
            ...stateFromJSON
        };

        if (stateFromDB && stateFromDB.funfacts && stateFromDB.funfacts.length > 0) {
            state.funfacts = stateFromDB.funfacts;
        } else if (stateFromJSON && stateFromJSON.funfacts && stateFromJSON.funfacts.length > 0) {
            state.funfacts = stateFromJSON.funfacts;
        }

        res.json(state);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRandomFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        console.log('State Code:', stateCode);

        const state = await States.findOne({ stateCode: stateCode });
        console.log('State:', state);


        const stateData = statesData.find(s => s.code === stateCode.toUpperCase());
        const stateName = stateData ? stateData.state : stateCode;

        if (!state.funfacts || state.funfacts.length === 0) {
            console.log('No fun facts found for the state');
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }

        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        const randomFunFact = state.funfacts[randomIndex];

        res.status(200).json({ funfact: randomFunFact });
    } catch (error) {
        console.error('Error retrieving random fun fact:', error);
        res.status(500).json({ error: error.message });
    }
};



const getCapital = async (req, res) => {
    try {
        const stateCode = req.params.state.toLowerCase(); 
        
        const state = statesData.find(state => state.code.toLowerCase() === stateCode);

        res.json({ state: state.state, capital: state.capital_city });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getNickname = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); 

        const state = statesData.find(state => state.code === stateCode);

        res.json({ state: state.state, nickname: state.nickname });
      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getPopulation = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase(); 

        const state = statesData.find(state => state.code === stateCode);

        const populationString = state.population.toLocaleString(); 
      
        res.json({ state: state.state, population: populationString });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAdmission = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();

        const state = statesData.find(state => state.code === stateCode);

        res.json({ state: state.state, admitted: state.admission_date });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addFunFacts = async (req, res) => {
    try {
        const stateCode = req.params.state;
        const funFacts = req.body.funfacts;

        if (!funFacts|| funFacts.length === 0) {
            return res.status(400).json({ message: "State fun facts value required" });
        }
        if (!funFacts || !Array.isArray(funFacts)) {
            return res.status(400).json({ message: "State fun facts value must be an array" });
        }
        if (!Array.isArray(funFacts)) {
            return res.status(400).json({ message: "State fun facts value must be an array" });
        }

        let state = await States.findOne({ stateCode });

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
      

        if (!index || typeof index !== 'number' || index < 1) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        if (!funfact || typeof funfact !== 'string') {
            return res.status(400).json({ message: "State fun fact value required" });
        }

        const adjustedIndex = index - 1;

        let state = await States.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        const stateData = statesData.find(s => s.code === stateCode.toUpperCase());
        const stateName = stateData ? stateData.state : stateCode;
        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }
        if (adjustedIndex >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}` });
        }
        if (adjustedIndex >= state.funfacts.length) {
            return res.status(400).json({ message: "Index out of bounds" });
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
        const stateData = statesData.find(s => s.code === stateCode.toUpperCase());
        const stateName = stateData ? stateData.state : stateCode;
        const index = req.body.index;

        if (index === undefined || index === null) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        let state = await States.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        if (!state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}`});
        }

        const adjustedIndex = index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateName}` });
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
    removeFunFact,
    getStatesAdmittedAfterYear,
    getStatesAdmittedBeforeYear
};
