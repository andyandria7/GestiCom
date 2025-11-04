# 🧩 Backend - GestiCom (CodeIgniter 4)

Ce dossier contient la partie **serveur (API)** du projet GestiCom, développée avec **CodeIgniter 4** et **MySQL**.  
Il sert de point central de communication pour les applications web et mobile.

---

## ⚙️ Prérequis

Avant de commencer, installez les outils suivants :

- [WAMP Server](https://www.wampserver.com/)
- [Composer](https://getcomposer.org/download/)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) *(nécessaire pour les projets web et mobile plus tard)*

---

## 📥 Installation

1. **Clonez le projet depuis GitHub** :
   ```bash
   git clone https://github.com/andyandria7/GestiCom.git
Placez le dossier dans le répertoire www de WAMP :

makefile
Copier le code
C:\wamp64\www\backend-gestiCom
Installez les dépendances PHP :

bash
Copier le code
cd backend-gestiCom
composer install
Créez la base de données MySQL :

Ouvrez phpMyAdmin via http://localhost/phpmyadmin

Créez une base nommée : gesticom

Configurez le fichier .env :
Dupliquez le fichier .env.example et renommez-le .env.

Modifiez les lignes suivantes :

ini
Copier le code
database.default.hostname = localhost
database.default.database = gesticom
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
app.baseURL = 'http://localhost:8080/'
Lancez le serveur CodeIgniter :

bash
Copier le code
php spark serve --host 0.0.0.0 --port 8080
L’API sera disponible sur :
👉 http://localhost:8080

🧩 Déploiement local avec IP
Pour que les applications web et mobile puissent communiquer avec ce backend :

Trouvez votre adresse IPv4 locale :

Ouvrez l’invite de commande Windows

Tapez : ipconfig

Copiez la ligne Adresse IPv4, exemple : 192.168.1.15

Utilisez cette IP dans les projets :

mobile-gestiCom/constants/apiConfig.ts

web-gestiCom/services/api.js

🚀 Lancer le backend
bash
Copier le code
php spark serve --host 0.0.0.0 --port 8080
L’API est maintenant prête à être utilisée par les deux interfaces (web et mobile).

yaml
Copier le code

---

## 🌐 README #2 — web-gestiCom (ReactJS)

```markdown
# 💻 Web - GestiCom (ReactJS)

Ce dossier contient la version **web** de l’application GestiCom, développée avec **ReactJS**.

---

## ⚙️ Prérequis

Installez les outils suivants avant de commencer :

- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)
- Avoir le **backend** (CodeIgniter 4) en cours d’exécution

---

## 📥 Installation

   cd web-gestiCom
Installez les dépendances :

bash
Copier le code
npm install
Mettez à jour l’adresse IP du backend :

Ouvrez le fichier :

bash
Copier le code
src/services/api.js
Modifiez la ligne suivante :

js
Copier le code
const BASE_URL = "http://192.168.1.15:8080/";
(remplacez 192.168.1.15 par votre IPv4 locale)

Démarrez le serveur web :

bash
Copier le code
npm run dev
L’application sera accessible à l’adresse :
👉 http://localhost:5173

🚀 Utilisation
Le site web se connecte automatiquement au backend via l’adresse IP configurée.

Vous pouvez naviguer, créer, modifier ou supprimer des données selon les fonctionnalités disponibles.

yaml
Copier le code

---

## 📱 README #3 — mobile-gestiCom (React Native + Expo)

```markdown
# 📱 Mobile - GestiCom (React Native + Expo)

Ce dossier contient la version **mobile** de GestiCom, développée avec **React Native** via **Expo**.

---

## ⚙️ Prérequis

Avant de lancer l’application, installez :

- [Node.js](https://nodejs.org/en/download/)
- [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) *(sur votre téléphone Android)*
- [Git](https://git-scm.com/downloads)
- Le **backend (CodeIgniter)** doit être lancé et accessible sur le réseau local

---

## 📥 Installation


   cd mobile-gestiCom
Installez les dépendances :

bash
Copier le code
npm install
Configurez l’adresse IP du backend :
Ouvrez le fichier :

bash
Copier le code
constants/apiConfig.ts
Et modifiez :

ts
Copier le code
const ngrok = "http://192.168.1.15:8080";
const API_BASE_URL: string = ngrok;
export default API_BASE_URL;
(Remplacez 192.168.1.15 par votre IPv4 locale)

🚀 Démarrer le projet mobile
Lancez Expo :

bash
Copier le code
npx expo start
Scannez le QR code avec l’application Expo Go sur votre téléphone.

L’application se connectera automatiquement au backend via l’adresse IP configurée.

🧩 Dépannage
Si l’application ne se connecte pas :

Assurez-vous que votre PC et votre téléphone sont sur le même Wi-Fi.

Vérifiez que le serveur CodeIgniter est lancé (php spark serve --port 8080).

Vérifiez l’adresse IPv4 utilisée dans les fichiers apiConfig.ts et api.js.

