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
const GOOGLE_CLIENT_ID = "963402508457-u58vs03gi4rp708gvted36vrogkanvf2.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback",
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield db_1.UserModel.find({ googleId: profile.id });
            if (!user) {
                const newuser = yield db_1.UserModel.create({
                    googleId: profile.id,
                    //@ts-ignore
                    email: profile.emails[0].value,
                    username: profile.displayName,
                });
                console.log(newuser);
                yield newuser.save();
            }
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
