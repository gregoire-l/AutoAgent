# Schéma Directeur Neo4j

_Version : 1.5 - Statut : Finalisé_

## **1. Introduction & Principes Architecturaux**

Ce document est la source de vérité pour la structure du Knowledge Graph (KG) qui motorise AutoAgent. Il a été conçu pour être la matérialisation de notre vision architecturale et a été audité contre les meilleures pratiques de l'industrie pour la modélisation de données, la performance et sa capacité à supporter des requêtes sémantiques avancées (GraphRAG).

### **1.1. Décisions de Conception Clés (Justifications)**

*   **Séparation des Graphes Conceptuels :** Le schéma est divisé en trois "espaces" logiques :
    1.  **`Common KG`** : La connaissance pérenne et les archétypes du système.
    2.  **`Factual KG`** : La mémoire autobiographique immuable, source de toute vérité et de tout apprentissage.
    3.  **`Potential KG`** : L'espace de travail éphémère pour la délibération et l'évaluation des futurs possibles.
    *   **Rationale :** Cette séparation garantit la clarté, la robustesse et la performance en isolant les domaines de requêtes et en protégeant l'intégrité des données factuelles.

*   **Distinction `:PotentialTask` vs. `:Task` :** Nous utilisons deux labels distincts pour séparer clairement les "options" des "faits".
    *   **Rationale :** Cela évite de polluer le graphe factuel avec des données de délibération, ce qui simplifie l'analyse et l'apprentissage. Chaque type de nœud peut avoir des index et des propriétés optimisés pour son rôle.

*   **Distinction `:Mission` vs. `:Task` :** Bien que conceptuellement fractal, nous gardons un label `:Mission` distinct.
    *   **Rationale :** Il sert de point d'entrée performant et sémantiquement clair pour les requêtes au niveau de la mission et pour la recherche de missions "similaires" (GraphRAG inter-mission).

*   **Utilisation de Labels Multiples :** La catégorisation se fait via des labels supplémentaires (ex: `:Task:ValidationTask`) plutôt que des propriétés de type.
    *   **Rationale :** C'est une meilleure pratique fondamentale dans Neo4j qui améliore massivement les performances des requêtes de filtrage grâce à une indexation plus efficace.

*   **Traçabilité avec la Couche d'Exécution :** Chaque nœud `:Task` contiendra une propriété `temporalWorkflowId`.
    *   **Rationale :** Créer un pont d'observabilité indispensable entre notre graphe de décision (le "Pourquoi") et le moteur de workflow Temporal (le "Comment").

---

## **2. Le Knowledge Graph Commun (Common KG)**

*Contient les connaissances stables, partagées et agnostiques des missions.*

### **2.1. Nœuds du Common KG**

*   **`:AgentProfile`**
    *   **Description :** L'archétype (template) d'un type d'agent, définissant ses capacités intrinsèques.
    *   **Propriétés :** `id: string`, `description: string`, `version: string`

*   **`:Capability`**
    *   **Description :** Une compétence abstraite que le système peut posséder (ex: "python_script_execution").
    *   **Propriétés :** `name: string`, `description: string`

*   **`:Tool`**
    *   **Description :** Un outil externe, formel et déterministe, décrit par son contrat d'interface.
    *   **Propriétés :** `name: string`, `version: string`, `endpoint: string`, `inputSchema: string (JSON Schema)`, `outputSchema: string (JSON Schema)`

*   **`:TaskArchetype`**
    *   **Description :** Un patron pour un type de tâche récurrent, utilisé pour la planification et l'amorçage du scoring.
    *   **Propriétés :** `name: string`, `description: string`

*   **`:MLModel`**
    *   **Description :** Une instance entraînée et versionnée d'un `Proxy Scorer` spécialisé (B1 ou B2).
    *   **Propriétés :** `id: string` (ex: "b1-lightgbm-v0.2"), `version: string`, `mlflowRunId: string`, `performanceMetrics: map`, `isActive: boolean`

### **2.2. Relations du Common KG**

*   **`(:AgentProfile)-[:HAS_CAPABILITY]->(:Capability)`**
*   **`(:Capability)-[:IMPLEMENTED_BY]->(:Tool)`**
*   **`(:TaskArchetype)-[:REQUIRES_CAPABILITY]->(:Capability)`**
*   **`(:MLModel)-[:PREDICTS_FOR {property: string}]->(:TaskArchetype)`** (La relation est enrichie pour spécifier la cible de la prédiction, ex: `property: "complexity"`)

---

## **3. Le Knowledge Graph Factuel (Factual KG)**

*Contient l'enregistrement immuable des faits avérés, spécifique à une mission (`missionID`). C'est la source de l'apprentissage.*

### **3.1. Nœuds du Factual KG**

*   **`:Mission`**
    *   **Description :** Le nœud racine pour une exécution complète. Point d'ancrage pour le GraphRAG inter-mission.
    *   **Propriétés :** `id: string`, `prompt: string`, `status: string`, `createdAt: datetime`, `promptVector: array<float>`

*   **`:Task`**
    *   **Description :** Une unité de travail concrète qui a été **exécutée**. Utilise des labels multiples pour la classification (ex: `:Task:CodeGeneration`, `:Task:ValidationTask`).
    *   **Propriétés :** `id: string`, `missionID: string`, `prompt: string`, `status: string ('completed', 'failed')`, `executionTimeMs: int`, `actualCost: float`, `temporalWorkflowId: string`

