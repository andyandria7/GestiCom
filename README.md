🏢 GestiCom

GestiCom est une solution complète de gestion commerciale composée de trois applications :

🧩 Backend (CodeIgniter 4 + MySQL) — dossier back_end

💻 Interface Web (ReactJS) — dossier admin_frontend

📱 Application Mobile (React Native + Expo) — dossier invest

Toutes les applications communiquent entre elles via le backend et peuvent fonctionner sur un réseau local.

⚙️ Prérequis

Avant d’installer le projet, téléchargez et installez ces outils :

Outil	Description	Lien de téléchargement
🧱 WAMP Server	Serveur local (Apache + MySQL + PHP)	https://www.wampserver.com/

🐘 Composer	Gestionnaire de dépendances PHP	https://getcomposer.org/download/

💻 Node.js	Pour ReactJS et Expo	https://nodejs.org/en/download/

🧰 Git	Pour cloner ce projet	https://git-scm.com/downloads

📱 Expo Go	Pour tester l’app mobile télécharger dans playstore

📥 Étape 1 — Cloner le projet

Ouvrez un terminal et exécutez :

git clone https://github.com/andyandria7/GestiCom.git
cd GestiCom


Vous aurez maintenant les trois dossiers :

backend/
admin_frontend/
invest/

🧩 Étape 2 — Backend (CodeIgniter 4 + MySQL)

Ce dossier contient l’API principale.

Installation

Placez backend dans le répertoire www de WAMP :

C:\wamp64\www\


Installez les dépendances PHP :
    Ouvrez le terminal du fichier (CMD)
C:\wamp64\www\back_end
   et tapez :
composer install


Créez la base de données MySQL :

Dnas votre navigateur ouvrez tapez : http://localhost/phpmyadmin

Créez une base nommée : invest2

Dans votre projet backend
Configurez le fichier .env :

Dupliquez .env.example → renommez en .env

Modifiez les lignes suivantes :

database.default.hostname = localhost
database.default.database = invest
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
app.baseURL = 'http://localhost:8080/'


Lancez le serveur CodeIgniter dans le terminal (CMD) du backend:

php spark serve --host 0.0.0.0 --port 8080


L’API sera disponible sur :
👉 http://localhost:8080

Déploiement local avec IP

Pour que le web et le mobile communiquent avec le backend :
Ouvrez une nouvelle terminal (CMD) et tapez :

ipconfig
et trouvez votre adresse IPv4 locale

Copiez la ligne Adresse IPv4 (exemple : 192.168.1.15)

Mettez cette IP dans les fichiers suivants :
Fichier mobile (invest/constants/apiConfig.ts) ouvrire dans block note

const ngrok = "http://192.168.1.15:8080"; <- Remplacez par votre Adresse IPv4 que vouz avez copié
const API_BASE_URL: string = ngrok;
export default API_BASE_URL;

puis dans
Fichier Web (admin_frontend/src/services/api.js)

const BASE_URL = "http://192.168.1.15:8080/"; <- Remplacez par votre Adresse IPv4 que vouz avez copié

🌐 Étape 3 — Web (ReactJS) — dossier admin_frontend
Ouvrez le terminal du fichier (CMD) dans admin_frontend
npm install


Configurez l’IP du backend comme indiqué ci-dessus.

Démarrez le serveur web :

npm start

login:andy@gmail.com    
password:andy123

L’application sera accessible sur :
👉 http://localhost:5173

📱 Étape 4 — Mobile (React Native + Expo) — dossier invest
Ouvrez le terminal du fichier (CMD) dans invest
npm install


Configurez l’IP du backend comme indiqué ci-dessus.

Démarrez Expo tapez dans le terminal (CMD):

npx expo start


Scannez le QR code avec l’application Expo Go sur votre téléphone.

Assurez-vous que le PC et le téléphone sont sur le même réseau Wi-Fi.

🧠 Conseils pour les débutants

Vérifiez que les 3 serveurs (backend, web, mobile) tournent.

Si le mobile ne se connecte pas :

Vérifiez que l’IP est correcte dans apiConfig.ts et api.js

Vérifiez que le backend est lancé (php spark serve)

Assurez-vous que le téléphone et le PC sont sur le même réseau

📚 Liens rapides vers les README des sous-projets
Projet	Dossier	Lien
Backend	backend	back_end/README.md

Web	admin_frontend	admin_frontend/README.md

Mobile	invest	invest/README.md
✨ Auteur

Projet GestiCom
Développé par @andyandria7

Technologies : CodeIgniter 4 · ReactJS · React Native (Expo) · MySQL
