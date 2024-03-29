import _ from 'lodash'
var ejs = require('ejs');
const fs = require('fs');
var path = require('path');
var nodemailer = require("nodemailer");
const SiteConfig = require("../../config/site");
const EmailConfig = require("../../config/email");
const Questionaire = require('../../models/QuestionaireSchema');
const InviteQuestionaire = require('../../models/InviteQuestionaireSchema');
const User = require('../../models/User');
const auth = require("../../auth");

export const getInviteQuestionaireQuestionaire = async (parentValue, args) => {
  return await Questionaire.findOne({'_id': parentValue.questionaire});
}

export const getInviteQuestionaireSender = async (parentValue, args) => {
  let user = await User.findOne({'_id': parentValue.senderId});
  user = user.toObject();
  if("password" in user) delete user.password;
  return user;
}

export const getInviteQuestionaireReceiver = async (parentValue, args) => {
    let user = await User.findOne({'_id': parentValue.receiverId});
    user = user.toObject();
    if("password" in user) delete user.password;
    return user;
  }

  export const getInviteQuestionaireForReceiver = async (parentValue, args,req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    const user = await User.findOne({_id: req.userId});
    return await InviteQuestionaire.find({invitedUserEmail: user.email});
  }


export const getInviteQuestionaireById = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  return await InviteQuestionaire.findOne({_id: args.id});
}

export const addInviteQuestionaire = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    const inviteQuestionaire =  await InviteQuestionaire.findOne({questionaire: args.questionaire, invitedUserEmail: args.invitedUserEmail, senderId: args.senderId});
    if(inviteQuestionaire) {
      return new Error('User is already invited for this questionaire!');
    } else {
      let inviteQuestionaire = new InviteQuestionaire({
        questionaire: args.questionaire,
        invitedUserEmail: args.invitedUserEmail,
        senderId: args.senderId,
        receiverId: args.receiverId,
        status: args.status,
        permission: args.permission
      });
    
      return await inviteQuestionaire.save();
    }
   
  } catch(e) {
    console.log(e);
    throw new Error('Error while adding new inviteQuestionaire');
  }
};

  export const editInviteQuestionaire = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await InviteQuestionaire.findOne({'_id': args.id});
      for (const key in args) {
        if (key !== "id") {
          result[key] = args[key];
        }
      }
      result.save();
      return result;
    }
    catch(e) {
      console.log(e);
      throw new Error('Error while editing InviteQuestionaire');
    }
  };
  
  export const deleteInviteQuestionaire = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await InviteQuestionaire.findOneAndRemove({$or: [
        {'_id': args.id},
        {'senderId': args.senderId},
        {'receiverId': args.receiverId},
      ]});
      return result;
    }
    catch(e) {
      throw new Error('Error while deleting InviteQuestionaire');
    }
  };
  
  export const deleteAllInviteQuestionaire = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await InviteQuestionaire.remove({'senderId': args.senderId});
      return result;
    }
    catch(e) {
      throw new Error('Error while deleting all InviteQuestionaires');
    }
  };
  
  export const inviteUser = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let permission
      const questionaire = await Questionaire.findOne({_id: args.questionaire});
      if(questionaire) {
        if(questionaire.owner == req.userId) {
          permission = 'r';
        } else {
          permission = 'rw';
        }
      }
      
      const user = await User.findOne({email: args.email});
      if(user) {
        if(req.userId == user._id) {
          return new Error('You cannot send invite to yourownself');
        }
        args.receiverId = user._id;
      }

      const inviteQuestionaire =  await InviteQuestionaire.findOne({questionaire: args.questionaire, invitedUserEmail: args.email, senderId: req.userId});
      if(inviteQuestionaire) {
        return new Error('User is already invited for this questionaire!');
      } else {
        const inviteQuestionaire = new InviteQuestionaire({
          questionaire: args.questionaire,
          invitedUserEmail: args.email,
          senderId: req.userId,
          receiverId: args.receiverId,
          status: args.status,
          permission: permission
        });
      
        await inviteQuestionaire.save();

         // G:/projects/GoogleFormClone/emails/invite-user.htm
      var template = fs.readFileSync(path.join('emails', 'notification.htm'), 'utf-8');
      var emailHTML = ejs.render(template, {
          siteURL: `${SiteConfig.url}:${SiteConfig.port}/login`,
          action: 'To open the link, click the following link:',
          btnText: 'Open Questionarire',
          message: 'If you do not want to view this questionaire form you can ignore and delete this email'
      });
      try {
      
        let transporter = nodemailer.createTransport({
            host: EmailConfig.host,
            port: EmailConfig.port,
            secure: EmailConfig.secure,
            auth: {
                user: EmailConfig.username,
                pass: EmailConfig.password
            }
        });
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            to: args.email, // list of receivers
            subject: "Invitation to fill the form", // Subject line
            html: emailHTML // html body
        });

        if(info.accepted.length > 0) {
          return {msg: "User is invited successfully"};
        }

      } catch(e) {
          console.log(e);
          return {msg: "Something went wrong while inviting the user"};

      }
    }     
     
    } catch(e) {
      console.log(e);
      throw new Error('Error while inviting user for questionaire');
    }
  }