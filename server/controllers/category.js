import Category from '../models/category.js';
import Profile from '../models/profile.js';
export async function createCategory(req, res) {
  const { name } = req.body;
  try {
    const category = await Category.findOne({ name, userId: req.user._id });

    // if the user already have a category with this name
    if (category) {
      return res
        .status(422)
        .json({ errors: ['A category with that name already exiist'] });
    }

    // create new category and add it to the category list of the user
    const newCategory = new Category({ name, userId: req.user.userId });
    const user = await Profile.findById(req.user.userId);
    const result = await newCategory.save();
    user.categoryList.push(result.id);
    await user.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await Category.find({ userId: req.user.userId });
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
}
