const { User, Thought} = require('../models');

 const thoughtController = {
     // GET /api/thoughts
     getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
        console.log(err);
        res.sendStatus(400);
        });
    },
     //GET /api/thoughts/:id
     getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.json({message: 'No thought found with this id!'})
            }
            return res.json(dbThoughtData);
          })
        .catch((err) => {
            return res.json(err)})
    },
     //POST /api/thoughts/:id
     createThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                {_id: body.userId},
                {$push: { thoughts: dbThoughtData._id }},
                {new: true}
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
    },
     //PUT /api/thoughts/:id
     updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.id},
            body,
            {new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(400).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
     //DELETE /api/thoughts/:id
     deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(400).json({ message: 'No thought found with this id!' });
            }
            return User.findOneAndUpdate(
                {_id: params.username},
                {$pull: {thoughts: params.id}},
                {new: true}
                )
                .then(() => {
                    res.json({message: 'Thought successfully deleted!'});
                })
                .catch(err => res.status(400).json(err));
            })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },
     //POST /api/thoughts/:thoughtId/reactions
     createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.id},
            {$push: {reactions: body}},
            {new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(400).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
     //DELETE /api/thoughts/:thoughtId/reactions

     deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true, runValidators: true}
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with this id!' });
                return;
            }
            res.json({message: 'reaction seuccessfully deleted'});
        })
        .catch(err => res.json(err));
    }
};
 

 module.exports = thoughtController;
