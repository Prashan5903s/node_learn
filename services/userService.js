const Role = require('../model/Role');
const Country = require('../model/Country');
const RoleUser = require('../model/RoleUser');
const User = require('../model/User');
const Zone = require('../model/Zone');
const Designation = require('../model/Designation');
const ParticipationType = require('../model/ParticipationType');
const bcrypt = require('bcryptjs')
const { hash, normalizeEmail, normalizePhone } = require('../util/encryption');

const importUsers = async (res, userId, chunk, roleIds = []) => {
  try {
    // const emails = chunk.map(u => u.Email?.toLowerCase().trim()).filter(Boolean);
    // const existing = await User.find({ email: { $in: emails } }).select('email').lean();
    // const existingEmails = new Set(existing.map(u => u.email));

    // const phones = chunk.map(u => u.PhoneNo ? String(u.PhoneNo).trim() : null).filter(Boolean);
    // const existing2 = await User.find({ phone: { $in: phones } }).select('phone').lean();
    // const existingPhones = new Set(existing2.map(u => u.phone));

    const emails = chunk.map(u => normalizeEmail(u.Email)).filter(Boolean);
    const emailHashes = emails.map(email => hash(email));

    const existingEmailUsers = await User.find({ email_hash: { $in: emailHashes } }).select('email_hash').lean();
    const existingEmailHashes = new Set(existingEmailUsers.map(u => u.email_hash));

    const phones = chunk.map(u => normalizePhone(String(u.PhoneNo || ''))).filter(Boolean);
    const phoneHashes = phones.map(phone => hash(phone));

    const existingPhoneUsers = await User.find({ phone_hash: { $in: phoneHashes } }).select('phone_hash').lean();
    const existingPhoneHashes = new Set(existingPhoneUsers.map(u => u.phone_hash));


    const usersToInsert = [];
    const resultWithStatus = [];

    for (const u of chunk) {
        // const email = u.Email?.toLowerCase().trim();
        // const phone = u.PhoneNo ? String(u.PhoneNo).trim() : null;
        const emailRaw = u.Email || '';
        const phoneRaw = u.PhoneNo || '';
        const email = normalizeEmail(emailRaw);
        const phone = normalizePhone(String(phoneRaw));
        const emailHash = hash(email);
        const phoneHash = hash(phone);

        const safeUser = JSON.parse(JSON.stringify(u)); // Make it plain
        let errors = {}; // collect all errors here

        let validate = true;

        if (existingEmailHashes.has(emailHash)) {
          errors.email = 'This email has already been taken!';
        }
      
        if (existingPhoneHashes.has(phoneHash)) {
          errors.phone = 'This phone has already been taken!';
        }
        
        // if (existingEmails.has(email)) {
        //   errors.email = 'This email has already been taken!';
        // }

        // if (existingPhones.has(phone)) {
        //   errors.phone = 'This phone has already been taken!';
        // }

        const result = await processEmployeeCodesForUser({
          rawCodes: u.EmpID,
          userId: null,
          existingUser: null,
        });
  
        if (!result.success) {
          errors.emp_id = result.message ;
        }

        const location = await getLocationByName(u.Country, u.State, u.City);

        if (location.errors) {
          resultWithStatus.push({ ...safeUser, errors: location.errors });
          continue;
        }

        if (Object.keys(errors).length > 0) {
          resultWithStatus.push({ ...safeUser, errors });
          continue;
        }

      

      if (validate) {
        try {
          
          const passwordRaw = u.password || u.EmpID || Math.floor(1111 + Math.random() * 8888).toString();
          const hashedPassword = await bcrypt.hash(passwordRaw, 12);
          const location = await getLocationByName(u.Country, u.State, u.City);
          const designationId = await getOrCreateDesignation(u.Designation, userId);
          const participationTypeId = await getOrCreateParticipationType(u.ParticipationType, userId);
          const zoneId = await getOrCreateZone(u.Zone, userId);

          usersToInsert.push({
            email,
            phone,
            first_name: u.FirstName.trim(),
            last_name: u.LastName.trim(),
            password: hashedPassword,
            address: u.Address,
            country_id: location?.country || null,
            state_id: location?.state || null,
            city_id: location?.city || null,
            pincode: u.PinCode,
            status: u.Status?.toLowerCase() === 'active' ? true : (u.Status?.toLowerCase() === 'inactive' ? false : null),
            application_no: u.ApplicationNo || '',
            licence_no: u.LicenseNo || '',
            urn_no: u.URNNumber || '',
            website: u.Website || '',
            codes: result.codes || [],
            designation_id: designationId,
            participation_type_id: participationTypeId,
            zone_id: zoneId,
            employee_type: u.EmployeeType || '',
            company_id: userId,
            master_company_id: userId,
            parent_company_id: userId,
            created_by: userId,
          });

          resultWithStatus.push({ ...safeUser, errors: [] });

        } catch (innerErr) {
          console.error('User insert error:', innerErr);
          resultWithStatus.push({ ...safeUser, errors: { error: 'Error processing this user' } });
        }
      }
    }

    let insertedUsers = [];
    if (usersToInsert.length > 0) {
      insertedUsers = await User.insertMany(usersToInsert);

      if (roleIds.length > 0) {
        const roleDocs = await Role.find({ _id: { $in: roleIds } });

        const roleUserInserts = [];
        for (const user of insertedUsers) {
          for (const role of roleDocs) {
            roleUserInserts.push({
              user_id: user._id,
              role_id: role._id,
              assigned_by: userId,
            });
          }
        }

        if (roleUserInserts.length > 0) {
          await RoleUser.insertMany(roleUserInserts);
        }
      }
    }

    return {
      success: true,
      message: `${usersToInsert.length} users imported.`,
      imported: usersToInsert.length,
      data: resultWithStatus,
    };
  } catch (error) {
    console.error("Import Error:", error);
    return {
      success: false,
      message: 'An error occurred during import.',
      imported: 0,
      data: [],
    };
  }
};


