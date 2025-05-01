## **AutoAgent \- Spécification des Outils LLM Essentiels (V1)**

**Objectif :** Définir de manière **prescriptive et détaillée** l'ensemble minimaliste mais fonctionnel d'Outils (fonctions Go) permettant aux agents LLM d'interagir de manière sécurisée, fiable et testable avec Neo4j, S3 et gVisor pour les fonctionnalités "Must-Have" d'AutoAgent V1. Ce document sert de spécification technique pour l'implémentation.

**Principes Généraux Appliqués :**

* **Sécurité par Conception :** Validation systématique des entrées LLM, sanitation, principe du moindre privilège, formatage sécurisé des requêtes/commandes.  
* **Clarté pour LLM :** Descriptions (docstrings) structurées, détaillées, prescriptives et non ambiguës suivant un template défini.  
* **Robustesse :** Gestion structurée des erreurs, typage Go spécifique, idempotence explicitement indiquée.  
* **Testabilité :** Conception favorisant l'injection de dépendances et les tests unitaires rigoureux avec mocks.  
* **Atomicité :** Outils réalisant une action logique unique et bien définie.  
* **Simplicité V1 :** Focus strict sur les besoins essentiels "Must-Have".

### **1\. Conventions Générales**

* **Typage Go :** Utilisation systématique de types Go spécifiques (ex: type TaskID string, type TaskStatus string avec constantes) pour améliorer la clarté, la sécurité de type et l'intention dans le code Go. La sérialisation/désérialisation pour l'API LLM utilisera les types primitifs sous-jacents (ex: string).  
* **Gestion des Erreurs Structurée :** Les erreurs retournées par les outils suivront la structure AppError pour une interprétation fiable par l'LLM et un débogage facilité.  
  
  ```go
  import (  
      "context"  
      "fmt"  
      "io"  
      "time"  
  )

  // AppError définit la structure standard des erreurs retournées par les outils.  
  type AppError struct {  
      Code    ErrorCode              // Code d'erreur catégorisé et standardisé.  
      Message string                 // Message descriptif lisible par l'humain (pour logs/debug).  
      Context map\[string\]interface{} // Métadonnées contextuelles pour l'IA (ex: {"param": "taskID", "value": "invalid-uuid", "allowed\_values": \["QUEUED", "IN\_PROGRESS"\]}). Peut être nil.  
      Err     error                  // Erreur sous-jacente originale (pour wrapping/logs). Peut être nil.  
  }

  // Implémentation standard de l'interface error  
  func (e \*AppError) Error() string {  
      errMsg := fmt.Sprintf("\[%s\] %s", e.Code, e.Message)  
      if len(e.Context) \> 0 {  
          errMsg \+= fmt.Sprintf(" (Context: %v)", e.Context)  
      }  
      if e.Err \!= nil {  
           errMsg \+= fmt.Sprintf(" (Caused by: %v)", e.Err)  
      }  
      return errMsg  
  }

  // NewAppError est la fonction helper pour créer une AppError standardisée.  
  func NewAppError(code ErrorCode, message string, context map\[string\]interface{}, underlying error) \*AppError {  
      return \&AppError{Code: code, Message: message, Context: context, Err: underlying}  
  }

  // ErrorCode représente les codes d'erreur standardisés et catégorisés.  
  // L'objectif est de permettre à l'LLM d'adapter sa stratégie en fonction du type d'erreur.  
  type ErrorCode string

  const (  
      // Input/Validation Errors (Récupérables par correction LLM)  
      ERR\_INVALID\_INPUT\_PARAM      ErrorCode \= "INVALID\_INPUT\_PARAM"       // Paramètre d'entrée invalide (format, valeur, longueur). Context doit inclure 'param' et 'details'.  
      ERR\_MISSING\_REQUIRED\_PARAM ErrorCode \= "MISSING\_REQUIRED\_PARAM"  // Paramètre requis manquant. Context doit inclure 'param'.

      // Neo4j Errors (Certains récupérables, d'autres non)  
      ERR\_NEO4J\_NODE\_NOT\_FOUND         ErrorCode \= "NEO4J\_NODE\_NOT\_FOUND"          // Nœud spécifié non trouvé. Context doit inclure 'nodeID'. (Non récupérable directement).  
      ERR\_NEO4J\_RELATIONSHIP\_NOT\_FOUND ErrorCode \= "NEO4J\_RELATIONSHIP\_NOT\_FOUND"  // Relation spécifiée non trouvée. (Non récupérable directement).  
      ERR\_NEO4J\_CONSTRAINT\_VIOLATION ErrorCode \= "NEO4J\_CONSTRAINT\_VIOLATION"  // Contrainte unique violée. (Non récupérable directement).  
      ERR\_NEO4J\_QUERY\_ERROR          ErrorCode \= "NEO4J\_QUERY\_ERROR"           // Erreur lors de l'exécution Cypher (syntaxe, logique). (Peut nécessiter correction requête/logique LLM).  
      ERR\_NEO4J\_CONNECTION\_ERROR     ErrorCode \= "NEO4J\_CONNECTION\_ERROR"      // Problème connexion DB. (Récupérable potentiellement via retry).  
      ERR\_NEO4J\_TRANSACTION\_ERROR    ErrorCode \= "NEO4J\_TRANSACTION\_ERROR"     // Erreur liée à la transaction (ex: deadlock, conflit). (Récupérable potentiellement via retry).

      // S3 Errors (Certains récupérables)  
      ERR\_S3\_ARTIFACT\_NOT\_FOUND    ErrorCode \= "S3\_ARTIFACT\_NOT\_FOUND"     // Artefact non trouvé (NoSuchKey). (Non récupérable directement).  
      ERR\_S3\_ACCESS\_DENIED         ErrorCode \= "S3\_ACCESS\_DENIED"          // Permissions insuffisantes. (Non récupérable directement).  
      ERR\_S3\_UPLOAD\_FAILED         ErrorCode \= "S3\_UPLOAD\_FAILED"          // Échec de l'upload (ex: problème réseau partiel). (Récupérable potentiellement via retry).  
      ERR\_S3\_DOWNLOAD\_FAILED       ErrorCode \= "S3\_DOWNLOAD\_FAILED"        // Échec du download. (Récupérable potentiellement via retry).  
      ERR\_S3\_CONNECTION\_ERROR      ErrorCode \= "S3\_CONNECTION\_ERROR"       // Problème connexion S3. (Récupérable potentiellement via retry).  
      ERR\_S3\_SIZE\_LIMIT\_EXCEEDED   ErrorCode \= "S3\_SIZE\_LIMIT\_EXCEEDED"    // Taille de fichier dépasse limite V1. (Non récupérable sans modification input).

      // Sandbox Errors (Peu récupérables par LLM directement)  
      ERR\_SANDBOX\_INVALID\_INTERPRETER ErrorCode \= "SANDBOX\_INVALID\_INTERPRETER"  // Interpréteur non autorisé. (Nécessite correction choix interpréteur).  
      ERR\_SANDBOX\_TIMEOUT             ErrorCode \= "SANDBOX\_TIMEOUT"              // Timeout d'exécution dépassé. (Peut nécessiter optimisation script ou augmentation timeout si justifié).  
      ERR\_SANDBOX\_SETUP\_FAILED        ErrorCode \= "SANDBOX\_SETUP\_FAILED"         // Échec création/configuration sandbox (problème infra). (Non récupérable par LLM).  
      ERR\_SANDBOX\_EXECUTION\_FAILED    ErrorCode \= "SANDBOX\_EXECUTION\_FAILED"     // Erreur interne pendant l'exécution script (ex: OOM kill interne gVisor). (Non récupérable par LLM).  
      ERR\_SANDBOX\_RESOURCE\_LIMIT      ErrorCode \= "SANDBOX\_RESOURCE\_LIMIT"       // Limite ressource (CPU/Mem) dépassée. (Nécessite optimisation script ou augmentation limites).  
      ERR\_SANDBOX\_SCRIPT\_ERROR        ErrorCode \= "SANDBOX\_SCRIPT\_ERROR"        // Le script lui-même a retourné une erreur (exit code non nul). L'erreur métier est dans Stderr du résultat, pas dans l'AppError.

      // General Tool Errors  
      ERR\_TOOL\_INTERNAL ErrorCode \= "TOOL\_INTERNAL\_ERROR" // Erreur interne générique et inattendue de l'outil. (Peut nécessiter retry ou investigation humaine).  
      ERR\_PERMISSION\_DENIED ErrorCode \= "PERMISSION\_DENIED" // L'agent appelant n'a pas la permission d'utiliser cet outil ou d'agir sur cette ressource. (Non récupérable directement).  
  )
  ```

