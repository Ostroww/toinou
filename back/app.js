// import express form express;
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const db = new sqlite3.Database('blog.db');

// creation de la bdd
db.serialize(() => {
    // creation de l'utilisateur en bdd
    db.run(`
    CREATE TABLE IF NOT EXISTS utilisateur (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        mdp VARCHAR(100) NOT NULL,
        date_creation DATE NOT NULL,
        date_maj DATE,
        date_supp DATE)`);
    // creation de la categorie en bdd
    db.run(`
        CREATE TABLE IF NOT EXISTS categorie (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nom VARCHAR(100) NOT NULL UNIQUE)`);
    // creation de l'article en bdd
    db.run(`
        CREATE TABLE IF NOT EXISTS article (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            titre VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            contenu TEXT NOT NULL,
            image VARCHAR(255),
            date_creation DATE NOT NULL,
            date_maj DATE,
            date_supp DATE,
            id_cat INTEGER,
            id_user INTEGER,
            FOREIGN KEY ("id_cat") REFERENCES "categorie" ("id"),
            FOREIGN KEY ("id_user") REFERENCES "utilisateur" ("id")
            )`);
});

db.serialize(() => {
    //db.run(`INSERT INTO categorie (nom) VALUES ('High Tech'), ('Android'), ('IPhone')`)

    /*db.run(`
    INSERT INTO utilisateur (email, nom, prenom, mdp, date_creation)
    VALUES 
        ('samuel.michaux@gmail.com', 'michaux', 'samuel', 'samsam', DATE()),
        ('sabrina.@sam.org', 'pasetto', 'sabrina', 'sabsabsab', DATE())
    `);*/

    /*db.run(`
        INSERT INTO article (titre, contenu, date_creation, id_cat, id_user, slug)
        VALUES
            ('Whatsapp : Il sera bientôt possible de réagir aux messages avec un emoji',
            'Ue nouvelle option et pas des moindres va bientot arriver sur Whatsapp. Dici quelque mois, tout sera possible',
            DATE(), 1, 1, 'whatsapp-il-sera-bientot-possible-de-reagir-aux-messages'),
            ('Android : Google utiliserait les données de vos messages et appels sans votre autorisation',
            'Google serait susceptible de collecter frauduleusement des données grâce aux applications Message et Téléphone',
            DATE(), 2, 1, 'android-google-utilisateur-donnees')
    `);*/
});

const personne = {
    prenom: "samuel",
    nom: "michaux",
}

app.get('/', (req, res) => {
    const query = `SELECT a.id, a.titre, a.slug, a.contenu, a.image, a.date_creation, c.nom as cat, u.nom, u.prenom, u.email FROM article as a
                JOIN categorie as c ON a.id_cat = c.id
                JOIN utilisateur as u ON a.id_user = u.id`;
    db.all(query, (err, row) => {
        res.status(200).json(row);
    });
});

app.listen(8080, (err) => {
    if (err) {
        db.close();
    }
    console.log("Serveur à l'écoute");
});