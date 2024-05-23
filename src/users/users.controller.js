import services from "./users.service.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

//desc      signup/set token
//route     post/api/v1/users/signup
//@access   private
export async function signUp(req, res) {
  const { email, name, password, stateCode, townshipCode } = req.body;

  if (!email || !name || !password || !stateCode || !townshipCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10, null);
  const existingUser = await services.getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  try {
    const user = await services.createUser({
      email,
      name,
      password: hashedPassword,
      balance: 0,
      stateCode,
      townshipCode,
    });

    const token = generateToken(user.id);

    if (!token) {
      throw new Error("Token generation error");
    }

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      id: user.id,
      email: email,
      name: name,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `errors: ${error}. An error occurred while signing up.` });
  }
}

//desc      Login user and set token
//route     POST /api/v1/users/login
//@access   Public
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await services.getUserByEmail(email);
    console.info("user ", user);
    if (user && (await bcrypt.compare(password, user.password, null))) {
      generateToken(user.id);
      res.json({
        _id: user.id,
        email: user.email,
        name: user.name,
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `error: ${error} An error occurred while logging in` });
  }
}

//desc      get user
//route     Get/api/v1/users
//@access   Public
export async function getAll(req, res) {
  try {
    const users = await services.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: `error: ${error} An error occurred while fetching users`,
    });
  }
}

//desc      get one user
//route     Get/api/v1/users/{id}
//@access   Public
export async function getUser(req, res) {
  try {
    const user = await services.getUserById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    return res.status(200).json({
      ...user,
      password: "",
    });
  } catch (error) {
    return res.status(500).json({
      error: `error: ${error} An error occurred while fetching users`,
    });
  }
}

//desc      Update one user
//route     put/api/v1/users/{id}
//@access   Private
export async function updateUser(req, res) {
  try {
    const user = await services.updateUser(req.params.id, req.body);
    return res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
    });
  } catch (error) {
    return res.status(500).json({
      error: `error: ${error} An error occurred while updating users`,
    });
  }
}

//desc      Delete one user
//route     delete/api/v1/users/{id}
//@access   private
export async function deleteUser(req, res) {
  try {
    await services.deleteUser(req.params.id);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: `error: ${error} An error occurred while deleting users`,
    });
  }
}

//desc      logout/set token
//route     get/api/v1/users/{id}/logout
//@access   private
export function logout(req, res) {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(201).json({ message: "user logged out successfully" });
}

export default {
  signUp,
  login,
  getAll,
  getUser,
  updateUser,
  deleteUser,
  logout,
};
