## **AutoAgent \- Schéma Neo4j V1**

**Objectif :** Définir la structure de données initiale dans Neo4j pour supporter les fonctionnalités "Must-Have" d'AutoAgent V1, en visant clarté, cohérence, robustesse et extensibilité future, conformément aux meilleurs standards.

**Principes :**

* Utiliser des labels clairs et cohérents (PascalCase).  
* Définir les propriétés essentielles pour chaque type de nœud V1 (camelCase).  
* Modéliser les relations clés entre les nœuds (UPPER\_SNAKE\_CASE).  
* Identifier les index et contraintes nécessaires pour l'intégrité et la performance des requêtes V1.  
* Assurer une gestion cohérente des timestamps : **utiliser le type datetime de Neo4j et stocker toutes les valeurs en UTC**.  
* Utiliser des **UUIDs (stockés comme string)** pour tous les identifiants uniques primaires.

### **Labels Principaux (Nœuds)**

1. **:Mission**  
   * Représente une mission complète déléguée par l'utilisateur.  
   * **Propriétés V1 :**  
     * missionID (string, **UUID**, unique, indexé) \- Identifiant unique global de la mission.  
     * name (string) \- Nom/Titre donné à la mission.  
     * description (string) \- Description détaillée fournie par l'utilisateur.  
     * initialContext (string, optionnel) \- Contexte initial spécifique fourni (peut être JSON ; opaque pour Neo4j).  
     * status (string, indexé) \- Statut global. **Valeurs V1 Valides (appliquées par Go) :** "DEFINING", "RUNNING", "PAUSED", "COMPLETED", "FAILED", "CANCELED".  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
     * maxDurationSeconds (integer, optionnel) \- Limite de durée.  
     * maxTokens (integer, optionnel) \- Limite de tokens LLM.  
     * maxBudget (float, optionnel) \- Limite budgétaire.  
     * notes (string, optionnel) \- Annotations générales.  
   * **Relations V1 :**  
     * \[:HAS\_ROOT\_TASK\] \-\> (:Task) \- Relation vers la ou les tâches racines.  
     * \[:CREATED\_BY\] \-\> (:User) \- Utilisateur ayant créé la mission.  
     * \[:HAS\_TAG\] \-\> (:Tag) \- Tags associés à la mission (N-N).  
