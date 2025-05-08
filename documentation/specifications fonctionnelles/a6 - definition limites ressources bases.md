# **Fonctionnalité : A6 \- Définition Limites Ressources (Base)**

Date de Dernière Modification : 2025-05-01

Statut : Approuvé

**\---**

**1\. User Story**

En tant qu'Utilisateur AutoAgent V1,

Je veux pouvoir spécifier des limites de ressources de base (durée maximale, budget maximal, nombre maximal de tokens LLM) pour une mission lors de sa phase de clarification,

Afin de pouvoir contrôler les coûts et le temps d'exécution de la mission par les agents.

**\---**

**2\. Préconditions**

* La phase de Clarification Guidée (A2) est en cours.  
* L'agent Orchestrateur collecte les informations de la Checklist V1, qui inclut Info\_Contrainte\_Critique.

**\---**

**3\. Critères d'Acceptation (Scénarios Gherkin)**

**Feature:** A6 \- Définition Limites Ressources (Base)

**Contexte Général:** L'utilisateur dialogue avec l'agent Orchestrateur (A2). Le Canvas affiche les informations de la mission en cours de définition.

**Scénario : Spécification réussie d'une limite de budget**

***Given*** l'agent Orchestrateur a demandé les contraintes critiques (Info\_Contrainte\_Critique)

***When*** l'utilisateur répond en spécifiant une limite de budget (ex: "Le budget total ne doit pas dépasser 100 euros.")

***Then*** l'agent Orchestrateur doit analyser la réponse et identifier la contrainte maxBudget.

***And*** l'agent Orchestrateur doit afficher un message de reformulation et de demande de confirmation dans le ChatPanel (ex: "Compris, j'enregistre une contrainte de budget maximum de 100€. Est-ce exact ?").

***And*** le CanvasPanel doit afficher/mettre à jour la zone des contraintes (ConstraintsInfoDisplay) avec "Budget Max: 100€" et un état logique "En attente de confirmation".

***When*** l'utilisateur confirme

***Then*** l'agent Orchestrateur doit accuser réception dans le ChatPanel.

***And*** l'état logique de la contrainte de budget doit passer à "Confirmé" sur le CanvasPanel.

***And*** l'agent Orchestrateur doit utiliser l'outil backend approprié pour persister la contrainte confirmée (ex: UpdateMissionPropertiesTool(missionID, {constraints: {maxBudget: 100}})).

**Scénario : Spécification réussie de plusieurs limites (durée et tokens)**

***Given*** l'agent Orchestrateur a demandé les contraintes critiques

***When*** l'utilisateur répond : "La mission ne doit pas durer plus de 2 heures et utiliser au maximum 50000 tokens."

***Then*** l'agent Orchestrateur doit identifier les contraintes maxDurationSeconds (7200) et maxTokens (50000).

***And*** l'agent doit demander confirmation pour ces deux limites dans le ChatPanel.

***And*** le CanvasPanel doit afficher ces deux limites avec l'état "En attente de confirmation".

***When*** l'utilisateur confirme

***Then*** l'agent doit accuser réception.

***And*** l'état logique des deux limites doit passer à "Confirmé" sur le CanvasPanel.

***And*** l'agent doit utiliser l'outil backend approprié pour persister ces contraintes (ex: UpdateMissionPropertiesTool(missionID, {constraints: {maxDurationSeconds: 7200, maxTokens: 50000}})).

**Scénario : L'utilisateur ne spécifie aucune limite de ressource**

***Given*** l'agent Orchestrateur a demandé les contraintes critiques

***When*** l'utilisateur répond sans mentionner de limite de durée, budget ou tokens (ex: "Pas de contrainte particulière, mais il faut utiliser l'API X.")

***Then*** l'agent Orchestrateur doit accuser réception des autres contraintes (si présentes).

***And*** l'agent doit confirmer explicitement l'absence de limites de ressources (ex: "Noté. Je ne définis donc pas de limite spécifique de durée, de budget ou de tokens pour cette mission. Est-ce correct ?").

***When*** l'utilisateur confirme l'absence de limites

***Then*** l'agent doit accuser réception.

***And*** aucune limite de ressource ne doit être affichée sur le CanvasPanel (ou indiquer "Aucune").

***And*** l'agent doit utiliser l'outil backend pour s'assurer que les propriétés correspondantes sont nulles ou non définies (ex: UpdateMissionPropertiesTool(missionID, {constraints: {maxBudget: null, ...}})).

**Scénario : Tentative de spécifier une limite avec un format invalide**

***Given*** l'agent Orchestrateur a demandé les contraintes critiques

***When*** l'utilisateur répond : "Budget max : beaucoup" ou "Durée max : \-10 minutes"

***Then*** l'agent Orchestrateur doit détecter que la valeur fournie n'est pas un nombre valide ou est négative.

***And*** l'agent doit demander une clarification dans le ChatPanel, en précisant le format attendu (ex: "Je n'ai pas compris la limite de budget. Pourriez-vous spécifier un montant numérique ?").

***And*** aucune limite invalide ne doit être proposée pour confirmation ou affichée sur le CanvasPanel.

**Scénario : Modification d'une limite précédemment définie**

***Given*** la contrainte maxBudget: 100€ est confirmée et affichée sur le CanvasPanel

***And*** la clarification A2 est toujours en cours

***When*** l'utilisateur dit : "Finalement, le budget maximum est de 200€."

***Then*** l'agent Orchestrateur doit identifier la demande de modification.

***And*** l'agent doit demander confirmation pour la nouvelle limite (ex: "D'accord, nous passons le budget maximum à 200€. Est-ce bien cela ?").

***And*** le CanvasPanel doit afficher "Budget Max: 200€" avec l'état "En attente de confirmation".

***When*** l'utilisateur confirme

***Then*** l'agent doit accuser réception.

***And*** l'état logique doit passer à "Confirmé" sur le CanvasPanel.

***And*** l'agent doit utiliser l'outil backend pour mettre à jour la contrainte (ex: UpdateMissionPropertiesTool(missionID, {constraints: {maxBudget: 200}})).

**\---**

**4\. Références UI**

* **Wireframe(s) Associé(s):**  
  * Wireframe\_ChatCanvas\_Definition\_V1.png (Montrant la zone ConstraintsInfoDisplay sur le Canvas affichant les limites définies et leur statut).  
* **Éléments Clés Référencés (Logiques):**  
  * ChatPanel: Zone de chat où l'utilisateur spécifie les limites.  
  * CanvasPanel: Canvas affichant les informations.  
  * ConstraintsInfoDisplay: Zone/Carte sur le Canvas affichant les limites de ressources confirmées ou en attente.

**\---**

**5\. Considérations Non Fonctionnelles (V1)**

* **Validation :** La validation des formats numériques et des valeurs positives doit être robuste (côté agent et/ou outil backend).  
* **Clarté :** L'affichage des limites sur le Canvas doit être clair et non ambigu.  
* **Enforcement (Hors Scope V1) :** Cette spécification couvre uniquement la *définition* des limites. L'application *effective* de ces limites pendant l'exécution de la mission (par Temporal ou les agents) est une fonctionnalité distincte et plus complexe, reportée après la V1.

**\---**

**6\. Termes du Glossaire Associés**

* Mission  
* Agent Orchestrateur  
* Chat  
* Canvas  
* Contrainte  
* Limite de Ressources
