const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Affiche les tâches pour un jour donné
exports.getTasksForDay = async (req, res) => {
  const { date } = req.params;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        date: new Date(date),
        userId: req.session.userId,
      },
    });
    res.render("tasks", { date, tasks });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error.message);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Ajoute une nouvelle tâche
exports.addTask = async (req, res) => {
  const { date, description, time, latitude, longitude, alertRadius } =
    req.body;

  try {
    await prisma.task.create({
      data: {
        date: new Date(date),
        description,
        time,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        alertRadius: 200,
        userId: req.session.userId,
      },
    });
    res.redirect(`/tasks/${date}`);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche :", error.message);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Modifie une tâche existante
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { description, time } = req.body;

  try {
    await prisma.task.update({
      where: { id: parseInt(id) },
      data: { description, time },
    });
    res.redirect(`/tasks/${req.body.date}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error.message);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Supprime une tâche
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body; // Date transmise par le formulaire

  try {
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.redirect(`/tasks/${date}`); // Redirige vers la date envoyée
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error.message);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Ajout de la logique pour récupérer les tâches à proximité et envoyer une notification
// exports.checkProximity = async (req, res) => {
//   const { latitude, longitude } = req.body;

//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         latitude: { not: null },
//         longitude: { not: null },
//         userId: req.session.userId,
//       },
//     });

//     const now = new Date(); // Heure actuelle
//     const nearTasks = tasks.filter((task) => {
//       const distance = getDistanceFromLatLonInMeters(
//         latitude,
//         longitude,
//         task.latitude,
//         task.longitude
//       );

//       // Calculer le temps restant en millisecondes
//       const taskTime = new Date(`${task.date}T${task.time}`); // Fusionner date et heure
//       const timeRemaining = taskTime - now;

//       console.log(
//         `Tâche ${task.id} : distance = ${distance} mètres, temps restant = ${timeRemaining} ms`
//       );

//       // Vérifier si à moins de 200m et dans les 5 minutes
//       return (
//         distance <= task.alertRadius &&
//         timeRemaining <= 5 * 60 * 1000 &&
//         timeRemaining > 0
//       );
//     });

//     console.log("Tâches proches et imminentes :", nearTasks);
//     res.json(nearTasks); // Renvoie les tâches proches et imminentes
//   } catch (error) {
//     console.error(
//       "Erreur lors de la vérification de proximité :",
//       error.message
//     );
//     res.status(500).send("Erreur interne du serveur");
//   }
// };

// // Fonction pour calculer la distance entre deux points géographiques
// function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Rayon de la Terre en mètres
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Retourne la distance en mètres
// }
