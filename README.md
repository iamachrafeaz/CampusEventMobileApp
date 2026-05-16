# Rapport de Projet — CampusEvents AI

---

## Table des matières

1. [Introduction & Contexte](#1-introduction--contexte)
2. [Architecture Générale](#2-architecture-générale)
3. [Authentification & Gestion des Rôles](#3-authentification--gestion-des-rôles)
4. [Base de Données SQLite](#4-base-de-données-sqlite)
5. [Interface Administrateur](#5-interface-administrateur)
6. [Interface Étudiant](#6-interface-étudiant)
7. [Fonctionnalités IA — Assistant Intelligent](#7-fonctionnalités-ia--assistant-intelligent)
8. [Design des Prompts](#8-design-des-prompts)
9. [Choix Techniques & Bibliothèques](#9-choix-techniques--bibliothèques)

---

## Installation

```bash
cd CampusEvents
npm install
```

## Configuration (.env)

Crée un fichier `.env` à la racine du projet et ajoute ta clé API Groq :

```bash
GROQ_API_KEY=your_groq_api_key_here
```

## Lancement de l’application

```bash
npx expo start
```

Ensuite, ouvre l’application avec Expo Go sur un appareil ou un émulateur.

## 1. Introduction & Contexte

**CampusEvents AI** est une application mobile multiplateforme développée avec **Expo** et **React Native** (TypeScript) dans le cadre du mini-projet universitaire. Elle répond à un problème concret : la dispersion des événements du campus sur de multiples canaux (affiches, groupes WhatsApp, réseaux sociaux), qui génère une faible visibilité et surtout une faible pertinence — un étudiant en informatique croise des événements qui ne le concernent pas et rate ceux qui l'intéressent.

L'application centralise l'ensemble des événements du campus dans un **catalogue structuré** géré par l'administration, et met à disposition un **assistant IA** capable de raisonner sur ce catalogue pour guider chaque étudiant de manière personnalisée.

### Objectifs du projet

- Offrir à l'administrateur un espace de gestion complet (CRUD) des événements.
- Permettre à l'étudiant de consulter le catalogue, de s'inscrire et de gérer ses favoris.
- Intégrer un assistant IA contextuel exploitant un LLM via API pour la recherche sémantique, la recommandation personnalisée, la planification hebdomadaire et les questions transversales sur le catalogue.
- Garantir la persistance locale complète des données via SQLite, sans backend distant.

---

## 2. Architecture Générale

L'application adopte une architecture **100 % locale**, sans serveur, reposant sur une séparation claire des responsabilités entre couches.

```
app/                    ← Écrans & navigation (Expo Router)
  auth/                 ← Écran de connexion
  admin/                ← Interface administrateur
  student/              ← Interface étudiant (tabs)
  events/               ← Détail événement [id].tsx

components/             ← Composants UI réutilisables
  ai/                   ← Composants de rendu des réponses IA
  ui/                   ← Boutons, Inputs, DatePicker, Tags...

services/               ← Couche métier
  assistantService.ts   ← Orchestration des appels LLM
  eventService.ts       ← CRUD événements
  registrationService.ts
  favoriteService.ts
  prompts/              ← Prompts IA nommés et séparés

database/               ← Accès SQLite
  init.ts               ← Création des tables + seed
  events.ts / registrations.ts / favorites.ts

store/                  ← État global (Zustand)
  useAuthStore.ts
  useEventStore.ts
  useRegistrationStore.ts

models/ / types/        ← Modèles TypeScript
constants/              ← Thème, typographie, credentials
hooks/                  ← Hooks personnalisés (useEvents, useRegister...)
```

---

## 3. Authentification & Gestion des Rôles

### Principe

L'authentification repose sur deux comptes **préconfigurés** dans le fichier `constants/credentials.ts`. Il n'y a pas d'inscription ni de backend d'authentification : le périmètre est volontairement limité à la simulation de la séparation des rôles.

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@campus.ma` | `admin123` |
| Étudiant | `etudiant@campus.ma` | `etudiant123` |

La session est persistée via **AsyncStorage** : à la réouverture de l'application, si une session existe, l'utilisateur reste connecté sans avoir à se reconnecter. La déconnexion efface l'état et redirige vers l'écran de connexion.

> **Note architecturale :** Les deux profils (Admin et Étudiant) partagent la même base de données SQLite sur le même appareil. C'est une contrainte inhérente à une architecture 100 % locale, acceptable dans le cadre d'une démo sans backend.

---

## 4. Base de Données SQLite

### Choix de SQLite

`expo-sqlite` a été retenu comme solution de persistance locale pour sa capacité à modéliser des données relationnelles, exécuter des requêtes SQL filtrées et gérer des contraintes d'intégrité référentielle — contrairement à AsyncStorage (clé-valeur non structurée). Toutes les données (événements, inscriptions, favoris, résultats IA) persistent entre les redémarrages de l'application.

### Schéma de la base

La base `campusevents.db` est initialisée au premier lancement par la fonction `initDatabase()` dans `database/init.ts`. Elle contient quatre tables :

[Schéma de la base](./screenshots/Class%20Diagram.png)

### Seed de données

Au premier lancement (base vide), `initDatabase()` insère automatiquement 12 événements de démonstration couvrant les catégories Talk, Workshop, Club, Exam et Other, avec des données variées (capacités, tags, organisateurs).

---

## 5. Interface Administrateur

L'administrateur dispose d'un espace dédié, accessible uniquement après connexion avec le rôle Admin, structuré en un Stack Navigator.

### Liste des événements

L'écran `admin/home.tsx` affiche la liste complète de tous les événements (y compris les passés), avec pour chacun les actions **Modifier** et **Supprimer**. La suppression déclenche une alerte de confirmation explicite avant exécution, puis rafraîchit la liste.

Un bouton **Exporter** (fonctionnalité bonus) permet de sérialiser le catalogue en JSON et de le partager via le système natif grâce à `expo-sharing`.

### Formulaire de création / modification

`admin/eventFormScreen.tsx` est un formulaire complet réutilisé pour la création et la modification. Il gère :

**Champs obligatoires** : Titre, Description, Catégorie (sélecteur parmi Talk / Workshop / Club / Exam / Other), Date et heure de début, Lieu.

**Champs optionnels** : Date et heure de fin, Organisateur, Capacité maximale, Tags (composant `TagInput` avec ajout dynamique), Image (composant `ImagePickerInput` via `expo-image-picker`).

**Validations appliquées :**

- Aucun champ obligatoire ne peut être vide (messages d'erreur inline).
- La date de fin, si renseignée, doit être strictement postérieure à la date de début.
- La capacité, si renseignée, doit être un entier positif.

Le sélecteur de date/heure utilise un composant modal personnalisé (`DateTimeModal`) intégrant `@react-native-community/datetimepicker`. L'identifiant de l'événement est généré localement via `expo-crypto` (`Crypto.randomUUID()`).

[Interface Administrateur](./screenshots/Admin%20Screens.png)

---

## 6. Interface Étudiant

L'interface étudiant est organisée en **4 onglets** (Bottom Tabs) : Événements, Favoris, Inscriptions et Assistant IA.

### Onglet Événements

`student/home.tsx` affiche le catalogue d'événements trié par date, avec trois états gérés : chargement (indicateur visuel), erreur et liste vide (message utile).

Des **chips de filtrage** permettent de filtrer par catégorie (Talk, Workshop, Club, Exam, Other) et par période (À venir / Passés). Une **recherche textuelle** insensible à la casse filtre les événements par titre en temps réel.

### Détail événement

`events/[id].tsx` affiche toutes les informations de l'événement : titre, description complète, catégorie, date/heure de début et de fin, lieu, organisateur, capacité restante et tags. Deux actions sont disponibles : **S'inscrire / Annuler** et **Ajouter aux favoris / Retirer**.

**Règles métier appliquées :**

- L'inscription est désactivée si l'événement est complet (`registeredCount >= capacity`) ou passé.
- L'inscription en double est bloquée au niveau SQL par la contrainte d'unicité sur (`eventId`, `userId`).
- `registeredCount` est mis à jour atomiquement à chaque inscription ou annulation.

### Onglet Favoris

`student/favorites.tsx` affiche les événements mis en favori par l'étudiant connecté, récupérés via une jointure SQL entre `events` et `favorites`. La liste se met à jour en temps réel après chaque ajout ou retrait.

### Onglet Inscriptions

`student/registrations.tsx` liste tous les événements auxquels l'étudiant est inscrit, avec leur statut (`confirmed` / `cancelled`) et une option d'annulation directe.

### Profil étudiant (bonus)

`student/profile.tsx` permet à l'étudiant de renseigner sa filière, son année et ses centres d'intérêt, ces informations étant persistées via AsyncStorage et utilisées pour enrichir les recommandations de l'assistant IA.

[Interface Étudiant](./screenshots/Student%20Screens.png)

---

## 7. Fonctionnalités IA — Assistant Intelligent

L'assistant IA est accessible depuis l'onglet dédié `student/assistant.tsx`. Il adopte une interface conversationnelle (bulles de messages) et intègre **Groq** comme fournisseur LLM via l'API HTTP (`groq-sdk`).

### Architecture de l'assistant

Un **classificateur d'intention** (prompt `base.prompt.ts`) analyse d'abord chaque message utilisateur et le catégorise en l'un des quatre types : `search`, `recommend`, `plan` ou `qa`. Ce résultat détermine quel prompt spécialisé est invoqué ensuite avec les données contextuelles extraites de SQLite.

[Architecture de l'assistant](./screenshots/Assistant%20Flow.png)

**Une seule requête IA à la fois** : le bouton d'envoi est désactivé pendant le chargement, et un indicateur animé (`TextShimmer`) signale l'attente.

### Résultats mis en cache

Chaque réponse IA est sauvegardée dans la table `llm_results` (avec `inputText`, `outputText`, `type`, `userId`) pour éviter des appels redondants à des requêtes identiques.

### Les quatre fonctionnalités

**1. Recherche en langage naturel (`search`)** — L'étudiant exprime sa recherche librement sans connaître les mots-clés exacts. Le LLM reçoit la requête et le catalogue complet sérialisé en JSON, identifie les événements pertinents par analyse sémantique, et retourne pour chacun une justification courte. Le composant `SearchResponse` affiche les résultats avec leur justification. La valeur ajoutée par rapport à une recherche exacte est notable : une requête sur "IA" peut trouver un workshop "Machine Learning avec TensorFlow".

**2. Recommandation personnalisée (`recommend`)** — À partir des favoris et inscriptions de l'étudiant connecté, le LLM analyse les patterns comportementaux (catégories fréquentes, tags récurrents) et suggère exactement 3 événements à venir non encore consultés, avec une justification personnalisée par suggestion. Le composant `RecommendResponse` présente les suggestions de manière structurée.

**3. Assistant de planification (`plan`)** — L'étudiant décrit ses contraintes horaires en langage naturel (cours, examens, disponibilités). Le LLM produit un planning de participation hebdomadaire sans conflit, en respectant des règles strictes (15 minutes de battement entre activités, maximum 2-3 événements par jour). Le composant `WeeklySchedule` affiche le planning organisé par jour.

**4. Questions sur le catalogue global (`qa`)** — L'étudiant pose des questions analytiques sur l'ensemble des événements ("Quels clubs sont actifs ce mois-ci ?", "Quels événements ont encore des places ?"). La réponse est générée en Markdown et affichée via `react-native-markdown-display`.

### États requis (tous implémentés)

| État | Implémentation |
|------|---------------|
| Chargement | `TextShimmer` animé, bouton envoi désactivé |
| Erreur | Message explicite avec type d'erreur |
| Résultat vide | Message utile ("Aucun événement correspondant") |
| Résultat | Composant dédié selon le type (`SearchResponse`, `RecommendResponse`, `WeeklySchedule`, Markdown) |

### Sécurité

Un avertissement visible est affiché en permanence en haut de l'écran Assistant : *"Ne soumettez pas de données personnelles ou sensibles."* Les prompts ne transmettent au LLM que les champs utiles des événements — les données d'authentification (email, mot de passe) ne sont jamais envoyées.

---

## 8. Design des Prompts

Tous les prompts sont centralisés dans `services/prompts/`, séparés par fonctionnalité, et structurés de manière cohérente.

---

### Prompt 1 — Classificateur d'intention (`base.prompt.ts`)

**Rôle système :** Classificateur d'intention pour application universitaire d'événements.

**Données injectées :** Aucune donnée JSON — le prompt reçoit uniquement le message brut de l'utilisateur.

**Format de sortie attendu :**

```json
{ "type": "search | recommend | plan | qa" }
```

**Justification des choix :** Ce prompt agit comme un routeur intelligent. En retournant un JSON minimal à un seul champ, le parsing est fiable et résistant aux variations de formulation du LLM. La classification en amont permet d'appeler le bon prompt spécialisé avec les données SQLite appropriées, évitant de transmettre des données inutiles.

---

### Prompt 2 — Recherche sémantique (`search.prompt.ts`)

**Rôle système :** Assistant événementiel universitaire expert en recommandation sémantique.

**Données injectées :** Catalogue complet des événements à venir sérialisé en JSON (`upcomingEvents`).

**Format de sortie attendu :**

```json
{
  "opening": "...",
  "content": [
    { "id", "title", "date", "time", "location", "justification" }
  ],
  "closing": "..."
}
```

**Justification des choix :** L'inclusion de l'`opening` et du `closing` permet un rendu conversationnel naturel. Le champ `justification` par événement est la valeur différenciante par rapport à une recherche exacte. La règle d'expansion sémantique explicite ("IA → Machine Learning, Data Science") est encodée directement dans le prompt pour guider le modèle. Les contraintes temporelles implicites ("pas trop tôt") sont aussi définies (">=10h00").

---

### Prompt 3 — Recommandation personnalisée (`recommend.prompt.ts`)

**Rôle système :** Assistant de recommandation d'événements universitaires expert.

**Données injectées :** Trois sources JSON distinctes — favoris de l'étudiant, inscriptions passées, événements à venir.

**Format de sortie attendu :** Identique au prompt de recherche, avec la contrainte supplémentaire de retourner exactement 3 suggestions et d'exclure les événements déjà favoris ou inscrits.

**Justification des choix :** Séparer les trois sources de données permet au LLM de distinguer les intérêts déclarés (favoris) des comportements réels (inscriptions). La règle d'exclusion explicite ("ne jamais recommander un événement déjà favori ou inscrit") évite des suggestions redondantes. Le tri par score de pertinence (0 à 1) assure un classement cohérent.

---

### Prompt 4 — Planification hebdomadaire (`plan.prompt.ts`)

**Rôle système :** Planificateur d'emploi du temps universitaire expert.

**Données injectées :** Contraintes horaires en texte libre + événements disponibles en JSON.

**Format de sortie attendu :**

```json
{
  "opening": "...",
  "content": [
    { "day": "Lundi", "events": [{ "id", "title", "date", "time", "location", "justification" }] }
  ],
  "closing": "..."
}
```

**Justification des choix :** La structure par jour est indispensable pour alimenter le composant `WeeklySchedule`. Les règles strictes de gestion des conflits (15 minutes de battement, maximum 2-3 événements/jour, aucun chevauchement) sont encodées explicitement car les LLMs ont naturellement tendance à proposer des plannings chargés. La définition des créneaux horaires ("Matin = 08:00-12:00") normalise l'interprétation des contraintes floues.

---

### Prompt 5 — Questions sur le catalogue (`qa.prompt.ts`)

**Rôle système :** Assistant conversationnel expert pour événements universitaires.

**Données injectées :** Catalogue complet + question de l'utilisateur.

**Format de sortie attendu :** Markdown structuré (titres en gras, listes à puces).

**Justification des choix :** Contrairement aux autres prompts qui retournent du JSON parsé, ce prompt retourne du Markdown directement affichable via `react-native-markdown-display`. La limite de 150 mots est imposée pour éviter des réponses trop longues dans une interface conversationnelle mobile. La limite de 5 événements maximum évite la surcharge visuelle.

---

## 9. Choix Techniques & Bibliothèques

### Stack principal

| Technologie | Rôle |
|------------|------|
| Expo | Plateforme de développement multiplateforme |
| React Native | Framework UI mobile |
| TypeScript  | Typage statique |
| Expo Router | Navigation file-based |
| expo-sqlite  | Persistance locale SQLite |
| Zustand | Gestion d'état global léger |
| groq-sdk | Intégration LLM via API Groq |

### Bibliothèques UI notables

`@gorhom/bottom-sheet` pour les modals de sélection, `react-native-markdown-display` pour le rendu Markdown des réponses Q/A, `react-native-toast-message` pour les notifications utilisateur, `expo-image-picker` pour la sélection d'images dans le formulaire admin, `expo-sharing` pour l'export JSON du catalogue.

### Gestion de la clé API

Conformément aux exigences de sécurité, la clé API Groq n'est **jamais codée en dur** dans le dépôt. Elle est chargée via `expo-constants` depuis un fichier `.env` listé dans `.gitignore`.

### Modèle LLM utilisé

Le fournisseur retenu est **Groq** avec le modèle `openai/gpt-oss-120b` (ou équivalent selon disponibilité), choisi pour sa rapidité d'inférence particulièrement adaptée à une expérience conversationnelle mobile.

---

Ce projet est sous licence **MIT** — contacter  [EL AZZOUZI Achraf](mailto:achraf0el7azzouzi@gmail.com) ou [Mohamed Iliass Kaddar](mailto:moahmediliassk@gmail.com) pour plus de détails.

---

<div align="center">
  <strong>Réalisé dans le cadre d’un projet académique de développement mobile</strong><br>
  Expo · React Native · TypeScript · SQLite · Zustand · AI Assistant Integration · Mobile-First Architecture
</div>
