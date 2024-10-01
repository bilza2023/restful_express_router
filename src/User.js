const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 =========================== TcodeSchema =======================
 
 1:*    email: String,required: true,unique: true
 2:*    password: String,required: true,
 3:     role : String,['student', 'teacher' , 'admin'],required: true,default : 'student'
 4:     name: String,required: false,unique: true
 5:     verified: Boolean,required: true,default: false
 6:     verificationId: String,required: false
 7:     createdAt: Date,required: true,default: Date.now
 8:     purchases: [purchasesSchema],required: true,default : []
 9:     description:String,required: false
   
 */
///////////////////////////////////////////
const purchasesSchema = new Schema({
        tcode: { 
                    type: String,
                    required: true,
                  },
        startDate: { 
                    type: Date,
                    required: true,
                  },
        endDate: { 
                    type: Date,
                    required: true,
                  }
                
});
///////////////////////////////////////////
const UserSchema = new Schema({

email: { 
        type: String,
        required: true,
        unique: true
},
password: {
        type: String,
        required: true,
        },
role : { // Board name, can be one of the specified values
        type: String,
        enum: ['student', 'teacher' , 'admin'],
        required: true,
        default : 'student'
        },        
name: {
        type: String,
        required: false,
        },
verified: { 
        type: Boolean,
        required: true,
        default: false
        },
verificationId: { 
        type: String,
        required: false
        },
createdAt: { 
        type: Date,
        required: true,
        default: Date.now
        },
verifiedAt: { 
        type: Date,
        required: false,
        },
lastLoginDate: { 
        type: Date,
        required: false,
        },
notifications: {
        type: [String],
        required: true,
        default : []
        },
purchases: {
        type: [purchasesSchema],
        required: true,
        default : []
        },
description: {
        type: String,
        required: false
        }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
