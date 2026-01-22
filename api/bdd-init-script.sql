
CREATE TABLE public.Utilisateur (
    IdUtilisateur SERIAL PRIMARY KEY,
    Nom TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    MotDePasse TEXT NOT NULL,
    CreeLe TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE public.Pollution (
    IdPollution SERIAL PRIMARY KEY,
     IdUtilisateur INT NULL,
    Titre TEXT NOT NULL,
    TypePollution VARCHAR(20) NOT NULL CHECK (TypePollution IN ('Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre')),
    Description TEXT NOT NULL,
    DateObservation DATE NOT NULL,
    Lieu TEXT NOT NULL,
    Latitude DOUBLE PRECISION NOT NULL,
    Longitude DOUBLE PRECISION NOT NULL,
    PhotoUrl TEXT,
    CreeLe TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    MisAJourLe TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_pollution_user
        FOREIGN KEY (IdUtilisateur)
        REFERENCES public.Utilisateur (IdUtilisateur)
        ON DELETE SET NULL
);

CREATE TABLE public.Favoris (
    IdFavoris SERIAL PRIMARY KEY,
    IdUtilisateur INT NOT NULL,
    IdPollution INT NOT NULL,
    CreeLe TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_favoris_user
        FOREIGN KEY (IdUtilisateur)
        REFERENCES public.Utilisateur (IdUtilisateur)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_favoris_pollution
        FOREIGN KEY (IdPollution)
        REFERENCES public.Pollution (IdPollution)
        ON DELETE CASCADE,
    
    -- Empêcher les doublons
    CONSTRAINT unique_favoris UNIQUE (IdUtilisateur, IdPollution)
);


INSERT INTO public.Pollution 
(Titre, TypePollution, Description, DateObservation, Lieu, Latitude, Longitude, PhotoUrl)
VALUES
('Décharge sauvage près du chemin forestier', 'Dépôt sauvage', 'Tas de déchets ménagers et plastiques abandonnés au bord du chemin.', '2025-10-15', 'Forêt de la Robertsau', 48.6275, 7.8032, 'https://exemple.com/photos/depot1.jpg'),

('Pollution plastique dans la rivière', 'Plastique', 'Accumulation de bouteilles et emballages dans le cours d’eau.', '2025-09-28', 'Rivière Ill, Strasbourg', 48.5839, 7.7455, 'https://exemple.com/photos/plastique2.jpg'),

('Fumées suspectes d’une usine', 'Air', 'Émission de fumées noires pendant plusieurs heures.', '2025-10-10', 'Zone industrielle de Reichstett', 48.6572, 7.7561, 'https://exemple.com/photos/usine3.jpg'),

('Rejet chimique dans le canal', 'Chimique', 'Substance huileuse et colorée observée à la surface de l’eau.', '2025-10-22', 'Canal du Rhône au Rhin, Neudorf', 48.5608, 7.7654, 'https://exemple.com/photos/produit4.jpg'),

('Déversement d’eaux usées', 'Eau', 'Écoulement d’eaux usées non traitées depuis une bouche d’égout.', '2025-10-05', 'Rue du Faubourg-National, Strasbourg', 48.5823, 7.7396, NULL);