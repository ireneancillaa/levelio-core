const dateFormatter = () => {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
};

module.exports = dateFormatter;