* **Docstrings (Format Prescriptif pour LLM) :** Chaque outil DOIT avoir une docstring Go suivant **strictement** ce template :  

```
  // \[NomOutilGo\] : \[Objectif clair, concis, actionnable en une phrase\].  
  // Description: \[Détail du rôle, contexte d'utilisation précis, fonctionnement général, effets de bord importants\].  
  // Parameters:  
  //   \- param1 (typeGoSpécifique): \[Description très précise. Format attendu (ex: "UUID string valide"). Contraintes IMPÉRATIVES (ex: "DOIT exister dans Neo4j", "Longueur max 255 chars", "DOIT être une des valeurs TaskStatus: StatusQueued, StatusInProgress"). Signification exacte\].  
  //   \- param2 (\*typeGoSpécifique, optionnel): \[Description. Indiquer "optionnel". Comportement si nil/omis: "Utilise la valeur par défaut X", "Aucune action Y effectuée"\].  
  // Returns:  
  //   \- retour1 (typeGoSpécifique): \[Description très précise du retour succès. Ex: "TaskID (UUID string) unique de la tâche créée", "Pointeur vers struct TaskInfo; nil si tâche non trouvée"\].  
  //   \- error (\*AppError): Retourne nil en cas de succès. En cas d'échec, retourne une AppError structurée.  
  //     Codes d'erreur possibles: \[Lister EXHAUSTIVEMENT les ErrorCode spécifiques que cet outil peut retourner. Ex: ERR\_INVALID\_INPUT\_PARAM, ERR\_NEO4J\_NODE\_NOT\_FOUND, ERR\_S3\_ACCESS\_DENIED, ERR\_TOOL\_INTERNAL\].  
  // Préconditions: \[Lister les conditions IMPÉRATIVES avant appel. Ex: "Nœud parent DOIT exister", "Fichier S3 référencé DOIT exister"\].  
  // Postconditions (Succès): \[Décrire l'état du système après succès. Ex: "Nœud :Task créé et lié", "Statut mis à jour", "Fichier stocké dans S3"\].  
  // Idempotence: \[Indiquer: "Oui", "Non", ou "Oui (sous conditions: ...)"\].  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "\[Intention claire et concise\]"  
  //   Appel: \[Exemple d'appel Go réaliste avec types spécifiques\]  
  //   Retour (Succès): \[Exemple de retour succès réaliste\]  
  //   Retour (Erreur Typique): \[Exemple de retour \*AppError avec Code, Message, Context pertinents\]

```

