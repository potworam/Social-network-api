const { Schema, model } = require('mongoose');

 const UserSchema = new Schema(
   {
     username: {
       type: String,
       unique: true,
       required: 'Please enter a username!',
       trim: true
     },
     email: {
       type: String,
       required: 'Please enter a valid email!',
       unique: true,
       match: /.+\@.+\..+/
     //   validate: {
     //     validator(email) {
     //       return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
     //     },
     //     message: "Please enter a valid email address!",
     //   },
     },
     thoughts: [
         {
           type: Schema.Types.ObjectId,
           ref: 'Thought'
         }
       ],
     friends: [
         {
           type: Schema.Types.ObjectId,
           ref: 'User'
         }
       ]
   },
   {
     toJSON: {
       virtuals: true,
       getters: true
     },
     id: false
   }
 );

 // friend count virtual
 UserSchema.virtual('friendCount').get(function() {
   return this.friends.length
 });

 const User = model('User', UserSchema);

 module.exports = User;