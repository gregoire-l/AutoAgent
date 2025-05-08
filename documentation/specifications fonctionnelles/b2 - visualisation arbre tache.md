# **Spécification Fonctionnelle V1 \- B2: Visualisation Arbre Tâches**

Date de Dernière Modification : 2025-05-01

Statut : Approuvé

**\---**

**1\. User Story**

En tant qu' **Utilisateur AutoAgent V1**,

Je veux pouvoir visualiser la structure hiérarchique des tâches d'une mission sous forme d'arbre ou de graphe interactif sur le Canvas,

Afin de comprendre comment la mission est décomposée, voir les dépendances (implicites par la hiérarchie V1), suivre l'état d'avancement de chaque tâche, et naviguer facilement dans la structure du projet pour analyse ou débogage.

**1.1 Contexte et Rôle V1**

Cette fonctionnalité fournit la **vue structurelle fondamentale** de la décomposition d'une mission. Pour la V1, elle est conçue pour offrir une compréhension claire de la hiérarchie et permettre une navigation basique. Elle **n'est pas optimisée** pour le suivi en temps réel très pertinent de missions extrêmement larges ou dynamiques, qui nécessitera des vues complémentaires (ex: Tableau de Bord) dans des versions ultérieures. Son utilité principale en V1 est la **compréhension structurelle et le support au débogage**.

**\---**

**2\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** B2 \- Visualisation de l'Arbre des Tâches (Interactif basique)

**Contexte Général:** L'utilisateur a sélectionné une mission spécifique (depuis B1) et la vue détaillée "Chat \+ Canvas" est affichée. Le Canvas contient une zone dédiée à l'arbre des tâches (TaskTreeCanvas).

Scenario: Affichage réussi de l'arbre des tâches d'une mission

**Given** la mission sélectionnée "Mission Alpha" contient plusieurs tâches (:Task) liées hiérarchiquement via \[:IS\_CHILD\_OF\] dans Neo4j

**And** chaque tâche a un nom (taskName) et un statut (status)

**When** la vue détaillée de "Mission Alpha" est chargée

**Then** la zone TaskTreeCanvas doit afficher une représentation visuelle de l'arbre des tâches.

**And** chaque nœud (TaskNode) dans l'arbre doit correspondre à une tâche et afficher au minimum son nom (TaskNode:Name).

**And** chaque nœud (TaskNode) doit afficher un indicateur visuel distinct de son statut actuel (ex: badge coloré/icône pour QUEUED, IN\_PROGRESS, DONE, FAILED...) (TaskNode:StatusIndicator).

**And** les relations parent-enfant (:IS\_CHILD\_OF) doivent être représentées par des connexions visuelles (TaskConnection) entre les nœuds correspondants.

**And** le rendu initial de l'arbre (pour \~50 nœuds) doit s'afficher en moins de 3 secondes (NFR Performance).

Scenario: Interaction \- Réduire (Collapse) un nœud parent

**Given** l'arbre des tâches est affiché pour "Mission Alpha"

**And** le nœud "T2: Design Maquettes" (TaskNode) a des enfants visibles ("T3", "T4")

**And** le nœud "T2" affiche un contrôle visuel pour réduire/étendre (TaskNode:CollapseToggle)

**When** l'utilisateur clique sur le contrôle de réduction du nœud "T2"

**Then** les nœuds enfants directs ("T3", "T4") et leurs descendants doivent devenir visuellement masqués.

**And** le nœud "T2" doit rester visible.

**And** l'indicateur du contrôle (TaskNode:CollapseToggle) sur "T2" doit changer pour indiquer qu'il est réduit (ex: icône '+').

**And** l'action doit être fluide (\< 0.5s) (NFR Réactivité).

Scenario: Interaction \- Étendre (Expand) un nœud parent réduit

**Given** l'arbre des tâches est affiché pour "Mission Alpha"

**And** le nœud "T2: Design Maquettes" est réduit et ses enfants ("T3", "T4") sont masqués

**And** le nœud "T2" affiche un contrôle visuel indiquant qu'il est réduit (TaskNode:ExpandToggle)

**When** l'utilisateur clique sur le contrôle d'extension du nœud "T2"

**Then** les nœuds enfants directs ("T3", "T4") doivent redevenir visibles.