### **2\. Outils d'Interaction Neo4j (Service neo4j\_service.go)**

**(Dépendance : Client Neo4j Go v5 injecté via interface Neo4jSessionExecutor)**

* **Types Go Spécifiques :**  
```go
  type MissionID string  
  type TaskID string  
  type AgentID string  
  type UserID string  
  type ArtifactID string // UUID pour le nœud :Artifact  
  type CapabilityName string  
  type ToolName string  
  type ValidationID string  
  type FailureID string  
  type TagName string  
  type S3Path string // Type pour les chemins S3 validés

  type TaskStatus string  
  const (  
      StatusQueued            TaskStatus \= "QUEUED"  
      StatusInProgress        TaskStatus \= "IN\_PROGRESS"  
      StatusPendingValidation TaskStatus \= "PENDING\_VALIDATION"  
      StatusValidated         TaskStatus \= "VALIDATED"  
      StatusDone              TaskStatus \= "DONE"  
      StatusFailed            TaskStatus \= "FAILED"  
      StatusCanceled          TaskStatus \= "CANCELED"  
  )  
  var ValidTaskStatuses \= map\[TaskStatus\]bool{  
      StatusQueued: true, StatusInProgress: true, StatusPendingValidation: true,  
      StatusValidated: true, StatusDone: true, StatusFailed: true, StatusCanceled: true,  
  }  
  // Définir constantes et maps de validation similaires pour AgentStatus et MissionStatus

* **Structs de Retour Détaillés :**  
  // TaskInfo contient les détails récupérés pour une tâche.  
  type TaskInfo struct {  
      ID                  TaskID              \`json:"id"\`  
      Name                \*string             \`json:"name,omitempty"\`  
      Description         string              \`json:"description"\`  
      Status              TaskStatus          \`json:"status"\`  
      Priority            \*int                \`json:"priority,omitempty"\`  
      CreatedAt           time.Time           \`json:"createdAt"\`  
      UpdatedAt           time.Time           \`json:"updatedAt"\`  
      TemporalWorkflowID  \*string             \`json:"temporalWorkflowID,omitempty"\`  
      ExpectedDeliverable \*string             \`json:"expectedDeliverable,omitempty"\`  
      ResultData          \*string             \`json:"resultData,omitempty"\` // Contenu JSON ou texte simple  
      Notes               \*string             \`json:"notes,omitempty"\`  
      ParentID            \*string             \`json:"parentID,omitempty"\` // ID de :Task ou :Mission parente  
      ChildTaskIDs        \[\]TaskID            \`json:"childTaskIDs,omitempty"\`  
      DependencyTaskIDs   \[\]TaskID            \`json:"dependencyTaskIDs,omitempty"\`  
      DependentTaskIDs    \[\]TaskID            \`json:"dependentTaskIDs,omitempty"\`  
      AssignedAgentID     \*AgentID            \`json:"assignedAgentID,omitempty"\`  
      ProducedArtifactIDs \[\]ArtifactID        \`json:"producedArtifactIDs,omitempty"\`  
      ConsumedArtifactIDs \[\]ArtifactID        \`json:"consumedArtifactIDs,omitempty"\`  
      RequiredCapabilities\[\]CapabilityName    \`json:"requiredCapabilities,omitempty"\`  
      ValidationID        \*ValidationID       \`json:"validationID,omitempty"\`  
      FailureID           \*FailureID          \`json:"failureID,omitempty"\`  
      MissionID           MissionID           \`json:"missionID"\`  
      PromptArtifactID    \*ArtifactID         \`json:"promptArtifactID,omitempty"\`  
      LogArtifactIDs      \[\]ArtifactID        \`json:"logArtifactIDs,omitempty"\`  
      Tags                \[\]TagName           \`json:"tags,omitempty"\`  
  }  
  // Définir d'autres structs (ex: ArtifactInfo { ID, Type, StoragePath, FileName, CreatedAt, UpdatedAt, Tags })

  ```

#### **2.1 Outil : CreateTaskNode**

* **Signature Go :**  