const getLocationByName = async (countryName, stateName, cityName) => {
  const errors = {};

  const countryDoc = await Country.findOne({
    country_name: new RegExp(`^${countryName?.trim()}$`, 'i'),
  }).lean();

  if (!countryDoc) {
    errors.country = `Country '${countryName}' not found`;
    return { errors };
  }

  const stateDoc = countryDoc.states.find(
    s => s.state_name.trim().toLowerCase() === stateName?.trim().toLowerCase()
  );

  if (!stateDoc) {
    errors.state = `State '${stateName}' not found in '${countryName}'`;
    return { errors };
  }

  const cityDoc = stateDoc.cities.find(
    c => c.city_name.trim().toLowerCase() === cityName?.trim().toLowerCase()
  );

  if (!cityDoc) {
    errors.city = `City '${cityName}' not found in '${stateName}'`;
    return { errors };
  }

  return {
    country: countryDoc.country_id,
    state: stateDoc.state_id,
    city: cityDoc.city_id,
    errors: null
  };
};

const processEmployeeCodesForUser = async ({ rawCodes, userId, existingUser = null }) => {
    let parsedCodes = [];
    try {
      parsedCodes = rawCodes;
      if (!Array.isArray(parsedCodes)) {
        parsedCodes = [parsedCodes];
      }
    } catch {
      return { success: true, codes: existingUser?.codes || [] };
    }
  
    if (parsedCodes.length === 0) {
      return { success: true, codes: existingUser?.codes || [] };
    }

  
    const normalizedCodes = parsedCodes
      .map(code => (code != null ? String(code).trim() : ''))
      .filter(Boolean);

    const duplicateUsers = await User.find({
     // _id: { $ne: userId },
      'codes.code': { $in: normalizedCodes }
    }).select('codes');
  
    const foundCodes = new Set();
    for (const user of duplicateUsers) {
      user.codes.forEach(c => {
        const codeLower = c.code;
        if (normalizedCodes.includes(codeLower)) {
          foundCodes.add(codeLower);
        }
      });
    }
    if (foundCodes.size > 0) {
      return {
        success: false,
        message: 'Duplicate employee ID(s) found in other users.',
        duplicates: Array.from(foundCodes)
      };
    }
  
    // Map existing codes for quick lookup
    const existingCodesMap = new Map(
      (existingUser?.codes || []).map(c => [c.code.toLowerCase(), c])
    );
  
    // Mark all existing codes inactive
    const updatedExistingCodes = (existingUser?.codes || []).map(codeObj => ({
      ...codeObj.toObject ? codeObj.toObject() : codeObj, // convert mongoose doc to plain object if needed
      type: 'inactive',
    }));
  
    // Add new codes as active only if they don't already exist
    for (const code of normalizedCodes) {
      if (!existingCodesMap.has(code)) {
        updatedExistingCodes.push({
          code,
          issued_on: new Date(),
          type: 'active',
        });
      } else {
        // If code exists, mark it active (override inactive)
        const index = updatedExistingCodes.findIndex(c => c.code.toLowerCase() === code);
        if (index !== -1) {
          updatedExistingCodes[index].type = 'active';
        }
      }
    }
  
    return { success: true, codes: updatedExistingCodes };
  }

const getUserStats = async (userId) => {
  try {
    const [total, active, inactive] = await Promise.all([
      User.countDocuments({ company_id: userId }),
      User.countDocuments({ company_id: userId, status: true }),
      User.countDocuments({ company_id: userId, status: false }),
      //User.countDocuments({ last_login: { $exists: false } }) // or: { $eq: null }
    ]);

    return {
      total_users: total,
      active_users: active,
      inactive_users: inactive,
      not_logged_in_users: 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

const getOrCreateDesignation = async (name, userId) => {
  if (!name) return null;

  const trimmedName = name.trim();

  let designation = await Designation.findOne({
    name: new RegExp(`^${trimmedName}$`, 'i'),
    company_id: userId
  });

  if (!designation) {
    designation = await Designation.create({
      name: trimmedName,
      status: true,
      company_id: userId
    });
  }

  return designation._id;
};

const getOrCreateParticipationType = async (name, userId) => {
  if (!name) return null;

  const trimmedName = name.trim();

  let participationType = await ParticipationType.findOne({
    name: new RegExp(`^${trimmedName}$`, 'i'),
  });

  if (!participationType) {
    participationType = await ParticipationType.create({
      name: trimmedName,
      status: true,
      company_id: userId
    });
  }

  return participationType._id;
};

const getOrCreateZone = async (name, userId) => {
  if (!name) return null;

  const trimmedName = name.trim();

  let zone = await Zone.findOne({
    name: new RegExp(`^${trimmedName}$`, 'i'),
  });

  if (!zone) {
    zone = await Zone.create({
      name: trimmedName,
      status: true,
      company_id: userId
    });
  }

  return zone._id;
};

module.exports = {
    importUsers,
    getUserStats,
    getUserStats
}