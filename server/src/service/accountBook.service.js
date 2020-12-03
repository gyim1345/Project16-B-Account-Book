const AccountBookModel = require('../model/accountBook.model');
const newError = require('../util/error');

const AccountBookService = {
  getAllAccountBooks: async (userId) => {
    const result = await AccountBookModel.find({
      authorizedUsers: userId,
    });
    return result;
  },
  getAccountBook: async (userId, accountBookId) => {
    const result = await AccountBookModel.findById(accountBookId);

    if (result && result.authorizedUsers.includes(userId)) {
      return result;
    }

    throw newError({
      status: 'BAD REQUEST',
      msg: '유효하지 않은 가계부입니다.',
    });
  },
  createAccountBook: async (userId, title) => {
    const sameTitle = await AccountBookModel.findOne({
      title,
      authorizedUsers: userId,
    });

    if (sameTitle) {
      throw newError({
        status: 'BAD REQUEST',
        msg: '이미 존재하는 가계부명입니다.',
      });
    }

    const newAccountBook = new AccountBookModel({
      title,
      authorizedUsers: [userId],
    });
    await newAccountBook.save();

    return newAccountBook;
  },
  deleteAccountBook: async (userId, accountBookId) => {
    const accountBook = await AccountBookModel.updateOne(
      { _id: accountBookId },
      { $pull: { authorizedUsers: userId } }
    );

    return accountBook;
  },
  updateAccountBook: async (
    userId,
    accountBookId,
    newTitle,
    newUsers,
    newTags
  ) => {
    const updateContent = {
      $push: { authorizedUsers: newUsers, tags: newTags },
    };
    if (newTitle) {
      updateContent.$set = { title: newTitle };
    }

    const accountBook = await AccountBookModel.updateOne(
      { _id: accountBookId },
      updateContent
    );

    return accountBook;
  },
};

module.exports = AccountBookService;