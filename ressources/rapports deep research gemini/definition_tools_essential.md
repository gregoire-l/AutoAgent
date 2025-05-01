# **Définition des Outils LLM Essentiels (Go) pour AutoAgent V1**

## **1\. Introduction**

### **1.1. Objectif et Périmètre**

Ce rapport a pour objectif de définir l'ensemble minimaliste mais fonctionnel d'outils logiciels, implémentés en langage Go, nécessaires aux agents basés sur des Large Language Models (LLMs) du système AutoAgent V1. Ces outils permettront aux agents d'interagir de manière sécurisée, fiable et testable avec les services principaux de l'infrastructure backend : la base de données graphe Neo4j, le système de stockage d'objets compatible S3 (MinIO), et l'environnement d'exécution sécurisé gVisor.

L'ensemble d'outils proposé est spécifiquement conçu pour couvrir les fonctionnalités "Must-Have" identifiées pour la version V1 d'AutoAgent, en privilégiant la simplicité et la robustesse pour cette première itération. Le périmètre de ce document se limite strictement aux outils d'interaction backend pour Neo4j (gestion de l'état des missions et tâches), S3 (stockage et récupération d'artefacts), et gVisor (exécution de scripts en sandbox). Les interactions avec le frontend React, les protocoles de communication inter-agents, ou d'autres services non mentionnés sont hors périmètre.

### **1.2. Aperçu des Systèmes Cibles**

* **Neo4j (Community Edition):** Sert de base de données centrale pour AutoAgent V1. Elle stocke l'état dynamique du système sous forme de graphe, modélisant les entités clés telles que les Missions, les Tâches (avec leur hiérarchie et leurs dépendances), les Agents affectés, et les métadonnées des Artefacts produits. Toutes les interactions avec Neo4j s'effectueront via des requêtes Cypher, exécutées par l'intermédiaire du driver Go officiel pour Neo4j v5.1  
* **Stockage Compatible S3 (MinIO):** Utilisé pour le stockage persistant des artefacts immuables générés par les agents lors de l'exécution des tâches. Ces artefacts peuvent inclure des fichiers journaux (logs), du code source, des documents textuels, ou d'autres fichiers binaires. L'interaction se fera via l'AWS SDK for Go v2, configuré pour cibler le point d'accès S3 compatible (MinIO).3  
* **gVisor (via runsc):** Fournit un environnement d'exécution sécurisé (sandbox) basé sur un noyau applicatif pour exécuter des scripts potentiellement non fiables ou générés par les LLMs (par exemple, Python, Bash, Go). gVisor intercepte les appels système pour isoler l'exécution du script du système d'exploitation hôte, réduisant ainsi drastiquement la surface d'attaque et prévenant les évasions de sandbox.5 L'interaction avec gVisor impliquera probablement l'orchestration de l'exécutable runsc via une couche d'abstraction en Go.7

### **1.3. Importance d'Outils Bien Définis pour les Agents LLM**

