const { test, expect, request } = require("@playwright/test");
const { apiBookstoreUtils } = require("../utils/apiBookstoreUtils");

import loginData from "../fixtures/loginData.json";

let apiContext;

let utilsInstance;

let usernamePass;

let response;

const loginPayLoad = {
  password: loginData.password,
  userName: loginData.username,
};

test.describe("Positive login api testing", () => {
  test("Happy flow basic", async () => {
    apiContext = await request.newContext();
    const loginResponse = await apiContext.post(
      "https://demoqa.com/Account/v1/Login",
      {
        data: loginPayLoad,
      }
    );
    expect(loginResponse.ok()).toBeTruthy();
    expect(loginResponse.headers()["content-length"]).toContain("376");
    const loginResponseJson = await loginResponse.json();
    expect(loginResponseJson.username).toEqual(loginPayLoad.userName); //equal koristiti
  });

  test("Valid login scenario using utils file", async () => {
    const apiContext = await request.newContext();
    const utilsInstance = await new apiBookstoreUtils(apiContext);
    const usernamePass = await utilsInstance.setUsernamePassword(
      "Zarko123",
      loginData.password
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(response.status).toEqual(loginData.successfulLoginStatus);
  });
});

test.describe("Negative login api testing", () => {
  test.beforeEach("Before each for creating textContext", async () => {
    apiContext = await request.newContext();
    utilsInstance = await new apiBookstoreUtils(apiContext);
  });

  test("Bad username random string: ", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.test,
      loginData.password
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(response.status).toEqual(loginData.unsuccessfulLoginStatus);
    expect(await response.result).toEqual(loginData.resultLogin);
  });

  test("Empty username", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.emptyString,
      loginData.password
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(await response.message).toEqual(loginData.messageLogin);
  });

  test("Username array of strings", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      "['ff','sdf','fdfa']",
      loginData.password
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(await response.status).toEqual(loginData.unsuccessfulLoginStatus);
    expect(await response.result).toEqual(loginData.resultLogin);
  });

  test.skip("Username numbers only", async () => {
    //ne valja ne mogu da asertujem jer uopste ne vrati
    usernamePass = await utilsInstance.setUsernamePassword(
      1234567,
      loginData.password
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(response.message).toEqual(loginData.messageLogin);
  });

  test("Username empty array", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      [],
      loginData.password
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(await response.message).toEqual(loginData.messageLogin);
  });

  test("Password empty", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.username,
      loginData.emptyString
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(await response.message).toEqual(loginData.messageLogin);
  });

  test("Bad password", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.username,
      loginData.test
    );
    response = await utilsInstance.loginUser(usernamePass);
    expect(await response.status).toEqual(loginData.unsuccessfulLoginStatus);
    expect(await response.result).toEqual(loginData.resultLogin);
  });
});
