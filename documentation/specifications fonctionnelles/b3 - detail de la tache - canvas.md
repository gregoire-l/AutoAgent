# **Fonctionnalité : B3 \- Détails de la Tâche (Affichage Canvas)**

Date de Dernière Modification : 2025-05-01

Statut : Approuvé

**\---**

**1\. User Story**

**En tant qu'** Utilisateur AutoAgent V1,

**Je veux** pouvoir sélectionner une tâche spécifique dans la visualisation de l'arbre (B2) et voir ses détails complets s'afficher dans une zone dédiée du Canvas,

**Afin de** comprendre précisément le statut, le contexte, les dépendances, l'agent assigné et les résultats (artefacts) associés à cette tâche.

**\---**

**2\. Préconditions**

* L'utilisateur est dans la vue détaillée d'une mission (Chat \+ Canvas).  
* La visualisation de l'arbre des tâches (B2) est affichée sur le TaskTreeCanvas.

**\---**

**3\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** B3 \- Détails de la Tâche (Affichage Canvas)

**Contexte Général:** L'utilisateur interagit avec l'arbre des tâches sur le Canvas. Une zone dédiée (TaskDetailsPanel) existe sur le Canvas pour afficher les détails de la tâche sélectionnée.

Scenario: Affichage réussi des détails d'une tâche sélectionnée

**Given** l'arbre des tâches de la mission "Mission Alpha" est affiché sur le TaskTreeCanvas

**And** la tâche "T3: Développement Front" (TaskNode) est visible

**And** la tâche "T3" a les propriétés suivantes dans Neo4j : statut='IN\_PROGRESS', agent='AgentDevFront', parent='T2', dépend de='T4', produit l'artefact 'artifact-frontend-code', consomme 'artifact-maquette-ui'

**When** l'utilisateur clique sur le nœud "T3" (TaskNode) dans l'arbre

**Then** la zone TaskDetailsPanel doit devenir visible ou mise à jour.

**And** un indicateur de chargement doit s'afficher brièvement dans le TaskDetailsPanel pendant la récupération des données.

**And** le TaskDetailsPanel doit ensuite afficher les informations clés de la tâche "T3", incluant au minimum :

\* Son ID (TaskDetails:ID)

\* Son Nom (si défini) (TaskDetails:Name)

\* Sa Description complète (TaskDetails:Description)

\* Son Statut actuel (TaskDetails:Status)

