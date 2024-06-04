import postModel from "../models/Post.js";
import userModel from "../models/User.js";

/* CREATE */
export const createPostController = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await userModel.findById(userId);
    const newPost = new postModel({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await postModel.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPostsController = async (req, res) => {
  try {
    const post = await postModel.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPostsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await postModel.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePostController  = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await postModel.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};