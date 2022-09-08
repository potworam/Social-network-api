import { User, Thought } from '../models';
import { populate } from '../models/User';
const userController = {
    //GET /api/users
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
        console.log(err);
        res.sendStatus(400);
        });
    },

    //GET /api/users/:id
    getUserById( { params }, res) {
        User.findOne({ _id: params.id })
        .populate( { path: 'thoughts', select: '-__v' } )
        .populate( { path: 'friends', select: '-__v' } )
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
              return res.json({message: 'No user found with this id!'})
            }
            return res.json(dbUserData);
          })
        .catch((err) => {
            return res.json(err)})
    },

    //POST /api/users
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    //PUT /api/users/:id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            {_id: params.id},
            body,
            {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //DELETE /api/users/:id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    //POST /api/users/:userId/friends/:friendId
    addFriend({ params }, res) {
        User.findByIdAndUpdate(
            {_id: params.id},
            {$push: {friends: params.friendId }},
            {new: true, runValidators: true}
        )
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //DELETE /api/users/:userId/friends/:friendId
    removeFriend({ params }, res) {
        User.findByIdAndUpdate (
            {_id: params.id},
            {$pull: {friends: params.friendId}},
            {new: true, runValidators: true}
        )
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }
};

export default userController;