```go
  // CreateTaskNode: Crée un nouveau nœud :Task comme enfant d'une tâche ou mission parente.  
  // Description: Crée une nouvelle tâche avec une description et un statut initial. Lie la nouvelle tâche au nœud parent spécifié (qui peut être une :Task ou une :Mission via la relation appropriée). Retourne l'ID unique (UUID) de la nouvelle tâche. L'assignation à un agent ou l'ajout de dépendances se font via des appels séparés à AddRelationship.  
  // Parameters:  
  //   \- parentNodeID (string): ID (UUID string) du nœud parent (:Task ou :Mission). DOIT exister. Le type de relation (:IS\_CHILD\_OF ou :HAS\_ROOT\_TASK) sera déterminé par le type du nœud parent.  
  //   \- taskName (\*string, optionnel): Nom court optionnel pour la tâche (max 100 chars). Pointeur nil si non fourni.  
  //   \- description (string): Description détaillée de l'objectif de la tâche (max 2000 chars). DOIT être non vide.  
  //   \- initialStatus (TaskStatus): Statut initial (DOIT être une valeur valide de l'enum TaskStatus, typiquement StatusQueued).  
  // Returns:  
  //   \- newTaskID (TaskID): L'ID (UUID string) de la nouvelle tâche créée.  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil en cas de succès.  
  //     Codes d'erreur possibles: ERR\_INVALID\_INPUT\_PARAM (ID parent, statut, longueurs), ERR\_MISSING\_REQUIRED\_PARAM (description), ERR\_NEO4J\_NODE\_NOT\_FOUND (parent), ERR\_NEO4J\_QUERY\_ERROR, ERR\_NEO4J\_CONSTRAINT\_VIOLATION (collision UUID improbable), ERR\_TOOL\_INTERNAL.  
  // Préconditions: Le nœud parent (parentNodeID) doit exister. initialStatus doit être valide.  
  // Postconditions (Succès): Un nouveau nœud :Task est créé avec un UUID unique, les propriétés spécifiées, les timestamps, et est lié au parent.  
  // Idempotence: Non (chaque appel crée une nouvelle tâche unique).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Créer une sous-tâche pour 'Analyser les logs'."  
  //   Appel: CreateTaskNode(ctx, "parent-task-uuid-123", ptr("Analyse Logs"), "Analyser les logs d'erreur du service X pour identifier la cause racine.", StatusQueued)  
  //   Retour (Succès): ("new-task-uuid-456", nil)  
  func (s \*Neo4jService) CreateTaskNode(ctx context.Context, parentNodeID string, taskName \*string, description string, initialStatus TaskStatus) (TaskID, \*AppError)

* **Sécurité & Implémentation:** Valider format UUID parentNodeID. Vérifier existence et type du parent. Valider initialStatus contre ValidTaskStatuses. Valider longueurs. Générer nouvel TaskID (UUID). Utiliser transaction ExecuteWrite. Requête Cypher paramétrée. Gérer erreurs Neo4j \-\> \*AppError.  
* **Testabilité :** Mocker session Neo4j. Vérifier appel ExecuteWrite, requête, paramètres. Simuler succès, parent non trouvé, statut invalide (attrapé avant DB), erreur DB.

```

#### **2.2 Outil : GetTaskDetails**

* **Signature Go :**  

```go
  // GetTaskDetails: Récupère les informations détaillées d'une tâche via son ID.  
  // Description: Récupère toutes les propriétés et les IDs/Noms des nœuds directement liés (parent, enfants, dépendances, agent, artefacts produits/consommés, capacités, tags, validation, échec, mission, prompt, logs) pour une tâche spécifique. Essentiel pour obtenir le contexte complet d'une tâche.  
  // Parameters:  
  //   \- taskID (TaskID): ID (UUID string) de la tâche à récupérer. DOIT être un UUID valide.  
  // Returns:  
  //   \- taskInfo (\*TaskInfo): Pointeur vers la structure contenant les détails. Retourne nil si la tâche n'est pas trouvée.  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil si la tâche est trouvée ou non trouvée (vérifier taskInfo \!= nil pour distinguer).  
  //     Codes d'erreur possibles: ERR\_INVALID\_INPUT\_PARAM (format taskID), ERR\_NEO4J\_QUERY\_ERROR, ERR\_NEO4J\_CONNECTION\_ERROR, ERR\_TOOL\_INTERNAL.  
  // Idempotence: Oui (lecture seule).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Obtenir tous les détails de la tâche 'new-task-uuid-456' pour décider de la prochaine étape."  
  //   Appel: GetTaskDetails(ctx, TaskID("new-task-uuid-456"))  
  //   Retour (Succès): (\&TaskInfo{ID:"...", Status:StatusQueued, DependencyTaskIDs:\[\]TaskID{"dep-uuid-789"}, ...}, nil)  
  //   Retour (Non Trouvé): (nil, nil)  
  func (s \*Neo4jService) GetTaskDetails(ctx context.Context, taskID TaskID) (\*TaskInfo, \*AppError)

  ```

* **Sécurité & Implémentation:** Valider format taskID. Utiliser transaction ExecuteRead. Requête Cypher paramétrée complexe avec OPTIONAL MATCH et collect(distinct ...). Mapper résultat Neo4j vers TaskInfo. Gérer "non trouvé" ((nil, nil)).  
* **Testabilité :** Mocker session Neo4j. Vérifier appel ExecuteRead/Query, requête, paramètre. Simuler retour complet, partiel, vide. Simuler erreur DB.

#### **2.3 Outil : UpdateTaskStatus**

