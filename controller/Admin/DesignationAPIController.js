require('dotenv').config();
const Designation = require('../../model/Designation');
const { successResponse, errorResponse, warningResponse } = require('../../util/response');

const getDesignationAPI = async (req, res, next) => {
    try {
        const companyId = req.user?._id || req.userId;

        const filter = { company_id: companyId };

        // If status is present in query, add it to the filter
        if (req.query.status !== undefined) {
            filter.status = req.query.status === 'true';
        }

        const data = await Designation.find(filter).select('name status');

        return successResponse(res, "Designation fetched successfully!", data);
    } catch (error) {
        next(error);
    }
};


const postDesignationAPI = async (req, res, next) => {
    try {
      const { name, status } = req.body;
      const user = req.user;
  
      if (!name || typeof status === 'undefined') {
        return warningResponse(res, "Name and status are required fields.", {}, 400);
      }
  
      //Check for existing designation with same name under same company
      const existing = await Designation.findOne({
        company_id: user._id,
        name: { $regex: new RegExp(`^${name}$`, 'i') } // case-insensitive match
      });
  
      if (existing) {
        return warningResponse(res, "Designation with this name already exists.", {}, 409);
      }
  
      const designation = new Designation({
        company_id: user._id,
        name,
        status
      });
  
      await designation.save();
  
      return successResponse(res, "Designation created successfully!", designation);
    } catch (err) {
      return errorResponse(res, "Failed to create designation", err, 500);
    }
  };
  

  const putDesignationAPI = async (req, res, next) => {
    try {
      const { name, status } = req.body;
      const user = req.user;
  
      if (!name || typeof status === 'undefined') {
        return warningResponse(res, "Name and status are required fields.", {}, 400);
      }

      const designation = await Designation.findOne({ company_id: user._id, _id: req.params.id });
      if (!designation) {
        return warningResponse(res, "Designation not found.", {}, 404);
      }
  
      const duplicate = await Designation.findOne({
        company_id: user._id,
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
  
      if (duplicate) {
        return warningResponse(res, "Another designation with this name already exists.", {}, 409);
      }
  
      designation.name = name;
      designation.status = status;
      await designation.save();
  
      return successResponse(res, "Designation updated successfully!", designation);
    } catch (err) {
      return errorResponse(res, "Failed to update designation", err, 500);
    }
  };
  

const deleteDesignationAPI = async (req, res, next) => {
    try {
        const user = req.user;
        const designationId = req.params.id;
        const designation = await Designation.findOne({ company_id: user._id, _id: designationId });
        if (!designation) {
            return warningResponse(res, "Designation not found.", {}, 404);
        }
        await designation.deleteOne();
        return successResponse(res, "Designation deleted successfully!", {}, 200);
    } catch (err) {
        return errorResponse(res, "Failed to delete designation", err, 500);
    }
};

module.exports = {
    getDesignationAPI,
    postDesignationAPI,
    putDesignationAPI,
    deleteDesignationAPI,
};
