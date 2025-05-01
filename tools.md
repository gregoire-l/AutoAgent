# **AutoAgent \- Outils LLM de Base v1.0**

Ce document définit un ensemble initial d'outils (tools) que les agents LLM du système AutoAgent peuvent utiliser pour interagir avec la base de données Dgraph (selon le schéma v1.4) et potentiellement d'autres composants système. Ces outils sont conçus pour être appelés par les LLMs et exécutés par le backend Go d'AutoAgent.

## **Principes de Conception des Outils**

* **Atomicité Logique :** Chaque outil vise à accomplir une action métier cohérente.  
* **Descriptions Claires :** Chaque outil possède une description précise de son but, de ses paramètres et de ce qu'il retourne, pour guider le choix de l'LLM.  
* **Validation et Sécurité :** L'implémentation Go de chaque outil doit valider rigoureusement les entrées, vérifier les permissions de l'agent appelant (basé sur son rôle/contexte), et gérer les erreurs proprement.  
* **Retours Informatifs :** Les outils retournent des informations utiles à l'LLM, y compris des messages d'erreur clairs en cas d'échec.  
* **Schémas Simples :** Les paramètres et les valeurs de retour utilisent des types de données simples (string, int, boolean, listes/objets simples) facilement manipulables par les LLMs.

## **Outils de Gestion des Tâches (Task Management)**

