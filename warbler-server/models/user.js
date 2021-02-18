const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
});

userSchema.pre("save", async function(next){
    try{
        //modify the password
        if(!this.isModified("password")){
            return next();
        }
        //hashing the password
        let hashedPassword = await bcrypt.hash(this.password, 10);
        //set to be that password from the user document
        this.password = hashedPassword;
        return next();
    } catch(err){
        return next(err);
    }
});

//easy way to compare the password that we get from a form/json request/ to whatever is inside of the database 
//useful to see if the user puts the right password when logging in
userSchema.methods.comparePassword = async function(candidatePassword, next){
    try{
        let isMatch = await bcrypt.compare(candidatePassword, this.password); //returns a boolean - true/false
        return isMatch;
    } catch(err){
        return next(err);
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;