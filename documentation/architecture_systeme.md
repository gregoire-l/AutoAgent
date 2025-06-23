# **Document d'Architecture Consolidé : AutoAgent v1.0**
_Version Finale - Vision & Stack Technique_

---

## **Partie 1 : Vision Architecturale Fondamentale (Document Original)**

_Cette section est la reproduction exacte du document d'architecture initial, préservant l'intégralité de la vision et des concepts fondamentaux._

### **1. Vision et Principes Architecturaux Fondamentaux**

#### **1.1. Vision**

AutoAgent est un système multi-agents autonome conçu pour exécuter des missions complexes et hétérogènes, allant de la génération de code à la production de rapports d'analyse stratégique.

#### **1.2. Principes Architecturaux**

L'architecture d'AutoAgent est une **symbiose neuro-symbolique hybride**, conçue pour capitaliser sur les forces respectives des modèles de langage étendus (LLM) et des systèmes algorithmiques formels.

1.  **Séparation Stricte des Responsabilités (Inspiration MRKL) :** Le système s'inspire du patron d'architecture **MRKL (Modular Reasoning, Knowledge, and Language Systems)**.
    *   **Le LLM comme Orchestrateur Sémantique :** Les LLMs sont utilisés exclusivement pour les tâches nécessitant une compréhension ou une génération sémantique.
    *   **Les Outils Formels comme Exécutants Fiables :** Toute action nécessitant une correction logique, factuelle ou une interaction déterministe est déléguée à un outil externe spécialisé et vérifiable.

2.  **Gestion Explicite de l'Incertitude :** Le système traite toute information non factuelle comme une **hypothèse** avec un **score de confiance** associé. Son objectif est de réduire activement l'incertitude en validant ou en réfutant les hypothèses les plus critiques.

3.  **Validation par Preuve Externe :** La qualité et la correction d'un artefact sont **prouvées** par des mécanismes de validation externes, objectifs et reproductibles.

4.  **Résolution de Problèmes Récursive :** Chaque tâche, quelle que soit son échelle, est traitée comme un problème à résoudre via le même processus de délibération, contraint par un budget de ressources alloué dynamiquement.

### **2. Architecture des Composants Fondamentaux**

L'architecture se décompose en services et couches logiques distincts, implémentés en Go et conçus pour fonctionner sur une machine de développement standard.

#### **2.1. Couche de Connaissance et d'État (La Mémoire)**

*   **Knowledge Graph (Neo4j) :** Le système nerveux central. L'isolation des missions est gérée **logiquement** via un `missionID`.
    *   **Common KG :** Un sous-graphe permanent stockant les connaissances stables (archétypes de tâches, capacités des agents, modèles de validation).
    *   **Mission KGs (Logiques) :** Des sous-graphes dynamiques contenant le **Graphe Factuel** (état vérifié) et le **Graphe de Potentiel** (chemins, tâches et hypothèses futurs).
*   **Stockage d'Artefacts (MinIO / S3-like) :** Stocke les fichiers volumineux ("blobs"). Le KG ne contient que les métadonnées et un pointeur.

#### **2.2. Couche de Contexte (Le Système Attentionnel)**

*   **Rôle :** Ce service est le pont entre la "mémoire à long terme" (le KG) et la "mémoire de travail" (la fenêtre de contexte du LLM). Il implémente une stratégie de **GraphRAG**.
*   **Mécanisme :** Il assemble un contexte pertinent en combinant des traversées structurelles (Cypher) et de la recherche sémantique (index vectoriels Neo4j).

#### **2.3. Couche de Délibération (Le Moteur de Décision)**

C'est le "cerveau" qui implémente un processus de planification itératif et probabiliste.

*   **Moteur de Planification Itérative :**
    *   **Générateur d'Options (assisté par LLM) :** Propose des décompositions de tâches et des stratégies.
    *   **Proxy Scorer (Juge Heuristique) :**
        *   **Nature (V1) :** Modèles **LightGBM mono-tâche** qui prédisent le coût, la probabilité de succès, et la **complexité** d'une tâche potentielle.
        *   **Amorçage (V1) :** Le scoring initial est basé sur des **heuristiques simples codées en dur**.
    *   **Algorithme d'Exploration :** Un algorithme de recherche (inspiré de MCTS) explore le graphe de potentiel.
