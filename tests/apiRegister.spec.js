const { test, expect, request } = require("@playwright/test");
const { apiBookstoreUtils } = require("../utils/apiBookstoreUtils");

import loginData from "../fixtures/loginData.json";

let apiContext; //srediti za prva dva pozitivna testa kao u negativnim sto sam krenuo
let utilsInstance;
let usernamePass;
let deleteUser;
let response;
let token;
let userId;
const registerPayLoad = {
  password: loginData.password,
  userName: "testic1234",
};

test.describe("Happy flow", async () => {
  test("Register new user", async () => {
    apiContext = await request.newContext();
    const registerResponse = await apiContext.post(
      "https://demoqa.com/Account/v1/User",
      {
        data: registerPayLoad,
      }
    );
    response = await registerResponse.json();
    userId = await response.userID;
  });

  test.afterEach("AFTER", async () => {
    utilsInstance = await new apiBookstoreUtils(apiContext);
    usernamePass = await utilsInstance.setUsernamePassword(
      loginData.newUsername,
      loginData.password
    );
    const loginResponse = await utilsInstance.loginUser(usernamePass);
    token = await loginResponse.token;
    await utilsInstance.authoriseUser(usernamePass);
    deleteUser = await utilsInstance.deleteUser(userId, token);
  });
});

test.describe("Bad flow", async () => {
  test.beforeEach(async () => {
    apiContext = await request.newContext();
    utilsInstance = await new apiBookstoreUtils(apiContext);
  });
  test("UserName field os empty", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      loginData.emptyString,
      loginData.password
    );
    const registerUser = await utilsInstance.registerUser({
      usernamePassword,
    });
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1200");
  });

  test.skip("Username is array of random string", async () => {
    const randomAraay = ["aa", "asda", "dsff"];
    const usernamePassword = await utilsInstance.setUsernamePassword(
      randomAraay,
      loginData.password
    );
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1200");
  });

  test("Username is emptry string of spaces", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      "          ",
      loginData.password
    );
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1204");
  });

  test("Username only numbers", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      12345678,
      loginData.password
    );
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1204");
  });

  test.skip("Username boolean", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      true,
      loginData.password
    );
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1204");
  });

  test("Password doesn't meet requirements", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      loginData.newUsername,
      loginData.test
    );
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1300");
  });

  test("Password lenght is less than 8", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      loginData.newUsername,
      loginData.invalidPasswordLength
    );
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    console.log("unamepass", usernamePassword);
    expect(registerUser.code).toBe("1300");
  });

  test.skip("Password with only numbers", async () => {
    const usernamePassword = await utilsInstance.setUsernamePassword(
      loginData.newUsername,
      12345678
    );
    console.log(usernamePassword);
    const registerUser = await utilsInstance.registerUser(usernamePassword);
    expect(registerUser.code).toBe("1300");
  });
});
