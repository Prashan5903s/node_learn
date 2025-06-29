require('dotenv').config();
const ParticipationType = require('../../model/ParticipationType');
const { successResponse, errorResponse, warningResponse } = require('../../util/response');

const getAPI = async (req, res, next) => {
    try {
        const companyId = req.user?._id || req.userId;

        const filter = { company_id: companyId };

        // If status is present in query, add it to the filter
        if (req.query.status !== undefined) {
            filter.status = req.query.status === 'true';
        }
        
        const data = await ParticipationType.find(filter).select('name status');
        return successResponse(res, "Participation type fetched successfully!", data);
    } catch (error) {
        next(error);
    }
};

const postAPI = async (req, res, next) => {
    try {
        const { name, status } = req.body;
        const user = req.user;
        if (!name || typeof status === 'undefined') {
            return warningResponse(res, "Name and status are required fields.", {}, 400);
        }

        const existing = await ParticipationType.findOne({
            company_id: user._id,
            name: { $regex: new RegExp(`^${name}$`, 'i') } // case-insensitive match
          });
      
          if (existing) {
            return warningResponse(res, "Participation Type with this name already exists.", {}, 409);
          }

        const participationtype = new ParticipationType({
            company_id: user._id,
            name,
            status
        });
        await participationtype.save();
        return successResponse(res, "ParticipationType created successfully!", participationtype);
    } catch (err) {
        return errorResponse(res, "Failed to create participation type", err, 500);
    }
};

const putAPI = async (req, res, next) => {
    try {
        const { name, status } = req.body;
        const user = req.user;
        if (!name || typeof status === 'undefined') {
            return warningResponse(res, "Name and status are required fields.", {}, 400);
        }

        const participationtype = await ParticipationType.findOne({ company_id: user._id, _id: req.params.id });
        if (!participationtype) {
            return warningResponse(res, "Participation type not found.", {}, 404);
        }

        const duplicate = await ParticipationType.findOne({
            company_id: user._id,
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: req.params.id }
        });
    
        if (duplicate) {
        return warningResponse(res, "Another Participation with this name already exists.", {}, 409);
        }
       
        participationtype.name = name;
        participationtype.status = status;
        await participationtype.save();
        return successResponse(res, "Participation Type updated successfully!", participationtype);
    } catch (err) {
        return errorResponse(res, "Failed to update participation type", err, 500);
    }
};

const deleteAPI = async (req, res, next) => {
    try {
        const user = req.user;
        const participationtypeId = req.params.id;
        const participationtype = await ParticipationType.findOne({ company_id: user._id, _id: participationtypeId });
        if (!participationtype) {
            return warningResponse(res, "ParticipationType not found.", {}, 404);
        }
        await participationtype.deleteOne();
        return successResponse(res, "Participation Type deleted successfully!", {}, 200);
    } catch (err) {
        return errorResponse(res, "Failed to delete participation type", err, 500);
    }
};

module.exports = {
    getAPI,
    postAPI,
    putAPI,
    deleteAPI,
};