Ces outils permettent aux agents (principalement l'Orchestrateur ou les Spécialistes) de créer, modifier et interroger la structure des tâches.

1. **createTask**  
   * **Description :** Crée une nouvelle tâche enfant sous une tâche parente spécifiée. Nécessite la description, le contexte initial, la priorité et potentiellement les capacités requises. Retourne l'UID de la nouvelle tâche créée.  
   * **Paramètres :**  
     * parentTaskID (string, UID) : UID de la tâche parente.  
     * description (string) : Description détaillée de la tâche à accomplir.  
     * initialContext (string, optionnel) : Contexte spécifique fourni pour cette tâche.  
     * priority (int, optionnel, défaut=0) : Niveau de priorité.  
     * requiredCapabilities (list\[string\], optionnel) : Liste des noms des capacités requises (capabilityName).  
     * resourceLimits (string, optionnel) : JSON décrivant les limites de ressources.  
     * dependsOnTaskIDs (list\[string\], optionnel) : Liste des UIDs des tâches dont celle-ci dépend.  
   * **Retourne :** object { taskID: string } ou object { error: string }  
2. **getTaskDetails**  
   * **Description :** Récupère les informations détaillées d'une tâche spécifique par son UID, incluant son statut, sa description, ses relations (parent, enfants, dépendances, assignation, artefacts, etc.).  
   * **Paramètres :**  
     * taskID (string, UID) : UID de la tâche à récupérer.  
   * **Retourne :** object { taskDetails: object } (contenant les prédicats de la tâche et les UIDs des relations) ou object { error: string }  
3. **updateTaskStatus**  
   * **Description :** Met à jour le statut métier d'une tâche spécifique (ex: de QUEUED à IN\_PROGRESS, de IN\_PROGRESS à PENDING\_VALIDATION ou FAILED). L'agent doit justifier le changement de statut. Ne doit pas être utilisé pour marquer une tâche DONE (utiliser markTaskCompleted).  
   * **Paramètres :**  
     * taskID (string, UID) : UID de la tâche à mettre à jour.  
     * newStatus (string, enum: voir Task.taskStatus) : Nouveau statut de la tâche.  
     * statusReason (string, optionnel) : Courte justification du changement de statut.  
   * **Retourne :** object { success: boolean } ou object { error: string }  
4. **markTaskCompleted**  
   * **Description :** Marque une tâche comme terminée avec succès (DONE). Doit être utilisé lorsqu'une tâche a produit ses livrables attendus. Peut lier les artefacts produits.  
   * **Paramètres :**  
     * taskID (string, UID) : UID de la tâche à compléter.  
     * producedArtifactIDs (list\[string\], optionnel) : Liste des UIDs des artefacts produits par cette tâche.  
     * completionNotes (string, optionnel) : Notes finales sur l'accomplissement de la tâche.  
   * **Retourne :** object { success: boolean } ou object { error: string }  
5. **recordTaskFailure**  
   * **Description :** Enregistre l'échec d'une tâche. Met le statut de la tâche à FAILED et crée un FailureRecord associé avec les détails de l'erreur.  
   * **Paramètres :**  
     * taskID (string, UID) : UID de la tâche échouée.  
     * failureType (string) : Catégorie de l'erreur (ex: "ToolError", "LogicError", "ResourceLimitExceeded").  
     * errorMessage (string) : Message d'erreur concis.  
     * errorDetails (string, optionnel) : Informations techniques supplémentaires.  
   * **Retourne :** object { success: boolean, failureRecordID: string } ou object { error: string }  
6. **queryTasks**  
   * **Description :** Recherche des tâches basées sur divers critères (statut, priorité, agent assigné, parent, etc.). Utile pour obtenir une vue d'ensemble ou trouver des tâches spécifiques.  
   * **Paramètres (Exemples, à affiner) :**  
     * filterByStatus (list\[string\], optionnel) : Liste des statuts à inclure.  
     * filterByAgentID (string, optionnel) : UID de l'agent assigné.  
     * filterByParentID (string, optionnel) : UID de la tâche parente (pour lister les enfants directs).  
     * filterByProjectID (string, optionnel) : Pour lister toutes les tâches d'un projet (nécessite de remonter la hiérarchie ou d'indexer).  
     * sortBy (string, optionnel) : Champ de tri (ex: createdAt, taskPriority).  
     * limit (int, optionnel, défaut=20) : Nombre maximum de résultats.  
   * **Retourne :** object { tasks: list\[object\] } (liste d'objets Task simplifiés) ou object { error: string }

## **Outils de Gestion des Agents (Agent Management)**

Ces outils concernent la gestion et l'interrogation des agents eux-mêmes.

7. **findAvailableAgent**  
   * **Description :** Recherche un agent disponible (IDLE) possédant un ensemble de capacités requises. Utile pour l'assignation de tâches.  
   * **Paramètres :**  
     * requiredCapabilities (list\[string\]) : Liste des noms (capabilityName) des capacités nécessaires.  
     * agentTypeFilter (string, optionnel) : Pour ne rechercher que parmi un certain type d'agent.  
   * **Retourne :** object { agentID: string } (UID du premier agent trouvé) ou object { agentID: null, reason: string } (si aucun agent trouvé) ou object { error: string }  
8. **assignTaskToAgent**  
   * **Description :** Assigne formellement une tâche (qui doit être dans un statut approprié, ex: TODO ou QUEUED) à un agent spécifique. Met à jour la relation assignedTo de la tâche et potentiellement le currentTask et agentStatus de l'agent.  
   * **Paramètres :**  
     * taskID (string, UID) : UID de la tâche à assigner.  
     * agentID (string, UID) : UID de l'agent recevant la tâche.  
   * **Retourne :** object { success: boolean } ou object { error: string }  
9. **getAgentStatus**  
   * **Description :** Récupère le statut et la tâche actuelle d'un agent spécifique.  
   * **Paramètres :**  
     * agentID (string, UID) : UID de l'agent.  
   * **Retourne :** object { agentStatus: string, currentTaskID: string } ou object { error: string }

## **Outils de Gestion des Artefacts (Artifact Management)**

Permettent de gérer les fichiers et livrables.

10. **storeArtifact**  
    * **Description :** Permet à un agent de stocker un contenu (ex: code généré, texte, image) comme un artefact lié à une tâche. Le contenu est envoyé au backend Go qui le stocke dans le stockage objet (MinIO/S3) et crée l'entrée Artifact dans Dgraph avec le storagePath résultant. Retourne l'UID de l'artefact créé.  
    * **Paramètres :**  
      * taskID (string, UID) : UID de la tâche produisant cet artefact.  
      * artifactName (string) : Nom de fichier suggéré pour l'artefact.  
      * artifactType (string) : Type MIME ou catégorie (ex: log/text, sourcecode/go).  
      * content (string ou bytes) : Le contenu de l'artefact (gestion de l'encodage/taille à définir dans l'implémentation Go).  
      * isLog (boolean, optionnel, défaut=false) : Indique s'il s'agit d'un log (pour créer la relation logArtifact).  
    * **Retourne :** object { artifactID: string, storagePath: string } ou object { error: string }  
11. **getArtifactDetails**  
    * **Description :** Récupère les métadonnées d'un artefact (nom, type, chemin de stockage, tâche créatrice) depuis Dgraph. Ne retourne PAS le contenu.  
    * **Paramètres :**  
      * artifactID (string, UID) : UID de l'artefact.  
    * **Retourne :** object { artifactDetails: object } ou object { error: string }  
12. **retrieveArtifactContent** (Potentiellement Risqué/Coûteux)  
    * **Description :** Récupère le contenu réel d'un artefact depuis le stockage objet (MinIO/S3) via son artifactID ou storagePath. **Attention :** Peut retourner des données volumineuses. L'utilisation doit être limitée et justifiée. L'implémentation Go pourrait imposer des limites de taille.  
    * **Paramètres :**  
      * artifactID (string, UID) : UID de l'artefact.  
    * **Retourne :** object { content: string ou bytes } ou object { error: string }

## **Outils de Contexte et Mémoire**

Ces outils permettent aux agents d'interroger la couche de contexte dynamique (qui combine potentiellement Dgraph, Qdrant, Redis).

13. **findRelevantContext**  
    * **Description :** Outil principal pour la récupération de contexte. Interroge la couche de contexte (probablement la base vectorielle Qdrant en priorité, potentiellement augmentée par Dgraph) pour trouver des informations pertinentes (extraits de logs, tâches similaires passées, documents, etc.) basées sur une requête sémantique et/ou des filtres.  
    * **Paramètres :**  
      * query (string) : La question ou le sujet pour lequel chercher du contexte.  
      * filterCriteria (object, optionnel) : Filtres structurés (ex: projectID, taskID, agentType, timeRange, artifactType).  
      * maxResults (int, optionnel, défaut=5) : Nombre maximum de résultats pertinents à retourner.  
    * **Retourne :** object { contextSnippets: list\[object\] } (liste d'extraits de contexte avec source et score de pertinence) ou object { error: string }  
14. **getTaskContextGraph**  
    * **Description :** Récupère un sous-graphe pertinent autour d'une tâche spécifique depuis Dgraph, montrant ses relations directes (parent, enfants, dépendances, agent, artefacts I/O). Utile pour comprendre le contexte immédiat d'une tâche.  
    * **Paramètres :**  
      * taskID (string, UID) : UID de la tâche centrale.  
      * depth (int, optionnel, défaut=1) : Profondeur de la traversée du graphe à partir de la tâche.  
    * **Retourne :** object { graphData: object } (représentation du sous-graphe, ex: JSON avec nœuds et arêtes) ou object { error: string }

## **Prochaines Étapes**

* **Affiner les Paramètres/Retours :** Définir plus précisément les structures JSON pour les paramètres complexes (filterCriteria) et les objets retournés.  
* **Gestion des Permissions :** Définir quels types d'agents peuvent appeler quels outils.  
* **Implémentation Go :** Développer la logique réelle derrière chaque outil, incluant l'interaction avec Dgraph (dgo), Temporal, Qdrant, MinIO, et la gestion robuste des erreurs et de la sécurité.