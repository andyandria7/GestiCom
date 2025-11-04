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

📱 Expo Go	Pour tester l’app mobile	Android
📥 Étape 1 — Cloner le projet

Ouvrez un terminal et exécutez :

git clone https://github.com/andyandria7/GestiCom.git
cd GestiCom


Vous aurez maintenant les trois dossiers :

back_end/
admin_frontend/
invest/

🧩 Étape 2 — Backend (CodeIgniter 4 + MySQL)

Ce dossier contient l’API principale.

Installation

Placez back_end dans le répertoire www de WAMP :

C:\wamp64\www\back_end


Installez les dépendances PHP :

cd back_end
composer install


Créez la base de données MySQL :

Ouvrez phpMyAdmin : http://localhost/phpmyadmin

Créez une base nommée : gesticom

Configurez le fichier .env :

Dupliquez .env.example → renommez en .env

Modifiez les lignes suivantes :

database.default.hostname = localhost
database.default.database = gesticom
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
app.baseURL = 'http://localhost:8080/'


Lancez le serveur CodeIgniter :

php spark serve --host 0.0.0.0 --port 8080


L’API sera disponible sur :
👉 http://localhost:8080

Déploiement local avec IP

Pour que le web et le mobile communiquent avec le backend :

Trouvez votre adresse IPv4 locale :

ipconfig


Copiez la ligne Adresse IPv4 (exemple : 192.168.1.15)

Mettez cette IP dans :

invest/constants/apiConfig.ts

const ngrok = "http://192.168.1.15:8080";
const API_BASE_URL: string = ngrok;
export default API_BASE_URL;


admin_frontend/services/api.js

const BASE_URL = "http://192.168.1.15:8080/";

🌐 Étape 3 — Web (ReactJS) — dossier admin_frontend
Installation

Allez dans le dossier :

cd admin_frontend


Installez les dépendances :

npm install


Configurez l’IP du backend comme indiqué ci-dessus.

Démarrez le serveur web :

npm run dev


L’application sera accessible sur :
👉 http://localhost:5173

📱 Étape 4 — Mobile (React Native + Expo) — dossier invest
Installation

Allez dans le dossier :

cd invest


Installez les dépendances :

npm install


Configurez l’IP du backend comme indiqué ci-dessus.

Démarrez Expo :

npx expo start


Scannez le QR code avec l’application Expo Go sur votre téléphone.

Assurez-vous que le PC et le téléphone sont sur le même réseau Wi-Fi.

🧠 Conseils pour les débutants

Vérifiez que les 3 serveurs (backend, web, mobile) tournent.

Si le mobile ne se connecte pas, assurez-vous que :

L’adresse IP est correcte dans apiConfig.ts et api.js.

Le backend est lancé (php spark serve).

Le téléphone et le PC sont sur le même réseau.

📚 Liens rapides vers les README des sous-projets
Projet	Dossier	Lien
Backend	back_end	back_end/README.md

Web	admin_frontend	admin_frontend/README.md

Mobile	invest	invest/README.md
✨ Auteur

Projet GestiCom
Développé par @andyandria7

Technologies : CodeIgniter 4 · ReactJS · React Native (Expo) · MySQL
