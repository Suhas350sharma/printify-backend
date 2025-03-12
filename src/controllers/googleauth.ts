import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from "../db";



passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try{
      let user=await UserModel.find({googleId:profile.id});

      if(!user){
        const newuser=await UserModel.create({
          googleId:profile.id,
          //@ts-ignore
          email:profile.emails[0].value,
          username:profile.displayName,
        })
        console.log(newuser)
        await newuser.save();
      }
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