const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation des champs
    if (!email || !password) {
      return res.status(400).send("Email et mot de passe sont requis.");
    }

    // Vérification si l'utilisateur existe déjà
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(400).send("Un compte avec cet email existe déjà.");
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Initialisation de la session pour connecter l'utilisateur
    req.session.userId = user.id;

    // Redirection vers la page d'accueil ou tableau de bord
    res.redirect("/calendar");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message);
    res.status(500).send("Erreur interne");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Email ou mot de passe incorrect");
    }

    req.session.userId = user.id;
    res.redirect("/calendar");
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    res.status(500).send("Erreur interne");
  }
};

exports.logout = (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).send("Aucune session active à détruire.");
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la destruction de la session :", err);
        return res
          .status(500)
          .send("Erreur de déconnexion. Veuillez réessayer.");
      }
      console.log("Session détruite avec succès.");
      res.redirect("/auth/login"); // Redirection vers la page de connexion
    });
  } catch (error) {
    console.error("Erreur inattendue lors de la déconnexion :", error);
    res.status(500).send("Erreur interne. Veuillez réessayer.");
  }
};