*   **Boucle de Réflexion à Gain Décroissant :** Le moteur de planification s'arrête lorsque le gain d'information d'une exploration supplémentaire devient marginal.
*   **Moteur de Décision :**
    *   **Analyseur de Criticité :** Identifie les décisions les plus importantes ou incertaines.
    *   **Optimiseur Multi-Objectifs :** Évalue les chemins prometteurs pour identifier le **Front de Pareto** des meilleurs compromis.
    *   **Sélecteur d'Action ("Point de Levier") :** Décide de l'action suivante : une tâche de **construction** ou une tâche de **vérification**.

#### **2.4. Couche de Validation (Le Système de Contrôle Qualité)**

Ce composant garantit la qualité et la correction des artefacts produits.

*   **Orchestrateur de Validation (V1) :** Utilise un LLM comme un **routeur stratégique** pour générer un **plan de validation** adapté à l'artefact.
*   **Modules de Validation Spécifiques :** Pipelines distincts pour le code et le qualitatif, s'appuyant sur des outils formels externes.
*   **Ground-Truth Scorer :** Agrège les résultats de validation pour produire un verdict fondé sur des preuves et générer des **données d'entraînement** pour le `Proxy Scorer`.

#### **2.5. Couche d'Exécution (Les Effecteurs)**

*   **Moteur de Workflow (Temporal) :** Assure l'exécution fiable de chaque tâche atomique et gère l'**autonomie temporelle**.
*   **Agents Exécuteurs :** Des workers Go spécialisés.
*   **Boîte à Outils (`ToolService`) :** L'interface unique de l'agent avec son environnement, fournissant des outils fiables et versionnés.

### **3. Protocoles et Processus Transversaux**

Ces protocoles ne sont pas des couches, mais des ensembles de règles et de mécanismes qui régissent les interactions entre les composants.

#### **3.1. Protocole de Gestion des Capacités et d'Assignation des Tâches**

Ce protocole formalise comment le système assigne les tâches aux agents appropriés.

*   **Modèle de Capacités :** Le Common KG contient des nœuds `:Capability` (ex: `capability: "python_script_execution"`).
*   **Registre d'Agents :** Chaque agent (ou type d'agent) est un nœud `:AgentProfile` dans le KG, lié aux nœuds `:Capability` qu'il possède.
*   **Processus d'Assignation :**
    1.  L'Orchestrateur identifie les capacités requises pour une tâche (en utilisant un LLM pour l'analyse sémantique).
    2.  Il interroge le KG pour trouver les agents disponibles possédant ces capacités.
    3.  Il assigne la tâche à l'agent le plus pertinent (en fonction de la charge, de la disponibilité, etc.).

#### **3.2. Protocole de Coordination Multi-Agents**

Ce protocole gère la collaboration et les conflits entre agents opérant en parallèle.

*   **Communication Inter-Agents (V1 - Canaux Go) :** La communication est gérée de manière **directe et performante** via des **canaux Go (`chan`)** au sein du processus unique, orchestrée par un `Dispatcher`.
*   **Gestion des Artefacts et des Conflits (Paradigme "Git-like" sur S3) :** Le système adopte un paradigme inspiré de **Git** pour la collaboration sur les artefacts. Les agents travaillent sur des **branches de tâches** isolées. Les modifications sont intégrées via un processus de **"Merge Request"**.

#### **3.3. Protocole d'Interaction Homme-Agent (HAAI)**

L'HAAI est un **espace de travail cognitif partagé** entre l'utilisateur et le système.

