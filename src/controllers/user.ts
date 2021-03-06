// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// import { Request, Response } from "express";
// import {
//   helperCreateUser,
//   helperResetPass,
//   helperGetUser,
//   helperOneUser,
//   helperSetRoll,
// } from "../helpers/user";

// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// const { google } = require("googleapis");
// const CLIENT_ID =
//   "879297955144-96ni6nqafc82f2pmtoudirg83dr4vub1.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";
// const REDIRECT_URL = "https://developers.google.com/oauthplayground";
// const REFRESH_TOKEN =
//   "1//04Hafn99KTVCbCgYIARAAGAQSNwF-L9IrL-kh9ejR2hYYze2_cfNE93m_bIPZiL0VzbcW1pcpJCx77psTMKi3jxlpB6uKyn96cEQ";
// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URL
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// //encryp & validate password
// const encryptPassword = async (password: string): Promise<string> => {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// };
// const validatePassword = function (
//   password: string,
//   hash: string
// ): Promise<boolean> {
//   return bcrypt.compare(password, hash);
// };

// export const signUp = async (req: Request, res: Response) => {
//   try {
//     // console.log(req.body);
//     const props = req.body;
//     //comprobamos si ya se creo la cuenta
//     const userAlreadyExist = await prisma.user.findFirst({
//       where: { email: props.email },
//     });

//     if (userAlreadyExist)
//       return res.status(200).json({ message: "User already exist" });

//     let newUser: any = await helperCreateUser(props);
//     newUser.password = await encryptPassword(newUser.password);
//     newUser = await prisma.user.update({
//       where: { id: newUser.id },
//       data: { password: newUser.password },
//     });
//     // token
//     const token: string = jwt.sign(
//       { id: newUser.id },
//       process.env.SECRET || "tokenTest",
//       {
//         expiresIn: "1d", //token expires in 2 hours
//       }
//     );
//     newUser
//       ? res.status(200).header("auth-token", token).send({
//           msg: "User created successfully, pls check your email to confirm",
//           token,
//         })
//       : res.send({ msg: "Error, could not create user" });

//     const sendMail = async (newUser: any) => {
//       const accessToken = await oAuth2Client.getAccessToken();

//       const transport = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           type: "oauth2",
//           user: "mathiasimagine@gmail.com",
//           clientId: CLIENT_ID,
//           clientSecret: CLIENT_SECRET,
//           refreshToken: REFRESH_TOKEN,
//           accessToken: accessToken,
//         },
//       });