* **Signature Go :**  
```go
  // UpdateTaskStatus: Met à jour le statut et le timestamp updatedAt d'une tâche.  
  // Description: Change la propriété 'status' d'une tâche existante vers une nouvelle valeur valide. Met également à jour le timestamp 'updatedAt'. Vérifie que la tâche existe avant la mise à jour.  
  // Parameters:  
  //   \- taskID (TaskID): ID (UUID string) de la tâche. DOIT exister.  
  //   \- newStatus (TaskStatus): Nouveau statut. DOIT être une valeur valide de l'enum TaskStatus.  
  // Returns:  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil en cas de succès.  
  //     Codes d'erreur possibles: ERR\_INVALID\_INPUT\_PARAM (ID, statut invalide), ERR\_NEO4J\_NODE\_NOT\_FOUND, ERR\_NEO4J\_QUERY\_ERROR, ERR\_TOOL\_INTERNAL.  
  // Préconditions: La tâche (taskID) doit exister. Le newStatus doit être une valeur valide de TaskStatus.  
  // Postconditions (Succès): La propriété 'status' de la tâche est mise à jour, ainsi que 'updatedAt'.  
  // Idempotence: Oui (si appelée plusieurs fois avec le même newStatus).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Marquer la tâche 'new-task-uuid-456' comme 'IN\_PROGRESS'."  
  //   Appel: UpdateTaskStatus(ctx, TaskID("new-task-uuid-456"), StatusInProgress)  
  //   Retour (Succès): (nil)  
  func (s \*Neo4jService) UpdateTaskStatus(ctx context.Context, taskID TaskID, newStatus TaskStatus) \*AppError
```
* **Sécurité & Implémentation:** Valider taskID (format UUID). Valider newStatus contre ValidTaskStatuses. Utiliser transaction ExecuteWrite. Requête paramétrée (MATCH (t:Task {taskID: $id}) SET t.status \= $status, t.updatedAt \= datetime() RETURN count(t)). Vérifier count(t) \= 1\.  
* **Testabilité :** Mocker session Neo4j. Vérifier appel ExecuteWrite, requête, paramètres. Simuler succès (count=1), tâche non trouvée (count=0), statut invalide (attrapé avant DB), erreur DB.

#### **2.4 Outil : AddRelationship (Générique)**

* **Signature Go :** 
```go 
  // AddRelationship: Crée une relation orientée entre deux nœuds existants si elle n'existe pas déjà.  
  // Description: Établit un lien (relation) d'un type spécifié entre un nœud source et un nœud cible, en utilisant MERGE pour éviter les duplications. Utile pour créer des liens de dépendance, d'assignation, de tag, etc. Les types de relations autorisés sont strictement contrôlés.  
  // Parameters:  
  //   \- fromNodeID (string): ID (UUID string) du nœud de départ. DOIT exister.  
  //   \- toNodeID (string): ID (UUID string) du nœud d'arrivée. DOIT exister.  
  //   \- relationshipType (string): Type de la relation (UPPER\_SNAKE\_CASE). DOIT être dans la liste autorisée V1: \["DEPENDS\_ON", "ASSIGNED\_TO", "REQUIRES\_CAPABILITY", "HAS\_TAG", "PRODUCES\_ARTIFACT", "CONSUMES\_ARTIFACT", "USED\_PROMPT", "HAS\_EXECUTION\_LOG", "HAS\_ACCESS\_TO", "IMPLEMENTS", "VALIDATED\_BY", "IS\_CHILD\_OF", "HAS\_ROOT\_TASK", "PART\_OF", "CREATED\_BY"\].  
  // Returns:  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil en cas de succès (relation créée ou déjà existante).  
  //     Codes possibles: ERR\_INVALID\_INPUT\_PARAM (IDs, type relation invalide), ERR\_NEO4J\_NODE\_NOT\_FOUND (from ou to), ERR\_NEO4J\_QUERY\_ERROR, ERR\_TOOL\_INTERNAL.  
  // Préconditions: Les nœuds fromNodeID et toNodeID doivent exister. relationshipType doit être autorisé.  
  // Postconditions (Succès): Une relation du type spécifié existe entre les deux nœuds.  
  // Idempotence: Oui (grâce à MERGE).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Assigner l'agent 'agent-uuid-789' à la tâche 'task-uuid-456'."  
  //   Appel: AddRelationship(ctx, "task-uuid-456", "agent-uuid-789", "ASSIGNED\_TO")  
  //   Retour (Succès): (nil)  
  func (s \*Neo4jService) AddRelationship(ctx context.Context, fromNodeID string, toNodeID string, relationshipType string) \*AppError
```
* **Sécurité & Implémentation:** Valider format UUIDs. **Valider relationshipType contre une liste d'autorisation Go stricte (constantes)**. Utiliser transaction ExecuteWrite. Vérifier existence des nœuds from et to. Utiliser MERGE paramétré pour créer la relation. La construction dynamique du type de relation dans MERGE doit être faite **après validation stricte** pour éviter injection Cypher.  
* **Testabilité :** Mocker session Neo4j. Vérifier appel ExecuteWrite, requête Cypher (avec MERGE), paramètres. Simuler succès, nœuds non trouvés, type relation invalide, erreur DB.

#### **2.5 Outil : CheckTaskDependenciesCompletion**

* **Signature Go :**  
```go
  // CheckTaskDependenciesCompletion: Vérifie si toutes les tâches dont dépend la tâche donnée sont dans un état final considéré comme 'complété'.  
  // Description: Interroge les relations \[:DEPENDS\_ON\] sortantes de la tâche spécifiée et vérifie si le statut de TOUTES les tâches dépendantes est soit 'DONE' soit 'VALIDATED'. Retourne true si c'est le cas ou s'il n'y a aucune dépendance. Essentiel avant de passer une tâche dépendante à l'état 'QUEUED' ou 'IN\_PROGRESS'.  
  // Parameters:  
  //   \- taskID (TaskID): ID (UUID string) de la tâche dont on vérifie les dépendances. DOIT être un UUID valide.  
  // Returns:  
  //   \- allCompleted (bool): true si toutes les dépendances sont complétées (ou s'il n'y a pas de dépendances), false sinon.  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil en cas de succès (même si allCompleted est false).  
  //     Codes possibles: ERR\_INVALID\_INPUT\_PARAM, ERR\_NEO4J\_NODE\_NOT\_FOUND, ERR\_NEO4J\_QUERY\_ERROR, ERR\_TOOL\_INTERNAL.  
  // Idempotence: Oui (lecture seule).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Vérifier si je peux démarrer la tâche 'task-B-uuid' (qui dépend de 'task-A')."  
  //   Appel: CheckTaskDependenciesCompletion(ctx, TaskID("task-B-uuid"))  
  //   Retour (Succès, Dép. non finie): (false, nil)  
  func (s \*Neo4jService) CheckTaskDependenciesCompletion(ctx context.Context, taskID TaskID) (bool, \*AppError)
  ```

