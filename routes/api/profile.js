const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile')
const User = require('../../models/user')
const { check, validationResult } = require('express-validator')
//@route GET api/profile/me
// @description test Route
// @access Public
router.get('/me',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})
//@route GET api/profile
// @description Create or Update the user profile
// @access Private
router.post('/',[auth,[
    check('status','Status is requires').not().isEmpty(),
    check('skills','Skills are required').not().isEmpty()
    ] 
],
async(req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() }) ;
    }

     // destructure the request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
        // spread the rest of the fields we don't need to check
        // ...rest
    } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    console.log(profileFields.skills);
    // res.send('Hello');

    //build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    //Check from here in  the morning!
    try{
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            //update
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            );
            return res.json(profile);
        }
        //create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}
);

//@route GET api/profile
// @description Get all profile
// @access Public
router.get('/',async(req,res)=>{
    try{
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

//@route GET api/profile/user/:user_id
// @description Get profile by ID
// @access Public

router.get('/user/:user_id',async(req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.send(profile);
    }catch(err){
        console.log(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

//@route DELETE api/profile
// @description Delete profile ,user & posts
// @access Private

router.delete('/',auth,async(req,res)=>{
    try{
        //Remove profile
        await Profile.findOneAndDelete({user: req.user.id});
        //Remove User
        await User.findOneAndDelete({_id: req.user.id});
        
        res.json({msg: 'User Deleted'});
    }catch(err){
        console.log(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

//@route PUT api/profile/experience
// @description Add profile experiance
// @access Private
router.put('/experience',[
    auth,
    [
        check('title','Title is required').not().isEmpty(),
        check('company','Company is required').not().isEmpty(),
        check('from','From date is required').not().isEmpty(),
    ]
],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try{
            const profile = await Profile.findOne({user: req.user.id});
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        }catch(err){
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }

)

//@route DELETE api/profile/experience/:exp_id
// @description Add profile experiance
// @access Private
router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id});
        //Get remove index
        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

//@route PUT api/profile/education
// @description Add profile education
// @access Private
router.put('/education',[
    auth,
    [
        check('school','School is required').not().isEmpty(),
        check('degree','Degree is required').not().isEmpty(),
        check('fieldofstudy','Field of Study is required').not().isEmpty(),
        check('from','From Date is required').not().isEmpty()
    ]   
],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try{
            const profile = await Profile.findOne({user: req.user.id});
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        }catch(err){
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }

)

//@route DELETE api/profile/experience/:exp_id
// @description Add profile experiance
// @access Private
router.delete('/education/:edu_id',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id});
        //Get remove index
        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports =  router;