const Admin = require("../../model/Admin");
const { adminSignToken } = require("../../services/authServices");
const bcrypt = require("bcrypt");
const dbService = require("../../utils/dbServices");

/**
 * @description : Sign up a new admin user.
 * @param {Object} req : The request object including body for email and password.
 * @param {Object} res : The response object to send back the signup status, access token, and new admin details.
 * @fields : email, password
 * @return {Object} : Status message indicating the result of the signup operation, access token, and new admin details. {status, accessToken, newUser}
 */

const signUp = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.badRequest({ message: "Email and password are required." });
    }

    const lowerCaseEmail = email.toLowerCase();

    const user = await Admin.findOne({ email: lowerCaseEmail });
    if (user) {
      return res.badRequest({ message: "User already exists, please login." });
    }

    const dataToCreate = {
      fullname:fullname,
      email: lowerCaseEmail,
      password: password,
    };

    const admin = await dbService.create(Admin, dataToCreate);

    if (!admin) {
      return res.badRequest({
        message: "Something went wrong, Registration failed.",
      });
    }

    const accessToken = await adminSignToken(admin._id);

    return res.status(201).json({
      status: "success",
      accessToken,
      admin,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};


/**
 * @description : Log in an admin user.
 * @param {Object} req : The request object including body for email and password.
 * @param {Object} res : The response object to send back the login status and access token.
 * @fields : email, password
 * @return {Object} : Status message indicating the result of the login operation, access token, and admin details. {status, message, accessToken, admin}
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.badRequest({ message: "Please provide email and password" });
    }

    const lowerCaseEmail = email.toLowerCase();

    const admin = await Admin.findOne({ email: lowerCaseEmail }).select("+password");

    if (!admin) {
      return res.badRequest({ message: "Admin doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.badRequest({ message: "Incorrect password" });
    }

    const accessToken = await adminSignToken(admin._id);

    return res.status(200).json({
      status: "success",
      message:"Login sucessfully!",
      accessToken,
      admin,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  signUp,
  loginAdmin,
};


























// const Admin = require("../../model/Admin");
// const {
//   adminSignToken,
// } = require("../../services/authServices");
// const bcrypt = require("bcrypt");
// const dbService = require("../../utils/dbServices");
// const mongoose = require("mongoose");
// const User = require("../../model/User");

// /**
//  * @description : Sign up a new admin user.
//  * @param {Object} req : The request object including body for email, password, and role.
//  * @param {Object} res : The response object to send back the signup status, access token, and new admin details.
//  * @fields : email, password, role
//  * @return {Object} : Status message indicating the result of the signup operation, access token, and new admin details. {status, accessToken, newUser}
//  */

// const signUp = async (req, res, next) => {
//   try {
//     const { email, password, role } = req.body;
    
//     if (role !== "admin" && role !== "master") {
//       return res.badRequest({
//         message: "Please mention user role as either 'admin' or 'master'.",
//       });
//     }

//     const lowerCaseEmail = email.toLowerCase();

//     const user = await Admin.findOne({ email:lowerCaseEmail });
//     if (user) {
//       return res.badRequest({ message: "User already exists, please login." });
//     }

//     const dataToCreate = {
//       email: lowerCaseEmail,
//       role: role,
//       password: password
//     }

//     const newUser = await dbService.create(Admin, dataToCreate);

//     if (!newUser) {
//       return res.badRequest({
//         message: "Something went wrong, Registration failed.",
//       });
//     }

//     const accessToken = await adminSignToken(newUser._id);

//     return res.status(201).json({
//       status: "success",
//       accessToken,
//       newUser,
//     });
//   } catch (error) {
//     return res.internalServerError({ message: error.message });
//   }
// };

// /**
//  * @description : Create a new admin user by the master admin.
//  * @param {Object} req : The request object including body for email, password, and role.
//  * @param {Object} res : The response object to send back the creation status and new admin details.
//  * @fields : email, password, role
//  * @return {Object} : Status message indicating the result of the creation operation and new admin details. {status, newUser}
//  */
// const createAdminByMaster = async (req, res) => {
//   const findMaster = await dbService.findOne(Admin, { _id: req.admin.id });

//   const { email, password, role } = req.body;
//   const lowerCaseEmail = email.toLowerCase();
//   let user = await Admin.findOne({ email: lowerCaseEmail });

  
//   if (user) {
//     return res.badRequest({ message: "user already exist, Please login" });
//   }

//   if (findMaster.role === "admin") {
//     return res.badRequest({
//       message: "Sorry...! You don't have access to create user.",
//     });
//   }

//   if (role === "master") {
//     return res.badRequest({
//       message: "Sorry...! You don't have access to create master user.",
//     });
//   }

//   const dataToCreate = {
//     email: lowerCaseEmail,
//     role: role,
//     password: password
//   }

//   const newUser = await dbService.create(Admin, dataToCreate);
//   if (!newUser) {
//     return res.badRequest({
//       message: "Something went wrong, User not created.",
//     });
//   }
//   return res.status(201).json({
//     status: "success",
//     newUser,
//   });
// };

// /**
//  * @description : Log in an admin user.
//  * @param {Object} req : The request object including body for email and password.
//  * @param {Object} res : The response object to send back the login status and access token.
//  * @fields : email, password
//  * @return {Object} : Status message indicating the result of the login operation, access token, and admin details. {status, message, accessToken, admin}
//  */
// const loginAdmin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.badRequest({ message: "Please provide email and password" });
//     }
//     const lowerCaseEmail = email.toLowerCase();

//     const admin = await Admin.findOne({ email: lowerCaseEmail }).select("+password");

//     if (!admin) {
//       return res.badRequest({ message: "Admin doesn't exist" });
//     }
//     if (admin.isBan) {
//       return res.badRequest({
//         message: `You are banned by master, you can't login your account. Banned Reason: ${admin.banReason}`,
//       });
//     }

//     const passwordMatch = await bcrypt.compare(password, admin.password);
//     if (!passwordMatch) {
//       return res.badRequest({ message: "Incorrect password" });
//     }

//     const accessToken = await adminSignToken(admin._id);

//     return res.status(200).json({
//       status: "success",
//       accessToken,
//       admin,
//     });
//   } catch (error) {
//     return res.internalServerError({ message: error.message });
//   }
// };

// /**
//  * @description : Update the admin's password.
//  * @param {Object} req : The request object including body for current and new password.
//  * @param {Object} res : The response object to send back the update status.
//  * @fields : oldpassword, newPassword
//  * @return {Object} : Status message indicating the result of the password update operation. {status, message}
//  */
// const setting = async (req, res, next) => {
//   try {
//     const { oldpassword, newPassword } = req.body;

//     if (!oldpassword || !newPassword) {
//       return res.badRequest({
//         message: "Please provide current password and new password",
//       });
//     }

//     const admin = await Admin.findOne({ email: req.admin.email }).select(
//       "+password"
//     );
//     if (!admin) {
//       return res.badRequest({ message: "Admin doesn't exist" });
//     }

//     const passwordMatch = await bcrypt.compare(password, admin.password);
//     if (!passwordMatch) {
//       return res.badRequest({ message: "Incorrect password" });
//     }

//     const hash = await bcrypt.hash(newPassword, 8);
//     await Admin.updateOne({ _id: admin._id }, { $set: { password: hash } });

//     return res.status(200).json({
//       status: "success",
//       message: "Password is updated",
//     });
//   } catch (error) {
//     return res.internalServerError({ message: error.message });
//   }
// };

// /**
//  * @description : Ban an admin or user by the master admin.
//  * @param {Object} req : The request object including body for identifying the user to ban.
//  * @param {Object} res : The response object to send back the banning status.
//  * @fields : adminId, userId, banReason
//  * @return {Object} : Status message indicating the result of the banning operation. {status, message}
//  */
// const banAdminOrUserByMaster = async (req, res) => {
//   try {
//     const { adminId, userId, banReason } = req.body;

//     if (!adminId && !userId) {
//       return res.badRequest({ message: "Please provide adminId or userId" });
//     }

//     if (!banReason || banReason.length > 150) {
//       return res.badRequest({
//         message:
//           "Ban reason must be provided and should be under 150 characters.",
//       });
//     }

//     const findMaster = await dbService.findOne(Admin, { _id: req.admin.id });
//     if (!findMaster || findMaster.role !== "master") {
//       return res.badRequest({
//         message:
//           "You don't have the authority to ban users! Please log in as a master.",
//       });
//     }

//     let userType, userModel, userIdKey;

//     if (adminId) {
//       userType = "admin";
//       userModel = Admin;
//       userIdKey = adminId;
//     } else if (userId) {
//       userType = "user";
//       userModel = User;
//       userIdKey = userId;
//     }

//     const user = await dbService.findOne(userModel, {
//       _id: mongoose.Types.ObjectId(userIdKey),
//     });
//     if (!user) {
//       return res.badRequest({
//         message: `${
//           userType.charAt(0).toUpperCase() + userType.slice(1)
//         } not found.`,
//       });
//     }

//     if (user.isBan) {
//       return res.badRequest({
//         message: `${
//           userType.charAt(0).toUpperCase() + userType.slice(1)
//         } already banned.`,
//       });
//     }

//     // Prevent banning master admins
//     if (userType === "admin" && user.role === "master") {
//       return res.badRequest({
//         message: "You cannot ban an admin with the 'master' role.",
//       });
//     }

//     await userModel.findByIdAndUpdate(
//       user._id,
//       { $set: { isBan: true, banReason } },
//       { new: true }
//     );

//     return res.success({
//       message: `${
//         userType.charAt(0).toUpperCase() + userType.slice(1)
//       } banned successfully.`,
//     });
//   } catch (error) {
//     return res.internalServerError({ message: error.message });
//   }
// };

// /**
//  * @description : Remove the ban from an admin or user by the master admin.
//  * @param {Object} req : The request object including body for identifying the user to unban.
//  * @param {Object} res : The response object to send back the unbanning status.
//  * @fields : adminId, userId
//  * @return {Object} : Status message indicating the result of the unbanning operation. {status, message}
//  */
// const removeBanAdminOrUserByMaster = async (req, res) => {
//   try {
//     const { adminId, userId } = req.body;

//     // Find the master admin
//     const findMaster = await dbService.findOne(Admin, { _id: req.admin.id });
//     if (!findMaster || findMaster.role !== "master") {
//       return res.badRequest({
//         message:
//           "You don't have the authority to unban users! Please log in as a master.",
//       });
//     }

//     let userType, userModel, userIdKey;

//     if (adminId) {
//       userType = "admin";
//       userModel = Admin;
//       userIdKey = adminId;
//     } else if (userId) {
//       userType = "user";
//       userModel = User;
//       userIdKey = userId;
//     }

//     const user = await dbService.findOne(userModel, {
//       _id: mongoose.Types.ObjectId(userIdKey),
//     });
//     if (!user) {
//       return res.badRequest({
//         message: `${
//           userType.charAt(0).toUpperCase() + userType.slice(1)
//         } not found.`,
//       });
//     }

//     if (!user.isBan) {
//       return res.badRequest({
//         message: `${
//           userType.charAt(0).toUpperCase() + userType.slice(1)
//         } is not banned.`,
//       });
//     }

//     await userModel.findByIdAndUpdate(
//       user._id,
//       { $set: { isBan: false }, $unset: { banReason: "" } },
//       { new: true }
//     );

//     return res.success({
//       message: `${
//         userType.charAt(0).toUpperCase() + userType.slice(1)
//       } is now unbanned.`,
//     });
//   } catch (error) {
//     return res.internalServerError({ message: error.message });
//   }
// };


// /**
//  * @description : View All the Admins by the master admin.
//  * @param {Object} req : The request object including body for identifying the user to unban.
//  * @param {Object} res : The response object to send back the unbanning status.
//  * @fields : adminId
//  * @return {Object} : Status message indicating the result of the unbanning operation. {status, message}
//  */

// const viewAllAdminByMaster = async(req,res)=>{
//  try {

//   // Find the master admin
//   const findMaster = await dbService.findOne(Admin, { _id: req.admin.id });
//   if (!findMaster || findMaster.role !== "master") {
//     return res.badRequest({
//       message:
//         "You don't have the authority to unban users! Please log in as a master.",
//     });
//   }

//   const findData  = await Admin.find({role: 'admin'});
//   if(!findData){
//     return res.badRequest({message : "Error!! Fetching data"});
//   }
//   return res.success({data: findData})
//  } catch (error) {
//   return res.badRequest({message: error.message});
//  }

// }

// module.exports = {
//   loginAdmin,
//   setting,
//   signUp,
//   createAdminByMaster,
//   banAdminOrUserByMaster,
//   removeBanAdminOrUserByMaster,
//   viewAllAdminByMaster
// };