* **Sécurité & Implémentation:** Valider taskID. Utiliser transaction ExecuteRead. Requête Cypher paramétrée (MATCH (t:Task {taskID: $id}) OPTIONAL MATCH (t)-\[:DEPENDS\_ON\]-\>(dep:Task) WITH t, collect(dep) AS deps WHERE t IS NOT NULL RETURN size(deps) \= 0 OR all(d IN deps WHERE d.status IN \[$doneStatus, $validatedStatus\])). Gérer "not found".  
* **Testabilité :** Mocker session Neo4j. Vérifier appel ExecuteRead/Query, requête, paramètres. Simuler retour true (pas de deps), true (deps OK), false (deps non OK), tâche non trouvée, erreur DB.

### **3\. Outils d'Interaction S3 (Service s3\_service.go)**

**(Dépendance : Client S3 Go v2 injecté via interface S3APIClient)**

#### **3.1 Outil : StoreArtifact**

* **Signature Go (Streaming) :**  
```go
  // StoreArtifact: Téléverse le contenu d'un artefact depuis un lecteur vers S3.  
  // Description: Stocke le contenu fourni par contentReader dans le bucket S3 configuré, sous une clé unique générée basée sur un nouvel UUID et le nom nettoyé. Retourne l'ID de l'artefact (UUID) et le chemin S3 complet (clé S3). L'appelant doit ensuite créer le nœud :Artifact dans Neo4j et le lier à l'entité appropriée (ex: :Task).  
  // Parameters:  
  //   \- ownerEntityID (string): ID (UUID string) de l'entité propriétaire (ex: TaskID, MissionID). Utilisé pour la structure du chemin S3. DOIT être valide.  
  //   \- artifactName (string): Nom de fichier descriptif (sera nettoyé pour la clé S3, max 255 chars). DOIT être non vide.  
  //   \- contentReader (io.Reader): Lecteur fournissant le contenu de l'artefact. DOIT être non nil.  
  //   \- contentType (string): Type MIME (ex: "text/plain", "application/json", "image/png"). DOIT être non vide et valide.  
  //   \- size (int64): Taille exacte du contenu en octets. DOIT être \> 0 et \<= à la limite V1 configurée (ex: 20MB).  
  // Returns:  
  //   \- artifactID (ArtifactID): L'ID unique (UUID string) généré pour cet artefact.  
  //   \- storagePath (S3Path): Clé S3 unique où l'artefact a été stocké (ex: "artifacts/uuid-artifact/safe-name.log").  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil en cas de succès.  
  //     Codes possibles: ERR\_INVALID\_INPUT\_PARAM (taille, nom, type, ownerID), ERR\_S3\_SIZE\_LIMIT\_EXCEEDED, ERR\_S3\_UPLOAD\_FAILED, ERR\_S3\_ACCESS\_DENIED, ERR\_S3\_CONNECTION\_ERROR, ERR\_TOOL\_INTERNAL.  
  // Postconditions (Succès): L'artefact est stocké dans S3 sous le chemin retourné. Un ID unique est généré.  
  // Idempotence: Non (génère un UUID unique à chaque appel).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Stocker le log ('execution.log', contenu dans logReader, taille logSize) généré par la tâche 'task-uuid-123'."  
  //   Appel: StoreArtifact(ctx, TaskID("task-uuid-123"), "execution.log", logReader, "text/plain", logSize)  
  //   Retour (Succès): ("artifact-uuid-789", "artifacts/artifact-uuid-789/execution.log", nil)  
  //   LLM Action Suivante: Créer nœud :Artifact {artifactID:"artifact-uuid-789", storagePath:"...", ...} puis appeler AddRelationship(ctx, "task-uuid-123", "artifact-uuid-789", "HAS\_EXECUTION\_LOG").  
  func (s \*S3Service) StoreArtifact(ctx context.Context, ownerEntityID string, artifactName string, contentReader io.Reader, contentType string, size int64) (artifactID ArtifactID, storagePath S3Path, err \*AppError)

  ```

* **Sécurité & Implémentation:** Valider ownerEntityID, artifactName (nettoyer \+ longueur), contentType, size (limite V1). Générer un nouvel ArtifactID (UUID). Construire clé S3 sécurisée (artifacts/{artifactUUID}/{sanitizedName}). Utiliser s3.PutObject avec Body: io.LimitReader(contentReader, size), ContentLength: size, ContentType: contentType. Gérer erreurs SDK S3 \-\> \*AppError.  
* **Testabilité :** Mocker client S3. Vérifier appel PutObjectInput (Bucket, Key construite, Body, ContentLength, ContentType). Simuler succès et erreurs S3.

#### **3.2 Outil : RetrieveArtifact**