\* L'ID de l'Agent Assigné (s'il y en a un) (TaskDetails:AgentID)

\* L'ID de la Tâche Parente (TaskDetails:ParentID)

\* La liste des IDs des Dépendances (tâches dont T3 dépend) (TaskDetails:DependenciesList)

\* La liste des IDs des Artefacts Produits (TaskDetails:ProducedArtifactsList)

\* La liste des IDs des Artefacts Consommés (TaskDetails:ConsumedArtifactsList)

\* Le Livrable Attendu (si défini) (TaskDetails:ExpectedDeliverable)

\* Les Données Résultat (si définies) (TaskDetails:ResultData)

\* Les Timestamps (Création, MàJ) (TaskDetails:Timestamps)

**And** les IDs listés dans TaskDetails:ProducedArtifactsList et TaskDetails:ConsumedArtifactsList doivent être des liens cliquables.

**And** l'affichage des détails doit apparaître en moins de 1.5 seconde après le clic (NFR Performance).

Scenario: Affichage des détails d'une tâche sans certaines informations optionnelles

**Given** l'utilisateur sélectionne la tâche "T5: Documentation" qui n'a pas de nom court, pas d'agent assigné, et n'a pas encore produit d'artefact

**When** les détails de "T5" sont affichés dans le TaskDetailsPanel

**Then** les champs correspondants aux informations absentes (Nom, Agent Assigné, Artefacts Produits) ne doivent pas s'afficher ou indiquer clairement "N/A".

**And** les autres informations présentes (ID, Description, Statut...) doivent s'afficher correctement.

Scenario: Gestion d'une liste longue d'éléments liés (ex: Artefacts Produits)

**Given** l'utilisateur sélectionne la tâche "T6: Génération Massive Logs" qui a produit 50 artefacts de log

**When** les détails de "T6" sont affichés dans le TaskDetailsPanel

**Then** la liste TaskDetails:ProducedArtifactsList doit afficher un nombre limité d'artefacts (ex: les 3 ou 5 premiers).

**And** un contrôle (ex: lien "Voir tout" ou bouton "+ ...") doit être présent pour permettre à l'utilisateur d'afficher la liste complète (potentiellement dans une modale ou une vue étendue).

Scenario: Cliquer sur un lien d'artefact

**Given** les détails de la tâche "T3" sont affichés dans le TaskDetailsPanel

**And** la liste TaskDetails:ProducedArtifactsList contient un lien cliquable pour "artifact-frontend-code" (ArtifactLink)

**When** l'utilisateur clique sur le lien "artifact-frontend-code"

**Then** l'action doit déclencher l'affichage du contenu de cet artefact (comportement défini dans la fonctionnalité C3).

Scenario: Gestion de l'erreur lors de la récupération des détails de la tâche

**Given** l'utilisateur clique sur le nœud "T7: Tâche Buggée" dans l'arbre (TaskNode)

**When** le frontend tente de récupérer les détails de "T7" depuis le backend et une erreur se produit (ex: ERR\_NEO4J\_NODE\_NOT\_FOUND ou ERR\_NEO4J\_QUERY\_ERROR)

**Then** la zone TaskDetailsPanel doit afficher un message d'erreur clair et concis (ex: "Erreur lors du chargement des détails de la tâche.").

**And** aucune information de tâche ne doit être affichée (à part potentiellement l'ID demandé).

**And** l'interface globale doit rester stable.

**\---**

**4\. Références UI**

* **Wireframe(s) Associé(s):**  
  * Wireframe\_TaskDetailsPanel\_V1.png (Montrant la zone dédiée sur le Canvas, avec la disposition des informations clés, l'affichage des listes et les liens cliquables).  
* **Éléments Clés Référencés (Logiques):**  
  * TaskTreeCanvas: Zone de l'arbre où la sélection a lieu.  
  * TaskNode: Nœud cliquable dans l'arbre.  
  * TaskDetailsPanel: La zone (ex: panneau latéral, section dédiée du canvas) où les détails s'affichent.  
  * TaskDetails:ID, TaskDetails:Name, TaskDetails:Description, TaskDetails:Status, TaskDetails:AgentID, TaskDetails:ParentID, TaskDetails:DependenciesList, TaskDetails:ProducedArtifactsList, TaskDetails:ConsumedArtifactsList, TaskDetails:ExpectedDeliverable, TaskDetails:ResultData, TaskDetails:Timestamps: Zones spécifiques affichant les propriétés correspondantes.  
  * ArtifactLink: Un lien cliquable représentant un artefact dans les listes.  
  * TaskDetailsPanel:LoadingIndicator: Indicateur affiché pendant le chargement.  
  * TaskDetailsPanel:ErrorMessage: Zone d'affichage pour les erreurs de chargement des détails.

**\---**

**5\. Considérations Non Fonctionnelles (V1)**

* **Performance :** Chargement et affichage rapides des détails (\< 1.5s après clic).  
* **Clarté :** Les informations doivent être présentées de manière claire et bien organisée. Les listes (artefacts, dépendances) doivent être faciles à parcourir.  
* **Cohérence :** L'information affichée doit être cohérente avec les données réelles dans Neo4j.

**\---**

**6\. Termes du Glossaire Associés**

* Tâche  
* Statut (Tâche)  
* Canvas  
* Arbre des Tâches  
* Nœud (Graphe)  
* Relation (Graphe)  
* Artefact  
* Agent  
* Dépendance
