const { test, request } = require("@playwright/test");
const { apiBookstoreUtils } = require("../utils/apiBookstoreUtils");

import loginData from "../fixtures/loginData.json";

let apiContext;
let utilsInstance;
let usernamePass;
let token;
let authorizeUser;
let postBook;
let bookIsbn;

test.describe("Bad flow of adding books to user", async () => {
  test.beforeAll(async () => {
    apiContext = await request.newContext();
    utilsInstance = await new apiBookstoreUtils(apiContext);
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.existing_user_Username,
      loginData.password
    );
    const loginUser = await utilsInstance.loginUser(usernamePass);
    token = await loginUser.token;
  });
  test.skip("Hepi", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status201,
    });

    const deleteBook = await utilsInstance.deleteBooks({
      userId: loginData.userId,
      token: token,
    });
  });

  test("User Id is empty string", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: "",
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status401,
    });
  });
  test("User Id is empty array", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: [],
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status401,
    });
  });

  test.skip("User Id is true", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: true,
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status401,
    });
  });

  // kada pokrenem i ova dva sa boolean vrednostima pokarabusi se
  test.skip("User Id is false", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: false,
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status401,
    });
  });

  test("User Id is random string", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: "somerandomstring",
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status401,
    });
  });

  test("User Id is random number", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: 128921893289,
      bookIsbn: bookIsbn,
      token: token,
      status: loginData.status401,
    });
  });

  test("User Id sent in array", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: [loginData.userId],
      bookIsbn: bookIsbn,
      token: token,
      status: 401,
    });
  });

  test("Book Isbn empty string", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: "",
      token: token,
      status: 401,
    });
  });

  test("Book Isbn array of numbers", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: [12, 2, 4, 34, 43, 2],
      token: token,
      status: 401,
    });
  });

  test("Book Isbn array of strings", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: ["dsf", "dsds", "sdds", "dsdsa"],
      token: token,
      status: loginData.status401,
    });
  });

  test("Book Isbn empty array", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: [],
      token: token,
      status: loginData.status401,
    });
  });

  test("Token is random string", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: bookIsbn,
      token: "thisisrandomstring",
      status: loginData.status401,
    });
  });

  test("Token is empty string", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: bookIsbn,
      token: "",
      status: loginData.status401,
    });
  });

  test("Token is array of numbers", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: bookIsbn,
      token: [1, 2, 3, 4, 5, 52, 23],
      status: loginData.status401,
    });
  });

  test("Token is random numbers", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: bookIsbn,
      token: 3248932482349,
      status: loginData.status401,
    });
  });

  test("Token is empty array", async () => {
    authorizeUser = await utilsInstance.authoriseUser(usernamePass);
    bookIsbn = await utilsInstance.getBook();
    postBook = await utilsInstance.postBooksToUser({
      userId: loginData.userId,
      bookIsbn: bookIsbn,
      token: [],
      status: loginData.status401,
    });
  });
});
