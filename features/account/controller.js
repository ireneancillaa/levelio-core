const { auth, db } = require("../../config/firebase");
const { generateLevelioId } = require("../../utils/generateLevelioId");
const supabase = require("../../config/supabase");

exports.register = async (req, res) => {
  console.info("[INFO] starting registering user...");

  try {
    const { email, password, name } = req.body;

    console.info("[INFO] awaiting register user to supabase auth...");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    const supabaseUserId = data.user.id

    console.info("[INFO] generating levelio id...");

    const levelioId = generateLevelioId();

    console.info("[INFO] awaiting insert user data to firestore...");

    await db.collection("users").doc(supabaseUserId).set({
      account_id: supabaseUserId,
      levelio_id: levelioId,
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        account_id: supabaseUserId,
        levelio_id: levelioId,
        name: name,
        email: email,
      },
    });

    console.info("[INFO] registering user finished...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  console.log("starting login user");

  try {
    const token = req.headers.authorization;
    console.log(`received token: ${token}`);

    if (!token) {
      return res.status(401).json({
        status: "unauthorized",
        message: "No token found",
      });
    }

    console.log("awaiting verify token");

    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    console.log("getting user data from doc");

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Doc not found",
      });
    }

    res.json({
      status: "success",
      data: userDoc.data(),
    });

    console.log("finished getting user data");
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  console.log("starting getting user");

  const { uid } = req.body;

  console.log(`received id: ${uid}`);

  try {
    console.log("getting user data from doc");

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Doc not found",
      });
    }

    res.json({
      status: "success",
      data: userDoc.data(),
    });

    console.log("finished getting user data");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error getting user data",
      error: error.message,
    });
  }
};
