const { Schema, model, Types } = require('mongoose');
 const User = require('./User.js');
 const dateFormat = require('../utils/dateFormat');

 //reaction schema
 const ReactionSchema = new Schema(
     {
       reactionId: {
         type: Schema.Types.ObjectId,
         default: () => new Types.ObjectId()
       },
       reactionBody: {
         type: String,
         required: 'Body content is required!',
         maxLength: 280
       },
       username: {
           type: String,
           required: 'Please enter a username!'
       },
       createdAt: {
         type: Date,
         default: Date.now,
         get: createdAtVal => dateFormat(createdAtVal)
       }
     },
     {
       toJSON: {
         getters: true
       },
       id: false
     }
   );

 //thought schema
 const ThoughtSchema = new Schema(
   {
     thoughtText: {
       type: String,
       required: 'Content here is required!',
       minLength: 1,
       maxLength: 280
     },
     createdAt: {
         type: Date,
         default: Date.now,
         get: createdAtVal => dateFormat(createdAtVal)
     },
     username: {
       type: String,
       required: 'Please provide a username!'
     },
     reactions: [ReactionSchema],
   },
   {
     toJSON: {
       getters: true,
       virtuals: true
     },
     id: false
   }
 );

 ThoughtSchema.virtual('reactionCount').get(function() {
   return this.reactions.length;
 });

 const Thought = model('Thought', ThoughtSchema);

 module.exports = Thought;