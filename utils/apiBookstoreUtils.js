import { expect } from "@playwright/test";
import loginData from "../fixtures/loginData.json";
import postBook from "../fixtures/postBookToUser.json";
import exp from "constants";

class apiBookstoreUtils {
  constructor(apiContext) {
    this.apiContext = apiContext;
  }

  async loginUser(unamepass) {
    const loginResponse = await this.apiContext.post(
      "https://demoqa.com/Account/v1/GenerateToken", //promeniti api
      {
        data: unamepass,
      }
    );
    const responseBody = await loginResponse.json();
    const status = await loginResponse.status();
    if ((await status) == 200) {
      if ((await responseBody.status) == loginData.successfulLoginStatus) {
        expect(await responseBody.status).toEqual(
          loginData.successfulLoginStatus
        );
        expect(await responseBody.result).toEqual(
          loginData.successfulLoginResult
        );
      } else {
        expect(await responseBody.status).toEqual(
          loginData.unsuccessfulLoginStatus
        );
      }
    } else {
      //
    }
    console.log("responseBody login", responseBody);
    return responseBody;
  }

  async getUserId(userNamePassword) {
    const loginRequest = await this.apiContext.post(
      "https://demoqa.com/Account/v1/User",
      {
        data: userNamePassword,
      }
    );
    console.log("sklj", loginRequest);
    const body = await loginRequest.json();
    console.log("login user body", body);
    return body;
  }

  async authoriseUser(user) {
    const authoriseUser = await this.apiContext.post(
      "https://demoqa.com/Account/v1/Authorized",
      {
        data: user,
      }
    );
    return authoriseUser;
  }

  // uraditi asertacije i za dobre i negativne slucajeve ovde razmisliti malo o tome
  async registerUser(unamepass) {
    const registerResponse = await this.apiContext.post(
      "https://demoqa.com/Account/v1/User",
      {
        data: unamepass,
      }
    );
    const registerResponseBody = await registerResponse.json();
    const statusRegistration = await registerResponse.status();
    const codeRegistration = await registerResponseBody.code;
    //expect(await codeRegistration).toEqual(status);
    return registerResponseBody;
  }

  async getBook() {
    const getAllBooks = await this.apiContext.get(
      "https://demoqa.com/BookStore/v1/Books"
    );
    const getAllBooksBody = await getAllBooks.json();

    const isbnArray = await getAllBooksBody.books.map((book) => book.isbn);
    const bookIsbn = isbnArray[0];

    return bookIsbn;
  }

  // prebaciti parametre u objekat i za ostale funkcije
  async postBooksToUser({
    userId,
    bookIsbn,
    token,
    status = loginData.status201,
  }) {
    const postBookData = {
      userId: userId,
      collectionOfIsbns: [{ isbn: bookIsbn }],
    };

    const addBookToUser = await this.apiContext.post(
      "https://demoqa.com/BookStore/v1/Books",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: postBookData,
      }
    );

    const statusCode = await addBookToUser.status();
    expect(statusCode).toEqual(status);
    return addBookToUser;
  }

  async deleteBooks({ userId, token }) {
    const deleteBooks = await this.apiContext.delete(
      `https://demoqa.com/BookStore/v1/Books?UserId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const deleteBooksStatus = await deleteBooks.status();
    return deleteBooks;
  }

  //funkcija za brisanje accounta
  async deleteUser(usr, token) {
    const loginUser = await this.loginUser();
    const deleteUser = await this.apiContext.delete(
      `https://demoqa.com/Account/v1/User/${usr}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return deleteUser;
  }

  async setUsernamePassword(username, password) {
    this.username = username;
    this.password = password;
    return { userName: username, password: password };
  }
}

module.exports = { apiBookstoreUtils };