* **Signature Go (Streaming) :**  
```go
  // RetrieveArtifact: Récupère le contenu d'un artefact S3 sous forme de flux lisible.  
  // Description: Télécharge le contenu de l'artefact spécifié par son storagePath (clé S3). L'appelant est responsable de lire entièrement et de fermer le flux retourné (io.ReadCloser). Utile pour obtenir le contenu d'un input ou d'un script avant exécution.  
  // Parameters:  
  //   \- storagePath (S3Path): Clé S3 exacte de l'artefact (obtenue via Neo4j). DOIT être validée (format, préfixe 'artifacts/').  
  // Returns:  
  //   \- contentReadCloser (io.ReadCloser): Flux lisible pour le contenu. L'appelant DOIT le fermer via Close(). Retourne nil si l'artefact n'est pas trouvé.  
  //   \- error (\*AppError): Structure d'erreur standardisée. Retourne nil si l'artefact est trouvé ou non trouvé (vérifier contentReadCloser \!= nil pour distinguer).  
  //     Codes possibles: ERR\_INVALID\_INPUT\_PARAM (storagePath), ERR\_S3\_ARTIFACT\_NOT\_FOUND, ERR\_S3\_ACCESS\_DENIED, ERR\_S3\_DOWNLOAD\_FAILED, ERR\_S3\_CONNECTION\_ERROR, ERR\_TOOL\_INTERNAL.  
  // Idempotence: Oui (lecture seule).  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Récupérer le script Python stocké à 'artifacts/script-uuid-def/main.py'."  
  //   Appel: RetrieveArtifact(ctx, S3Path("artifacts/script-uuid-def/main.py"))  
  //   Retour (Succès): (reader, nil) \-\> Lire le script depuis \`reader\`, puis appeler \`reader.Close()\`.  
  //   Retour (Non Trouvé): (nil, nil)  
  func (s \*S3Service) RetrieveArtifact(ctx context.Context, storagePath S3Path) (contentReadCloser io.ReadCloser, err \*AppError)

  ```

* **Sécurité & Implémentation:** **Valider strictement storagePath** (doit commencer par artifacts/ ou préfixe configuré, pas de .., etc.). Utiliser s3.GetObject. Retourner le Body (io.ReadCloser). Gérer l'erreur NoSuchKey en retournant (nil, nil). Traduire autres erreurs S3 en \*AppError.  
* **Testabilité :** Mocker client S3. Vérifier appel GetObjectInput (Bucket, Key). Simuler succès (retournant GetObjectOutput avec Body mocké). Simuler erreurs (NoSuchKey, AccessDenied...).

### **4\. Outils d'Exécution Sandbox gVisor (Service sandbox\_service.go)**

**(Dépendance : Interface d'abstraction SandboxExecutor pour l'orchestration runsc)**

#### **4.1 Outil : ExecuteScriptInSandbox**

