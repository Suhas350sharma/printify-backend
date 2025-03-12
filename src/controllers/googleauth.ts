import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from "../db";
import {CLIENT_ID,CLIENT_SECRET,CALLBACKURL} from "../config"

passport.use(new GoogleStrategy({
    clientID:  CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACKURL,
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    try{
      let user=await UserModel.findOne({googleId:profile.id});
      console.log(user);
      if(!user){
        const newuser=await UserModel.create({
          googleId:profile.id,
          //@ts-ignore
          email:profile.emails[0].value,
          username:profile.displayName,
          password:"Google-oauth"
        })
        await newuser.save();
      }
      //@ts-ignore
      done(null,user);
      return;
    }catch(error){
       done(error,undefined)
       return;
    } 
  }
));

passport.serializeUser(function(user,done){
    done(null,user)
})

passport.deserializeUser(async  function(id,done){
  try{
    const user=await UserModel.findById(id);
    done(null,user)
  }catch(error){
    done(error,null)
  }
})