const { auth, db } = require("../../config/firebase");
const { generateLevelioId } = require("../../utils/generateLevelioId");

exports.register = async (req, res) => {
  console.log("starting registering user");

  try {
    const { email, password, name } = req.body;

    console.log("awaiting register user to firebase auth");

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    console.log("generating levelio id");

    const levelioId = generateLevelioId();

    console.log("awaiting insert user data to firestore");

    await db.collection("users").doc(userRecord.uid).set({
      account_id: userRecord.uid,
      levelio_id: levelioId,
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        account_id: userRecord.uid,
        levelio_id: levelioId,
        name: userRecord.displayName,
        email: userRecord.email,
      },
    });

    console.log("registering user finished");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  res.json({ message: "account login" });
};
