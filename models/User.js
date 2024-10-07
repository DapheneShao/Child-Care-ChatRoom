// Author: Zhuojun Shao
// Date: August 2024
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema({
    username:{type: String, required: true, unique: true },
    password:{type: String, required: true },
    // role:{type: String, required: true}
});

// Save the user with encrypted password before saving
// chatgpt generate
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.comparePassword=function(password) {
    return bcrypt.compare(password,this.password)
};

module.exports=mongoose.model('User',UserSchema);
