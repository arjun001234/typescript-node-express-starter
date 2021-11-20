// import {google} from 'googleapis';

// class GoogleService {
//   public oauth2Client;
//   public url : string;
//   private scopes : string[] = [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile'
//   ];
//   private static instance: GoogleService;
//   constructor(){
//     this.oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_SECRET,'http://localhost:4000/users/google');
//     this.url = this.oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: this.scopes
//     })
//   }
//   static getInstance(): GoogleService {
//     if (!GoogleService.instance) {
//       GoogleService.instance = new GoogleService();
//     }
//     return GoogleService.instance;
//   }
// }

// private googleLogin() : void {
//   this.router.get('/users/google',async (req: Request,res: Response) => {
//     try {
//       const code = req.query.code as string
//       const {tokens} = await GoogleService.oauth2Client.getToken(code);
//       GoogleService.oauth2Client.setCredentials(tokens);
//       const userInfo = (await oauth2("v2").userinfo.get({auth: GoogleService.oauth2Client})).data;
//       const user = new UserModel({
//         name: userInfo.name,
//         email: userInfo.email,
//         password: `${userInfo.id}${process.env.APP_SECRET}`
//       })
//       const token = await user.generateToken();
//       await user.save();
//       res.send({user,token});
//     } catch (error: any) {
//       res.send(error);
//     }
//   })
// }

// const stringifiedParams = queryString.stringify({
//   client_id: process.env.GOOGLE_CLIENT_ID,
//   redirect_uri: 'http://localhost:4000/users/google',
//   scope: [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile',
//   ].join(' '),
//   response_type: 'code',
//   access_type: 'offline',
//   prompt: 'consent',
// });

// export const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;