# **AutoAgent \- Schéma Dgraph v1.4**

Ce document décrit la version 1.4 du schéma pour la base de données Dgraph, utilisée comme base principale pour le projet AutoAgent. Cette version intègre la gestion des logs, du contexte initial, le lien avec Temporal et la gestion structurée des erreurs.

## **Conventions**

* **Types :** Les noms de types commencent par une majuscule (ex: Task).  
* **Prédicats :** Les noms de prédicats sont en camelCase (ex: taskDescription). Les prédicats représentant des relations (arêtes) peuvent utiliser des noms plus descriptifs (ex: hasChild, assignedTo).  
* **Indexation :** Les types d'index (@index) sont indiqués pour faciliter les recherches courantes. Les types d'index courants utilisés sont :  
  * hash : Pour les recherches exactes sur des chaînes (souvent utilisé pour les identifiants uniques textuels ou les noms exacts).  
  * exact : Pour les recherches exactes sur des chaînes, nombres, booléens ou datetime. Utile pour les filtres sur les statuts (enums), les IDs, etc.  
  * term : Pour la recherche textuelle (tokenisation) sur des chaînes. Utile pour rechercher des mots dans les noms ou descriptions.  
  * hour : Pour indexer les datetime à l'heure près, utile pour les requêtes basées sur le temps.  
  * int : Pour indexer les nombres entiers.  
  * uid : Pour indexer les prédicats de type uid (relations), optimisant les requêtes qui filtrent ou trient sur ces relations.  
* **Relations Inverses (@reverse) :** Utilisé sur les prédicats de type uid ou \[uid\] pour permettre la navigation dans le graphe dans le sens inverse de l'arête définie.

## **Types Principaux**

### **Type : Project**

Représente un projet global initié par l'utilisateur.

type Project {  
    projectName         \# Nom du projet (string)  
    projectStatus       \# Statut global (enum: PENDING, IN\_PROGRESS, COMPLETED, FAILED) (string)  
    projectDescription  \# Description fournie par l'utilisateur (string)  
    rootMission         \# Relation vers la mission racine du projet (Task uid)  
    createdAt           \# Timestamp de création (datetime)  
    updatedAt           \# Timestamp de dernière mise à jour (datetime)  
}

projectName: string @index(hash) .  
projectStatus: string @index(exact) .  
createdAt: datetime @index(hour) .  
updatedAt: datetime @index(hour) .  
rootMission: uid @reverse .

### **Type : Mission**

Une Mission est conceptuellement le point de départ d'un projet ou d'une phase majeure. Dans ce schéma, elle est modélisée comme une Task racine, c'est-à-dire une Task qui n'a pas de parentTask.

### **Type : Task**

Représente une unité de travail décomposable dans la hiérarchie d'une mission. C'est l'élément central du workflow.

type Task {  
    taskDescription     \# Description détaillée de la tâche (string)  
    initialContext      \# Contexte initial spécifique fourni lors de la création/délégation (string, peut contenir du JSON ou référence)  
    taskStatus          \# Statut métier de la tâche (enum: TODO, QUEUED, IN\_PROGRESS, PENDING\_VALIDATION, VALIDATED, DONE, FAILED, CANCELED) (string)  
    taskPriority        \# Niveau de priorité pour l'ordonnancement (int)  
    resourceLimits      \# Contraintes de ressources pour l'exécution (ex: JSON string pour CPU, mémoire, temps max) (string)  
    temporalWorkflowID  \# ID unique du workflow Temporal associé à l'exécution de cette tâche (string)  
    createdAt           \# Timestamp de création du nœud Task (datetime)  
    updatedAt           \# Timestamp de la dernière mise à jour du nœud Task (datetime)  
    startedAt           \# Timestamp du début effectif de l'exécution (datetime)  
    completedAt         \# Timestamp de la fin de l'exécution (succès ou échec) (datetime)  
    assignedTo          \# Relation vers l'Agent responsable de l'exécution (Agent uid)  
    parentTask          \# Relation vers la Task parente dans la hiérarchie (Task uid)  
    hasChild            \# Relation vers les Task enfants directes (list\[Task uid\])  
    dependsOn           \# Relation vers les Tasks qui doivent être complétées avant celle-ci (list\[Task uid\])  
    blockedBy           \# Relation inverse: Tasks qui dépendent de celle-ci (list\[Task uid\])  
    consumesArtifact    \# Relation vers les Artifacts utilisés comme données d'entrée (list\[Artifact uid\])  
    producesArtifact    \# Relation vers les Artifacts générés comme résultat/livrable (list\[Artifact uid\])  
    logArtifact         \# Relation vers les Artifacts contenant les logs d'exécution (list\[Artifact uid\])  
    requiresCapability  \# Relation vers les Capabilities nécessaires pour exécuter la tâche (list\[Capability uid\])  
    validationRecord    \# Relation vers l'enregistrement de validation (si applicable) (ValidationRecord uid)  
    failureRecord       \# Relation vers l'enregistrement d'erreur (si la tâche a échoué) (FailureRecord uid)  
}

