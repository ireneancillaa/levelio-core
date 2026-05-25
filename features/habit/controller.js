const { db } = require("../../config/firebase");

exports.newHabit = async (req, res) => {
  console.info("[INFO] starting creating new habit...");

  const {
    supabaseId,
    habitName,
    habitDesc,
    habitColor,
    habitFrequency,
    habitReminder,
    xpGain
  } = req.body;

  try {
    const newHabitData = {
      habit_name: habitName,
      habit_desc: habitDesc,
      habit_color: habitColor,
      habit_frequency: habitFrequency,
      habit_reminder: new Date().toISOString(),
      xp_gain: xpGain,
      created_at: new Date().toISOString(),
    };

    console.info("[INFO] waiting creating new habit...");

    const docRef = await db
      .collection("users")
      .doc(supabaseId)
      .collection("habits")
      .add(newHabitData);

    res.status(201).json({
      status: "success",
      message: "Habit creted successfully",
      data: { newHabitData },
    });

    console.info("[INFO] finished create new habit...");
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
