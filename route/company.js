const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const languageController = require('../controller/Company/LanguageController');
const zoneController = require('../controller/Company/ZoneAPIController');
const regionController = require('../controller/Company/RegionAPIController');
const appMenuController = require('../controller/Company/AppMenuController');
const companyValidation = require('../validation/Companyvalidation')

//This route is for zone
router.get('/zone', isAuth, zoneController.getZoneAPIData);
router.post('/zone', isAuth, zoneController.postZoneAPI);
router.put('/zone/:id', isAuth, zoneController.putZoneAPI);


//This route is for region
router.get('/region', isAuth, regionController.getRegionAPI);
router.get('/region/create', isAuth, regionController.createRegionAPI);
router.post('/region', isAuth, regionController.postRegionAPI);
router.post('/data/region', isAuth, regionController.postRegionDataAPI);
router.put('/data/region/:id', isAuth, regionController.putRegionData);

//This route is for language
router.get('/language', isAuth, languageController.getLanguageAPI);
router.post('/language', isAuth, companyValidation.postLanguageAPI, languageController.postLanguageAPI);
router.put('/language/:id', isAuth, companyValidation.postLanguageAPI, languageController.putLanguageAPI);
router.get('/language/menu', isAuth, languageController.getMenuAPI);

//This route is for label
router.get('/terminology', isAuth, appMenuController.getAppMenuAPI);
router.get('/terminology/label/create', isAuth, appMenuController.createLabelAPI);
router.post('/terminology/label', isAuth, appMenuController.postLabelAPI);
router.post('/terminology/app/menu', isAuth, appMenuController.postAppMenuAPI);
router.get('/menu/list', isAuth, appMenuController.getMenuListingAPI)

router.get('/app/menu/label/listing/:sn', isAuth, appMenuController.getAppMenuCompanyListAPI);
router.post('/app/menu/label/listing/:sn', isAuth, appMenuController.postCompanyMenuListAPI);

module.exports = router;