\# Définition des prédicats et index pour Task  
taskDescription: string .  
initialContext: string .  
taskStatus: string @index(exact) .  
taskPriority: int @index(int) .  
resourceLimits: string .  
temporalWorkflowID: string @index(exact) .  
createdAt: datetime @index(hour) .  
updatedAt: datetime @index(hour) .  
startedAt: datetime .  
completedAt: datetime .  
assignedTo: uid @reverse .  
parentTask: uid @reverse .  
hasChild: \[uid\] @reverse .  
dependsOn: \[uid\] @reverse .  
blockedBy: \[uid\] . \# Gérée par @reverse sur dependsOn  
consumesArtifact: \[uid\] @index(uid) @reverse .  
producesArtifact: \[uid\] @index(uid) @reverse .  
logArtifact: \[uid\] @index(uid) @reverse .  
requiresCapability: \[uid\] @index(uid) @reverse .  
validationRecord: uid @reverse .  
failureRecord: uid @reverse .

### **Type : Agent**

Représente une instance d'agent logiciel (LLM ou autre) opérant dans le système.

type Agent {  
    agentType           \# Type ou rôle principal de l'agent (enum: Orchestrator, CTO, UXDesigner, Verifier, Specialist\_Code...) (string)  
    agentStatus         \# Statut opérationnel courant de l'agent (enum: IDLE, BUSY, ERROR) (string)  
    currentTask         \# Relation vers la Task que l'agent est en train de traiter activement (Task uid)  
    hasCapability       \# Relation vers les Capabilities que cet agent possède ou auxquelles il a accès (list\[Capability uid\])  
    createdAt           \# Timestamp de création de l'instance d'agent (datetime)  
    lastHeartbeat       \# Timestamp du dernier signal indiquant que l'agent est actif (datetime)  
}

\# Définition des prédicats et index pour Agent  
agentType: string @index(exact) .  
agentStatus: string @index(exact) .  
currentTask: uid @reverse .  
hasCapability: \[uid\] @index(uid) @reverse .  
createdAt: datetime @index(hour) .  
lastHeartbeat: datetime @index(hour) .

### **Type : Capability**

Représente une compétence discrète, un outil accessible, ou une permission qu'un agent peut posséder ou qu'une tâche peut requérir.

type Capability {  
    capabilityName        \# Nom unique et identifiable de la capacité/outil (string)  
    capabilityDescription \# Description textuelle de ce que permet la capacité (string)  
}

\# Définition des prédicats et index pour Capability  
capabilityName: string @index(term) .  
capabilityDescription: string .

### **Type : Artifact**

Représente une donnée atomique produite ou consommée par une tâche, typiquement un fichier stocké externe mais référencé dans le graphe.

