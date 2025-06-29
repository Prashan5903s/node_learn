const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moduleTrainingSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'users', // Assuming there's a 'companies' collection to reference
    },
    training_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // training_id is required
        ref: 'trainings', // Assuming there's a 'trainings' collection to reference
    },
    module_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // module_id is required
        ref: 'modules', // Assuming there's a 'modules' collection to reference
    },
});

module.exports = mongoose.model('module_training', moduleTrainingSchema); // Model name 'ModuleTraining'
