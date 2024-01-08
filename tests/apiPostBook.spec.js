const { test, request } = require("@playwright/test");
const { apiBookstoreUtils } = require("../utils/apiBookstoreUtils");

import loginData from "../fixtures/loginData.json";

let apiContext;
let utilsInstance;
let usernamePass;
let userId;
let token;
let authorizeUser;
let postBook;
let bookIsbn;
let deleteBook;

test.describe("Happy1 flow of adding books to user", async () => {
  userId = loginData.userId;
  test.beforeEach(async () => {
    apiContext = await request.newContext();
    utilsInstance = await new apiBookstoreUtils(apiContext);
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.existing_user_Username,
      loginData.password
    );
    const loginUser = await utilsInstance.loginUser(usernamePass);
    token = await loginUser.token;
  });

  test("Happy flow!", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: userId,
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status201,
    });
  });

  test.afterEach("After each happy flow", async () => {
    deleteBook = await utilsInstance.deleteBooks({
      userId: userId,
      token: token,
    });
  });
});