**And** l'état d'expansion/réduction des enfants ("T3", "T4") doit être restauré (s'ils étaient eux-mêmes réduits/étendus précédemment).

**And** l'indicateur du contrôle (TaskNode:ExpandToggle) sur "T2" doit changer pour indiquer qu'il est étendu (ex: icône '-').

**And** l'action doit être fluide (\< 0.5s) (NFR Réactivité).

Scenario: Interaction \- Zoomer/Dézoomer sur l'arbre

**Given** l'arbre des tâches est affiché sur le TaskTreeCanvas

**When** l'utilisateur utilise un mécanisme de zoom standard (ex: molette de la souris, geste pinch-to-zoom sur écran tactile) sur la zone TaskTreeCanvas

**Then** la vue de l'arbre des tâches doit zoomer ou dézoomer de manière fluide et centrée sur le curseur/point de pincement.

**And** le niveau de zoom doit être limité à des bornes raisonnables (pour éviter un dézoom/zoom excessif).

**And** l'interaction doit être fluide (NFR Réactivité).

Scenario: Interaction \- Se déplacer (Panoramique) dans l'arbre

**Given** l'arbre des tâches est affiché et potentiellement plus grand que la zone visible du TaskTreeCanvas

**When** l'utilisateur effectue un cliquer-glisser (drag) sur l'arrière-plan du TaskTreeCanvas (ou utilise les barres de défilement si présentes)

**Then** la vue de l'arbre doit se déplacer (panoramique) de manière fluide dans la direction du glissement.

**And** l'interaction doit être fluide (NFR Réactivité).

Scenario: Interaction \- Sélectionner un nœud de tâche

**Given** l'arbre des tâches est affiché

**And** le nœud "T3: Développement Front" (TaskNode) est visible

**When** l'utilisateur clique sur le nœud "T3"

**Then** une indication visuelle doit montrer que "T3" est sélectionné (ex: bordure différente, changement de fond).

**And** l'action doit déclencher l'affichage des détails de la tâche "T3" (comportement défini dans la fonctionnalité B3).

Scenario: Gestion de l'erreur lors du chargement des données de l'arbre

**Given** l'utilisateur a sélectionné une mission "Mission Erreur"

**When** le frontend tente de charger les données des tâches depuis le backend (via Outil LLM/API) et une erreur se produit (ex: ERR\_NEO4J\_QUERY\_ERROR)

**Then** la zone TaskTreeCanvas doit afficher un message d'erreur clair et concis (ex: "Erreur lors du chargement de l'arbre des tâches.").

**And** aucun nœud ou connexion ne doit être affiché.

**And** l'interface globale doit rester stable.

**\---**

**3\. Références UI**

* **Wireframe(s) Associé(s):**  
  * Wireframe\_TaskTreeCanvas\_V1.png (Montrant la zone dédiée, un exemple de nœuds (TaskNode) avec indicateur de statut (StatusIndicator) et contrôle expand/collapse (CollapseToggle/ExpandToggle), et les connexions (TaskConnection)).  
* **Éléments Clés Référencés (Logiques):**  
  * TaskTreeCanvas: La zone du Canvas dédiée à l'affichage de l'arbre.  
  * TaskNode: La représentation visuelle d'un nœud :Task.  
  * TaskNode:Name: Affichage du nom de la tâche sur le nœud.  
  * TaskNode:StatusIndicator: Indicateur visuel du statut de la tâche sur le nœud.  
  * TaskNode:CollapseToggle/ExpandToggle: Contrôle interactif pour réduire/étendre le nœud.  
  * TaskConnection: La ligne ou flèche visuelle représentant la relation parent-enfant.  
  * TaskTreeCanvas:ErrorMessage: Zone d'affichage pour les erreurs de chargement de l'arbre.

**\---**

**4\. Considérations Non Fonctionnelles (V1)**

* **Performance :** Rendu initial rapide (\< 3s pour \~50 nœuds). Interactions (zoom, pan, expand/collapse) fluides et réactives (\< 0.5s). La bibliothèque frontend choisie (ex: React Flow) doit être implémentée en suivant ses bonnes pratiques de performance (mémoïsation...).  
* **Lisibilité :** L'arbre doit rester lisible même avec un nombre modéré de nœuds. Les informations clés (nom, statut) doivent être claires.

\-----