Les LLMs, bien que puissants, interagissent avec des systèmes externes différemment des composants logiciels traditionnels. Ils sont sensibles à l'ambiguïté et nécessitent des instructions extrêmement claires pour fonctionner correctement.11 De plus, ils peuvent être sujets à des manipulations via des techniques comme l'injection de prompt (un risque identifié comme LLM01 par l'OWASP Top 10 for LLM Applications), où des entrées malveillantes peuvent les amener à utiliser des outils de manière non prévue ou dangereuse.12

Par conséquent, la conception des "outils" (fonctions Go) que les LLMs peuvent appeler est d'une importance capitale. Ces outils constituent l'Interface Agent-Ordinateur (Agent-Computer Interface \- ACI).11 Une ACI bien conçue est essentielle non seulement pour l'efficacité de l'agent (lui permettre d'accomplir ses tâches) mais aussi pour la sécurité et la fiabilité globales du système AutoAgent. Des outils mal définis, peu clairs, ou manquant de contrôles de sécurité robustes peuvent entraîner des erreurs, des comportements imprévisibles, et des vulnérabilités critiques.

## **2\. Principes de Conception Fondamentaux pour les Outils LLM d'AutoAgent**

La conception des outils LLM pour AutoAgent V1 repose sur un ensemble de principes fondamentaux dérivés des meilleures pratiques en matière de conception d'API, de sécurité applicative, de développement logiciel et des spécificités liées aux agents LLM.

### **2.1. Synthèse des Principes Directeurs**

Les principes suivants guideront la définition de chaque outil :

1. **Simplicité et Atomicité:** Chaque outil doit réaliser une action logique unique et bien définie.  
2. **Clarté et Expliciteté:** Les descriptions et signatures des outils doivent être parfaitement claires pour la consommation par les LLMs.  
3. **Sécurité par Conception:** La sécurité doit être intégrée dès la conception, en anticipant les risques spécifiques aux LLMs (notamment ceux listés par l'OWASP).  
4. **Testabilité:** Les outils doivent être conçus pour être facilement testables unitairement, en favorisant une approche TDD (Test-Driven Development).

### **2.2. Simplicité et Atomicité**

Chaque outil doit encapsuler une seule opération logique atomique. Il faut éviter de créer des outils trop larges qui effectuent plusieurs actions distinctes et potentiellement indépendantes (par exemple, "créer une tâche, l'assigner et stocker un log initial"). Inversement, des outils trop fins nécessiteraient un nombre excessif d'appels de la part du LLM pour accomplir une tâche simple, augmentant la latence et la complexité de la logique de l'agent.11 L'objectif est de trouver un équilibre où chaque outil correspond à une intention logique claire de l'agent (par exemple, "créer une tâche", "récupérer les détails d'une tâche").

Cette approche simplifie le raisonnement requis de la part du LLM pour utiliser l'outil correctement. Elle réduit la probabilité d'erreurs lors de l'enchaînement de multiples étapes par l'agent et rend chaque outil plus facile à sécuriser et à tester individuellement.15 L'atomicité contribue également à limiter la portée des actions possibles lors d'un seul appel d'outil, ce qui aide à mitiger les risques liés à une "agence excessive" (LLM08), où un LLM pourrait abuser d'un outil aux capacités trop étendues.13 Les principes de conception RESTful, qui préconisent des actions ciblées sur des ressources spécifiques, offrent une analogie pertinente.15 L'importance de la simplicité dans la conception globale des agents est également soulignée par des recherches sur les agents efficaces.11

### **2.3. Clarté et Expliciteté (pour la Consommation par le LLM)**

La clarté est primordiale lors de la définition des outils destinés aux LLMs. Le nom de la fonction Go, les noms des paramètres, et surtout la description fournie (qui servira de "docstring" pour le LLM) doivent être exceptionnellement précis, sans ambiguïté et riches en détails.11

La description doit expliquer clairement :

* **L'objectif** de l'outil : Que fait-il?  
* **Quand l'utiliser** : Dans quel contexte ou pour quelle intention l'agent doit-il choisir cet outil?  
* **La signification de chaque paramètre** : Qu'attend-on comme valeur? Quelles sont les contraintes (format, type, valeurs possibles pour les énumérations)?  
* **Les valeurs de retour** : Que signifient les valeurs retournées en cas de succès? Quels types d'erreurs peuvent survenir et que signifient-elles?  
* **Préconditions et Postconditions** (si pertinent) : Que doit être vrai avant d'appeler l'outil? Quel sera l'état du système après un appel réussi?  
* **Effets de bord** : L'outil modifie-t-il l'état du système?

Les LLMs s'appuient massivement sur ces descriptions textuelles pour comprendre comment et quand utiliser un outil. Toute imprécision peut conduire à une mauvaise utilisation, à des erreurs fonctionnelles ou à des failles de sécurité. Une bonne pratique consiste à rédiger la description comme si elle était destinée à un développeur junior, en incluant des exemples d'utilisation, en clarifiant les cas limites, les exigences de formatage des entrées et les frontières avec d'autres outils similaires.11 Cette exigence de clarté rejoint les principes généraux de bonne conception d'API qui insistent sur l'importance d'une documentation complète et compréhensible.15

### **2.4. Sécurité par Conception (Focus OWASP LLM)**

La sécurité ne peut être une réflexion après coup ; elle doit être intégrée nativement dans la conception de chaque outil. Les outils agissent comme une passerelle critique entre le LLM, potentiellement non fiable ou manipulable, et les systèmes backend sensibles.

* **Principe Fondamental:** Traiter toutes les données fournies par le LLM comme non fiables. Mettre en œuvre des mécanismes de validation et de nettoyage robustes pour les entrées et les sorties. Appliquer le principe du moindre privilège pour les permissions accordées aux outils. Concevoir activement contre les vulnérabilités connues des LLMs.  
* **Justification:** Les LLMs peuvent être la cible d'attaques spécifiques comme l'injection de prompt (LLM01 12), où un attaquant manipule les entrées pour détourner le comportement de l'agent et de ses outils. De plus, les LLMs peuvent générer des sorties dangereuses (LLM02 Insecure Output Handling 12) qui, si elles ne sont pas correctement traitées par les outils ou le système appelant, peuvent entraîner des vulnérabilités en aval (XSS, RCE, etc.).  
* **Stratégies de Mitigation Clés Appliquées:**  
  * **Validation Rigoureuse des Entrées:** Chaque paramètre fourni par le LLM à un outil doit être validé :  
    * Format : Les identifiants (ex: taskID) doivent correspondre au format attendu (UUID, etc.). Les valeurs d'énumération (ex: status) doivent appartenir à un ensemble prédéfini.  
    * Contraintes : Longueurs de chaînes, plages numériques, etc.  
    * Existence : Vérifier si les identifiants référencés (ex: parentTaskID) existent réellement dans le système (ex: Neo4j) avant de les utiliser.  
    * Sanitization : Nettoyer les entrées textuelles libres pour prévenir les attaques par injection (ex: injection Cypher pour les outils Neo4j 19, injection de commande pour l'outil gVisor 20). L'utilisation systématique de requêtes paramétrées est la défense principale contre l'injection SQL/Cypher.1 Ces mesures adressent directement les risques LLM01 (Prompt Injection) et LLM07 (Insecure Plugin Design).13  
  * **Traitement Sécurisé des Sorties:** Les données retournées par un outil, ou les données générées par un LLM et traitées par un outil, doivent être validées et/ou nettoyées avant d'être transmises à d'autres composants ou renvoyées au LLM. Cela empêche l'exploitation de sorties malveillantes (LLM02).12 Il faut également filtrer toute information sensible (clés d'API, données personnelles, détails internes) qui ne devrait pas être exposée (LLM06 Sensitive Information Disclosure).13  
  * **Principe du Moindre Privilège:** Chaque outil doit fonctionner avec l'ensemble minimal de permissions requis pour accomplir sa tâche spécifique sur le système cible (rôles Neo4j spécifiques, politiques S3 restreintes, configuration restrictive du sandbox gVisor). Si des rôles d'agent sont définis, les permissions des outils pourraient potentiellement en dépendre. Cela limite l'impact potentiel en cas de compromission ou de mauvaise utilisation d'un outil (LLM01, LLM07, LLM08).13 Ce principe est un fondement de la sécurité informatique.23  
  * **Agence Limitée (Scoped Agency):** Concevoir des outils pour effectuer des actions spécifiques et bien délimitées. Éviter de créer des outils "tout-puissants" qui pourraient avoir des conséquences graves et imprévues s'ils étaient mal utilisés par le LLM (LLM08 Excessive Agency).13 Pour les actions particulièrement critiques (probablement hors périmètre V1), une confirmation humaine pourrait être nécessaire.  
  * **Limitation de Débit (Rate Limiting):** Envisager d'implémenter une limitation du nombre d'appels aux outils pour prévenir les abus et les attaques par déni de service qui viseraient à épuiser les ressources du LLM ou des systèmes backend (LLM04 Model Denial of Service).12 Cette fonctionnalité pourrait être gérée au niveau de l'orchestrateur (Temporal), mais une protection au niveau de l'interface de l'outil est une bonne pratique de défense en profondeur.  
* **Intégration des Références:** Ces stratégies s'appuient sur les recommandations de l'OWASP Top 10 for LLM Applications 12, les principes généraux de sécurité des API 15, et les pratiques de codage sécurisé en Go, notamment pour l'exécution de commandes externes.20

### **2.5. Testabilité (Approche TDD)**

La conception des outils doit intégrer la testabilité dès le départ, idéalement en suivant une approche de Développement Piloté par les Tests (TDD).

* **Principe Fondamental:** Chaque outil doit pouvoir être testé unitairement de manière isolée, rapide et fiable.  
* **Justification:** Les tests unitaires garantissent que chaque outil fonctionne comme prévu, détectent les régressions lors de modifications ultérieures, facilitent le refactoring sécurisé et améliorent la qualité globale du code. Ceci est particulièrement crucial dans un système complexe comme AutoAgent.  
* **Stratégie d'Implémentation:**  
  * **Injection de Dépendances (DI):** Les dépendances externes nécessaires aux outils (client Neo4j, client S3, service d'exécution gVisor) ne doivent pas être instanciées directement dans le code de l'outil. Elles doivent être injectées, généralement via des interfaces Go, dans le service qui héberge les fonctions d'outils.26 Cela découple l'outil de ses dépendances concrètes.  
  * **Mocks (Simulacres):** Utiliser une bibliothèque de mocking comme testify/mock 29 pour créer des versions simulées (mocks) des interfaces de dépendances. Dans les tests unitaires, ces mocks remplacent les vraies dépendances. Ils permettent de contrôler le comportement des dépendances (ex: simuler une réponse réussie ou une erreur de la base de données) et de vérifier que l'outil interagit correctement avec elles (ex: s'assurer que la bonne requête Cypher est envoyée avec les bons paramètres).31  
  * **Cas de Test Exhaustifs:** Définir une suite de tests unitaires couvrant :  
    * Le chemin nominal (succès).  
    * Les cas d'erreur dus à des entrées invalides (fournies par le LLM simulé).  
    * Les cas d'erreur dus à des défaillances simulées des dépendances externes (ex: erreur de connexion DB, objet S3 non trouvé).  
    * Les cas limites liés à la sécurité (ex: tentative d'injection dans les paramètres, validation des permissions simulées).  
* **Intégration des Références:** Cette approche s'aligne sur les meilleures pratiques de test en Go, l'utilisation de l'injection de dépendances 26 et de bibliothèques de mocking comme testify/mock.29

### **2.6. Interconnexion des Principes**

Il est important de reconnaître que ces principes de conception ne sont pas isolés mais interagissent et se renforcent mutuellement.

La nécessité de descriptions claires et explicites pour le LLM 11 oblige l'architecte à définir un contrat précis pour chaque outil : ce qu'il fait, ses entrées exactes, ses sorties attendues. Ce contrat précis est la base indispensable pour écrire des tests unitaires significatifs et complets.26 Pour rendre un outil testable unitairement, ses dépendances externes (comme un client de base de données) doivent être découplées et injectées, typiquement via des interfaces.27 L'injection de dépendances permet ensuite d'utiliser des mocks 31 pour simuler le comportement de ces dépendances en isolation.

Parallèlement, l'injection de dépendances facilite l'application du principe de moindre privilège : la dépendance réelle injectée en production peut être configurée avec des permissions minimales, et les mocks peuvent même simuler des erreurs de permission pour tester la réaction de l'outil.

De plus, le principe d'atomicité 11, qui vise à limiter chaque outil à une seule action logique, simplifie intrinsèquement la tâche de test (moins de logique à couvrir par test) et l'analyse de sécurité (surface d'attaque réduite). Un outil atomique est moins susceptible de se voir accorder une "agence excessive" (LLM08) 13, car sa portée est naturellement limitée.

En conséquence, une approche holistique, considérant simultanément la clarté pour le LLM, la sécurité, la testabilité et la simplicité/atomicité, mène à une conception d'outils plus robuste, sécurisée et maintenable que si l'on optimisait pour un seul de ces aspects isolément.

## **3\. Outils d'Interaction Neo4j**

### **3.1. Vue d'ensemble et Approche Générale**

Les outils de cette section permettent aux agents LLM d'interagir avec la base de données Neo4j pour lire et modifier l'état des Missions et des Tâches.

* **Modèle d'Interaction:** L'interaction se fera via le driver Go officiel pour Neo4j v5.1 Conformément aux meilleures pratiques, une seule instance du DriverWithContext sera créée au niveau de l'application et réutilisée.2 Des sessions (SessionWithContext) seront créées pour chaque opération ou groupe d'opérations logiques, en spécifiant explicitement la base de données cible ("neo4j" par défaut pour la Community Edition) pour éviter des requêtes de découverte superflues.1 Les sessions et le driver devront être correctement fermés (via defer) pour libérer les ressources.1  
* **Gestion des Transactions:** Pour garantir l'atomicité et la cohérence, en particulier pour les opérations d'écriture ou les lectures multi-requêtes nécessitant une vue cohérente, les transactions managées (Session.ExecuteRead, Session.ExecuteWrite) sont préconisées.1 Elles offrent l'avantage de tentatives automatiques en cas d'erreurs serveur transitoires. Les opérations de lecture simple pourront utiliser neo4j.ExecuteQuery pour plus de simplicité, mais ExecuteRead est préférable pour bénéficier du routage potentiel vers les nœuds lecteurs dans un cluster (même si V1 est mono-nœud, c'est une bonne pratique).1  
* **Paramétrisation Systématique:** Toute requête Cypher exécutée par ces outils **doit** utiliser des paramètres (ex: $taskID, $newStatus) pour injecter les valeurs fournies par le LLM (après validation). C'est la mesure de sécurité essentielle pour prévenir les injections Cypher.1 La concaténation de chaînes pour construire des requêtes est strictement interdite.  
* **Gestion des Erreurs:** Les outils doivent intercepter et gérer les erreurs potentielles provenant du driver (connexion, session), de l'exécution des requêtes (syntaxe, contraintes violées, nœud non trouvé), et retourner des objets error clairs et informatifs à la couche appelante (le framework de l'agent).  
* **Injection de Dépendances et Mocking:** Pour la testabilité, le neo4j.DriverWithContext (ou une interface le représentant) sera injecté dans le service Go contenant ces outils.1 Les tests unitaires utiliseront testify/mock 31 pour simuler l'interface du driver/session, permettant de vérifier la génération correcte des requêtes Cypher, l'utilisation des paramètres, et la gestion des réponses ou erreurs simulées de la base de données.

### **3.2. Tableau Récapitulatif des Outils Neo4j Essentiels (V1)**

Ce tableau fournit une référence rapide des opérations Neo4j fondamentales nécessaires pour les fonctionnalités V1 de gestion des tâches et missions. La sélection de ces outils découle de l'analyse des besoins V1 : créer et suivre des tâches simples, gérer leur hiérarchie et leurs dépendances basiques, les assigner, et lier les artefacts produits.

| Nom de l'Outil (Go) | Objectif Principal | Entrées Clés | Sorties Clés | Types Nœuds/Relations Cibles |
| :---- | :---- | :---- | :---- | :---- |
| CreateTaskNode | Créer un nouveau nœud :Task. | parentTaskID (ou missionID), description | newTaskID | :Task, :HAS\_CHILD (ou :PART\_OF\_MISSION) |
| GetTaskDetails | Récupérer les informations détaillées d'un nœud :Task. | taskID | TaskInfo (struct) | :Task, relations sortantes/entrantes pertinentes |
| UpdateTaskStatus | Mettre à jour la propriété status d'un nœud :Task. | taskID, newStatus (enum) | error | :Task (propriété status) |
| ListChildTasks | Lister les identifiants ou informations de base des tâches enfants d'une tâche. | parentTaskID | string (IDs) ou TaskInfo | :Task, :HAS\_CHILD |
| AddChildTaskRelationship | Créer une relation :HAS\_CHILD entre deux nœuds :Task. | parentTaskID, childTaskID | error | :Task, :HAS\_CHILD |
| AddDependencyRelationship | Créer une relation :DEPENDS\_ON entre deux nœuds :Task. | dependentTaskID, dependencyTaskID | error | :Task, :DEPENDS\_ON |
| CheckTaskDependencies | Vérifier si toutes les dépendances d'une tâche sont satisfaites (ex: 'Completed'). | taskID | bool (all\_satisfied), error | :Task, :DEPENDS\_ON |
| AssignAgentToTask | Créer/Mettre à jour une relation :ASSIGNED\_TO vers un nœud :Agent. | taskID, agentID | error | :Task, :Agent, :ASSIGNED\_TO |
| LinkArtifactToTask | Créer une relation :PRODUCES\_ARTIFACT vers un nœud :Artifact (ou stocker path). | taskID, artifactPath (ou artifactID) | error | :Task, :Artifact (ou prop), :PRODUCES\_ARTIFACT |

*(Note: La modélisation exacte des artefacts \- nœud dédié ou propriété \- et la relation mission/tâche initiale peuvent nécessiter des ajustements)*

### **3.3. Spécifications Détaillées des Outils**

#### **3.3.1. Outil: CreateTaskNode**

* **Nom et Objectif Go:** CreateTaskNode. Crée un nouveau nœud :Task dans Neo4j avec des propriétés initiales (description, statut 'Pending', ID unique généré).  
* **Signature Go:**  
  Go  
  // CreateTaskNode creates a new task node as a child of a parent task or mission.  
  // parentID refers to the ID of the parent :Task or :Mission node.  
  // description details the task's objective.  
  // Returns the unique ID of the newly created task.  
  func (s \*Neo4jService) CreateTaskNode(ctx context.Context, parentID string, description string) (newTaskID string, err error)  
  *(Note: L'assignation initiale d'agent est retirée pour l'atomicité; elle sera gérée par AssignAgentToTask)*  
* **Description Détaillée (Docstring pour LLM):**  
  // Creates a new task node in the Neo4j database as a child of the specified parent task or mission.  
  // Use this tool when you need to define a new sub-task or the first task of a mission.  
  // Parameters:  
  //  \- parentID (string): The unique ID of the parent :Task or :Mission node. This task will be linked as a child to this parent. Must be a valid existing node ID.  
  //  \- description (string): A clear and concise description of the task's objective and requirements. Max length: 1000 characters.  
  // Returns:  
  //  \- newTaskID (string): The unique ID assigned to the newly created task node upon successful creation.  
  //  \- error: An error if the parentID is invalid, not found, or if there is a database issue during creation.  
  // Usage: Call this function first when breaking down a larger task or starting a mission. The returned newTaskID can then be used with other tools like AssignAgentToTask or AddDependencyRelationship.

* **Considérations de Sécurité Spécifiques:**  
  * **Validation des Entrées:**  
    * Valider le format de parentID (ex: UUID).  
    * Vérifier l'existence du nœud parentID dans Neo4j avant de tenter de créer la relation :HAS\_CHILD (ou similaire). Retourner une erreur claire si non trouvé.  
    * Valider la longueur de description (ex: max 1000 caractères).  
    * Nettoyer (sanitize) description pour éviter l'injection de caractères qui pourraient poser problème si la description est réutilisée dans d'autres contextes (ex: affichage HTML), bien que la paramétrisation soit la défense principale contre l'injection Cypher.19 (Adresse LLM01, LLM07)  
  * **Permissions (Moindre Privilège):** Le rôle Neo4j associé au driver doit avoir les permissions minimales requises : CREATE sur les nœuds avec le label :Task, CREATE sur les relations :HAS\_CHILD (ou :PART\_OF\_MISSION) entre les types de nœuds appropriés, READ pour vérifier l'existence du parent. (Adresse LLM07)  
  * **Sanitization:** Utiliser **exclusivement** des requêtes Cypher paramétrées pour insérer description et l'ID généré. Ne jamais construire la requête par concaténation de chaînes.1  
* **Testabilité (TDD):**  
  * **Dépendances:** Interface mockée pour le client/session Neo4j.1 Un générateur d'ID unique (ex: UUID) pourrait aussi être injecté/mocké si l'ID n'est pas généré par Neo4j.  
  * **Stratégie de Mocking:**  
    * Utiliser mock.On(...) pour simuler l'appel à ExecuteWrite.  
    * Vérifier que la requête Cypher attendue est générée (ex: MATCH (p {id: $parentID}) CREATE (t:Task {id: $newTaskID, description: $description, status: 'Pending'}) CREATE (p)--\>(t) RETURN t.id).  
    * Vérifier que le map de paramètres contient $parentID et $description avec les valeurs correctes (et $newTaskID si généré côté Go).  
    * Simuler le succès en retournant un ID de tâche mocké.  
    * Simuler les erreurs : parent non trouvé (peut être vérifié avant ou géré par l'échec de MATCH), erreur de contrainte (ex: ID unique), erreur de connexion.  
  * **Cas de Test Principaux:** Création réussie, parentID invalide/non trouvé, erreur base de données pendant CREATE, validation de la description (longueur).

#### **3.3.2. Outil: GetTaskDetails**

* **Nom et Objectif Go:** GetTaskDetails. Récupère un ensemble complet d'informations sur un nœud :Task spécifique via son ID.  
* **Signature Go:**  
  Go  
  // TaskInfo holds detailed information about a task retrieved from Neo4j.  
  type TaskInfo struct {  
      ID            string   \`json:"id"\`  
      Description   string   \`json:"description"\`  
      Status        string   \`json:"status"\` // Consider using a defined type/enum  
      ParentID      \*string  \`json:"parent\_id,omitempty"\` // ID of parent :Task or :Mission  
      ChildIDs     string \`json:"child\_ids,omitempty"\`  
      DependencyIDsstring \`json:"dependency\_ids,omitempty"\` // Tasks this task depends on  
      DependentIDs string \`json:"dependent\_ids,omitempty"\`  // Tasks that depend on this task  
      AgentID       \*string  \`json:"agent\_id,omitempty"\`  
      ArtifactPathsstring \`json:"artifact\_paths,omitempty"\` // Paths stored in S3, linked via :PRODUCES\_ARTIFACT  
      // Add other relevant fields like creation/update timestamps if needed  
  }

  // GetTaskDetails retrieves detailed information for a given taskID.  
  func (s \*Neo4jService) GetTaskDetails(ctx context.Context, taskID string) (\*TaskInfo, error)

* **Description Détaillée (Docstring pour LLM):**  
  // Retrieves detailed information about a specific task identified by its unique taskID.  
  // Use this tool to get the current status, description, assigned agent, parent, children, dependencies, dependents, and associated artifact paths for a task.  
  // Parameters:  
  //  \- taskID (string): The unique ID of the task to retrieve details for. Must be a valid task ID.  
  // Returns:  
  //  \- \*TaskInfo: A structure containing the task details upon success. Fields like parent\_id, child\_ids, dependency\_ids, dependent\_ids, agent\_id, and artifact\_paths might be empty or null if not applicable.  
  //  \- error: An error if the taskID is not found, invalid, or if there is a database query issue.  
  // Usage: Essential for understanding the context of a task before deciding on the next action (e.g., checking dependencies, finding children, retrieving artifacts).

* **Considérations de Sécurité Spécifiques:**  
  * **Validation des Entrées:** Valider le format de taskID. (Adresse LLM01, LLM07)  
  * **Permissions (Moindre Privilège):** Requiert un rôle Neo4j avec permissions de READ sur les nœuds :Task et :Agent (si agentID est retourné), et la capacité de traverser les relations :HAS\_CHILD, :DEPENDS\_ON, :ASSIGNED\_TO, :PRODUCES\_ARTIFACT (ou équivalent). (Adresse LLM07)  
  * **Gestion des Sorties:** S'assurer que la structure TaskInfo retournée n'expose pas de détails d'implémentation internes ou d'informations excessivement sensibles non nécessaires à l'agent. Filtrer si besoin. Par exemple, ne pas inclure des métadonnées internes de Neo4j. (Adresse LLM02, LLM06)  
* **Testabilité (TDD):**  
  * **Dépendances:** Interface mockée pour le client/session Neo4j.1  
  * **Stratégie de Mocking:**  
    * Simuler l'appel à ExecuteRead (ou ExecuteQuery).  
    * Vérifier la requête Cypher (ex: MATCH (t:Task {id: $id}) OPTIONAL MATCH (p)--\>(t) OPTIONAL MATCH (t)--\>(c:Task) OPTIONAL MATCH (t)--\>(dep:Task) OPTIONAL MATCH (dependant:Task)--\>(t) OPTIONAL MATCH (t)--\>(a:Agent) OPTIONAL MATCH (t)--\>(art:Artifact) RETURN t.id, t.description, t.status, p.id, collect(distinct c.id), collect(distinct dep.id), collect(distinct dependant.id), a.id, collect(distinct art.path) \- la requête exacte peut varier).  
    * Vérifier le passage du paramètre $taskID.  
    * Simuler le succès en retournant un enregistrement (record) mocké qui peut être transformé en \*TaskInfo. Tester différents scénarios (avec/sans enfants, dépendances, agent, artefacts).  
    * Simuler les erreurs : taskID non trouvé (le driver retourne une erreur spécifique ou un résultat vide), erreur de connexion.  
  * **Cas de Test Principaux:** Tâche trouvée avec toutes les relations possibles, tâche trouvée sans certaines relations (ex: pas d'enfants, pas d'agent), taskID non trouvé, erreur base de données.

#### **3.3.3. Outil: UpdateTaskStatus**

* **Nom et Objectif Go:** UpdateTaskStatus. Met à jour le champ status d'un nœud :Task existant.  
* **Signature Go:**  
  Go  
  // UpdateTaskStatus sets the status property of a task node.  
  // newStatus must be one of the predefined valid statuses (e.g., "InProgress", "Completed", "Failed").  
  func (s \*Neo4jService) UpdateTaskStatus(ctx context.Context, taskID string, newStatus string) error

* **Description Détaillée (Docstring pour LLM):**  
  // Updates the status of a specific task identified by taskID.  
  // Use this tool to reflect the progress or outcome of a task (e.g., starting work, completing it, or marking it as failed).  
  // Parameters:  
  //  \- taskID (string): The unique ID of the task whose status needs to be updated. Must be a valid existing task ID.  
  //  \- newStatus (string): The new status to set for the task. Must be one of the allowed values: 'Pending', 'InProgress', 'Completed', 'Failed'.  
  // Returns:  
  //  \- error: An error if the taskID is not found, if newStatus is invalid, or if there is a database update issue.  
  // Usage: Call this when a task's state changes significantly, for example, when an agent starts working on it or finishes it.

* **Considérations de Sécurité Spécifiques:**  
  * **Validation des Entrées:** Valider le format de taskID. Valider newStatus contre une liste prédéfinie (enum) de statuts autorisés. Rejeter toute valeur non reconnue. (Adresse LLM01, LLM07)  
  * **Permissions (Moindre Privilège):** Requiert un rôle Neo4j avec permission de WRITE (spécifiquement SET property) sur les nœuds :Task. (Adresse LLM07)  
  * **Sanitization:** Utiliser des requêtes paramétrées (SET t.status \= $newStatus).  
* **Testabilité (TDD):**  
  * **Dépendances:** Interface mockée pour le client/session Neo4j.1  
  * **Stratégie de Mocking:** Simuler ExecuteWrite. Vérifier la requête (MATCH (t:Task {id: $id}) SET t.status \= $newStatus) et les paramètres ($id, $newStatus). Simuler succès et erreurs (tâche non trouvée, erreur DB).  
  * **Cas de Test Principaux:** Succès mise à jour, taskID non trouvé, newStatus invalide (doit être attrapé par la validation avant l'appel DB), erreur base de données.

#### **3.3.4. Outil: ListChildTasks**

* *(Structure similaire : Nom, Objectif, Signature, Description, Sécurité, Testabilité)*  
* **Points Clés:** Valider parentTaskID. Retourne string (IDs) ou \*TaskInfo (détails basiques). Permission READ et traversée :HAS\_CHILD. Mocking vérifie MATCH (p:Task {id: $id})--\>(c:Task) RETURN c.id (ou c).

#### **3.3.5. Outil: AddChildTaskRelationship**

* *(Structure similaire)*  
* **Points Clés:** Valider parentTaskID et childTaskID (format, existence). Permission CREATE relation :HAS\_CHILD entre :Task. Mocking vérifie MATCH (p:Task {id: $parentId}), (c:Task {id: $childId}) CREATE (p)--\>(c).

#### **3.3.6. Outil: AddDependencyRelationship**

* *(Structure similaire)*  
* **Points Clés:** Valider dependentTaskID et dependencyTaskID. Permission CREATE relation :DEPENDS\_ON entre :Task. Mocking vérifie MATCH (dependent:Task {id: $dependentId}), (dependency:Task {id: $dependencyId}) CREATE (dependent)--\>(dependency).

#### **3.3.7. Outil: CheckTaskDependencies**

* *(Structure similaire)*  
* **Points Clés:** Valider taskID. Permission READ et traversée :DEPENDS\_ON. La logique vérifie si toutes les tâches pointées par :DEPENDS\_ON ont le statut 'Completed'. Retourne bool. Mocking vérifie MATCH (t:Task {id: $id})--\>(dep:Task) RETURN all(d in collect(dep) WHERE d.status \= 'Completed').

#### **3.3.8. Outil: AssignAgentToTask**

* *(Structure similaire)*  
* **Points Clés:** Valider taskID et agentID. Permission CREATE/MERGE relation :ASSIGNED\_TO entre :Task et :Agent. Gérer le cas où une assignation existe déjà (la remplacer ou retourner une erreur? Pour V1, remplacer est plus simple). Mocking vérifie MATCH (t:Task {id: $taskId}), (a:Agent {id: $agentId}) MERGE (t)--\>(:Agent) DELETE r MERGE (t)--\>(a).

#### **3.3.9. Outil: LinkArtifactToTask**

* *(Structure similaire)*  
* **Points Clés:** Valider taskID et artifactPath. Permission CREATE relation :PRODUCES\_ARTIFACT (ou SET propriété). Si :Artifact est un nœud, il faut potentiellement le créer (MERGE). Mocking vérifie la requête appropriée pour lier le chemin S3 à la tâche.

### **3.4. Compromis entre Granularité et Charge Cognitive du LLM**

La conception d'outils atomiques, comme préconisé 11, présente des avantages clairs en termes de testabilité et de sécurité. Chaque outil a une responsabilité unique et limitée, ce qui simplifie la vérification de son comportement et la définition de permissions restreintes. Par exemple, CreateTaskNode, AddChildTaskRelationship, et AssignAgentToTask sont des opérations distinctes et testables individuellement.

Cependant, cette atomicité impose une charge cognitive plus importante au LLM agent. Pour réaliser une action de plus haut niveau comme "créer une nouvelle sous-tâche et l'assigner à l'agent X", le LLM doit planifier et exécuter une séquence de plusieurs appels d'outils atomiques :

1. Appeler CreateTaskNode avec l'ID parent et la description.  
2. Mémoriser le newTaskID retourné.  
3. Appeler AssignAgentToTask avec le newTaskID mémorisé et l'ID de l'agent X.

Cette nécessité de séquencement et de gestion de l'état intermédiaire (le newTaskID) augmente la complexité de la logique de planification de l'agent et le risque d'erreurs (oubli de l'ID, mauvaise séquence d'appels).

Une alternative serait de créer un outil composite, par exemple CreateAndAssignSubtask. Cependant, un tel outil violerait le principe d'atomicité, serait plus complexe à tester de manière exhaustive (couvrant toutes les combinaisons d'états et d'erreurs internes), nécessiterait des permissions plus larges (création de nœud et de relation), et serait moins flexible si l'utilisateur ne souhaite qu'une partie de l'action (juste créer la tâche sans l'assigner immédiatement).

Pour AutoAgent V1, qui privilégie la simplicité et la stabilité, l'approche retenue est de **conserver des outils atomiques**. La complexité de l'enchaînement des appels sera gérée par la logique de l'agent (Orchestrateur ou Spécialiste), potentiellement facilitée par le framework d'orchestration sous-jacent (Temporal), qui est conçu pour gérer des workflows multi-étapes. Si, dans des versions futures, la performance ou la complexité de la logique LLM devient un problème majeur pour des séquences très fréquentes, l'introduction d'outils composites soigneusement conçus et sécurisés pourra être envisagée, mais uniquement après une analyse approfondie des bénéfices et des risques.

## **4\. Outils d'Interaction avec le Stockage Compatible S3**

### **4.1. Vue d'ensemble et Approche Générale**

Ces outils permettent aux agents de stocker et récupérer les fichiers (artefacts) générés ou nécessaires lors de l'exécution des tâches.

* **Modèle d'Interaction:** L'interaction se fera via l'AWS SDK for Go V2 3, configuré pour utiliser le point d'accès (endpoint) et les informations d'authentification du service de stockage compatible S3 (MinIO). La configuration du client doit être sécurisée, évitant de coder en dur les clés d'accès.  
* **Opérations Requises (V1):** Les besoins fondamentaux sont de pouvoir déposer un fichier (PutObject) et de récupérer un fichier (GetObject).3  
* **Gestion des Clés S3 (Paths):** La sécurité impose que les agents LLM ne puissent pas spécifier directement des chemins S3 arbitraires. Les outils doivent construire les clés S3 de manière déterministe et sécurisée, en se basant sur des identifiants validés (comme taskID) et des noms de fichiers nettoyés fournis par l'agent. Le chemin complet stocké dans S3 sera typiquement lié à l'entité correspondante (ex: Tâche) dans Neo4j.  
* **Gestion des Erreurs:** Les outils doivent gérer les erreurs potentielles de l'SDK S3 : problèmes d'authentification, erreurs de connexion, bucket ou objet non trouvé, permissions insuffisantes, etc., et les retourner de manière informative.  
* **Injection de Dépendances et Mocking:** Le client S3 (\*s3.Client ou une interface wrapper) sera injecté.26 Les tests unitaires utiliseront testify/mock 31 pour simuler les appels PutObject et GetObject, vérifiant les paramètres (bucket, clé, contenu) et simulant les succès et les erreurs S3.

### **4.2. Tableau Récapitulatif des Outils S3 Essentiels (V1)**

Les opérations de base requises pour la gestion des artefacts sont le stockage et la récupération.

| Nom de l'Outil (Go) | Objectif Principal | Entrées Clés | Sorties Clés |
| :---- | :---- | :---- | :---- |
| StoreArtifact | Déposer le contenu d'un artefact dans S3. | taskID, artifactName, content (byte) | storagePath (string) |
| RetrieveArtifact | Récupérer le contenu d'un artefact depuis S3 via son path. | storagePath (string) | content (byte) |

### **4.3. Spécifications Détaillées des Outils**

#### **4.3.1. Outil: StoreArtifact**

* **Nom et Objectif Go:** StoreArtifact. Téléverse le contenu binaire (content) fourni vers le stockage S3, en l'associant logiquement à une tâche.  
* **Signature Go:**  
  Go  
  // StoreArtifact uploads the given content to S3-compatible storage, associating it with a task.  
  // taskID is the ID of the task producing this artifact.  
  // artifactName is the desired filename (e.g., "output.log"). It will be sanitized.  
  // content is the byte slice representing the file content.  
  // Returns the unique storagePath (S3 key) where the artifact was stored.  
  func (s \*S3Service) StoreArtifact(ctx context.Context, taskID string, artifactName string, contentbyte) (storagePath string, err error)  
  *(Alternative: content io.Reader pour le streaming de gros fichiers)*  
* **Description Détaillée (Docstring pour LLM):**  
  // Stores the provided binary 'content' as an artifact file in the S3-compatible storage, linked to the specified 'taskID'.  
  // Use this tool to save any file generated during a task's execution (like logs, code, reports, etc.).  
  // Parameters:  
  //  \- taskID (string): The unique ID of the task that generated this artifact. Must be a valid task ID.  
  //  \- artifactName (string): A descriptive filename for the artifact (e.g., 'execution.log', 'generated\_script.py'). Avoid special characters or path elements (/,\\). Max length: 255 characters.  
  //  \- content (byte): The raw byte content of the file to be stored. Max size:.  
  // Returns:  
  //  \- storagePath (string): The unique S3 key (path) under which the artifact was successfully stored. This path should be recorded (e.g., using the LinkArtifactToTask Neo4j tool).  
  //  \- error: An error if the inputs are invalid (bad taskID, invalid artifactName, content too large), if the upload fails (permission denied, connection error), or other S3 issues occur.  
  // Usage: Call this whenever a task produces a file that needs to be persisted. Remember to link the returned storagePath to the task in Neo4j afterwards.

* **Considérations de Sécurité Spécifiques:**  
  * **Validation des Entrées:**  
    * Valider le format de taskID.  
    * Valider et **nettoyer** artifactName : interdire les caractères dangereux (/, \\, .., etc.) pour prévenir toute forme de path traversal. Utiliser une fonction de nettoyage robuste pour générer un nom de fichier sûr.  
    * Valider la taille de content contre une limite raisonnable (ex: 10MB pour V1) pour éviter l'épuisement des ressources (LLM04). (Adresse LLM01, LLM07)  
  * **Construction Sécurisée de la Clé S3:** L'outil **doit** construire la clé S3 finale de manière interne et non modifiable par le LLM. Utiliser un template sécurisé basé sur des informations validées, par exemple : fmt.Sprintf("tasks/%s/artifacts/%s", validatedTaskID, sanitizedArtifactName). Ne **jamais** permettre au LLM de fournir le chemin S3 complet. Cela empêche l'écrasement arbitraire de fichiers. (Adresse LLM01, LLM07, LLM08)  
  * **Permissions (Moindre Privilège):** Les crédentials S3 utilisées par le service doivent avoir uniquement la permission s3:PutObject et être restreintes au bucket et potentiellement au préfixe tasks/ si possible. (Adresse LLM07)  
  * **Gestion des Sorties:** Le storagePath retourné doit être le chemin canonique utilisé. S'assurer qu'il ne révèle pas d'informations non intentionnelles. (Adresse LLM02, LLM06)  
* **Testabilité (TDD):**  
  * **Dépendances:** Interface mockée pour le client S3 (s3.PutObjectAPIClient ou similaire).3  
  * **Stratégie de Mocking:**  
    * Simuler l'appel à PutObject.  
    * Vérifier les paramètres passés : Bucket (correct), Key (correctement construit et nettoyé), Body (correspond au contenu fourni).  
    * Simuler le succès (retournant un \*s3.PutObjectOutput vide ou avec ETag).  
    * Simuler les erreurs S3 : AccessDenied, NoSuchBucket, erreur réseau, etc.  
  * **Cas de Test Principaux:** Succès upload, taskID invalide, artifactName invalide (avec caractères spéciaux), artifactName nécessitant nettoyage, contenu trop volumineux, erreur de permission S3, erreur de connexion S3.

#### **4.3.2. Outil: RetrieveArtifact**

* **Nom et Objectif Go:** RetrieveArtifact. Télécharge le contenu d'un artefact depuis le stockage S3 en utilisant son chemin de stockage (clé S3).  
* **Signature Go:**  
  Go  
  // RetrieveArtifact downloads the content of an artifact from S3-compatible storage given its path.  
  // storagePath is the S3 key obtained previously (e.g., from Neo4j TaskDetails).  
  // Returns the artifact content as a byte slice.  
  func (s \*S3Service) RetrieveArtifact(ctx context.Context, storagePath string) (byte, error)  
  *(Alternative: io.ReadCloser pour le streaming)*  
* **Description Détaillée (Docstring pour LLM):**  
  // Retrieves the content of a previously stored artifact using its unique storagePath (S3 key).  
  // Use this tool to load the content of a file needed for the current task (e.g., input data, a script to execute) or for analysis. The storagePath should typically be obtained from the task details in Neo4j.  
  // Parameters:  
  //  \- storagePath (string): The exact S3 key (path) of the artifact to retrieve. Must be a path previously returned by StoreArtifact and recorded.  
  // Returns:  
  //  \-byte: The raw byte content of the retrieved artifact upon success.  
  //  \- error: An error if the storagePath is invalid, the artifact is not found (NoSuchKey), access is denied, or if there is a connection/S3 issue.  
  // Usage: Provide the storagePath associated with a task's artifact (found via GetTaskDetails) to get its content. Be prepared to handle potential errors like 'file not found'.

* **Considérations de Sécurité Spécifiques:**  
  * **Validation des Entrées:**  
    * Valider le format de storagePath.  
    * Crucial : Valider que storagePath correspond à un format attendu et se trouve dans un préfixe autorisé (ex: doit commencer par tasks/). Idéalement, ce chemin provient d'une source fiable (Neo4j) et n'est pas directement construit par le LLM. Si le LLM fournit le chemin, la validation doit être extrêmement stricte pour prévenir l'accès à des objets S3 inattendus. (Adresse LLM01, LLM07)  
  * **Permissions (Moindre Privilège):** Requiert des crédentials S3 avec la permission s3:GetObject, restreintes au bucket et au préfixe tasks/. (Adresse LLM07)  
  * **Gestion des Sorties:** La taille du contenu retourné (byte) peut être importante. Pour des artefacts volumineux, une approche par streaming (io.ReadCloser) serait préférable pour éviter de charger tout en mémoire. L'appelant (l'agent ou le framework) doit traiter le contenu de manière appropriée (ne pas l'exécuter directement s'il s'agit d'un script, sauf si c'est l'intention explicite via l'outil sandbox). (Adresse LLM02)  
* **Testabilité (TDD):**  
  * **Dépendances:** Interface mockée pour le client S3 (s3.GetObjectAPIClient ou similaire).3  
  * **Stratégie de Mocking:**  
    * Simuler l'appel à GetObject.  
    * Vérifier les paramètres Bucket et Key.  
    * Simuler le succès en retournant un \*s3.GetObjectOutput avec un Body mocké (ex: ioutil.NopCloser(bytes.NewReader(mockContent))).  
    * Simuler les erreurs S3 : NoSuchKey, AccessDenied, erreur réseau.  
  * **Cas de Test Principaux:** Succès récupération, storagePath invalide (format, préfixe), objet non trouvé (NoSuchKey), erreur de permission S3.

## **5\. Outils d'Exécution en Sandbox gVisor**

### **5.1. Vue d'ensemble et Approche Générale**

Cet outil est fondamental pour permettre aux agents d'exécuter du code (généré par LLM ou récupéré comme artefact) de manière sécurisée.

* **Modèle d'Interaction:** L'objectif est de fournir une interface simple et sécurisée pour exécuter des scripts dans un sandbox gVisor. Compte tenu de la complexité potentielle de l'API Go bas niveau de gVisor ou de l'orchestration directe de runsc 6, l'approche recommandée est de créer une **couche d'abstraction interne** en Go. Cette couche (un service SandboxService) encapsulera la logique de création du sandbox via runsc, la configuration de l'environnement (OCI spec), l'exécution de la commande (ex: python script.py), la capture de stdout/stderr/code de sortie, et la destruction du sandbox. L'outil LLM (ExecuteScriptInSandbox) appellera simplement cette couche d'abstraction. Le modèle conceptuel de golang.org/x/pkgsite-metrics/internal/sandbox 10 illustre une telle abstraction, bien que l'implémentation spécifique doive être adaptée à runsc.  
* **Priorité Sécurité:** C'est un composant à haut risque. Les défenses doivent être multiples :  
  * **Prévention de l'Injection de Commande:** La manière dont le script et l'interpréteur sont passés à runsc ou à l'API Go sous-jacente doit absolument prévenir l'injection de commande au niveau de l'hôte.20 Passer le script via stdin à l'interpréteur dans le sandbox est généralement plus sûr.  
  * **Isolation Stricte par Défaut:** Le sandbox doit être configuré par défaut avec le maximum d'isolation : réseau désactivé 32, système de fichiers racine en lecture seule 33, accès minimal aux fichiers hôtes (via des montages bind en lecture seule si nécessaire, configurés via OCI spec 8), capacités Linux minimales 34, filtres seccomp stricts.34  
  * **Validation des Entrées:** L'interpréteur doit être validé contre une liste d'autorisation stricte. Le contenu du script lui-même est difficile à valider, l'isolation du sandbox est la défense principale.  
  * **Gestion Sécurisée des Sorties:** stdout et stderr du script exécuté doivent être traités comme potentiellement non fiables par l'appelant (LLM02).13  
* **Configuration:** L'outil doit permettre de spécifier l'interpréteur et le contenu du script. Il pourrait accepter une structure de configuration pour ajuster *certains* paramètres du sandbox (timeout, limites de ressources, potentiellement accès réseau très limité si *absolument* nécessaire pour un cas d'usage V1 validé), mais avec des valeurs par défaut ultra-sécurisées. Les options de configuration pourraient se traduire en flags runsc 7 ou en modifications de la spec OCI.  
* **Entrées/Sorties:** Entrées : interpréteur (string), contenu du script (string), configuration du sandbox (struct). Sorties : stdout (string), stderr (string), code de sortie (int), erreur d'exécution du sandbox (error).  
* **Gestion des Erreurs:** Gérer les erreurs liées à la création du sandbox, à l'exécution de la commande (timeout, OOM kill), à la récupération des sorties.  
* **Injection de Dépendances et Mocking:** Injecter une interface pour le SandboxService abstrait. Mocker cette interface pour simuler l'exécution de scripts (succès, échec, sorties spécifiques) sans dépendre de runsc ou gVisor.

### **5.2. Tableau Récapitulatif des Outils gVisor Essentiels (V1)**

Pour V1, une seule interface d'exécution est nécessaire pour encapsuler la complexité et garantir la sécurité. Exposer des commandes de gestion de bas niveau (créer, détruire) au LLM serait dangereux (LLM08).

| Nom de l'Outil (Go) | Objectif Principal | Entrées Clés | Sorties Clés |
| :---- | :---- | :---- | :---- |
| ExecuteScriptInSandbox | Exécuter un script dans un sandbox gVisor isolé. | interpreter, scriptContent, config (SandboxConfig) | SandboxExecutionResult |

### **5.3. Spécification Détaillée de l'Outil**

#### **5.3.1. Outil: ExecuteScriptInSandbox**

* **Nom et Objectif Go:** ExecuteScriptInSandbox. Exécute de manière sécurisée et isolée un script fourni, en utilisant l'interpréteur spécifié, à l'intérieur d'un sandbox gVisor.  
* **Signature Go:**  
  Go  
  // SandboxConfig defines configuration options for the execution sandbox.  
  type SandboxConfig struct {  
      // NetworkEnabled specifies if the sandbox should have network access.  
      // Defaults to false (most secure). Enable only if absolutely necessary.  
      NetworkEnabled bool \`json:"network\_enabled"\`

      // ReadOnlyRoot specifies if the root filesystem inside the sandbox is read-only.  
      // Defaults to true (most secure).  
      ReadOnlyRoot bool \`json:"read\_only\_root"\`

      // TODO: Potentially add fields for:  
      // \- AllowedReadOnlyMounts: map\[string\]string // HostPath \-\> SandboxPath  
      // \- CPULimit: string // e.g., "100m"  
      // \- MemoryLimit: string // e.g., "128Mi"

      // TimeoutSeconds specifies the maximum execution time for the script.  
      // Defaults to a reasonable value (e.g., 60 seconds).  
      TimeoutSeconds int \`json:"timeout\_seconds"\`  
  }

  // SandboxExecutionResult holds the results of a script execution in the sandbox.  
  type SandboxExecutionResult struct {  
      Stdout   string // Captured standard output.  
      Stderr   string // Captured standard error.  
      ExitCode int    // Exit code of the executed script. 0 typically means success.  
      // Error field is used for sandbox-level errors (setup, timeout, OOM),  
      // not for script errors which are indicated by Stderr and ExitCode.  
      Error    error  \`json:"-"\` // Internal error during sandbox operation  
  }

  // ExecuteScriptInSandbox runs the provided script content using the specified interpreter  
  // within a secure gVisor sandbox configured by the config options.  
  // interpreter must be one of the allowed values (e.g., "python", "bash").  
  // scriptContent is the raw source code to execute.  
  func (s \*SandboxService) ExecuteScriptInSandbox(ctx context.Context, interpreter string, scriptContent string, config SandboxConfig) (\*SandboxExecutionResult, error)

* **Description Détaillée (Docstring pour LLM):**  
  // Executes the provided 'scriptContent' using the specified 'interpreter' inside a highly secure and isolated gVisor sandbox.  
  // Use this tool ONLY for running code (e.g., Python, Bash scripts generated by you or retrieved from trusted artifacts).  
  // CRITICAL: The sandbox environment is heavily restricted by default for security:  
  //   \- NO network access.  
  //   \- Read-only filesystem.  
  //   \- Strict resource limits (CPU, memory, time).  
  // Parameters:  
  //  \- interpreter (string): The interpreter to use. MUST be one of: 'python', 'bash', 'go run'. Other values will be rejected.  
  //  \- scriptContent (string): The raw source code of the script to execute.  
  //  \- config (SandboxConfig): Optional configuration overrides. It is STRONGLY recommended to use default settings (especially NetworkEnabled=false).  
  //      \- NetworkEnabled (bool): Set to true ONLY if network access is absolutely required and approved for the task. Default: false.  
  //      \- ReadOnlyRoot (bool): Set to false ONLY if the script needs to write to its root filesystem (rarely needed). Default: true.  
  //      \- TimeoutSeconds (int): Maximum execution time in seconds. Default: 60\.  
  // Returns:  
  //  \- \*SandboxExecutionResult: A structure containing the execution results:  
  //      \- Stdout (string): The standard output produced by the script.  
  //      \- Stderr (string): The standard error output produced by the script. Check this for error messages from the script itself.  
  //      \- ExitCode (int): The exit code returned by the script. An exit code of 0 usually indicates success. Non-zero indicates an error within the script.  
  //  \- error: This is returned ONLY if there was a problem setting up or managing the sandbox itself (e.g., invalid interpreter, timeout reached before script finished, internal gVisor error). If this error is nil, the script execution completed (check ExitCode and Stderr for script-level success/failure).  
  // Usage: Provide the interpreter and the script content. Analyze the returned Stdout, Stderr, and ExitCode to determine the outcome of the script execution. Treat Stdout/Stderr as potentially untrusted output.

* **Considérations de Sécurité Spécifiques:**  
  * **Validation des Entrées (Critique):**  
    * Valider interpreter contre une liste d'autorisation **stricte** et immuable ("python", "bash", "go run"). Rejeter toute autre valeur. Ne pas permettre au LLM d'influencer cette liste.  
    * La scriptContent ne doit pas être utilisée pour construire une ligne de commande shell sur l'hôte. Elle doit être passée de manière sécurisée à l'interpréteur *à l'intérieur* du sandbox (ex: via stdin ou un fichier monté temporairement en lecture seule dans le sandbox). Prévenir l'injection de commande au niveau de l'orchestration runsc.20  
    * Valider les valeurs dans config (ex: TimeoutSeconds \> 0). (Adresse LLM01, LLM07)  
  * **Configuration de l'Isolation (Critique):**  
    * Le service sous-jacent **doit** appliquer les configurations par défaut les plus strictes : réseau désactivé, rootfs en lecture seule, limites de ressources (CPU, mémoire via cgroups 36), limite de descripteurs de fichiers 35, timeout strict.  
    * Toute dérogation (ex: NetworkEnabled=true) doit être un choix explicite via config et potentiellement soumis à des politiques de sécurité supplémentaires.  
    * Utiliser les mécanismes de gVisor/runsc pour appliquer ces restrictions (flags runsc 7, spec OCI 8). (Adresse LLM07, LLM04, LLM08)  
  * **Moindre Privilège (Hôte et Sandbox):** Le processus runsc lui-même doit s'exécuter avec le moins de privilèges possible sur l'hôte. À l'intérieur du sandbox, le script doit s'exécuter en tant qu'utilisateur non privilégié, avec un minimum de capacités Linux et des filtres seccomp stricts appliqués par gVisor.5  
  * **Gestion des Sorties:** Traiter Stdout et Stderr comme des sorties potentiellement non fiables. Limiter leur taille maximale pour éviter l'épuisement de la mémoire. Nettoyer si ces sorties doivent être affichées ou traitées par d'autres systèmes. (Adresse LLM02)  
* **Testabilité (TDD):**  
  * **Dépendances:** Interface mockée pour le SandboxService abstrait.31  
  * **Stratégie de Mocking:**  
    * Simuler l'appel à ExecuteScriptInSandbox.  
    * Vérifier les paramètres interpreter, scriptContent, et config reçus.  
    * Simuler différents SandboxExecutionResult :  
      * Succès (ExitCode 0, stdout/stderr spécifiques).  
      * Erreur de script (ExitCode non nul, stderr spécifique).  
      * Timeout (retourner une erreur spécifique ou un résultat avec un flag de timeout).  
      * Erreur de setup du sandbox (retourner une erreur non-nil).  
    * Vérifier que les configurations par défaut (réseau désactivé, etc.) sont appliquées si config est vide ou omis.  
  * **Cas de Test Principaux:** Exécution réussie (Python, Bash), script avec erreur (exit non nul), script produisant stdout/stderr, timeout dépassé, interpréteur invalide, échec de création du sandbox, vérification des configurations de sécurité par défaut.

### **5.4. Nécessité d'une Couche d'Abstraction**

L'interaction directe avec l'exécutable runsc ou l'API Go bas niveau gvisor.dev/gvisor/runsc/sandbox 8 depuis l'outil LLM présente des défis majeurs en termes de complexité et de sécurité. Le cycle de vie complet d'une exécution en sandbox implique plusieurs étapes : la création potentielle du sandbox (runsc create), la configuration de son environnement via une spec OCI, l'exécution de la commande (runsc exec 37), la gestion des flux d'entrée/sortie, l'attente de la fin de l'exécution, et enfin la destruction des ressources du sandbox (runsc delete 8).

Exposer chacune de ces étapes comme un outil distinct au LLM serait non seulement complexe pour la planification de l'agent, mais accorderait également une "agence excessive" (LLM08) 13, augmentant le risque d'erreurs ou d'abus (par exemple, un agent oubliant de détruire un sandbox, conduisant à une fuite de ressources). De plus, la configuration fine des aspects de sécurité (isolation réseau, montage de systèmes de fichiers, limites de ressources, filtres seccomp) nécessite souvent la manipulation de la spec OCI 8 ou l'utilisation de flags runsc spécifiques 7, ce qui n'est pas approprié pour un contrôle direct par le LLM.

Par conséquent, une couche d'abstraction interne en Go est indispensable. Cette couche, implémentée sous forme d'un service (par exemple, SandboxService), encapsulera l'ensemble du cycle de vie de l'exécution en sandbox. Elle sera responsable de :

1. Recevoir la requête simple de l'outil ExecuteScriptInSandbox (interpréteur, script, config).  
2. Appliquer les politiques de sécurité par défaut et les overrides de configuration validés.  
3. Orchestrer les appels nécessaires à runsc ou à l'API Go sous-jacente pour créer, configurer, exécuter et détruire le sandbox de manière atomique du point de vue de l'appelant.  
4. Gérer la capture et le retour sécurisé de stdout, stderr, et du code de sortie.

Cette abstraction garantit que l'interface exposée au LLM est simple, sécurisée et respecte le principe du moindre privilège. L'implémentation de l'outil ExecuteScriptInSandbox nécessitera donc non seulement la fonction elle-même, mais aussi le développement de ce service de gestion de sandbox robuste et sécurisé en coulisses.

## **6\. Conclusion**

### **6.1. Résumé de l'Ensemble d'Outils Proposé**

Ce rapport a défini un ensemble minimaliste mais fonctionnel d'outils Go essentiels pour permettre aux agents LLM d'AutoAgent V1 d'interagir avec les systèmes backend clés : Neo4j, le stockage S3 compatible, et le sandbox gVisor.

* **Pour Neo4j:** Des outils atomiques pour créer, lire, et mettre à jour les nœuds :Task et leurs relations (:HAS\_CHILD, :DEPENDS\_ON, :ASSIGNED\_TO), ainsi que pour lier les artefacts (:PRODUCES\_ARTIFACT).  
* **Pour S3:** Deux outils fondamentaux, StoreArtifact et RetrieveArtifact, pour gérer le stockage et la récupération des fichiers générés par les tâches, avec une construction sécurisée des clés S3.  
* **Pour gVisor:** Un outil unique et sécurisé, ExecuteScriptInSandbox, qui abstrait la complexité de l'exécution de code dans un environnement isolé, en appliquant des restrictions strictes par défaut.

### **6.2. Justification du Minimalisme et de la Suffisance (V1)**

L'ensemble d'outils proposé est jugé minimal car il se concentre strictement sur les opérations fondamentales requises par les fonctionnalités "Must-Have" d'AutoAgent V1 (délégation, suivi, validation de missions simples). Il couvre les opérations CRUD de base sur les tâches dans Neo4j, la persistance et l'accès aux artefacts dans S3, et l'exécution sécurisée de scripts simples via gVisor.

Bien que minimaliste, cet ensemble est considéré comme suffisant pour la V1. Des opérations plus complexes (requêtes Neo4j avancées, gestion du cycle de vie S3, configurations de sandbox plus granulaires) ne sont pas incluses pour maintenir la simplicité, mais pourront être ajoutées dans des versions futures si le besoin se présente. L'atomicité des outils Neo4j nécessitera une logique de séquencement au niveau des agents, ce qui est acceptable pour la V1 compte tenu de l'utilisation de Temporal pour l'orchestration.

### **6.3. Adhésion aux Principes de Conception**

La conception de chaque outil a systématiquement suivi les principes fondamentaux établis :

* **Sécurité:** Intégration des mitigations pour les risques OWASP LLM pertinents (LLM01, LLM02, LLM04, LLM06, LLM07, LLM08), validation stricte des entrées, traitement sécurisé des sorties, application du moindre privilège, et utilisation de techniques sécurisées (paramétrisation, isolation sandbox).  
* **Testabilité:** Conception orientée TDD avec injection de dépendances et utilisation de mocks (testify/mock) pour permettre des tests unitaires isolés et fiables.  
* **Clarté:** Descriptions détaillées et signatures précises pour faciliter la compréhension et l'utilisation correcte par les LLMs.  
* **Atomicité/Simplicité:** Outils réalisant une seule action logique pour simplifier le raisonnement LLM, la sécurité et les tests, tout en reconnaissant le besoin de séquencement par l'agent pour V1.

### **6.4. Recommandations d'Implémentation**

1. **Organisation du Code:** Implémenter ces outils au sein de packages Go dédiés par service (ex: internal/services/neo4j, internal/services/s3, internal/services/sandbox). Ces services encapsuleront la logique client/driver et exposeront les fonctions d'outils définies.  
2. **Injection de Dépendances:** Mettre en place un système d'injection de dépendances (ex: via des constructeurs ou une bibliothèque légère) pour fournir les clients (Neo4j, S3) et le service sandbox aux couches supérieures (ex: activités Temporal qui appellent les outils).  
3. **Tests Rigoureux:** Implémenter des tests unitaires exhaustifs pour chaque outil en utilisant des mocks. Envisager également des tests d'intégration pour valider l'interaction réelle avec les services (Neo4j, MinIO, gVisor) dans un environnement de test contrôlé.  
4. **Conventions:** Établir et suivre des conventions claires pour la gestion des erreurs (types d'erreurs retournés) et la journalisation (logging) à travers tous les outils pour faciliter le débogage et la surveillance.  
5. **Configuration Sécurisée:** Gérer la configuration des services (endpoints, crédentials) de manière sécurisée (variables d'environnement, gestionnaire de secrets), en particulier pour S3 et Neo4j.

### **6.5. Considérations Futures**

À mesure qu'AutoAgent évoluera au-delà de la V1, l'ensemble d'outils devra potentiellement être étendu :

* **Neo4j:** Ajout d'outils pour des requêtes plus complexes (recherche de chemins, agrégations), gestion des Missions, support de transactions plus longues ou complexes.  
* **S3:** Outils pour lister des artefacts, gérer les métadonnées, ou implémenter des politiques de cycle de vie.  
* **gVisor:** Options de configuration plus fines pour le sandbox si des cas d'usage spécifiques le nécessitent (ex: accès réseau limité et contrôlé, montages de volumes spécifiques).  
* **Performance:** Si le volume de tâches ou d'artefacts augmente significativement, des optimisations comme le traitement par lots (batching) pour les interactions Neo4j ou S3 pourraient devenir nécessaires.  
* **Outils Composites:** Réévaluer la nécessité d'outils composites pour les séquences d'actions très fréquentes, en pesant soigneusement les avantages par rapport aux inconvénients en termes de complexité, de sécurité et de testabilité.

En conclusion, l'ensemble d'outils défini dans ce rapport fournit une base solide, sécurisée et testable pour les interactions des agents LLM d'AutoAgent V1 avec son infrastructure backend. Une implémentation rigoureuse suivant les principes et recommandations énoncés sera essentielle au succès et à la fiabilité de cette première version.

#### **Sources des citations**

1. Build applications with Neo4j and Go \- Neo4j Go Driver Manual, consulté le avril 25, 2025, [https://neo4j.com/docs/go-manual/current/](https://neo4j.com/docs/go-manual/current/)  
2. Neo4j Bolt Driver for Go \- GitHub, consulté le avril 25, 2025, [https://github.com/neo4j/neo4j-go-driver](https://github.com/neo4j/neo4j-go-driver)  
3. Amazon S3 examples using SDK for Go V2 \- AWS Documentation, consulté le avril 25, 2025, [https://docs.aws.amazon.com/sdk-for-go/v2/developer-guide/go\_s3\_code\_examples.html](https://docs.aws.amazon.com/sdk-for-go/v2/developer-guide/go_s3_code_examples.html)  
4. Amazon S3 examples using SDK for Go V2 \- AWS Documentation, consulté le avril 25, 2025, [https://docs.aws.amazon.com/code-library/latest/ug/go\_2\_s3\_code\_examples.html](https://docs.aws.amazon.com/code-library/latest/ug/go_2_s3_code_examples.html)  
5. gVisor: The Container Security Platform, consulté le avril 25, 2025, [https://gvisor.dev/](https://gvisor.dev/)  
6. What is gVisor?, consulté le avril 25, 2025, [https://gvisor.dev/docs/](https://gvisor.dev/docs/)  
7. Debugging \- gVisor, consulté le avril 25, 2025, [https://gvisor.dev/docs/user\_guide/debugging/](https://gvisor.dev/docs/user_guide/debugging/)  
8. sandbox package \- gvisor.dev/gvisor/runsc/sandbox \- Go Packages, consulté le avril 25, 2025, [https://pkg.go.dev/gvisor.dev/gvisor/runsc/sandbox](https://pkg.go.dev/gvisor.dev/gvisor/runsc/sandbox)  
9. gvisor/runsc/sandbox/sandbox.go at master · google/gvisor \- GitHub, consulté le avril 25, 2025, [https://github.com/google/gvisor/blob/master/runsc/sandbox/sandbox.go](https://github.com/google/gvisor/blob/master/runsc/sandbox/sandbox.go)  
10. sandbox package \- golang.org/x/pkgsite-metrics/internal/sandbox \- Go Packages, consulté le avril 25, 2025, [https://pkg.go.dev/golang.org/x/pkgsite-metrics/internal/sandbox](https://pkg.go.dev/golang.org/x/pkgsite-metrics/internal/sandbox)  
11. Building Effective AI Agents \\ Anthropic, consulté le avril 25, 2025, [https://www.anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents)  
12. What are the OWASP Top 10 risks for LLMs? \- Cloudflare, consulté le avril 25, 2025, [https://www.cloudflare.com/learning/ai/owasp-top-10-risks-for-llms/](https://www.cloudflare.com/learning/ai/owasp-top-10-risks-for-llms/)  
13. OWASP Top 10 for Large Language Model Applications | OWASP ..., consulté le avril 25, 2025, [https://owasp.org/www-project-top-10-for-large-language-model-applications/](https://owasp.org/www-project-top-10-for-large-language-model-applications/)  
14. OWASP Top 10 LLM, Updated 2025: Examples & Mitigation Strategies, consulté le avril 25, 2025, [https://www.oligo.security/academy/owasp-top-10-llm-updated-2025-examples-and-mitigation-strategies](https://www.oligo.security/academy/owasp-top-10-llm-updated-2025-examples-and-mitigation-strategies)  
15. Good Api Design Principles for Ai Products \- Restack, consulté le avril 25, 2025, [https://www.restack.io/p/design-principles-for-ai-products-answer-good-api-design](https://www.restack.io/p/design-principles-for-ai-products-answer-good-api-design)  
16. What is API Design? Principles & Best Practices \- Postman, consulté le avril 25, 2025, [https://www.postman.com/api-platform/api-design/](https://www.postman.com/api-platform/api-design/)  
17. Four principles for designing effective APIs | MuleSoft, consulté le avril 25, 2025, [https://www.mulesoft.com/api-university/four-principles-designing-effective-apis](https://www.mulesoft.com/api-university/four-principles-designing-effective-apis)  
18. APIs in the age of AI: Echoes of the past, whispers of the future \- Cutover, consulté le avril 25, 2025, [https://www.cutover.com/blog/apis-in-the-age-of-ai](https://www.cutover.com/blog/apis-in-the-age-of-ai)  
19. Neo4j Driver Best Practices \- Graph Database & Analytics, consulté le avril 25, 2025, [https://neo4j.com/blog/developer/neo4j-driver-best-practices/](https://neo4j.com/blog/developer/neo4j-driver-best-practices/)  
20. Avoid command injection \- Datadog Docs, consulté le avril 25, 2025, [https://docs.datadoghq.com/security/code\_security/static\_analysis/static\_analysis\_rules/go-security/command-injection/](https://docs.datadoghq.com/security/code_security/static_analysis/static_analysis_rules/go-security/command-injection/)  
21. How to Securely Execute External Commands in Go \- LabEx, consulté le avril 25, 2025, [https://labex.io/tutorials/go-how-to-securely-execute-external-commands-in-go-431338](https://labex.io/tutorials/go-how-to-securely-execute-external-commands-in-go-431338)  
22. Performance recommendations \- Neo4j Go Driver Manual, consulté le avril 25, 2025, [https://neo4j.com/docs/go-manual/current/performance/](https://neo4j.com/docs/go-manual/current/performance/)  
23. How to avoid unintended code execution \- LabEx, consulté le avril 25, 2025, [https://labex.io/tutorials/go-how-to-avoid-unintended-code-execution-422489](https://labex.io/tutorials/go-how-to-avoid-unintended-code-execution-422489)  
24. OWASP Top 10 LLM Risks : r/llmprivacy \- Reddit, consulté le avril 25, 2025, [https://www.reddit.com/r/llmprivacy/comments/1id3vca/owasp\_top\_10\_llm\_risks/](https://www.reddit.com/r/llmprivacy/comments/1id3vca/owasp_top_10_llm_risks/)  
25. Remote command execution \- Go \- Knowledge Base \- Fluid Attacks, consulté le avril 25, 2025, [https://help.fluidattacks.com/portal/en/kb/articles/criteria-fixes-go-004](https://help.fluidattacks.com/portal/en/kb/articles/criteria-fixes-go-004)  
26. Dependency Injection | Learn Go with tests \- GitBook, consulté le avril 25, 2025, [https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/dependency-injection](https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/dependency-injection)  
27. 5 Mocking Techniques for Go | Golang Mocking for Unit Testing \- Hatchpad, consulté le avril 25, 2025, [https://www.myhatchpad.com/insight/mocking-techniques-for-go/](https://www.myhatchpad.com/insight/mocking-techniques-for-go/)  
28. Golang Tutorial: Unit Testing with Mocking | Ompluscator's Blog, consulté le avril 25, 2025, [https://www.ompluscator.com/article/golang/tutorial-unit-testing-mocking/](https://www.ompluscator.com/article/golang/tutorial-unit-testing-mocking/)  
29. How can I mock a function with no input or output in testify? \- Stack Overflow, consulté le avril 25, 2025, [https://stackoverflow.com/questions/77787228/how-can-i-mock-a-function-with-no-input-or-output-in-testify](https://stackoverflow.com/questions/77787228/how-can-i-mock-a-function-with-no-input-or-output-in-testify)  
30. Detailed Guide for Simplifying Testing with Golang Testify \- Relia Software, consulté le avril 25, 2025, [https://reliasoftware.com/blog/simplifying-testing-with-golang-testify](https://reliasoftware.com/blog/simplifying-testing-with-golang-testify)  
31. stretchr/testify: A toolkit with common assertions and mocks ... \- GitHub, consulté le avril 25, 2025, [https://github.com/stretchr/testify](https://github.com/stretchr/testify)  
32. gvisor module \- gvisor.dev/gvisor \- Go Packages, consulté le avril 25, 2025, [https://pkg.go.dev/gvisor.dev/gvisor](https://pkg.go.dev/gvisor.dev/gvisor)  
33. Filesystem \- gVisor, consulté le avril 25, 2025, [https://gvisor.dev/docs/user\_guide/filesystem/](https://gvisor.dev/docs/user_guide/filesystem/)  
34. Containing a Real Vulnerability \- gVisor, consulté le avril 25, 2025, [https://gvisor.dev/blog/2020/09/18/containing-a-real-vulnerability/](https://gvisor.dev/blog/2020/09/18/containing-a-real-vulnerability/)  
35. gvisor/runsc/config/config.go at master \- GitHub, consulté le avril 25, 2025, [https://github.com/google/gvisor/blob/master/runsc/config/config.go](https://github.com/google/gvisor/blob/master/runsc/config/config.go)  
36. gVisor fails to detect memory/cpu w/ systemd+cgroupsv2 · Issue \#9580 \- GitHub, consulté le avril 25, 2025, [https://github.com/google/gvisor/issues/9580](https://github.com/google/gvisor/issues/9580)  
37. gvisor/runsc/cmd/exec.go at master \- GitHub, consulté le avril 25, 2025, [https://github.com/google/gvisor/blob/master/runsc/cmd/exec.go](https://github.com/google/gvisor/blob/master/runsc/cmd/exec.go)