*   **`:Artefact`**
    *   **Description :** Un produit tangible et vérifié généré par une tâche. Utilise des labels multiples (ex: `:Artefact:PythonScript`, `:Artefact:MarkdownReport`).
    *   **Propriétés :** `id: string`, `missionID: string`, `path: string (S3 pointer)`, `hash: string (sha256)`

*   **`:Finding`**
    *   **Description :** Un résultat atomique et factuel issu d'un processus de validation.
    *   **Propriétés :** `id: string`, `missionID: string`, `description: string`, `severity: string`, `verdict: string`, `sourceTool: string`

*   **`:KnowledgeChunk`**
    *   **Description :** Un "morceau de connaissance", une affirmation sur le monde avec un niveau de confiance associé. C'est le cœur du réseau de croyances bayésien du système et un point d'ancrage pour le GraphRAG sémantique.
    *   **Propriétés :** `id: string` (hash du `statement`), `statement: string`, `confidence: float`, `source: string`, `lastUpdatedAt: datetime`, `statementVector: array<float>`

### **3.2. Relations du Factual KG**

*   **`(:Mission)-[:HAS_ROOT_TASK]->(:Task)`**
*   **`(:Task)-[:DECOMPOSED_FROM]->(:Task)`** (Trace la hiérarchie des tâches)
*   **`(:Task)-[:PRODUCED]->(:Artefact)`**
*   **`(:Task)-[:CONSUMED]->(:Artefact)`** (Dépendance)
*   **`(:Task)-[:GENERATED]->(:Finding)`** (Lie une tâche à ses résultats de validation)
*   **`(:Artefact)-[:IS_REVISION_OF]->(:Artefact)`** (Trace l'évolution d'un artefact)
*   **`(:Task)-[:UPDATED_KNOWLEDGE]->(:KnowledgeChunk)`** (Indique qu'une tâche a mené à une mise à jour de la confiance d'une connaissance)

---

## **4. Le Knowledge Graph de Potentiel (Potential KG)**

*Le "tableau blanc" éphémère pour la délibération, contenant les futurs possibles.*

### **4.1. Nœuds du Potential KG**

*   **`:PotentialTask`**
    *   **Description :** Une action future proposée, en attente d'évaluation et de décision. Utilise des labels multiples pour la classification (ex: `:PotentialTask:RefactoringOption`).
    *   **Propriétés :** `id: string`, `missionID: string`, `prompt: string`, `status: string ('proposed', 'evaluated', 'discarded')`

*   **`:Score`**
    *   **Description :** Contient les prédictions d'un `Proxy Scorer` pour une `:PotentialTask`.
    *   **Propriétés :** `predictedCost: float`, `predictedComplexity: float`, `predictedSuccessProbability: float`, `scorerModelId: string`

### **4.2. Relations du Potential KG**

*   **`(:PotentialTask)-[:IS_OPTION_FOR]->(:Task)`** (Lie une option à la tâche parente déjà exécutée)
*   **`(:PotentialTask)-[:AIMS_TO_VALIDATE]->(:KnowledgeChunk)`** (Lie une tâche de vérification potentielle à la connaissance qu'elle cherche à confirmer ou infirmer)
*   **`(:PotentialTask)-[:HAS_SCORE]->(:Score)`**
*   **`(:Score)-[:GENERATED_BY]->(:MLModel)`** (Crucial pour la traçabilité des prédictions)

---

## **5. Schéma Cypher d'Initialisation (Exemples de Contraintes)**

*Ce code doit être exécuté pour initialiser la base de données et garantir l'intégrité des données.*

```cypher
// --- Contraintes d'Unicité (Créent des index performants) ---
CREATE CONSTRAINT unique_capability_name IF NOT EXISTS FOR (c:Capability) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT unique_tool_name IF NOT EXISTS FOR (t:Tool) REQUIRE t.name IS UNIQUE;
CREATE CONSTRAINT unique_agent_profile_id IF NOT EXISTS FOR (ap:AgentProfile) REQUIRE ap.id IS UNIQUE;
CREATE CONSTRAINT unique_task_archetype_name IF NOT EXISTS FOR (ta:TaskArchetype) REQUIRE ta.name IS UNIQUE;
CREATE CONSTRAINT unique_ml_model_id IF NOT EXISTS FOR (m:MLModel) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT unique_mission_id IF NOT EXISTS FOR (m:Mission) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT unique_task_id IF NOT EXISTS FOR (t:Task) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT unique_artefact_id IF NOT EXISTS FOR (a:Artefact) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT unique_knowledge_chunk_id IF NOT EXISTS FOR (kc:KnowledgeChunk) REQUIRE kc.id IS UNIQUE;

// --- Index pour les recherches fréquentes (Non couverts par l'unicité) ---
CREATE INDEX task_mission_id_index IF NOT EXISTS FOR (t:Task) ON (t.missionID);
CREATE INDEX artefact_mission_id_index IF NOT EXISTS FOR (a:Artefact) ON (a.missionID);

// --- Index Vectoriels (Pour la recherche sémantique / GraphRAG) ---
// Note : Les dimensions (ex: 384) doivent correspondre au modèle d'embedding choisi.
CREATE VECTOR INDEX mission_prompt_vector IF NOT EXISTS FOR (m:Mission) ON (m.promptVector) OPTIONS {indexConfig: {`vector.dimensions`: 384, `vector.similarity_function`: 'cosine'}};
CREATE VECTOR INDEX knowledge_chunk_statement_vector IF NOT EXISTS FOR (kc:KnowledgeChunk) ON (kc.statementVector) OPTIONS {indexConfig: {`vector.dimensions`: 384, `vector.similarity_function`: 'cosine'}};