2. **:Task**  
   * Représente une tâche ou sous-tâche au sein d'une mission.  
   * **Propriétés V1 :**  
     * taskID (string, **UUID**, unique, indexé) \- Identifiant unique global de la tâche.  
     * taskName (string, optionnel) \- Nom court pour affichage.  
     * description (string) \- Description de la tâche.  
     * status (string, indexé) \- Statut détaillé. **Valeurs V1 Valides (appliquées par Go) :** "QUEUED", "IN\_PROGRESS", "PENDING\_VALIDATION", "VALIDATED", "DONE", "FAILED", "CANCELED".  
     * priority (integer, optionnel) \- Niveau de priorité (absence signifie priorité par défaut).  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
     * temporalWorkflowID (string, optionnel, indexé) \- ID du workflow Temporal exécutant cette tâche.  
     * expectedDeliverable (string, optionnel) \- Description du livrable attendu.  
     * resultData (string, optionnel) \- Stockage de résultats simples non-fichier (peut être JSON ; opaque pour Neo4j).  
     * notes (string, optionnel) \- Annotations générales.  
   * **Relations V1 :**  
     * \[:IS\_CHILD\_OF\] \-\> (:Task) \- Lien vers la tâche parente (hiérarchie).  
     * \[:DEPENDS\_ON\] \-\> (:Task) \- Dépendance (cette tâche doit attendre que l'autre soit DONE ou VALIDATED).  
     * \[:ASSIGNED\_TO\] \-\> (:Agent) \- Agent responsable. **Contrainte V1 (logique Go) : Doit être 1-1.**  
     * \[:PRODUCES\_ARTIFACT\] \-\> (:Artifact) \- Artefact(s) généré(s) par cette tâche.  
     * \[:CONSUMES\_ARTIFACT\] \-\> (:Artifact) \- Artefact(s) utilisé(s) en entrée.  
     * \[:REQUIRES\_CAPABILITY\] \-\> (:Capability) \- Compétence(s) abstraite(s) nécessaire(s).  
     * \[:HAS\_VALIDATION\] \-\> (:ValidationRecord) \- Lien vers l'enregistrement de validation.  
     * \[:HAS\_FAILURE\] \-\> (:FailureRecord) \- Lien vers l'enregistrement d'erreur.  
     * \[:PART\_OF\] \-\> (:Mission) \- Lien vers la mission globale.  
     * \[:USED\_PROMPT\] \-\> (:Artifact {artifactType:"prompt/text"}) \- Lien vers l'artefact contenant le prompt spécifique utilisé.  
     * \[:HAS\_EXECUTION\_LOG\] \-\> (:Artifact {artifactType:"log/text"}) \- Lien vers l'artefact contenant les logs d'exécution.  
     * \[:HAS\_TAG\] \-\> (:Tag) \- Tags associés à la tâche (N-N).  
3. **:Agent**  
   * Représente une instance d'agent logiciel.  
   * **Propriétés V1 :**  
     * agentID (string, **UUID**, unique, indexé) \- Identifiant unique global de l'agent.e me d  
     * agentType (string, indexé) \- Type/Rôle. **Valeurs V1 Suggérées :** "Orchestrator", "Verifier", "ScriptExecutor", "CodeGenerator".  
     * status (string, indexé) \- Statut opérationnel. **Valeurs V1 Valides (appliquées par Go) :** "IDLE", "EXECUTING", "ERROR", "DISABLED".  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
   * **Relations V1 :**  
     * \[:ASSIGNED\_TO\] \<- (:Task) \- Tâches actuellement assignées.  
     * \[:HAS\_CAPABILITY\] \-\> (:Capability) \- Compétences abstraites possédées.  
     * \[:HAS\_ACCESS\_TO\] \-\> (:Tool) \- Outils concrets auxquels cet agent a accès dans son environnement.  
4. **:User**  
   * Représente un utilisateur humain du système.  
   * **Propriétés V1 :**  
     * userID (string, **UUID**, unique, indexé) \- Identifiant unique global (peut être dérivé d'un login).  
     * name (string, optionnel) \- Nom de l'utilisateur.  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
   * **Relations V1 :**  
     * \[:CREATED\_BY\] \<- (:Mission) \- Missions créées par cet utilisateur.  
     * \[:VALIDATED\_BY\] \<- (:ValidationRecord) \- Validations effectuées par cet utilisateur.  
5. **:Artifact**  
   * Représente un livrable ou une donnée produite/consommée (fichier, log, prompt...).  
   * **Propriétés V1 :**  
     * artifactID (string, **UUID**, unique, indexé) \- Identifiant unique global.  
     * artifactType (string, indexé) \- Type MIME ou sémantique (ex: "log/text", "code/go", "image/png", "document/markdown", "prompt/text").  
     * storagePath (string) \- Chemin unique vers le fichier dans le stockage S3/MinIO.  
     * fileName (string, optionnel) \- Nom original du fichier pour référence.  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
   * **Relations V1 :**  
     * \[:PRODUCES\_ARTIFACT\] \<- (:Task) \- Tâche ayant produit cet artefact.  
     * \[:CONSUMES\_ARTIFACT\] \<- (:Task) \- Tâches consommant cet artefact.  
     * \[:USED\_PROMPT\] \<- (:Task) \- Tâche ayant utilisé ce prompt.  
     * \[:HAS\_EXECUTION\_LOG\] \<- (:Task) \- Tâche ayant généré ce log.  
     * \[:HAS\_TAG\] \-\> (:Tag) \- Tags associés à l'artefact (N-N).  
6. **:Tag**  
   * Représente un tag ou mot-clé pour classifier des entités.  
   * **Propriétés V1 :**  
     * tagName (string, unique, indexé) \- Le tag lui-même (sensible à la casse ? À définir).  
     * createdAt (datetime) \- Timestamp de création (UTC).  
   * **Relations V1 :**  
     * \[:HAS\_TAG\] \<- (:Mission | :Task | :Artifact) \- Entités associées à ce tag.  
7. **:Capability**  
   * Représente une compétence ou capacité abstraite requise/possédée.  
   * **Propriétés V1 :**  
     * capabilityName (string, unique, indexé) \- Nom unique (ex: "execute\_python\_script", "generate\_react\_component").  
     * description (string, optionnel).  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
   * **Relations V1 :**  
     * \[:REQUIRES\_CAPABILITY\] \<- (:Task) \- Tâches nécessitant cette capacité.  
     * \[:HAS\_CAPABILITY\] \<- (:Agent) \- Agents possédant cette capacité.  
     * \[:IMPLEMENTED\_BY\] \<- (:Tool) \- Outils implémentant cette capacité.  
8. **:Tool**  
   * Représente un outil logiciel ou une fonction spécifique utilisable par un agent.  
   * **Propriétés V1 :**  
     * toolName (string, unique, indexé) \- Nom unique de l'outil (ex: "PythonExecutorTool", "S3UploaderTool", "Neo4jTaskCreatorTool").  
     * description (string, optionnel).  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
   * **Relations V1 :**  
     * \[:IMPLEMENTS\] \-\> (:Capability) \- Capacité(s) fournie(s) par cet outil.  
     * \[:HAS\_ACCESS\_TO\] \<- (:Agent) \- Agents ayant accès à cet outil.  
9. **:ValidationRecord**  
   * Stocke le résultat d'une validation.  
   * **Propriétés V1 :**  
     * validationID (string, **UUID**, unique, indexé).  
     * result (string) \- **Valeurs V1 Valides :** "VALIDATED", "INVALIDATED".  
     * feedback (string, optionnel) \- Justification si invalidé.  
     * validatedAt (datetime) \- Timestamp de validation (UTC).  
     * createdAt (datetime) \- Timestamp de création (UTC).  
     * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
   * **Relations V1 :**  
     * \[:HAS\_VALIDATION\] \<- (:Task) \- Tâche concernée.  
     * \[:VALIDATED\_BY\] \-\> (:User | :Agent) \- Entité ayant validé.  
10. **:FailureRecord**  
    * Stocke les détails d'un échec de tâche.  
    * **Propriétés V1 :**  
      * failureID (string, **UUID**, unique, indexé).  
      * failureType (string) \- Ex: "ActivityTimeout", "AgentCrash", "ToolError", "ValidationError", "ScriptError".  
      * errorMessage (string).  
      * errorDetails (string, optionnel) \- Peut contenir stack trace, logs courts ; opaque pour Neo4j.  
      * failedAt (datetime) \- Timestamp de l'échec (UTC).  
      * createdAt (datetime) \- Timestamp de création (UTC).  
      * updatedAt (datetime) \- Timestamp dernière mise à jour (UTC).  
    * **Relations V1 :**  
      * \[:HAS\_FAILURE\] \<- (:Task) \- Tâche concernée.

### **Index et Contraintes V1 Proposés**

* **Contraintes d'Unicité (impliquent un index) :**  
  * CONSTRAINT ON (m:Mission) ASSERT m.missionID IS UNIQUE  
  * CONSTRAINT ON (t:Task) ASSERT t.taskID IS UNIQUE  
  * CONSTRAINT ON (a:Agent) ASSERT a.agentID IS UNIQUE  
  * CONSTRAINT ON (u:User) ASSERT u.userID IS UNIQUE  
  * CONSTRAINT ON (art:Artifact) ASSERT art.artifactID IS UNIQUE  
  * CONSTRAINT ON (tag:Tag) ASSERT tag.tagName IS UNIQUE  
  * CONSTRAINT ON (c:Capability) ASSERT c.capabilityName IS UNIQUE  
  * CONSTRAINT ON (tool:Tool) ASSERT tool.toolName IS UNIQUE  
  * CONSTRAINT ON (v:ValidationRecord) ASSERT v.validationID IS UNIQUE  
  * CONSTRAINT ON (f:FailureRecord) ASSERT f.failureID IS UNIQUE  
* **Index Secondaires (pour performance des requêtes) :**  
  * INDEX ON :Mission(status)  
  * INDEX ON :Task(status)  
  * INDEX ON :Task(temporalWorkflowID)  
  * INDEX ON :Agent(status)  
  * INDEX ON :Agent(agentType)  
  * INDEX ON :Artifact(artifactType)  
  * *Note : L'index sur :Artifact(tags) n'est plus nécessaire avec les nœuds :Tag.*

### **Conventions de Schéma**

* **Labels :** PascalCase (ex: :Task, :Mission).  
* **Propriétés :** camelCase (ex: taskID, createdAt).  
* **Types de Relations :** UPPER\_SNAKE\_CASE (ex: :IS\_CHILD\_OF, :DEPENDS\_ON).  
* **Timestamps :** Utiliser le type datetime de Neo4j, stocker en **UTC**.  
* **Identifiants :** Utiliser des **UUIDs** (stockés comme string) pour les IDs primaires.

### **Points à Affiner (Post-V1)**

* Gestion des versions d'artefacts.  
* Historique détaillé des changements de statut métier (potentiellement via propriétés sur relations ou nœuds :StatusEvent).  
* Modélisation plus fine des dépendances de tâches (types, délais).  
* Ajout de propriétés sur les relations (ex: timestamp sur :ASSIGNED\_TO).  
* Index composites basés sur des analyses de requêtes plus poussées.