import CustomList from '../models/CustomList.js';

// @desc    Get user's custom lists
// @route   GET /api/lists
// @access  Private
export const getMyLists = async (req, res) => {
  try {
    const lists = await CustomList.find({ user: req.user._id });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a custom list
// @route   POST /api/lists
// @access  Private
export const createList = async (req, res) => {
  try {
    const { title, description } = req.body;
    const list = await CustomList.create({
      user: req.user._id,
      title,
      description,
      books: []
    });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add book to list or rename list
// @route   PUT /api/lists/:id
// @access  Private
export const updateList = async (req, res) => {
  try {
    const { title, description, action, book } = req.body;
    const list = await CustomList.findOne({ _id: req.params.id, user: req.user._id });

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (title) list.title = title;
    if (description !== undefined) list.description = description;

    if (action === 'addBook' && book) {
      if (!list.books.find(b => b.openLibraryId === book.openLibraryId)) {
        list.books.push(book);
      }
    } else if (action === 'removeBook' && book) {
      list.books = list.books.filter(b => b.openLibraryId !== book.openLibraryId);
    }

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete custom list
// @route   DELETE /api/lists/:id
// @access  Private
export const deleteList = async (req, res) => {
  try {
    const list = await CustomList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.json({ message: 'List removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
