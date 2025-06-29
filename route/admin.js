const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const validation = require('../validation/Adminvalidation');
const roleController = require('../controller/Admin/RoleAPIController');
const packageAPIController = require('../controller/Admin/PackageAPIController');
const permissionController = require('../controller/Admin/PermissionAPIController');
const permissionModuleController = require('../controller/Admin/PermissionModuleAPIController');
const packageTypeController = require('../controller/Admin/PackageTypeAPIController');
const companyAPIController = require('../controller/Admin/CompanyAPIController');
const designationAPIController = require('../controller/Admin/DesignationAPIController');
const ParticipationTypeAPIController = require('../controller/Admin/ParticipationTypeAPIController');
const UserAPIController = require('../controller/Admin/UserAPIController');

//routes for roles
router.get('/role', isAuth, roleController.getRoleAPI);
router.post('/role', isAuth, validation.postRoleValidation, roleController.postRoleAPI);
router.get('/role/create', isAuth, roleController.createDataAPI);
router.post('/role/user', isAuth, validation.roleUserPostValidation, roleController.postRoleUserAPI)
router.put('/role/:roleId', isAuth, validation.postRoleValidation, roleController.putRole);

//routes for permission
router.get('/permission-module', isAuth, permissionModuleController.getPermissionModuleAPI);
router.post('/permission-module', isAuth, validation.postPermissionModule, permissionModuleController.postPermissionModuleAPI);
router.put('/permission-module/:permissionId', isAuth, validation.postPermissionModule, permissionModuleController.putPermissionModuleAPI);

router.get('/permission', isAuth, permissionController.getPermission);
router.post('/permission', isAuth, validation.postPermission, permissionController.postPermission);
router.get('/permission/edit/:permissionId', isAuth, permissionController.editPermission);
router.get('/permission/create', isAuth, permissionController.createPermission);
router.put('/permission/:permissionModuleId/:permissionId', isAuth, validation.postPermission, permissionController.putPermission)

//routes for package type
router.get('/package-type', isAuth, packageTypeController.getPackageTypeAPI);
router.post('/package-type', isAuth, validation.packageTypePostValidation, packageTypeController.postPackageType);
router.put('/package-type/:packageTypeId', isAuth, validation.packageTypePostValidation, packageTypeController.updatePackageTypeAPI);

//routes for package
router.get('/package', isAuth, packageAPIController.getPackageAPI);
router.get('/package/create', isAuth, packageAPIController.createPackageAPI);
router.post('/package', isAuth, validation.postPackageValidation, packageAPIController.postPackageAPI);
router.put('/package/:packageTypeId/:packageId', isAuth, packageAPIController.putPackageAPI)

//routes for company
router.get('/company', isAuth, companyAPIController.getCompanyIndexAPI);
router.post('/company', isAuth, validation.postCompany, companyAPIController.postCompanyAPI);
router.get('/company/create', isAuth, companyAPIController.createCompanyAPI);
router.get('/company/:id/edit', isAuth, companyAPIController.editCompanyAPI);
router.put('/company/:id', isAuth, companyAPIController.putCompanyAPI);
router.get('/company/email/check/:email/:id', isAuth, companyAPIController.checkEmailCompanyAPI)


router.post('/designation', isAuth, designationAPIController.postDesignationAPI);
router.get('/designations', isAuth, designationAPIController.getDesignationAPI);
router.put('/designation/:id', isAuth, designationAPIController.putDesignationAPI)
router.delete('/designation/:id', isAuth, designationAPIController.deleteDesignationAPI)

router.post('/participation_type', isAuth, ParticipationTypeAPIController.postAPI);
router.get('/participation_types', isAuth, ParticipationTypeAPIController.getAPI);
router.put('/participation_type/:id', isAuth, ParticipationTypeAPIController.putAPI)
router.delete('/participation_type/:id', isAuth, ParticipationTypeAPIController.deleteAPI)

//user routes
router.post('/user', isAuth, UserAPIController.createUserAPI);
router.put('/user/:id', isAuth, validation.putUser, UserAPIController.updateUserAPI);
router.delete('/user/:id', isAuth, UserAPIController.deleteAPI);
router.get('/user/:id/edit', isAuth, UserAPIController.editAPI);
router.get('/user/search', isAuth, UserAPIController.searchUserAPI);
router.put('/user/update-password/:id', isAuth, UserAPIController.updatePasswordAPI);
router.put('/user/attach/empcode/:id', isAuth, UserAPIController.attachNewUserCodeAPI);
router.put('/user/mark/active/empcode/:id', isAuth, UserAPIController.markActiveUserCodeAPI);
router.put('/user/status/update/:id', isAuth, UserAPIController.updateStatusAPI);
router.post('/users/import', isAuth, UserAPIController.importAPI);
router.get('/users/stats', isAuth, UserAPIController.getUserStatsAPI);

router.get('/countries', isAuth, companyAPIController.getCountryAPI);

router.get('/role/allow/permission', isAuth, permissionController.getPermAllowAPI);

module.exports = router;