//       const mailOptions = {
//         from: "FUNKOMMERCE  <mathiasimagine@gmail.com>",
//         // in Prod
//         to: newUser.email,
//         subject: "Activate Account",
//         text: "Hello from gmail using API",
//         html: `<h1>Email Confirmation</h1>
//                       <h2>Hello ${newUser.name}</h2>
//                       <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
//                       <a href=http://localhost:3000/confirm/${token}> Click here </a>
//                       </div>`,
//       };
//       const result = await transport.sendMail(mailOptions);
//       return result;
//     };
//     sendMail(newUser);
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const signIn = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await prisma.user.findFirst({ where: { email }});
//     if (!user) {
//       return res.status(200).send({ msg: "User not found" });
//     }
//     const validPassword: boolean = await validatePassword(
//       password,
//       user.password || ""
//     ); //PROBABLEMENTE ESTA MAL
//     if (!validPassword) {
//       return res.status(200).send({ msg: "Password is incorrect" });
//     }
//     if (user.status === "PENDING") {
//       return res
//         .status(200)
//         .send({ msg: "User not confirmed, please check your Email" });
//     } else {
//       // token
//       const token: string = jwt.sign(
//         { id: user.id },
//         process.env.SECRET || "tokenTest",
//         {
//           expiresIn: "1d",
//         }
//       );
//       const userLoged: any = await prisma.user.update({
//         where: { id: user.id },
//         data: { LogedIn: true },
//       });
//       res
//         .status(200)
//         .header("auth-token", token)
//         .send({
//           msg: "User signed in successfully",
//           token,
//           user: {
//             name: userLoged.name,
//             email: userLoged.email,
//             id: userLoged.id,
//             role: userLoged.role,
//           },
//         });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// interface IDecoded {
//   id: string;
//   iat: number;
//   exp: number;
// }
// export const profile = async (req: Request, res: Response) => {
//   try {
//     const token = req.header("auth-token");
//     console.log(token);
//     if (!token) return res.status(401).send({ msg: "Acces denied" });
//     const decoded = jwt.verify(
//       token,
//       process.env.SECRET || "tokenTest"
//     ) as IDecoded;
//     const user1: any = await prisma.user.findUnique({
//       where: { id: parseInt(decoded.id) },
//     });
//     console.log(user1);
//     if (user1.status === "PENDING" || user1.LogedIn === false)
//       return res.status(401).send({ msg: "Acces denied" });
//     const userId = await prisma.user.findUnique({
//       where: { id: parseInt(decoded.id) },
//     });
//     res.status(200).send({ msg: "User found", user: userId });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const confirm = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(
//       token,
//       process.env.SECRET || "tokenTest"
//     ) as IDecoded;
//     const user = await prisma.user.update({
//       where: { id: parseInt(decoded.id) },
//       data: { status: "ACTIVE" },
//     });
//     res.status(200).send({ msg: `Confirmed!, welcome ${user.name}` });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     const userNewPassword = await prisma.user.findUnique({ where: { email } });
//     if (!userNewPassword) {
//       return res.send({ msg: "User not found" });
//     } else {
//       const token = jwt.sign(
//         { id: userNewPassword.id },
//         process.env.SECRET || "tokenTest",
//         {
//           expiresIn: "2h",
//         }
//       );
//       res.send({ msg: "Email sent" });
//       const sendMail = async (userNewPassword: any) => {
//         const accessToken = await oAuth2Client.getAccessToken();
//         const transport = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             type: "oauth2",
//             user: "mathiasimagine@gmail.com",
//             clientId: CLIENT_ID,
//             clientSecret: CLIENT_SECRET,
//             refreshToken: REFRESH_TOKEN,
//             accessToken: accessToken,
//           },
//         });
//         const mailOptions = {
//           from: "FUNKOMMERCE  <mathiasimagine@gmail.com>",
//           // in Prod
//           to: userNewPassword.email,
//           subject: "Recover your Account",
//           text: "Hello from gmail using API",
//           html: `<h1>Change your Password</h1>
//               <h2>Dont worry! ${userNewPassword.name}</h2>
//               <p>If you forgot your password click in the link donw below to get a new one!</p>
//               <a href=http://localhost:3000/confirmnewpassword/${token}> Click here </a>
//               </div>`,
//         };
//         const result = await transport.sendMail(mailOptions);
//         return result;
//       };
//       sendMail(userNewPassword);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const newPassword = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.params;
//     const { password1, password2 } = req.body;
//     const decoded = jwt.verify(
//       token,
//       process.env.SECRET || "tokenTest"
//     ) as IDecoded;
//     if (password1 !== password2) {
//       return res.status(401).send({ msg: "Passwords do not match" });
//     }
//     if (password1 === password2) {
//       // user.password = await encryptPassword(newUser.password);
//       const passwordChanged = await encryptPassword(password1);
//       const user = await prisma.user.update({
//         where: { id: parseInt(decoded.id) },
//         data: { password: passwordChanged },
//       });
//       res
//         .status(200)
//         .send({ msg: `Password changed!, try to login again ${user.name}` });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const logOut = async (req: Request, res: Response) => {
//   try {
//     const token = req.header("auth-token");
//     if (!token) return res.status(401).send({ msg: "Acces denied" });
//     const decoded = jwt.verify(
//       token,
//       process.env.SECRET || "tokenTest"
//     ) as IDecoded;
//     const userLoged: any = await prisma.user.update({
//       where: { id: parseInt(decoded.id) },
//       data: { LogedIn: false },
//     });
//     res.status(200).send({ msg: "User signed out successfully" });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const { idUser } = req.query;
//     let findUserOne = await prisma.user.findFirst({
//       where: { id: Number(idUser) },
//     });
//     let findOrder = await prisma.order.findFirst({
//       where: {
//         UserId: Number(idUser),
//       },
//     });
//     if(findUserOne){
//     if (findOrder) {
//       let findDetail = await prisma.order_detail.findFirst({where:{OrderId: findOrder?.id}})
//       if(findDetail){
//         await prisma.order_detail.deleteMany({
//           where:{OrderId: findOrder?.id}
//         })
//       }
//       await prisma.order.delete({where:{id:findOrder.id}})
//     }
//     await prisma.user.delete({ where: { id: Number(idUser) } });
//     return res.status(200).send({ msg: "User has been deleted" });
//   }
//     res.status(404).send({ msg: "Wrong user ID" });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getUsersAdmin = async (req: Request, res: Response) => {
//   const email = req.body.email;
//   const token = req.body.token;
//   try {
//     const Admin = await prisma.user.findUnique({
//       where: { email: email },
//     });

