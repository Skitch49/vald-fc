# ValdFc
**Clone de Netflix** en Angular représentant tout les clips et toutes les videos youtubes de VALD !
Projet à but de formation sur Angular et est en constante évolution.
Ce projet est lié à l'[api-vald](https://github.com/Skitch49/api-vald) que j'ai également créer en NodeJS.

![Logo du site](https://vald-fc.netlify.app/assets/logo.png)
## Pages
- page d'accueil regroupant tout le contenu video par catégorie
- page clip regroupant tout les clips par catégorie
- page player clip permet de visualisé le clip selectionner, afficher les informations du clip, si l'utilisateur est connecté permet de le mettre en favoris, toggle qui permet de mettre les prochains clips par date de sortie ou en aléatoire.
- page video regroupant toutes les vidéos par catégorie
- page player video permet de visualisé la vidéo selectionner, afficher les informations de la vidéo, si l'utilisateur est connecté permet de la mettre en favoris, toggle qui permet de mettre les prochaines vidéos par date de sortie ou en aléatoire.
- page Ma liste regroupe tout le contenu mis en favoris par l'utilisateur.
- page Search qui affiche le contenu suivant la saisi de l'utilisateur et peux être trier par différents critère (Date,Nom,Catégorie,Popularité) en ascendant ou en descendant.
- page Album Ultime qui permet de créer une image de l'album parfait de l'utilisateur suivant ces choix fait lors d'un QCM.
- page Me contacter permet d'envoyer un mail à l'auteur du site.
- page gallery (en cours de dev).
- page Dashboard accessible uniquement par l'auteur du site qui permet d'ajouter, de lire, modifier et supprimé (CRUD) les différents contenu de l'API sur les Artistes, Clips et Interview.

## Installation
1. Clonez le dépôt : `git clone https://github.com/Skitch49/tinder-dogs.git`

2. Installer les dépendances : `npm i`

3. Ajouter un fichier d'environment : `ng generate environments`

4. Ajouter les clés API dans le nouveau fichier environment :
```
export const environment = {
  apiValdUrl: 'API_KEY',
  redirectUri: 'REDIRECT_URL_AFTER_LOGIN',
  postLogoutRedirectUri: 'REDIRECT_URL_AFTER_LOGOUT',
  recaptcha: 'API_KEY',
};
```

5. Lancer l'application : `ng serve`

## Lien vers le projet
[Le projet est disponible en ligne ici](http://vald-fc.netlify.app/)