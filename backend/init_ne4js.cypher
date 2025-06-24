/*
 * =============================================================================
 * AutoAgent Knowledge Graph - Schema Initialization Script V1.5
 * =============================================================================
 *
 * Ce script est la source de vérité pour la structure de la base de données Neo4j.
 * Il doit être exécuté pour initialiser un nouvel environnement.
 * Il est conçu pour être idempotent : il peut être exécuté plusieurs fois en toute
 * sécurité grâce à l'utilisation de la clause "IF NOT EXISTS".
 *
 */

-- =============================================================================
-- Section 1: Contraintes d'Unicité (Common KG)
-- Ces contraintes garantissent l'unicité des entités de référence et créent
-- automatiquement des index ultra-performants sur ces propriétés.
-- =============================================================================

CREATE CONSTRAINT unique_capability_name IF NOT EXISTS FOR (c:Capability) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT unique_tool_name IF NOT EXISTS FOR (t:Tool) REQUIRE t.name IS UNIQUE;
CREATE CONSTRAINT unique_agent_profile_id IF NOT EXISTS FOR (ap:AgentProfile) REQUIRE ap.id IS UNIQUE;
CREATE CONSTRAINT unique_task_archetype_name IF NOT EXISTS FOR (ta:TaskArchetype) REQUIRE ta.name IS UNIQUE;
CREATE CONSTRAINT unique_ml_model_id IF NOT EXISTS FOR (m:MLModel) REQUIRE m.id IS UNIQUE;

-- =============================================================================
-- Section 2: Contraintes d'Unicité (Factual & Potential KG)
-- Garantit l'unicité des entités de mission par leur ID.
-- =============================================================================

CREATE CONSTRAINT unique_mission_id IF NOT EXISTS FOR (m:Mission) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT unique_task_id IF NOT EXISTS FOR (t:Task) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT unique_artefact_id IF NOT EXISTS FOR (a:Artefact) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT unique_knowledge_chunk_id IF NOT EXISTS FOR (kc:KnowledgeChunk) REQUIRE kc.id IS UNIQUE;
CREATE CONSTRAINT unique_potential_task_id IF NOT EXISTS FOR (pt:PotentialTask) REQUIRE pt.id IS UNIQUE;
-- Note: :Finding n'a pas de contrainte d'unicité sur son ID pour l'instant pour plus de flexibilité,
-- mais une unicité au niveau applicatif (via UUID) est attendue.

-- =============================================================================
-- Section 3: Index B-Tree
-- Index standards pour accélérer les recherches fréquentes sur des propriétés qui
-- ne sont pas uniques, typiquement les clés étrangères comme 'missionID'.
-- =============================================================================

CREATE INDEX index_task_missionid IF NOT EXISTS FOR (t:Task) ON (t.missionID);
CREATE INDEX index_artefact_missionid IF NOT EXISTS FOR (a:Artefact) ON (a.missionID);

-- =============================================================================
-- Section 4: Index Vectoriels (Pour la Recherche Sémantique / GraphRAG)
-- Ces index sont la pierre angulaire de nos capacités de recherche sémantique.
-- Les dimensions (ex: 384) doivent correspondre au modèle d'embedding choisi
-- (ex: all-MiniLM-L6-v2).
-- =============================================================================

CREATE VECTOR INDEX vector_mission_prompt IF NOT EXISTS FOR (m:Mission) ON (m.promptVector) 
OPTIONS {indexConfig: {
  `vector.dimensions`: 384, 
  `vector.similarity_function`: 'cosine'
}};

CREATE VECTOR INDEX vector_knowledge_chunk_statement IF NOT EXISTS FOR (kc:KnowledgeChunk) ON (kc.statementVector) 
OPTIONS {indexConfig: {
  `vector.dimensions`: 384, 
  `vector.similarity_function`: 'cosine'
}};

/*
 * =============================================================================
 * Fin du script de schéma.
 * =============================================================================
 */