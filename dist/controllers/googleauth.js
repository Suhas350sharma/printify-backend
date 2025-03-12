"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("../db");
const config_1 = require("../config");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_1.CLIENT_ID,
    clientSecret: config_1.CLIENT_SECRET,
    callbackURL: config_1.CALLBACKURL,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(profile);
        try {
            let user = yield db_1.UserModel.findOne({ googleId: profile.id });
            console.log(user);
            if (!user) {
                const newuser = yield db_1.UserModel.create({
                    googleId: profile.id,
                    //@ts-ignore
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: "Google-oauth"
                });
                yield newuser.save();
            }
            //@ts-ignore
            done(null, user);
            return;
        }
        catch (error) {
            done(error, undefined);
            return;
        }
    });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db_1.UserModel.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    });
});
