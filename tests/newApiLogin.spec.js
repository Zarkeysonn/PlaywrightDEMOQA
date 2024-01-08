import { test, expect, request } from "@playwright/test";
import { apiBookstoreUtils } from "../utils/apiBookstoreUtils";

import loginData from "../fixtures/loginData.json";

let apiContext;
let utilsInstance;
let usernamePass;
let response;

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
    console.log(response);
    expect(await response.message).toEqual(loginData.messageLogin);
  });

  test("Username array of strings", async () => {
    //
    usernamePass = await utilsInstance.setUsernamePassword(
      "['ff','sdf','fdfa']",
      loginData.password
    );
    console.log(usernamePass);
    response = await utilsInstance.loginUser(usernamePass);
    console.log(response);
    expect(await response.status).toEqual(loginData.unsuccessfulLoginStatus);
    expect(await response.result).toEqual(loginData.resultLogin);
  });

  test.skip("Username numbers only", async () => {
    //ne valja ne mogu da asertujem jer uopste ne vrati
    usernamePass = await utilsInstance.setUsernamePassword(
      1234567,
      loginData.password
    );
    console.log(usernamePass);
    response = await utilsInstance.loginUser(usernamePass);
    console.log(response);
    expect(response.message).toEqual(loginData.messageLogin);
  });

  test("Username empty array", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      [],
      loginData.password
    );
    console.log(usernamePass);
    response = await utilsInstance.loginUser(usernamePass);
    console.log(response);
    expect(await response.message).toEqual(loginData.messageLogin);
  });

  test("Password empty", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.username,
      loginData.emptyString
    );
    console.log(usernamePass);
    response = await utilsInstance.loginUser(usernamePass);
    console.log(response);
    expect(await response.message).toEqual(loginData.messageLogin);
  });

  test("Bad password", async () => {
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.username,
      loginData.test
    );
    console.log(usernamePass);
    response = await utilsInstance.loginUser(usernamePass);
    console.log(response);
    expect(await response.status).toEqual(loginData.unsuccessfulLoginStatus);
    expect(await response.result).toEqual(loginData.resultLogin);
  });
});
