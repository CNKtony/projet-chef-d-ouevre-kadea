const fetch = require("node-fetch");

exports.getWeather = async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city = "Kinshasa";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      return res
        .status(400)
        .send("Erreur dans la récupération des données météo");
    }

    const forecastData = data.list.filter((_, index) => index % 8 === 0); // Prévisions sur 7 jours
    res.render("calendar", { forecastData });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données météo :",
      error.message
    );
    res.status(500).send("Erreur interne du serveur");
  }
};
