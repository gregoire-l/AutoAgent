
# Fonctionnalité : A3 - Canvas "Tableau Blanc" Dynamique (Phase de Définition)

Date de Dernière Modification : 2025-05-01

Statut : Approuvé

**---**

**1. User Story**

En tant qu' Utilisateur AutoAgent V1,

Je veux que le panneau Canvas de droite se mette à jour dynamiquement pendant ma conversation de clarification avec l'agent Orchestrateur,

Afin de visualiser en temps réel les informations clés de la mission (objectif, contraintes, etc.) telles qu'elles sont comprises et confirmées, me servant ainsi d'un "tableau blanc" interactif qui reflète notre compréhension partagée.

**---**

**2. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** A3 - Canvas "Tableau Blanc" Dynamique (Phase de Définition)

**Contexte Général:** Ces scénarios se déroulent pendant l'exécution de la fonctionnalité A2 (Clarification Guidée). Le ChatPanel et le CanvasPanel sont actifs. L'agent Orchestrateur utilise sa Checklist V1 interne.

Scenario: Affichage initial du Canvas lors de la définition

**Given** l'utilisateur a démarré une nouvelle mission (après A1)

**And** l'agent Orchestrateur a posé sa première question dans le ChatPanel

**When** le CanvasPanel est affiché pour la première fois pour cette mission

**Then** le CanvasPanel doit afficher son état initial de définition (ChatCanvas\_Init\_V1:InitialCanvasState).

**And** cet état initial doit inclure des zones ou cartes dédiées mais vides pour les informations clés de la Checklist V1 (ex: ObjectiveInfoDisplay, ConstraintsInfoDisplay, etc.).

Scenario: Mise à jour du Canvas lorsqu'une information est proposée pour confirmation

**Given** l'agent Orchestrateur analyse une réponse utilisateur et identifie une information clé (ex: l'objectif principal Info\_Objective\_Principal)

**When** l'agent Orchestrateur formule une reformulation et demande confirmation dans le ChatPanel (cf. A2)

**Then** le CanvasPanel doit simultanément afficher cette information reformulée dans la zone dédiée (ObjectiveInfoDisplay).

**And** cette information affichée sur le Canvas doit avoir un état logique et visuel clair indiquant "En attente de confirmation".

**And** la mise à jour du Canvas doit être visible en moins de 1 seconde après l'apparition du message de l'agent dans le chat (NFR Réactivité UI).

Scenario: Mise à jour du Canvas lorsqu'une information est confirmée par l'utilisateur

**Given** une information (ex: l'objectif principal) est affichée sur le CanvasPanel avec l'état "En attente de confirmation"

**And** l'agent Orchestrateur a demandé confirmation dans le ChatPanel

**When** l'utilisateur confirme l'information dans le ChatPanel (cf. A2)

**And** l'agent Orchestrateur accuse réception de la confirmation dans le ChatPanel

**Then** l'état logique et visuel de l'information correspondante sur le CanvasPanel (ex: ObjectiveInfoDisplay) doit passer à "Confirmé".

**And** le texte affiché doit correspondre à la version confirmée.

**And** cette mise à jour de statut sur le Canvas doit être visible en moins de 1 seconde après l'accusé de réception de l'agent dans le chat (NFR Réactivité UI).

Scenario: Mise à jour du Canvas lors de la confirmation groupée de plusieurs informations

**Given** l'agent Orchestrateur a proposé pour confirmation groupée l'Objectif et les Contraintes

**And** les zones ObjectiveInfoDisplay et ConstraintsInfoDisplay affichent ces informations avec l'état "En attente de confirmation"

**When** l'utilisateur confirme l'ensemble dans le ChatPanel

**And** l'agent Orchestrateur accuse réception

**Then** l'état logique et visuel des informations "Objectif Principal" ET "Contraintes Critiques" doit passer à "Confirmé" sur le CanvasPanel.

**And** la mise à jour des deux zones sur le Canvas doit être visible en moins de 1 seconde.

Scenario: Mise à jour du Canvas lors de la modification d'une information confirmée

**Given** l'information "Objectif Principal" est affichée sur le CanvasPanel avec l'état "Confirmé"

**When** l'utilisateur demande à modifier cet objectif dans le ChatPanel (cf. A2)

**And** l'agent Orchestrateur propose le nouvel objectif pour confirmation dans le ChatPanel

**Then** le CanvasPanel doit mettre à jour la zone ObjectiveInfoDisplay avec le nouvel objectif proposé.

**And** l'état logique et visuel de ObjectiveInfoDisplay doit repasser à "En attente de confirmation".

Scenario: Comportement du Canvas lors d'une clarification en cours

**Given** l'agent Orchestrateur a demandé une clarification sur une information ambiguë (ex: le livrable)

**When** l'utilisateur répond, mais l'agent juge la réponse encore insuffisante et pose une nouvelle question de clarification

**Then** la zone correspondante sur le CanvasPanel (DeliverablesInfoDisplay) doit rester dans un état "Non défini" ou "En cours de clarification".

**And** aucune information partielle ou ambiguë ne doit être affichée comme "En attente de confirmation" tant que l'agent n'a pas pu la reformuler pour validation.

Scenario: Affichage de la synthèse finale sur le Canvas (Transition vers A5)

**Given** l'agent Orchestrateur a confirmé toutes les informations du Noyau Dur V1

**When** l'agent Orchestrateur initie la phase de synthèse finale (cf. A2)

**Then** le CanvasPanel doit afficher une vue ou une carte récapitulative (SummaryCard).

**And** cette SummaryCard doit présenter de manière claire et lisible toutes les informations clés confirmées du Noyau Dur V1 (Objectif, Livrable, Critère, Contrainte, Validateur).

**And** la SummaryCard doit contenir les contrôles de validation finale ("Confirmer la Mission" ConfirmButton, "Modifier" ModifyButton).

**---**

**3. Références UI**

*   **Wireframe(s) Associé(s):**

*   Wireframe\_ChatCanvas\_Definition\_V1.png (Montrant les différentes cartes/zones d'information et leurs états visuels possibles : vide, "En attente", "Confirmé").
*   Wireframe\_ChatCanvas\_Summary\_V1.png (Montrant la SummaryCard finale).

*   **Éléments Clés Référencés (Logiques):**

*   CanvasPanel: Le conteneur principal du canvas.
*   ObjectiveInfoDisplay, ContextInfoDisplay, ConstraintsInfoDisplay, DeliverablesInfoDisplay, AcceptanceCriteriaInfoDisplay, ValidatorInfoDisplay: Zones logiques (ex: cartes) affichant les informations respectives et leur état. *(Note : Le contenu exact et le style visuel seront définis en phase de conception UI détaillée, mais l'information logique et son état doivent être présents)*.
*   SummaryCard: Zone/Carte affichant le résumé final pour validation.
*   ConfirmButton, ModifyButton: Boutons sur la SummaryCard.

**---**

**4. Considérations Non Fonctionnelles (V1)**

*   **Réactivité UI :** Les mises à jour du Canvas suite aux interactions dans le chat doivent être perçues comme instantanées (< 1s).
*   **Cohérence :** L'état affiché sur le Canvas doit toujours refléter fidèlement l'état de la clarification validé par l'agent Orchestrateur.
*   **Performance :** L'affichage et la mise à jour du Canvas doivent rester fluides même si plusieurs cartes d'information sont présentes.

**---**

**5. Termes du Glossaire Associés**

*   Mission
*   Agent Orchestrateur
*   Chat
*   Canvas
*   Checklist d'Informations Clés V1
*   État Logique (UI)
