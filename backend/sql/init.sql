DROP TABLE IF EXISTS Classe_Evenement;
DROP TABLE IF EXISTS Evenement;
DROP TABLE IF EXISTS Periode;
DROP TABLE IF EXISTS Theme;
DROP TABLE IF EXISTS Classe;
DROP TABLE IF EXISTS Cycle;

CREATE TABLE Cycle (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       nom TEXT NOT NULL
);

CREATE TABLE Classe (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nom TEXT NOT NULL,
                        cycle_id INTEGER NOT NULL,
                        FOREIGN KEY (cycle_id) REFERENCES Cycle(id)
);

CREATE TABLE Theme (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       nom TEXT NOT NULL,
                       annee TEXT,
                       classe_id INTEGER NOT NULL,
                       FOREIGN KEY (classe_id) REFERENCES Classe(id)
);

CREATE TABLE Periode (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         nom TEXT NOT NULL,
                         theme_id INTEGER NOT NULL,
                         FOREIGN KEY (theme_id) REFERENCES Theme(id)
);

CREATE TABLE Evenement (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           titre TEXT NOT NULL,
                           description TEXT,
                           date TEXT,
                           lien TEXT,
                           image_url TEXT,
                           periode_id INTEGER NOT NULL,
                           FOREIGN KEY (periode_id) REFERENCES Periode(id)
);

CREATE TABLE Periode_Evenement (
                                  periode_id INTEGER NOT NULL,
                                  evenement_id INTEGER NOT NULL,
                                  PRIMARY KEY (periode_id, evenement_id),
                                  FOREIGN KEY (periode_id) REFERENCES Periode(id),
                                  FOREIGN KEY (evenement_id) REFERENCES Evenement(id)
);
