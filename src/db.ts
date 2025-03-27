import mongoose, {Schema,model}from 'mongoose';
const ObjectId=mongoose.Types.ObjectId;
import { MONGO_URL } from './config';

mongoose.connect(MONGO_URL);

interface User{
    username:string;
    PhNo:string;
    email:string;
    password:string;
    resetToken:string | null;
    resetTokenExpiry:Date | null;
}

const userSchema = new Schema({
    username:{  type: String, required: true },
    PhNo:{type: String},
    email:{type: String, unique:true},
    password:{type:String, required:true},
    resetToken:{type:String,default:null},
    resetTokenExpiry:{type:Date,default:null},
    googleId:{type:String}
});

const adminSchema=new Schema({
    username:{type:String, required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
})

const filesSchema = new Schema({
    userId:{type:ObjectId,required:true},
   files:[
    {
        filename:{type:String,required:true},
        documentUrl:{type:String,required:true},
        colorMode:{type:String,enum:["black_white","color"],required:true},
        side:{type:String,enum:["single","double"],required:true},
        papersize:{type:String,enum:["1","2","4"],required:true},
        numberofcopies:{type:Number,required:true},
        numberofpages:{type:Number,required:true},
        price:{type:Number,require:true},
    }
   ],
   TotalAmount:{type:Number,required:true},
   TotalSheets:{type:Number,required:true}
})

const UserfilesSchema=new Schema({
    userId:{type:ObjectId,required:true},
    files:[
        {
            filename:{type:String,required:true},
            documentUrl:{type:String,required:true},
            colorMode:{type:String,enum:["black_white","color"],required:true},
            side:{type:String,enum:["single","double"],required:true},
            papersize:{type:String,enum:["1","2","4"],required:true},
            numberofcopies:{type:Number,required:true},
            numberofpages:{type:Number,required:true},
            price:{type:Number,require:true},
        }
       ]
})

export const UserModel=model("userSchema",userSchema);
export const AdminModel=model("adminSchema",adminSchema);
export const FilesModel=model("filesSchema",filesSchema);
export const UserfilesModel=model("particularuserSchema",UserfilesSchema)



