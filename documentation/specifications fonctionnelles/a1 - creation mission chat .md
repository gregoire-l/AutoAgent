# **Fonctionnalité : A1 \- Création de Mission via Chat**

**Date de Dernière Modification :** 2025-04-30 

**Statut :** Approuvé

## **\---**

**1\. User Story**

**En tant qu'** Utilisateur AutoAgent V1, 

**Je veux** pouvoir initier la création d'une nouvelle mission en cliquant sur un bouton dédié pour démarrer une conversation avec l'agent Orchestrateur via l'interface de chat, 

**Afin de** pouvoir ensuite définir les détails de cette mission (objectif, contexte, etc.) et la lancer.

## **\---**

**2\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** A1 \- Création de Mission via Chat

Scenario: Démarrage réussi d'une nouvelle conversation de mission 

**Given** l'utilisateur est sur l'interface principale d'AutoAgent V1 ()

 **And** aucune conversation de définition de mission n'est actuellement active 

**When** l'utilisateur clique sur le bouton "Nouvelle Mission" (`MainUI_V1:NewMissionButton`) 

**Then** une nouvelle vue de conversation doit s'ouvrir dans le panneau de chat (`ChatCanvas_Init_V1:ChatPanel`) 

**And** un message initial de l'agent Orchestrateur doit être le premier message visible dans le chat (`ChatCanvas_Init_V1:OrchestratorGreeting`), avec un contenu similaire à : "Bonjour \! Prêt à définir une nouvelle mission ? Quel en serait l'objectif principal ?" 

**And** le panneau Canvas (`ChatCanvas_Init_V1:CanvasPanel`) doit afficher son état initial de définition de mission (`ChatCanvas_Init_V1:InitialCanvasState`, ex: carte "Objectif Principal" vide). 

**And** le bouton "Nouvelle Mission" (`MainUI_V1:NewMissionButton`) doit devenir désactivé ou non visible sur l'interface principale. 

**And** la nouvelle vue doit apparaître en moins de 1 seconde (NFR Réactivité).

Scenario: Bouton "Nouvelle Mission" non disponible si une définition est déjà en cours 

**Given** l'utilisateur est déjà en train de définir une mission (état système interne "DEFINING\_MISSION")

 **And** l'interface principale est visible () 

**When** l'utilisateur interagit avec l'interface principale 

**Then** le bouton "Nouvelle Mission" (`MainUI_V1:NewMissionButton`) doit être dans un état désactivé (grisé, non cliquable) ou totalement absent.

Scenario: Clic sur "Nouvelle Mission" pendant l'initialisation (état intermédiaire) **Given** l'utilisateur est sur l'interface principale **When** l'utilisateur clique sur le bouton "Nouvelle Mission" (`MainUI_V1:NewMissionButton`) **And** le système est en cours d'initialisation de la nouvelle session de chat (ex: affichage d'un indicateur de chargement sur le bouton ou à proximité) **Then** le bouton "Nouvelle Mission" doit être immédiatement désactivé après le premier clic. **And** des clics supplémentaires sur le bouton désactivé ne doivent avoir aucun effet.

Scenario: Gestion d'une erreur contrôlée lors de l'initialisation de la conversation

**Given** l'utilisateur est sur l'interface principale 

**When** l'utilisateur clique sur le bouton "Nouvelle Mission" (`MainUI_V1:NewMissionButton`) 

**And** une erreur contrôlée se produit côté backend lors de l'initialisation (ex: échec de création de la session d'agent Orchestrateur) 

**Then** un message d'erreur clair et informatif doit s'afficher à l'utilisateur dans une zone dédiée de l'UI principale (ex: "Impossible de démarrer une nouvelle mission pour le moment. Erreur : \[Code/Message Erreur Simplifié\]. Veuillez réessayer.") 

**And** aucune nouvelle vue de conversation ne doit s'ouvrir dans le panneau de chat. **And** le panneau Canvas doit rester dans son état précédent (ou un état d'erreur clair). **And** le bouton "Nouvelle Mission" (`MainUI_V1:NewMissionButton`) doit redevenir actif après l'affichage de l'erreur. 

**And** l'application doit rester stable et pleinement fonctionnelle (NFR Stabilité).

## **\---**

**3\. Références UI**

* **Wireframe(s) Associé(s):**  
  * `Wireframe_MainUI_V1.png` (Montrant l'emplacement et l'état possible du `NewMissionButton`)  
  * `Wireframe_ChatCanvas_Init_V1.png` (Montrant l'état initial du `ChatPanel`, `CanvasPanel`, et `OrchestratorGreeting`)  
* **Éléments Clés Référencés :**  
  * `MainUI_V1:NewMissionButton`: Bouton principal pour démarrer une mission (états : actif, désactivé/absent, en chargement).  
  * `ChatCanvas_Init_V1:ChatPanel`: Zone d'affichage de la conversation.  
  * `ChatCanvas_Init_V1:CanvasPanel`: Zone d'affichage dynamique de droite.  
  * `ChatCanvas_Init_V1:OrchestratorGreeting`: Premier message de l'agent Orchestrateur dans le chat.  
  * `ChatCanvas_Init_V1:InitialCanvasState`: État initial du canvas lors du démarrage de la définition.  
  * `MainUI_V1:ErrorDisplayArea`: Zone (ex: toast, bannière) où afficher les erreurs d'initialisation.

## **\---**

**4\. Considérations Non Fonctionnelles (V1)**

* **Réactivité :** L'ouverture de la vue de conversation doit être \< 1s (intégré comme AC).  
* **Stabilité :** La gestion des erreurs d'initialisation ne doit pas entraîner de crash (intégré comme AC).  
* **Sécurité :** Pas de considérations de sécurité spécifiques majeures pour cette action d'initiation elle-même, au-delà de la gestion propre des erreurs backend.

## **\---**

**5\. Termes du Glossaire Associés**

* Mission  
* Agent Orchestrateur  
* Chat  
* Canvas  
* Statut (Mission)
