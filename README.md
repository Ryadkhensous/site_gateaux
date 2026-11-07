# 🎂 SweetBox DZ — Plateforme de Haute Pâtisserie & Confiserie en Algérie

Plateforme B2C & B2B moderne dédiée au secteur agroalimentaire de la pâtisserie, chocolaterie et confiserie artisanale en Algérie.

---

## 🏛️ Architecture Monorepo & Technologies

- **Client Web (Marketplace & Atelier 3D)** : **React 18** + Vite + Tailwind CSS + Lucide Icons (`http://localhost:5173`)
- **Portail Artisan & Back-Office** : **Vue 3** + Vite + Pinia + Tailwind CSS (`http://localhost:5174`)
- **Backend API & WebSockets** : **Node.js** + Express + **Prisma ORM** + **PostgreSQL** + Socket.io (`http://localhost:5000`)
- **Couverture Territoriale** : **69 Wilayas d'Algérie** intégrées nativement
- **Monnaie Officielle** : **Dinars Algériens (DZD / DA)**

---

## 🚀 Démarrage Rapide

### 1. Lancer l'ensemble des services en une seule commande
```bash
npm run dev
```
Cette commande lance simultanément :
- Le serveur Backend sur le port `5000`
- Le frontend Client (React) sur le port `5173`
- Le tableau de bord Artisan (Vue 3) sur le port `5174`

---

## 💎 Fonctionnalités Clés Implémentées

### 1. Marketplace B2C & B2B
- Vitrine nationale classée par wilayas (1 à 69) et par catégories (*Mariages*, *Anniversaires*, *Traditionnel Algérien*, *Buffets Entreprises*).
- Formules B2B avec mention du Registre de Commerce / NIF et facturation avec TVA.

### 2. Atelier de Personnalisation Sur-Mesure
- Choix de la taille (1 étage, 1 étage haut, 2 étages, 3 étages royaux).
- Choix des saveurs de génoise et des garnitures intérieures (Kinder Bueno, Praliné, Fruits rouges, Pistache d'Iran...).
- Palette de couleurs et glaçages de finition.
- Décorations (fleurs fraîches, macarons, feuille d'or, coulage drip).
- Options photos comestibles haute résolution et figurines 3D sculptées.
- **Calcul et affichage instantané du prix en Dinars Algériens (DZD)**.

### 3. Réservation Officielle & KYC
- Formulaire électronique conforme aux exigences d'identification :
  - **Identité** : Nom complet, Type de document officiel (**CNI**, **Passeport** ou **Permis de conduire**) et numéro de pièce.
  - **Lieu** : Sélection parmi les 69 wilayas et adresse exacte.
  - **Mode de paiement** : Espèces à la livraison/retrait ou Carte bancaire (**CIB / Edahabia**).

### 4. Suivi de Confection en Temps Réel (WebSockets)
- Synchronisation en direct entre l'artisan (Vue 3) et le client (React).
- 7 étapes de fabrication avec horodatage et photos preuves d'avancement prises par le chef pâtissier.

---

## 🗄️ Configuration PostgreSQL & Prisma

Un fichier `docker-compose.yml` est fourni à la racine :
```bash
# Pour démarrer une base PostgreSQL en conteneur :
docker compose up -d

# Pour synchroniser Prisma avec PostgreSQL :
cd backend
npx prisma migrate dev
```
*(En environnement local sans conteneur, un moteur de persistance intégré permet de tester immédiatement toutes les fonctionnalités sans interruption).*

