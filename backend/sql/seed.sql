-- ⚠️ Exécute ceci après avoir lancé sqlite3 et chargé ta base avec le script init.sql

-- Cycles
INSERT INTO Cycle (nom) VALUES ('Cycle 3');

-- Classes
INSERT INTO Classe (nom, cycle_id) VALUES ('CM1', 1);
INSERT INTO Classe (nom, cycle_id) VALUES ('CM2', 1);

-- Thèmes CM1
INSERT INTO Theme (nom, annee, classe_id) VALUES ('Et avant la France ?', 'CM1', 1);
INSERT INTO Theme (nom, annee, classe_id) VALUES ('Le temps des rois', 'CM1', 1);
INSERT INTO Theme (nom, annee, classe_id) VALUES ('Le temps de la Révolution et de l''Empire', 'CM1', 1);

-- Thèmes CM2
INSERT INTO Theme (nom, annee, classe_id) VALUES ('Le temps de la République', 'CM2', 2);
INSERT INTO Theme (nom, annee, classe_id) VALUES ('L''âge industriel en France', 'CM2', 2);
INSERT INTO Theme (nom, annee, classe_id) VALUES ('La France, des guerres mondiales à l''Union européenne', 'CM2', 2);

-- Périodes
INSERT INTO Periode (nom, theme_id) VALUES ('La Gaule celtique', 1);
INSERT INTO Periode (nom, theme_id) VALUES ('La conquête romaine', 1);
INSERT INTO Periode (nom, theme_id) VALUES ('Le règne de Louis XIV', 2);
INSERT INTO Periode (nom, theme_id) VALUES ('La Révolution française', 3);
INSERT INTO Periode (nom, theme_id) VALUES ('Le Consulat et l''Empire', 3);
INSERT INTO Periode (nom, theme_id) VALUES ('Naissance de la République', 4);
INSERT INTO Periode (nom, theme_id) VALUES ('La Troisième République', 4);
INSERT INTO Periode (nom, theme_id) VALUES ('Révolution industrielle', 5);
INSERT INTO Periode (nom, theme_id) VALUES ('Exode rural et urbanisation', 5);
INSERT INTO Periode (nom, theme_id) VALUES ('Première Guerre mondiale', 6);
INSERT INTO Periode (nom, theme_id) VALUES ('Seconde Guerre mondiale', 6);
INSERT INTO Periode (nom, theme_id) VALUES ('Construction européenne', 6);

-- Événements
INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
VALUES (
           'Prise de la Bastille',
           'Événement déclencheur de la Révolution française, symbole de la fin de la monarchie absolue.',
           '1789-07-14',
           'https://fr.wikipedia.org/wiki/Prise_de_la_Bastille',
           'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Prise_de_la_Bastille.jpg/800px-Prise_de_la_Bastille.jpg',
           4
       );

INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
VALUES (
           'Sacré de Louis XIV',
           'Louis XIV est sacré roi de France en 1654 à Reims.',
           '1654-06-07',
           'https://fr.wikipedia.org/wiki/Louis_XIV',
           'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Louis_XIV_of_France.jpg/800px-Louis_XIV_of_France.jpg',
           3
       );

INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
VALUES (
           'Déclaration de la Première République',
           'Proclamation de la Première République le 22 septembre 1792.',
           '1792-09-22',
           'https://fr.wikipedia.org/wiki/Premi%C3%A8re_R%C3%A9publique_(France)',
           '',
           6
       );

INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
VALUES (
           'Proclamation de la Troisième République',
           'Après la défaite de 1870 contre la Prusse, la Troisième République est proclamée.',
           '1870-09-04',
           'https://fr.wikipedia.org/wiki/Troisi%C3%A8me_R%C3%A9publique_(France)',
           '',
           7
       );

INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
VALUES (
           'Première Guerre mondiale',
           'Guerre mondiale de 1914 à 1918 qui marque profondément la France.',
           '1914-07-28',
           'https://fr.wikipedia.org/wiki/Premi%C3%A8re_Guerre_mondiale',
           '',
           10
       );

INSERT INTO Evenement (titre, description, date, lien, image_url, periode_id)
VALUES (
           'Signature du traité de Rome',
           'Le traité fondateur de la CEE est signé en 1957.',
           '1957-03-25',
           'https://fr.wikipedia.org/wiki/Traité_de_Rome_(1957)',
           '',
           12
       );

-- Liens classe / événement (Prise de la Bastille partagée CM1/CM2)
INSERT INTO Classe_Evenement (classe_id, evenement_id) VALUES (1, 1); -- CM1
INSERT INTO Classe_Evenement (classe_id, evenement_id) VALUES (2, 1); -- CM2
