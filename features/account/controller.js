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
      user_dob: new Date().toISOString(),
      join_date: new Date().toISOString(),
      gender: "Prefer not to say",
      avatar_url: "www.example.com",
      current_streak: 0,
      best_streak: 0,
      today_xp: 0,
    });

    const userDoc = await db.collection("users").doc(supabaseUserId).get();

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { supabaseData: data, firebaseData: userDoc.data() },
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

    const supabaseUserId = data.user.id;

    const userDoc = await db.collection("users").doc(supabaseUserId).get();

    res.status(200).json({
      status: "success",
      message: "User sign in successfully",
      data: { supabaseData: data, firebaseData: userDoc.data() },
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

exports.sendEmailResetPassword = async (req, res) => {
  console.info("[INFO] starting sending email...");

  const { email } = req.body;

  try {
    console.info("[INFO] sending email...");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.warn("[WARN] sending email failed:", error.message);
      return res.status(400).json({
        status: "error",
        message: "Sending email failed",
        error: error.message,
      });
    }

    console.info("[INFO] finished send email...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error send email reset password",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  console.info("[INFO] starting verify OTP...");

  const { email, otpCode } = req.body;

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "recovery",
    });

    if (error) {
      console.warn("[WARN] verify OTP failed:", error.message);
      return res.status(400).json({
        status: "error",
        message: "Verify OTP failed",
        error: error.message,
      });
    }

    res.json({
      status: "success",
      message: "Verify OTP success",
      data: {
        access_token: data.session.access_token,
      },
    });

    console.info("[INFO] finished verify OTP...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error verify OTP",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  console.info("[INFO] starting resetting password...");

  const { newPassword } = req.body;

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.warn("[WARN] reset password failed:", error.message);
      return res.status(400).json({
        status: "error",
        message: "Reset password failed",
        error: error.message,
      });
    }

    res.json({
      status: "success",
      message: "Reset password success",
    });

    console.info("[INFO] finished reset password...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error reset password",
      error: error.message,
    });
  }
};
