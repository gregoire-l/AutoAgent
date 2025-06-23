# **Plan de Développement Stratégique Intégré - AutoAgent v1.0**

---

## **Rationale de cette Approche Intégrée**

Ce plan est conçu pour construire le système et l'agent en parfaite symbiose. Chaque phase fait progresser simultanément l'infrastructure technique et la maturité de l'agent. Cela permet de :
*   **Maintenir la Clarté :** Toujours savoir comment les briques techniques que vous construisez servent le concept d'agent.
*   **Réduire les Risques :** Valider à chaque étape que l'infrastructure peut bien supporter le concept d'agent prévu.
*   **Garder la Motivation :** À la fin de chaque phase, non seulement le système est plus robuste, mais l'agent lui-même devient plus "réel" et capable.

---

## **Phase 0 : L'Échafaudage - Préparation de l'Environnement**

**Objectif :** Établir une fondation de développement parfaitement stable et reproductible.

*   **Volet 1: Infrastructure & Capacités Système**
    *   **Tâches :**
        1.  Initialisation du dépôt Git avec une structure de branches (`main`/`develop`).
        2.  Mise en place du fichier `docker-compose.yml` racine.
        3.  Déclaration et lancement des services de base : **Neo4j** et **MinIO**.
        4.  Mise en place de la gestion de la configuration via les fichiers `.env`.
        5.  Création de la structure des projets Go (`/app-go`) et Python (`/app-python`).
        6.  Mise en place du workflow de CI (GitHub Actions) pour le linting initial.

*   **Volet 2: Cycle de Vie de l'Agent**
    *   **Tâche :**
        1.  **Point de Départ Conceptuel :** Formaliser dans un `README.md` ou un document de design la définition de ce qu'est un "Agent" dans le projet (Corps/Worker, CV/Profil, Délégation/Logique).

---

## **Phase 1 : La Colonne Vertébrale - Interconnexion et Naissance de l'Agent**

**Objectif :** Le système "s'allume" et l'agent "naît" dans la mémoire du système.

*   **Volet 1: Infrastructure & Capacités Système**
    *   **Tâches :**
        1.  Définition du contrat d'API **gRPC** initial (`/protos`) pour la communication Go-Python.
        2.  Intégration des services applicatifs Go et Python dans Docker Compose.
        3.  Intégration de **Temporal** et de son UI.
        4.  Intégration de **LiteLLM** comme gateway de LLM.
        5.  **Validation :** Tous les conteneurs démarrent et une requête de health-check de Go vers Python via gRPC fonctionne.

*   **Volet 2: Cycle de Vie de l'Agent**
    *   **Tâche :**
        1.  **Modélisation du Profil d'Agent (La "Naissance") :**
            *   Créer un script d'initialisation pour Neo4j.
            *   Ce script crée les premiers nœuds `:Capability` (ex: `code_execution_tool`).
            *   Il crée le premier nœud `:AgentProfile` (ex: `GenericGoWorker-v1`).
            *   Il lie le profil à ses capacités via une relation `[:HAS_CAPABILITY]`.
            *   **Résultat :** L'agent existe désormais en tant que concept défini et interrogeable dans le Knowledge Graph.

---

## **Phase 2 : Le "Happy Path" - Premier Acte de l'Agent**

**Objectif :** L'agent exécute sa première tâche de bout en bout.

*   **Volet 1: Infrastructure & Capacités Système**
    *   **Tâches :**
        1.  Intégration du sandboxing **E2B** (auto-hébergé).
        2.  Définition d'un premier workflow Temporal simple : `SimpleExecutionWorkflow`.
        3.  Implémentation de la logique pour stocker un artefact produit dans **MinIO**.
        4.  Implémentation de la logique pour écrire le résultat (nœuds `:Task`, `:Artifact`) dans **Neo4j**.

*   **Volet 2: Cycle de Vie de l'Agent**
    *   **Tâche :**
        1.  **Instanciation de l'Exécuteur (Le "Corps") :**
            *   Le Worker Go qui s'enregistre auprès de Temporal est notre premier `AgentExecutor`.
            *   Structurez-le dans un `struct` Go `AgentExecutor`.
            *   Ce worker écoute sur une file de tâches spécifique (ex: `generic-worker-queue`).
            *   Il implémente l'activité Temporal qui utilise E2B pour exécuter une action.
            *   **Résultat :** Le profil de l'agent dans Neo4j a maintenant un "corps" physique qui tourne et attend des instructions.

---

## **Phase 3 : L'Intelligence - L'Agent devient Autonome**

**Objectif :** Le système n'exécute plus des ordres, il délègue des tâches à l'agent compétent.

*   **Volet 1: Infrastructure & Capacités Système**
    *   **Tâches :**
        1.  Implémentation de la **Couche de Contexte** (GraphRAG V1) pour lire l'état dans Neo4j.
        2.  Implémentation de la **Couche de Délibération** (Moteur de Planification V1) qui utilise un LLM pour décomposer une tâche.
        3.  Implémentation de la **Couche de Validation** (Orchestrateur V1) qui utilise un LLM pour générer un plan de validation.

*   **Volet 2: Cycle de Vie de l'Agent**
    *   **Tâche :**
        1.  **Implémentation de la Délégation (Le "Cerveau d'Assignation") :**
            *   Intégrer le **Protocole d'Assignation (3.1)** dans le Moteur de Planification.
            *   Le moteur détermine la capacité requise pour une tâche.
            *   Il **interroge Neo4j** pour trouver le `:AgentProfile` ayant cette `:Capability`.
            *   Il utilise le nom du profil pour trouver la bonne file de tâches Temporal.
            *   Il **délègue** le travail en postant le job sur cette file.
            *   **Résultat :** L'agent gagne son autonomie. Le système peut maintenant prendre une mission, la décomposer et assigner le travail à l'agent approprié.

---

## **Phase 4 : L'Interface - L'Agent devient Observable**

**Objectif :** Exposer les capacités et l'état de l'agent à l'utilisateur.

*   **Volet 1: Infrastructure & Capacités Système**
    *   **Tâches :**
        1.  Développement de l'**API REST & WebSockets** pour l'interaction externe.
        2.  Développement du **Frontend React (HAAI V1)** pour afficher l'état et les résultats.
        3.  Mise en place de **MLflow** pour commencer à tracer les expériences.
        4.  Finalisation et test du script de **sauvegarde** de la base de données.

*   **Volet 2: Cycle de Vie de l'Agent**
    *   **Tâche :**
        1.  **Monitoring et Observabilité de l'Agent :**
            *   Créer un endpoint d'API `GET /agents`.
            *   Ce endpoint fusionne les informations de Neo4j (`:AgentProfile`, `:Capability`) et de l'API de Temporal (état des workers) pour donner une vue complète.
            *   Créer une vue "Status des Agents" dans le frontend React.
            *   **Résultat :** Le cycle de vie de l'agent est maintenant entièrement visible, de sa définition à son état opérationnel en temps réel.