* **Signature Go (Config V1 Minimaliste) :**  
```go
  // SandboxConfig définit les options V1 minimales et sécurisées pour le sandbox.  
  type SandboxConfig struct {  
      // TimeoutSeconds: Max execution time in seconds. Default: 60\. Max: 300 (V1 limit). 0 ou négatif utilise le défaut.  
      TimeoutSeconds int \`json:"timeoutSeconds,omitempty"\`  
      // InputArtifacts: Map de chemins S3 vers chemins sandbox (lecture seule).  
      // Utilisé pour fournir des fichiers d'input au script. Les clés sont des S3Path validés.  
      // Les valeurs sont des chemins absolus DANS le sandbox (ex: "/inputs/data.csv").  
      // Le service Sandbox gère le téléchargement S3 et le montage sécurisé.  
      InputArtifacts map\[S3Path\]string \`json:"inputArtifacts,omitempty"\` // S3StoragePath \-\> SandboxPath (ReadOnly)  
      // NetworkPolicy: Définit la politique réseau. DOIT être une valeur de l'enum NetworkPolicy.  
      // Défaut: NetworkPolicyNone. NetworkPolicyOutboundLimited est TRES RESTREINT et à utiliser avec extrême prudence.  
      NetworkPolicy NetworkPolicy \`json:"networkPolicy,omitempty"\`  
  }

  type NetworkPolicy string  
  const (  
      NetworkPolicyNone             NetworkPolicy \= "NONE"              // Défaut: Aucun accès réseau.  
      NetworkPolicyOutboundLimited  NetworkPolicy \= "OUTBOUND\_LIMITED"  // Accès sortant très limité (ex: HTTPS ports standards vers domaines autorisés ? À définir précisément).  
  )  
  var ValidNetworkPolicies \= map\[NetworkPolicy\]bool{ NetworkPolicyNone: true, NetworkPolicyOutboundLimited: true }

  // SandboxExecutionResult contient les résultats.  
  type SandboxExecutionResult struct {  
      Stdout   string \`json:"stdout"\` // Capturé. Limite de taille appliquée (ex: 1MB).  
      Stderr   string \`json:"stderr"\` // Capturé. Limite de taille appliquée (ex: 1MB).  
      ExitCode int    \`json:"exitCode"\` // Code de sortie du script. 0 \= succès.  
      // Error est nil si le sandbox a pu exécuter le script (même si le script a échoué via ExitCode/Stderr).  
      Error    \*AppError \`json:"-"\` // Erreurs d'infrastructure du sandbox  
  }

  // ExecuteScriptInSandbox: Exécute un script de manière sécurisée dans gVisor.  
  // Description: Lance le script fourni ('scriptContent') avec l'interpréteur spécifié ('interpreter')  
  //              dans un sandbox gVisor hautement isolé (réseau désactivé, FS lecture seule par défaut).  
  //              Capture stdout, stderr, et le code de sortie. Les fichiers d'entrée sont fournis via S3 paths.  
  //              Le script est passé via stdin à l'interpréteur pour sécurité maximale.  
  // Parameters:  
  //   \- interpreter (string): Interpréteur autorisé. DOIT être 'python', 'bash', ou 'go run'.  
  //   \- scriptContent (string): Le code source du script à exécuter. DOIT être non vide.  
  //   \- config (\*SandboxConfig, optionnel): Configuration pour ajuster le timeout, les fichiers d'input (via S3),  
  //                             ou la politique réseau (DANGEREUX, utiliser NONE par défaut). Si nil, défauts sécurisés appliqués.  
  // Returns:  
  //   \- result (\*SandboxExecutionResult): Contient stdout, stderr, exitCode. result.Error est nil si le sandbox a fonctionné.  
  //                                      Vérifier ExitCode et Stderr pour le succès/échec du script lui-même.  
  //   \- error (\*AppError): Retourné SEULEMENT si le service sandbox lui-même échoue (setup, config invalide, etc.).  
  //     Codes possibles: ERR\_INVALID\_INPUT\_PARAM (interpreter, config, script vide, S3 path invalide),  
  //                      ERR\_SANDBOX\_INVALID\_INTERPRETER, ERR\_SANDBOX\_TIMEOUT, ERR\_SANDBOX\_SETUP\_FAILED,  
  //                      ERR\_SANDBOX\_EXECUTION\_FAILED, ERR\_SANDBOX\_RESOURCE\_LIMIT,  
  //                      ERR\_S3\_ARTIFACT\_NOT\_FOUND (pour les inputs), ERR\_PERMISSION\_DENIED (ex: network), ERR\_TOOL\_INTERNAL.  
  // Préconditions: L'interpréteur demandé et ses dépendances V1 DOIVENT être dans l'image gVisor. Les S3 paths dans InputArtifacts DOIVENT exister.  
  // Postconditions (Succès d'exécution sandbox): result contient les sorties. Aucun état persistant dans le sandbox.  
  // Idempotence: Non. Chaque appel lance une nouvelle exécution.  
  // Exemple d'Usage (Conceptuel):  
  //   LLM Intention: "Exécuter script Python 'content' qui lit '/inputs/data.csv' (provenant de S3 path 's3\_path')."  
  //   Config: \&SandboxConfig{ InputArtifacts: {S3Path("s3\_path"): "/inputs/data.csv"} }  
  //   Appel: ExecuteScriptInSandbox(ctx, "python", content, config)  
  //   Retour (Succès Script): (\&SandboxExecutionResult{Stdout:"Result: 42\\n", Stderr:"", ExitCode:0, Error:nil}, nil)  
  func (s \*SandboxService) ExecuteScriptInSandbox(ctx context.Context, interpreter string, scriptContent string, config \*SandboxConfig) (\*SandboxExecutionResult, \*AppError)

  ```

* **Sécurité & Implémentation:**  
  * **Validation Stricte interpreter** (liste blanche Go). Valider scriptContent non vide.  
  * **Validation config :** Valider TimeoutSeconds (appliquer défaut/max). Valider NetworkPolicy contre enum Go. Valider **chaque clé S3Path** dans InputArtifacts (format, préfixe) et chaque **chemin sandbox** (absolu, nettoyé, non sensible).  
  * **SandboxService Interne :**  
    * Télécharger les artefacts S3 (InputArtifacts) vers des fichiers hôtes temporaires **sécurisés et isolés**.  
    * Orchestrer runsc create avec spec OCI : rootfs RO, réseau configuré selon NetworkPolicy (défaut=NONE), limites CPU/Mem/PID, capacités minimales, seccomp strict, et les **montages bind RO** depuis les fichiers temporaires vers les chemins sandbox spécifiés.  
    * Passer scriptContent via **stdin** à runsc exec \[interpreter\] avec timeout.  
    * Capturer stdout/stderr (avec limites de taille).  
    * **Nettoyer systématiquement** sandbox (runsc delete) et fichiers temporaires.  
  * **Images de Base gVisor :** Préparer images OCI minimales avec Python3, Bash, Go et bibliothèques standards V1. **AUCUNE dépendance installée dynamiquement.**  
* **Testabilité :** Mocker l'interface SandboxExecutor. Simuler différents SandboxExecutionResult (succès, erreur script, timeout, OOM, erreur setup). Vérifier passage correct de interpreter, scriptContent (via stdin simulé), et options config (network, mounts, timeout) à la couche d'abstraction. Tester erreurs S3 lors du pré-téléchargement des inputs.

### **5\. Conclusion**

Cet ensemble d'outils V1, spécifié avec ces directives prescriptives, fournit une interface plus robuste, sécurisée et testable pour les agents LLM d'AutoAgent. L'implémentation devra suivre scrupuleusement ces spécifications, en particulier les aspects de sécurité, de validation des entrées, de gestion structurée des erreurs et de testabilité via l'injection de dépendances. L'accent mis sur le streaming S3 et l'abstraction sécurisée du sandbox gVisor vise à atteindre les standards de qualité requis, tout en restant pragmatique pour une première version.