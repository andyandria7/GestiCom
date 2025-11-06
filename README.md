# 🏢 GestiCom : Solution Complète de Gestion Commerciale

GestiCom est une solution de gestion commerciale **modulaire et complète**, conçue pour fonctionner sur un réseau local.

Elle est composée de trois applications distinctes qui communiquent entre elles via le backend :

* **🧩 Backend (API) :** Gestion des données et logique métier (CodeIgniter 4 + MySQL).
* **💻 Interface Web :** Application d'administration et de gestion (ReactJS) — dossier `admin_frontend`.
* **📱 Application Mobile :** Application pour les utilisateurs ou investisseurs (React Native + Expo) — dossier `invest`.

---

## ⚙️ Prérequis

Avant de commencer l'installation, assurez-vous d'avoir téléchargé et installé les outils suivants :

| Outil | Description | Lien de Téléchargement |
| :--- | :--- | :--- |
| **🧱 WAMP Server** | Serveur local (Apache + MySQL + PHP) | [https://www.wampserver.com/](https://www.wampserver.com/) |
| **🐘 Composer** | Gestionnaire de dépendances PHP | [https://getcomposer.org/download/](https://getcomposer.org/download/) |
| **💻 Node.js** | Environnement d'exécution pour React/Expo | [https://nodejs.org/en/download/](https://nodejs.org/en/download/) |
| **🧰 Git** | Pour cloner le projet | [https://git-scm.com/downloads](https://git-scm.com/downloads) |
| **📱 Expo Go** | Application mobile pour tester (Play Store/App Store) | *Nécessite l'installation sur votre téléphone* |

---

## 🚀 Guide d'Installation et de Démarrage

### 📥 Étape 1 — Cloner le Projet

Dans un dossier 
Ouvrez votre terminal(cmd) et exécutez les commandes :
```bash
git clone https://github.com/andyandria7/GestiCom.git
cd GestiCom
```
Les trois dossiers de projet seront disponibles : backend/, admin_frontend/, et invest/.

### 🧩 Étape 2 — Configuration du Backend (CodeIgniter 4 + MySQL)
Ce dossier (backend/) contient l'API centrale du projet.

---

* ** Placement du Dossier
* Placez le dossier backend/ dans le répertoire www de WAMP : C:\wamp64\www\ (ou équivalent).
* **Installation des Dépendances PHP
* Ouvrez un terminal dans le dossier C:\wamp64\www\backend et exécutez :
  ```bash
  composer install
  ```
* ** Création de la Base de Données
* Ouvrez phpMyAdmin : http://localhost/phpmyadmin
* Créez une base de données nommée : invest2.
* ** Configuration du Fichier .env
* Dupliquez le fichier .env.example et renommez-le en .env dans le dossier backend/.
* Modifiez les lignes suivantes dans .env pour correspondre à votre configuration MySQL et à l'URL de l'API :
# Configuration de la base de données
```bash
database.default.hostname = localhost
database.default.database = invest2
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
```

# URL de base de l'API
app.baseURL = 'http://localhost:8080/'
* ** Lancement du Serveur CodeIgniter
* Dans le terminal du dossier backend/, lancez l'API :
  php spark serve --host 0.0.0.0 --port 8080
* ** L'API est maintenant disponible sur : 👉 http://localhost:8080

### 🔗 Étape 3 — Configuration de l'IP Locale (Communication Réseau)
Pour que l'Interface Web et l'Application Mobile puissent communiquer avec le Backend, vous devez utiliser votre adresse IPv4 locale (uniquement nécessaire si vous testez le mobile ou si l'API est hébergée sur une autre machine).

* Trouver l'Adresse IPv4
* ** Ouvrez un nouveau terminal (CMD) et tapez :
ipconfig
* ** Copiez l'Adresse IPv4 (ex. : 192.168.1.15).
  
* Mise à jour dans l'Application Mobile
* ** Ouvrez le fichier : invest/constants/apiConfig.ts.
* ** Remplacez l'IP par votre adresse (gardez le port :8080) :
```bash
const ngrok = "http://VOTRE_IP_ICI:8080"; <- Remplacez l'IP par votre adresse
const API_BASE_URL: string = ngrok; 
export default API_BASE_URL;
```
* Mise à jour dans l'Interface Web
* ** Ouvrez le fichier : admin_frontend/src/services/api.js.
* ** Remplacez l'IP par votre adresse :
```bash
const BASE_URL = "http://VOTRE_IP_ICI:8080/";
```

# Étape 4 — Interface Web (ReactJS) — admin_frontend
* Installation des Dépendances
* ** Ouvrez un terminal dans le dossier admin_frontend/ et exécutez :
```bash
npm install
```
* Démarrage du Serveur Web
* ** Démarrez l'application :
```bash
npm start
```
* ** L'application sera accessible sur : 👉 http://localhost:5173
Login : andy@gmail.com
Password : andy123

# 📱 Étape 5 — Application Mobile (React Native + Expo) — invest
* Installation des Dépendances
* ** Ouvrez un terminal dans le dossier invest/ et exécutez :
```bash
npm install
```

* Démarrage d'Expo
* ** Démarrez le packager :
```bash
npx expo start
```

* Test sur Appareil
* ** Scannez le QR code affiché dans le terminal avec l'application Expo Go sur votre téléphone.
* ** ⚠️ Rappel : Le PC et le téléphone doivent être sur le même réseau Wi-Fi.

🧠 Conseils pour les Débutants et Dépannage
Vérifiez que les 3 serveurs (Backend, Web, Mobile) sont bien lancés.

Si le mobile ou le web ne se connectent pas au backend :

Vérifiez que l'Adresse IPv4 est correcte et sans faute de frappe dans les fichiers apiConfig.ts et api.js.

Confirmez que le backend est lancé (php spark serve --host 0.0.0.0 --port 8080).

```bash
✨ Auteur
Projet GestiCom Développé par @andyandria7.

Technologies : CodeIgniter 4 · ReactJS · React Native (Expo) · MySQL.
```
