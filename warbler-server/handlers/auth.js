const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next){
    try{
        //find a user
        let user = await db.User.findOne({
            email: req.body.email
        });
        let { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(req.body.password);
        //check if password matches what is send to the server
        if(isMatch){
            let token = jwt.sign(
                {
                    id,
                    username,
                    profileImageUrl
                },
                process.env.SECRET_KEY
            );
            //if is all matches
            //log the use in
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password"
            });
        }
    } catch(err) {
        return next({
            status: 400,
            message: "Invalid Email/Password"
        });
    }
};

exports.signup = async function(req, res, next){
    try{
        //create a user
        let user = await db.User.create(req.body);
        //distructuring properties from the document we got back
        let { id, username, profileImageUrl } = user;
        //cretate a token (signing a token) using jwt
        let token = jwt.sign(
            {
                id, 
                username,
                profileImageUrl
            }, 
            
            //process.env.SECRET_KEY
            process.env.SECRET_KEY
        );
        //respond with json including these properties
        return res.status(200).json({
            id, 
            username, 
            profileImageUrl,
            token
        }); 
    } catch(err){
        //if a validation fails (the required and unique from user model should pass in order not to fail the validation)
        if(err.code === 11000){
            //respond with username/email already taken
            err.message = "Sorry, that username and/or email is taken";
        }
        //otherwise just send back a generic 400
        return next({
            status: 400,
            message: err.message
        });
    }
};