type Artifact {  
    artifactName        \# Nom du fichier ou de l'artefact (string)  
    artifactType        \# Type MIME, extension, ou catégorie sémantique (ex: 'log/text', 'image/png', 'application/json', 'sourcecode/go') (string)  
    storagePath         \# Identifiant unique (ex: chemin S3/MinIO, URI) pointant vers le contenu réel dans le stockage externe (string)  
    artifactSchemaRef   \# Référence optionnelle vers un schéma décrivant la structure de l'artefact (ex: URL JSON Schema, ID interne) (string)  
    createdByTask       \# Relation inverse vers la Task qui a produit cet artefact (Task uid)  
    consumedByTask      \# Relation inverse vers les Tasks qui utilisent cet artefact en entrée (list\[Task uid\])  
    logOfTask           \# Relation inverse vers la Task dont cet artefact contient les logs (Task uid)  
    createdAt           \# Timestamp de création de l'artefact (datetime)  
    \# Métadonnées potentielles : fileSize (int), contentHash (string), artifactDescription (string)  
}

\# Définition des prédicats et index pour Artifact  
artifactName: string @index(term) .  
artifactType: string @index(exact) .  
storagePath: string @index(exact) . \# Indexé pour recherche par chemin/ID externe  
artifactSchemaRef: string .  
createdByTask: uid @reverse .  
consumedByTask: \[uid\] . \# Gérée par @reverse sur consumesArtifact  
logOfTask: uid @reverse . \# Gérée par @reverse sur logArtifact  
createdAt: datetime @index(hour) .

### **Type : ValidationRecord**

Enregistre le résultat d'une étape de validation formelle d'une tâche, typiquement effectuée par un agent Verifier.

type ValidationRecord {  
    validationStatus    \# Résultat de la validation (enum: PASSED, FAILED, PENDING) (string)  
    validationComment   \# Commentaire ou justification du validateur (string)  
    validatedBy         \# Relation vers l'Agent qui a effectué la validation (Agent uid)  
    validatedTask       \# Relation inverse vers la Task qui a été validée (Task uid)  
    createdAt           \# Timestamp de l'enregistrement de la validation (datetime)  
}

\# Définition des prédicats et index pour ValidationRecord  
validationStatus: string @index(exact) .  
validationComment: string .  
validatedBy: uid @reverse .  
validatedTask: uid @reverse .  
createdAt: datetime @index(hour) .

### **Type : FailureRecord**

Enregistre des informations structurées lorsqu'une tâche échoue, pour faciliter le diagnostic et la reprise éventuelle.

type FailureRecord {  
    failureType         \# Catégorie de l'erreur pour classification (ex: "ActivityTimeout", "AgentCrash", "ValidationError", "ToolError", "ResourceLimitExceeded") (string)  
    errorMessage        \# Message d'erreur principal et concis (string)  
    errorDetails        \# Informations supplémentaires pour le debug (ex: JSON structuré, stack trace partielle, contexte d'erreur) (string)  
    failedTask          \# Relation inverse vers la Task qui a échoué (Task uid)  
    errorTimestamp      \# Timestamp précis de l'occurrence de l'erreur (datetime)  
}

\# Définition des prédicats et index pour FailureRecord  
failureType: string @index(exact) .  
errorMessage: string .  
errorDetails: string .  
failedTask: uid @reverse .  
errorTimestamp: datetime @index(hour) .

## **Conclusion de l'Ébauche v1.4**

Cette version 1.4 du schéma Dgraph fournit une base de données structurée et relationnelle pour représenter l'état principal du système AutoAgent. Elle est conçue pour intégrer :

* La structure hiérarchique et les dépendances des tâches.  
* L'assignation des tâches aux agents et le suivi de leurs capacités.  
* La gestion des artefacts (entrées, sorties, logs) via des références vers un stockage externe.  
* Les processus de validation et la capture structurée des erreurs.  
* Le lien nécessaire avec le moteur de workflow Temporal pour le suivi de l'exécution.

Les index définis visent à supporter les requêtes d'interrogation et de filtrage les plus courantes. Ce schéma constitue un point de départ solide pour l'implémentation, bien que des ajustements mineurs puissent émerger lors du développement détaillé des interactions et des outils.