*   **Support Principal - Le Canvas Interactif :** Une interface dynamique combinant un chat et une zone de "focus" pour des contenus riches.
*   **Modes d'Interaction :**
    1.  **Mode "Pull" (Initié par l'Utilisateur) :** Pour interroger l'état du système.
    2.  **Mode "Push" (Escalade par le Système) :** Pour présenter des décisions stratégiques critiques à l'utilisateur.
    3.  **Mode "Collaboratif" :** Pour des tâches de revue ou de clarification en temps réel.

#### **3.4. Protocole de Gouvernance des Connaissances et MLOps**

Ce processus assure l'amélioration stratégique du système et la gestion de ses modèles.

*   **Gouvernance du Common KG (Distillation Post-Mission) :**
    1.  À la fin d'une mission, un **Agent "Synthétiseur Stratégique"** analyse le graphe archivé pour identifier des patrons efficaces.
    2.  Il génère une **`Proposition de Mise à Jour`** structurée pour le Common KG.
    3.  Cette proposition est soumise à une **revue (humaine en V1)** avant d'être appliquée.
*   **Gouvernance du `Proxy Scorer` (MLOps Léger) :**
    1.  **Versionnage :** Chaque dataset d'entraînement et chaque modèle `Proxy Scorer` entraîné est versionné et stocké.
    2.  **Registre de Modèles :** Un registre (dans le KG) trace la performance de chaque version du modèle.
    3.  **Déploiement Contrôlé :** Une nouvelle version du `Proxy Scorer` n'est mise en production qu'après avoir démontré une performance supérieure à la version actuelle sur un jeu de données de validation.

#### **3.5. Protocole de Résolution des Conflits de Validation**

Ce protocole définit comment l'`Orchestrateur de Validation` gère les verdicts contradictoires de ses modules.

*   **Hiérarchie des Preuves :** Le protocole établit une priorité stricte. Par exemple : **Preuve Factuelle > Preuve de Cohérence Logique > Preuve d'Alignement aux Objectifs**.
*   **Logique de Veto :** Certains résultats de validation (ex: une faille de sécurité détectée) ont un droit de veto et provoquent un échec immédiat de la tâche, quel que soit le score des autres modules.
*   **Escalade Humaine :** Les conflits complexes et non résolubles par la hiérarchie sont escaladés à l'utilisateur.

#### **3.6. Protocole d'Observabilité**

Ce protocole assure que le système est débogable et auditable.

*   **Traçage Distribué :** Chaque flux de travail est associé à un `traceID` unique qui permet de suivre la causalité à travers les différents composants.
*   **Logging Structuré :** Tous les logs sont au format JSON et contiennent des identifiants clés (`missionID`, `taskID`, `traceID`).
*   **Visualisation de Débogage :** L'HAAI doit inclure des vues pour les développeurs, permettant de visualiser l'état du graphe de potentiel et les décisions prises par le système.

### **4. Le Cycle de Vie d'une Tâche : Le Processus Récursif en Action**

Chaque tâche, de la mission globale à la plus petite correction, suit le même processus fondamental.

1.  **Instanciation et Estimation :** Une tâche est créée. Le `Proxy Scorer` prédit sa **complexité**.
2.  **Allocation de Budget :** L'Orchestrateur alloue un **budget de ressources dynamique** à la tâche (itérations, temps, etc.) basé sur cette complexité.
3.  **Délibération (Boucle de Réflexion) :** L'agent assigné entre dans sa boucle de délibération, contrainte par le budget, pour trouver la meilleure stratégie.
4.  **Décision Stratégique :** Le `Moteur de Décision` choisit l'action la plus pertinente (Vérifier ou Construire).
5.  **Exécution :** L'action est exécutée via Temporal.
6.  **Validation et Raffinement Itératif :** L'artefact produit est validé. En cas d'échec, une **boucle de raffinement** est initiée, créant une sous-tâche de correction qui suit récursivement le même processus, contrainte par le budget restant.
7.  **Apprentissage :** Le résultat final est utilisé pour générer une nouvelle donnée d'entraînement afin d'affiner le `Proxy Scorer`.

### **5. Défis Architecturaux et Angles Morts**

*   **Pipeline de "Featurisation" pour le Proxy Scorer :** La performance de la planification dépendra de manière critique de la qualité des caractéristiques extraites du KG.
*   **Problème du Démarrage à Froid (Cold Start) :** La performance initiale du `Proxy Scorer` reposera sur des heuristiques codées en dur.
*   **Complexité de l'Orchestrateur de Validation :** La qualité des plans de validation générés par le "LLM-Routeur" en V1 dépendra de la qualité de ses prompts.
*   **Dualité du Knowledge Graph :** La gestion du KG comme base de données passive et modèle du monde actif pour la planification nécessitera une conception de schéma et des stratégies de requêtage rigoureuses.
*   **Méta-Validation :** L'architecture doit intégrer des mécanismes pour évaluer la performance de ses propres composants de validation.

---
---

## **Partie 2 : Stack Technique et Décisions Opérationnelles (Version 1.0)**

_Cette section annexe les décisions technologiques et opérationnelles concrètes prises pour l'implémentation de la V1, basées sur la vision architecturale ci-dessus._

### **2.1. Architecture de la Stack Technologique**

| Catégorie | Composant | Technologie Choisie | Rationale / Contexte d'Utilisation |
| :--- | :--- | :--- | :--- |
| **Fondations** | Orchestration de Dev | **Docker Compose** | Socle unifié pour définir, lier et lancer tous les services en développement. |
| | Langage Core System | **Go** | Performance, robustesse et concurrence de premier ordre (goroutines) pour l'orchestration. |
| | Langage IA/ML | **Python** | Écosystème inégalé pour le ML (LightGBM, MLflow) et l'interaction avec les LLMs (LiteLLM). |
| **Exécution & Données** | Moteur de Workflow | **Temporal** | Assure la résilience, la durabilité et l'observabilité des tâches et des agents. |
| | Sandboxing Agents | **E2B (auto-hébergé)** | Sécurité maximale (via Firecracker) avec une API de haut niveau conçue pour les agents IA. |
| | Base de Connaissances | **Neo4j** | Modélisation native des relations complexes pour la mémoire, la planification et le GraphRAG. |
| | Stockage Fichiers | **MinIO** | Stockage objet compatible S3, léger et facile à déployer localement. |
| **Communication** | Interne (Go <-> Python) | **gRPC** | Robustesse et performance du contrat d'API, éliminant les erreurs d'intégration. |
| | Asynchrone (Intra-Go) | **Canaux Go (via interface)** | Simplicité et performance maximale pour la V1, avec une conception évolutive. |
| | Externe (Backend <-> UI) | **API REST & WebSockets** | Intégration simple et standard avec les clients web (React). |
| **Interface & IA** | Frontend | **React (avec Vite)** | Écosystème mature et choix standard de l'industrie pour une UI réactive. |
| | Gateway LLM | **LiteLLM** | Interface unifiée pour interagir avec n'importe quel fournisseur de LLM. |
| | Scoring IA | **LightGBM** | Modèle ML performant pour la planification, servi via une API gRPC. |

### **2.2. Processus Opérationnels et de Gouvernance**

| Domaine | Outil / Stratégie | Description |
| :--- | :--- | :--- |
| **Configuration & Secrets** | **Fichiers `.env`** | Fichier `.env` local, ignoré par Git, chargé par Docker Compose pour injecter les variables d'environnement. |
| **Gouvernance ML (MLOps)** | **MLflow** | Traçage des expériences, versionnage des datasets et registre des modèles `Proxy Scorer` entraînés. |
| **Intégration Continue (CI)** | **GitHub Actions** | **Validation uniquement :** Le workflow exécute les tests (Go/Python) et le linting (`mypy`) à chaque push pour garantir la qualité du code. |
| **Build des Images** | **Local (`docker-compose build`)** | Le build des images Docker est une opération locale pour maximiser la vitesse de développement. |
| **Sauvegarde & Récupération** | **Script local (`neo4j-admin dump`)** | Un script de sauvegarde manuel ou via cron pour dumper la base Neo4j et archiver les données MinIO. |
| **Observabilité** | **Logging Structuré + UI Temporal** | Logs structurés sur `stdout` collectés par Docker. L'UI de Temporal pour le traçage des workflows. |