//     if (Admin!.role !== "ADMIN") return res.send({ msg: "User Not Admin" });

//     const users = await prisma.user.findMany({
//       select: {
//         name: true,
//         lastName: true,
//         email: true,
//         role: true,
//         LogedIn: true,
//       },
//     });
//     console.log("los usuario son: ", users);
//     return res.send({ msg: "todo ok", users });
//   } catch (error) {
//     console.log("error en Get_User_Admin");
//     return res.send({ msg: "error XD" });
//   }
// };

// export const getAllUser = async (req: Request, res: Response) => {
//   try {
//     const token = req.header("auth-token");
//     if (!token) return res.status(401).send({ msg: "Acces denied" });
//     let AllUser = await helperGetUser();
//     AllUser
//       ? res.status(200).send(AllUser)
//       : res.status(404).send({ msg: "user was not shortened" });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getOneUser = async (req: Request, res: Response) => {
//   try {
//     const token = req.header("auth-token");
//     const props = req.params;
//     if (!token) return res.status(401).send({ msg: "Acces denied" });
//     let oneUser = await helperOneUser(props);
//     oneUser
//       ? res.status(200).send(oneUser)
//       : res.status(404).send({ msg: "user was not shortened" });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const setUserRole = async (req: Request, res: Response) => {
//   try {
//     const token = req.header("auth-token");
//     const props = req.body;
//     if (!token) return res.status(401).send({ msg: "Acces denied" });
//     let oneUser = await helperSetRoll(props);
//     oneUser
//       ? res.status(200).send(oneUser)
//       : res.status(404).send({ msg: "user not update role" });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const setUserResetPass = async (req: Request, res: Response) => {
//   try {
//     const token = req.header("auth-token");
//     const props = req.body;
//     if (!token) return res.status(401).send({ msg: "Acces denied" });
//     let oneUser = await helperResetPass(props);
//     oneUser
//       ? res.status(200).send({ msg: "user reset pass " })
//       : res.status(404).send({ msg: "user not reset pass  " });
//     const sendMail = async (oneUser: any) => {
//       const accessToken = await oAuth2Client.getAccessToken();
//       const transport = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           type: "oauth2",
//           user: "mathiasimagine@gmail.com",
//           clientId: CLIENT_ID,
//           clientSecret: CLIENT_SECRET,
//           refreshToken: REFRESH_TOKEN,
//           accessToken: accessToken,
//         },
//       });
//       const mailOptions = {
//         from: "FUNKOMMERCE  <mathiasimagine@gmail.com>",
//         // in Prod
//         to: oneUser.email,
//         subject: "Recover your Account",
//         text: "Hello from gmail using API",
//         html: `<h1>Change your Password</h1>
//           <h2>Hi ${oneUser.name}!</h2>
//           <p>Your password was changed and set to 1234, please update it by clicking here:</p>
//           <a href=http://localhost:3000/confirmnewpassword/${token}> Click here </a>
//           </div>`,
//       };
//       const result = await transport.sendMail(mailOptions);
//       return result;
//     };
//     sendMail(oneUser);
//   } catch (error) {
//     console.error(error);
//   }
// };
