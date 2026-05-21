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

    if (error) {
      console.warn("[WARN] register failed:", error.message);
      return res.status(401).json({
        status: "error",
        message: "Register failed",
        error: error.message,
      });
    }

    const supabaseUserId = data.user.id;

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
  console.info("[INFO] starting sign in user...");

  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.warn("[WARN] sign in failed:", error.message);
      return res.status(401).json({
        status: "error",
        message: "Sign in failed",
        error: error.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "User sign in successfully",
      data: data,
    });

    console.info("[INFO] sign in user finished...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Sign in failed",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  console.info("[INFO] starting getting user...");

  const { uid } = req.body;

  console.info(`[INFO] received id: ${uid}`);

  try {
    console.info("[INFO] getting user data from doc...");

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

    console.info("[INFO] finished getting user data...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error getting user data",
      error: error.message,
    });
  }
};
