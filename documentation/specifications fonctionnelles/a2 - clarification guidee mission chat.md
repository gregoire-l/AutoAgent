# **Fonctionnalité : A2 \- Clarification Guidée Adaptative via Chat et Canvas**

Date de Dernière Modification : 2025-05-01

Statut : Approuvé

**\---**

**1\. User Story**

En tant qu' Utilisateur AutoAgent V1,

Je veux interagir avec un agent Orchestrateur qui écoute activement mes descriptions initiales, analyse les informations fournies, pose des questions ciblées uniquement sur ce qui manque ou est ambigu pour définir les détails essentiels de ma mission (objectif, contexte, contraintes, livrables), et me demande confirmation explicite, tout en reflétant dynamiquement notre compréhension mutuelle sur le Canvas,

Afin de définir clairement et efficacement la mission avant son lancement, dans une conversation fluide, naturelle et sans friction inutile.

**\---**

**2\. Processus de Clarification (Logique Interne de l'Agent Orchestrateur)**

L'agent Orchestrateur suit un processus interne adaptatif, guidé par une **"Checklist d'Informations Clés V1"**, pour s'assurer qu'une compréhension fondamentale et partagée de la mission est atteinte avant la synthèse (A5).

**2.1 Checklist d'Informations Clés (Noyau Dur V1)**

L'agent Orchestrateur *doit* obtenir et faire valider explicitement par l'utilisateur les informations suivantes :

1. **Info\_Motivation\_Contexte :** Le "Pourquoi" de la mission (problème à résoudre, opportunité).  
2. **Info\_Objective\_Principal :** L'objectif principal, spécifique et concret.  
3. **Info\_Livrable\_Cle :** Le résultat tangible principal attendu.  
4. **Info\_Critere\_Acceptation\_Fondamental :** Le critère objectif principal pour valider le livrable clé.  
5. **Info\_Contrainte\_Critique :** Les contraintes non négociables (ou leur absence confirmée).  
6. **Info\_Validateur\_Principal :** Qui valide la mission finale.

*(Note : Les critères de qualité pour chaque information sont définis dans le document autoagent\_clarification\_checklist\_v1\_core)*.

**2.2 Flux Général Adaptatif (Principes d'Application)**

1. **Analyse Initiale & Écoute Active :** Examiner attentivement l'input initial (et suivants) pour identifier les informations de la checklist déjà fournies (explicitement ou implicitement). Accuser réception des informations comprises.  
2. **Questionnement Ciblé :** Poser des questions ouvertes et spécifiques **uniquement** sur les informations de la checklist (priorité au Noyau Dur V1) qui sont manquantes, ambiguës, ou inférées avec une faible confiance.  
3. **Reformulation & Confirmation Explicite :** Pour chaque information clé identifiée ou fournie, la **reformuler clairement** et demander une **confirmation explicite** à l'utilisateur ("Est-ce exact ?", "Pouvons-nous confirmer que...").  
4. **Mise à Jour État & Persistance :** Si une information est confirmée :  
   * Mettre à jour son état logique à "Confirmé" (visible sur le Canvas).  
   * **Persister l'information via l'outil backend approprié** (ex: UpdateMissionPropertiesTool).  
   * Passer à l'information manquante suivante la plus prioritaire.  
5. **Gestion des Dialogues Complexes :** Gérer les réponses ambiguës (clarification limitée), les modifications (re-confirmation, mise à jour backend), les contradictions (signalement, demande de résolution), et les tangentes utilisateur (réponse brève \+ recentrage poli).  
6. **Synthèse Progressive :** Proposer de courts résumés des points clés confirmés à des étapes logiques pour valider la compréhension mutuelle.  
7. **Condition de Fin :** Ne passer à la phase de Synthèse Finale (A5) que lorsque **tous les points du Noyau Dur V1 (1 à 6\) sont à l'état "Confirmé"**.

**\---**

**3\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** A2 \- Clarification Guidée Adaptative via Chat et Canvas

**Contexte Général:** Démarre après A1. ChatPanel et CanvasPanel actifs. L'agent Orchestrateur utilise sa Checklist V1 interne et les principes adaptatifs.

Scenario: Collecte adaptative et confirmation (utilisateur fournit objectif et contrainte)

**Given** l'agent Orchestrateur a posé la question initiale sur l'objectif principal (Info\_Objective\_Principal)

**When** l'utilisateur répond : "L'objectif est d'analyser les ventes T1 (produits top/flop). Budget max : 50€."

**Then** l'agent Orchestrateur doit analyser la réponse et identifier les informations pour Info\_Objective\_Principal et Info\_Contrainte\_Critique.

**And** l'agent Orchestrateur doit afficher un message de reformulation groupée et de demande de confirmation dans le ChatPanel (ex: "Ok, j'ai noté : Objectif \= Analyse ventes T1 (top/flop), Contrainte Critique \= Budget max 50€. Est-ce exact ?")

**And** le CanvasPanel doit représenter visuellement l'information "Objectif Principal" avec le texte reformulé et un état logique "En attente de confirmation" (ObjectiveInfoDisplay).

**And** le CanvasPanel doit représenter visuellement l'information "Contraintes Critiques" (Budget) avec le texte reformulé et un état logique "En attente de confirmation" (ConstraintsInfoDisplay).

**And** la réponse de l'agent doit apparaître en moins de 5 secondes (NFR Réactivité Agent).

**When** l'utilisateur confirme (ex: "Oui")

**Then** l'agent Orchestrateur doit accuser réception dans le ChatPanel.

**And** l'état logique des informations "Objectif Principal" et "Contraintes Critiques" doit passer à "Confirmé" sur le CanvasPanel.

**And** l'agent Orchestrateur doit utiliser l'outil backend approprié pour persister l'objectif confirmé (ex: UpdateMissionPropertiesTool(missionID, {objective: "..."})).

**And** l'agent Orchestrateur doit utiliser l'outil backend approprié pour persister la contrainte confirmée (ex: UpdateMissionPropertiesTool(missionID, {constraints: {maxBudget: 50}})).

**And** l'agent Orchestrateur doit ensuite analyser sa checklist interne et poser une question ciblée sur la prochaine information manquante du Noyau Dur V1 (ex: Info\_Livrable\_Cle).

Scenario: Gestion d'une réponse utilisateur ambiguë (avec boucle de clarification limitée et directive)

**Given** l'agent Orchestrateur a demandé le livrable clé (Info\_Livrable\_Cle)

**When** l'utilisateur répond "Un truc bien"

**Then** l'agent Orchestrateur doit poser une question de clarification spécifique (ex: "Pouvez-vous préciser la forme de ce 'truc bien' ? Un rapport texte ? Un tableau de données ? Un script ?")

**When** l'utilisateur répond à nouveau de manière ambiguë (ex: "Le résultat quoi")

**Then** l'agent Orchestrateur doit poser une deuxième question de clarification, en proposant des options basées sur l'objectif (ex: "Pour l'analyse des ventes, préférez-vous : A) Un rapport Markdown synthétique, B) Un fichier CSV avec les produits classés, C) Autre format ?")

**When** l'utilisateur répond encore de manière ambiguë (3ème tentative)

**Then** l'agent Orchestrateur doit indiquer qu'il ne peut pas clarifier ce point et doit proposer une action directive (ex: "Je ne parviens pas à définir le livrable précis. Pourriez-vous décrire le format exact du résultat que vous attendez ? Ou préférez-vous que nous notions 'Format à définir' pour l'instant et passions à la suite ?") (NFR Robustesse Dialogue \- Limite de 2 clarifications).

**And** aucune information sur le livrable ne doit être marquée comme "Confirmée" sur le CanvasPanel ni persistée tant que ce n'est pas clarifié ou accepté comme "à définir".

Scenario: Modification d'une information précédemment confirmée (adaptatif)

**Given** Info\_Objective\_Principal ("Analyser ventes T1") est confirmé sur le CanvasPanel et persisté

**And** l'agent Orchestrateur demande le contexte (Info\_Context, non V1 mais pour exemple)

**When** l'utilisateur dit : "En fait, l'objectif c'est T1+T2."

**Then** l'agent Orchestrateur doit identifier la demande de modification sur Info\_Objective\_Principal.

**And** l'agent doit demander confirmation du nouvel objectif (ex: "D'accord, le nouvel objectif est donc l'analyse des ventes T1 ET T2. Est-ce bien cela ?")

**And** le CanvasPanel doit représenter visuellement le nouvel objectif "Analyser ventes T1+T2" avec un état logique "En
