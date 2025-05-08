# **Analyse Prescriptive des Workflows Logiciels Augmentés par IA Basés sur un Graphe de Connaissance pour AutoAgent**

## **I. Introduction**

Le projet AutoAgent, un système multi-agents Go/React exploitant un Large Language Model (LLM) comme codeur principal sous la supervision d'un humain unique et s'appuyant sur une base de données graphe Neo4j, explore des pistes de réflexion pour une optimisation radicale de son workflow de développement. Ces pistes incluent l'automatisation de la génération d'artefacts via des outils LLM, la représentation du projet sous forme de graphe de connaissances interconnecté dans Neo4j (plutôt qu'une structure de fichiers classique), et l'utilisation de ce graphe comme une mémoire persistante active pour le contexte projet.

Ce rapport fournit une analyse critique approfondie de l'état de l'art, de la faisabilité technique, des meilleures pratiques, des outils habilitants et des défis liés à la mise en œuvre de ces concepts de workflow augmenté par IA et basé sur un graphe de connaissances. L'objectif est de formuler des recommandations prescriptives, actionnables et priorisées pour l'adoption (ou non) de ces approches dans le cadre du projet AutoAgent, en distinguant les implémentations pragmatiques pour une première version (V1) des évolutions envisageables post-V1. L'analyse s'appuie rigoureusement sur des sources académiques, techniques et expertes pour fonder ses conclusions et recommandations.

## **II. Modélisation du Projet Logiciel en Graphe de Connaissances**

La transition d'une représentation de projet basée sur des fichiers et des silos de données vers un modèle unifié sous forme de graphe de connaissances (Knowledge Graph \- KG) constitue une étape fondamentale pour réaliser le potentiel d'un workflow augmenté par IA.

### **A. Concepts et Approches de Modélisation**

Un graphe de connaissances organise des entités de données interconnectées et leurs relations sémantiques, permettant le raisonnement sur ces données pour en extraire des connaissances.1 Il se compose de nœuds (entités), de relations (arêtes) entre ces nœuds, et de principes organisateurs (catégories, hiérarchies).1 Les bases de données orientées graphe, comme Neo4j, sont particulièrement adaptées car elles traitent les relations comme des citoyens de première classe, nativement intégrées à la structure de données, contrairement aux bases relationnelles où les jointures sont reconstruites par le code.1

La modélisation d'un projet logiciel en KG va au-delà de la simple représentation de la structure du code (Code Knowledge Graph \- CKG). Les CKGs modélisent typiquement les entités de code (fichiers, modules, classes/structs, fonctions, variables, arguments) et leurs relations structurelles (contient, appelle, hérite de, implémente, dépend de, défini dans).2 Des outils comme Strazh (pour C\#) 4 ou des frameworks génériques 3 existent pour construire de tels graphes, souvent via une analyse statique et sémantique du code.3

Cependant, une vision véritablement augmentée nécessite de modéliser *l'ensemble* des artefacts et contextes du projet. Cela inclut les exigences, la documentation (6), les tests, les problèmes/bugs (7), les commits (7), les utilisateurs/développeurs (7), les décisions de conception, les risques identifiés, et potentiellement les discussions ou les logs d'actions des agents IA. Des approches comme RO-Crate pour l'archivage structuré d'artefacts de recherche (8) ou les travaux sur la modélisation d'artefacts digitaux de recherche (6) fournissent des pistes. L'objectif est de créer un modèle unique et interconnecté représentant l'état complet et l'historique du projet.

La flexibilité du schéma est un avantage clé des bases de données graphe.1 Contrairement aux schémas relationnels rigides, un schéma de KG peut évoluer plus facilement pour intégrer de nouvelles sources de données ou de nouveaux types d'informations au fil du temps.9 Des LLMs peuvent potentiellement assister à l'inférence dynamique du schéma à partir de données non structurées, réduisant ainsi le goulot d'étranglement de la conception initiale.12 Toutefois, cette approche automatisée nécessite une validation humaine rigoureuse, surtout dans les systèmes critiques où l'exactitude du schéma est primordiale.13

La valeur fondamentale de cette approche réside dans la création d'un *modèle de projet unifié et interrogeable*. Les systèmes traditionnels fragmentent l'information : le code dans le système de fichiers ou le VCS 3, les problèmes dans un outil de suivi 7, les commits dans le VCS 7, les exigences dans des documents séparés. Les relations entre ces éléments sont souvent implicites ou nécessitent des liens manuels fragiles. L'approche KG propose de modéliser explicitement toutes ces entités (par exemple, FichierSource, Fonction, Exigence, Probleme, Commit, Utilisateur) et leurs relations (IMPLEMENTE, SUIT, INTRODUIT\_PAR, ECRIT\_PAR) au sein d'un seul graphe cohérent.3 Cette unification permet de poser des questions complexes et transversales (par exemple, "Quels changements de code, effectués par le développeur X, ont corrigé des problèmes critiques liés à l'exigence Y?") qui sont extrêmement difficiles, voire impossibles, à adresser lorsque les données sont cloisonnées.9 Le KG devient ainsi une représentation holistique et calculable de l'état et de l'historique complets du projet.

### **B. Stratégies d'Identification des Nœuds (UUIDs vs. Alias)**

L'identification unique de chaque nœud est une pratique essentielle en modélisation de graphe pour éviter la duplication de données et faciliter la création de relations fiables.15 Neo4j offre des contraintes (UNIQUE, NODE KEY) pour garantir cette unicité au niveau de la base de données.15 Le choix de la stratégie d'identification a des implications profondes sur l'interaction humaine et machine avec le graphe.

* **UUIDs (Universally Unique Identifiers) :**  
  * *Avantages :* Unicité garantie globalement, format standardisé, évite les collisions de nommage.  
  * *Inconvénients :* Non lisibles par l'humain, n'offrent aucune information sémantique intrinsèque (ni aux humains, ni aux LLMs en dehors du contexte strict du graphe), peuvent rendre le débogage manuel et l'écriture de requêtes plus ardus.  
* **Alias Lisibles par l'Humain (ex: chemins de fichiers, noms de fonctions) :**  
  * *Avantages :* Intuitifs pour les humains, potentiellement interprétables par les LLMs grâce à leur pré-entraînement sur de vastes corpus de texte et de code.19  
  * *Inconvénients :* Risque de collisions (nécessite une gestion attentive, potentiellement via des espaces de noms), ambiguïté possible, peuvent devenir obsolètes si l'artefact source est renommé (nécessitant des mises à jour synchronisées dans le graphe), risque d'induire des hallucinations du LLM si la sémantique perçue de l'alias contredit la structure réelle du graphe.13 La requête utilisateur mentionne explicitement ce point de friction.  
* **Approches Hybrides :** Une stratégie recommandée consiste à utiliser *à la fois* un UUID stable comme identifiant principal (clé primaire, par exemple, propriété uuid) avec une contrainte d'unicité Neo4j 15, et un alias lisible (par exemple, propriété nom ou chemin) comme propriété additionnelle. L'alias facilite l'interaction humaine et peut aider à l'interprétation par le LLM, tandis que l'UUID garantit la stabilité des liens internes du graphe.

L'impact sur l'interaction LLM est notable. Les UUIDs opaques forcent le LLM à se baser exclusivement sur la structure du graphe fournie via les résultats de requêtes, ce qui peut conduire à des réponses mieux ancrées ("grounded") mais potentiellement moins "intuitives". Les alias, en revanche, pourraient permettre au LLM de mobiliser des connaissances plus larges issues de son entraînement, mais augmentent le risque d'inférences non fondées si la signification de l'alias entre en conflit avec la structure réelle du graphe ou le contexte spécifique du projet.13

Le choix d'une stratégie d'identifiant n'est donc pas une simple décision technique de base de données ; c'est une décision fondamentale de conception d'interaction homme-machine et homme-IA. Elle influence directement la charge cognitive pour l'humain et l'équilibre entre l'ancrage factuel et l'inférence sémantique (avec son risque d'hallucination) pour les agents LLM. Les humains trouvent les noms significatifs plus faciles à mémoriser et à utiliser que les UUIDs.13 Les LLMs traitent nativement le texte, et les noms porteurs de sens véhiculent une information sémantique exploitable 19, contrairement aux UUIDs qui ne portent que l'identité. Un LLM utilisant des alias pourrait s'appuyer sur sa connaissance générale (par exemple, sur les fonctions de "Login") mais pourrait être induit en erreur si l'alias FonctionLogin du projet désigne en réalité un mécanisme non conventionnel. À l'inverse, un LLM utilisant des UUIDs *doit* se fier aux connexions explicites fournies dans le contexte du graphe, réduisant le risque d'hallucination mais limitant potentiellement sa capacité à faire des rapprochements plus larges. Ce choix représente un arbitrage central entre utilisabilité humaine, ancrage de l'IA, et le potentiel de levier sémantique versus le risque d'hallucination.

### **C. Métadonnées et Étiquetage pour un Contexte Enrichi**

Au-delà de la structure de base (nœuds et relations), les métadonnées (propriétés associées aux nœuds et aux relations) sont cruciales pour enrichir le graphe et permettre des analyses plus fines.1 Des exemples pertinents incluent les timestamps de création/modification, le statut (par exemple, 'EnCours', 'Terminé'), la priorité, l'auteur (extrait des commits), l'URL source, la taille du fichier, ou des métriques de complexité du code.3

L'utilisation d'étiquettes (labels Neo4j) ou de propriétés spécifiques pour l'étiquetage ("tagging") permet une catégorisation flexible et un filtrage efficace (par exemple, Tag: 'UI', Statut: 'EnCours', NiveauRisque: 'Élevé').

Des métadonnées riches et bien structurées améliorent la précision des requêtes, tant pour les humains que pour les LLMs. Un LLM peut exploiter les métadonnées fournies dans son contexte pour générer des réponses plus pertinentes, effectuer des analyses plus précises, ou même pour guider ses propres actions.6 La gestion cohérente de ces métadonnées nécessite des processus clairs ou des outils dédiés pour assurer leur application uniforme et leur maintenance.23

### **D. Recommandation pour AutoAgent (V1 & Évolution)**

* **Approche Pragmatique V1 :**  
  * **Schéma :** Débuter avec un schéma central focalisé sur les artefacts essentiels pour AutoAgent : FichierSource, Fonction, Struct/Interface (équivalents Go), Exigence, Test, Commit, Utilisateur. Définir les relations clés : IMPLEMENTE, APPELLE, DEFINI\_DANS, TESTE, CONCERNE (Exigence-Code), COMMITE\_PAR, MODIFIE. S'inspirer des bonnes pratiques CKG 3 et adapter aux besoins spécifiques du projet.7  
  * **Identifiants :** Adopter une **approche hybride**. Utiliser des UUIDs auto-générés comme identifiant principal immuable (propriété uuid) avec une contrainte UNIQUE.15 Inclure également des propriétés lisibles nom ou chemin (nom de fonction, chemin de fichier) pour l'affichage et faciliter les requêtes humaines, mais sans les utiliser pour les liens fondamentaux du graphe.  
  * **Métadonnées :** Se concentrer sur les métadonnées essentielles et facilement extractibles en V1 : chemin de fichier, dates de création/modification, auteur (via commits), ID d'exigence, statut du test. Ajouter des étiquettes simples pour le statut ou le type.  
* **Évolution Post-V1 :**  
  * Étendre le schéma pour inclure des concepts plus avancés : Decision, Risque, Probleme, FragmentDocumentation, FilDiscussion, LogActionAgent.  
  * Introduire des relations plus riches : ATTENUE (Risque-Code), BASE\_SUR (Decision-Exigence), GENERE (ActionAgent-Artefact).  
  * Développer une extraction de métadonnées plus sophistiquée (par exemple, métriques de complexité du code, étiquettes sémantiques dérivées par LLM).  
  * Affiner la stratégie des alias en fonction de l'expérience V1 – envisager des vocabulaires contrôlés ou des conventions de nommage plus structurées si des confusions LLM apparaissent.  
* **Tableau : Proposition de Schéma V1 Essentiel**

| Libellé de Nœud | Propriétés Clés (Exemples) | Relations Clés (Exemples) |
| :---- | :---- | :---- |
| FichierSource | uuid (UNIQUE), chemin, date\_creation, date\_modif | CONTIENT \-\> Fonction/Struct/Interface, \<- MODIFIE \<- Commit, \<- DEFINI\_DANS \<- Fonction/Struct/Interface |
| Fonction | uuid (UNIQUE), nom, signature, complexite (Post-V1) | DEFINI\_DANS \-\> FichierSource, APPELLE \-\> Fonction, \<- APPELLE \<- Fonction, IMPLEMENTE (si pertinent) \-\> Exigence |
| Struct/Interface | uuid (UNIQUE), nom | DEFINI\_DANS \-\> FichierSource, IMPLEMENTE (si pertinent) \-\> Exigence |
| Exigence | uuid (UNIQUE), id\_req, description, statut | \<- IMPLEMENTE \<- Fonction/Struct/Interface, \<- TESTE \<- Test |
| Test | uuid (UNIQUE), nom, statut | TESTE \-\> Exigence, TESTE\_FONCTION \-\> Fonction |
| Commit | uuid (UNIQUE), hash, message, timestamp | MODIFIE \-\> FichierSource, COMMITE\_PAR \-\> Utilisateur |
| Utilisateur | uuid (UNIQUE), nom, email | \<- COMMITE\_PAR \<- Commit |

\*Justification :\* Ce schéma fournit un point de départ concret et équilibré pour la V1 d'AutoAgent, couvrant les artefacts essentiels tout en restant réalisable. Il s'appuie sur une synthèse des pratiques de modélisation KG \[1\], des spécificités des CKG \[3, 4\], et des meilleures pratiques d'identification.\[15, 16, 17, 18\]

## **III. Permettre l'Interaction IA avec le Graphe Projet**

Une fois le graphe de connaissances du projet établi, il devient une ressource essentielle pour les agents IA d'AutoAgent, servant de contexte et de mémoire active. Faciliter cette interaction nécessite des techniques et des outils spécifiques.

### **A. Techniques d'Interaction LLM-KG (Interrogation, Mise à Jour, Raisonnement)**

* **Retrieval-Augmented Generation (RAG) et Graph RAG :** Le RAG est un paradigme où un LLM utilise des informations récupérées d'une source externe pour améliorer ses réponses. Le Graph RAG applique ce concept en utilisant un KG comme source de connaissances.1 Le processus typique implique qu'un LLM traduise la question de l'utilisateur en une requête spécifique au KG (par exemple, Cypher pour Neo4j 7), exécute cette requête, puis utilise les résultats comme contexte pour générer une réponse finale.22  
* **Génération de Requêtes (NL-to-Cypher) :** Les LLMs peuvent générer des requêtes Cypher en se basant sur le schéma du graphe et la question posée.7 La qualité de la requête générée dépend fortement de la clarté du prompt, de la richesse des informations de schéma fournies au LLM 25, et des capacités intrinsèques du LLM. Des erreurs de génération (syntaxiques ou sémantiques) sont possibles, surtout pour des requêtes complexes impliquant plusieurs sauts ou des logiques complexes.7 Des techniques comme le "Chain-of-Thought" prompting peuvent améliorer la précision.7  
* **Mise à Jour du Graphe par les LLMs :** Permettre aux LLMs de modifier le KG (par exemple, ajouter un nœud pour une documentation générée, lier un nouveau test à une exigence) est techniquement possible mais présente des risques significatifs. Cela nécessite une validation robuste des modifications proposées, potentiellement via une confirmation humaine ou des règles de validation strictes pour préserver l'intégrité du graphe.  
* **Raisonnement sur le Graphe :** C'est l'aspect le plus ambitieux et le plus difficile.  
  * *Raisonnement Implicite via Contexte Textuel :* Le LLM raisonne principalement sur le *texte* des résultats retournés par la requête KG.22 L'efficacité de ce raisonnement dépend de la capacité de la requête à extraire les informations pertinentes et de la manière dont ces informations structurées sont linéarisées en texte pour le LLM.  
  * *Raisonnement Multi-Sauts :* Les KGs excellent dans les requêtes multi-sauts qui explorent des chemins complexes.27 Cependant, traduire une tâche de raisonnement complexe nécessitant plusieurs étapes logiques en une séquence efficace de requêtes KG pour un LLM est un défi.26 La complexité computationnelle peut également être un facteur limitant, notamment pour des explorations exhaustives.29  
  * *Raisonnement Conscient de la Structure (Graph-Aware Reasoning) :* Des techniques plus avancées visent à rendre le LLM plus "conscient" de la structure du graphe :  
    * *Intégration LLM \+ GNN (Graph Neural Networks) :* Les GNNs peuvent encoder la structure locale ou globale du graphe en embeddings (vecteurs numériques) que le LLM peut ensuite utiliser comme contexte supplémentaire.21 Des approches comme Graph Neural Prompting (GNP) utilisent les GNNs pour générer des prompts enrichis pour le LLM 32, tandis que d'autres utilisent le LLM comme "professeur" pour entraîner un GNN "étudiant" (distillation de connaissances).31  
    * *Frameworks de Prompting/Agents Spécialisés :* Des recherches proposent des frameworks dédiés au raisonnement sur graphe, comme ReKnoS qui utilise des "super-relations" pour abstraire les chemins 34, ou KG-RAR qui intègre une récupération KG étape par étape dans le processus de raisonnement du LLM.30  
    * *Couche Sémantique / Appels de Fonctions :* Au lieu de générer du Cypher brut, le LLM appelle des fonctions prédéfinies et validées qui encapsulent des requêtes KG spécifiques (par exemple, getNodeNeighbors(uuid), findShortestPath(uuid1, uuid2)). Le LLM fournit les paramètres, et la fonction exécute la requête sécurisée.22 Cela améliore la fiabilité au détriment de la flexibilité.

### **B. Évaluation des Outils (LangChain/LlamaIndex+Neo4j, GNNs+LLMs) et Limitations**

* **LangChain :**  
  * Fournit un wrapper Neo4jGraph pour les opérations de base.22  
  * La GraphCypherQAChain est le composant principal pour le Q\&A basé sur Cypher.22 Elle nécessite un schéma clair et un LLM compétent. Les prompts sont personnalisables.36  
  * Neo4jVector permet la recherche vectorielle et hybride (texte \+ vecteur) dans Neo4j.22  
  * Propose des Graph Transformers pour aider à la construction de KG à partir de texte.22  
  * LangGraph est un framework pour construire des applications LLM multi-acteurs et avec état, adapté aux workflows Graph RAG complexes.25  
* **LlamaIndex :**  
  * Utilise Neo4jGraphStore ou Neo4jPGStore comme backend de stockage pour les données graphe.38  
  * KnowledgeGraphIndex et PropertyGraphIndex extraient des structures de graphe (triplets ou graphes de propriétés) à partir de documents et les stockent.38 Des paramètres comme max\_triplets\_per\_chunk contrôlent l'extraction.38 L'extraction guidée par schéma est disponible.40  
  * Permet l'interrogation basée sur des mots-clés ou des embeddings, retournant des triplets ou du contexte textuel.38 Le paramètre include\_text contrôle l'inclusion du contexte.38  
  * Dispose de modules de construction de graphes modulaires.39  
* **Intégration GNN+LLM :** Actuellement plus orientée recherche.7 Des frameworks existent (GNP 32, LinguGKD 31) mais demandent souvent une implémentation plus personnalisée que l'utilisation directe de LangChain/LlamaIndex. Offre un potentiel pour une compréhension structurelle plus profonde.  
* **Limitations Actuelles :**  
  * *Limites du Raisonnement LLM :* Les LLMs peinent avec le raisonnement logique complexe, multi-étapes, ou basé nativement sur des graphes, même avec un contexte KG.7 Ce sont avant tout des systèmes de reconnaissance de formes statistiques, pas des moteurs de raisonnement symbolique.43 La précision diminue avec la complexité de la tâche.28  
  * *Précision de la Génération de Requêtes :* Les LLMs peuvent générer des requêtes Cypher incorrectes ou inefficaces, surtout pour des motifs complexes.7 Cela exige un prompting soigné, des informations de schéma complètes, et potentiellement des mécanismes de validation ou de correction.35  
  * *Limites de la Fenêtre de Contexte :* Fournir suffisamment de contexte du graphe (schéma, données récupérées) au LLM sans dépasser sa limite de tokens est un défi, en particulier pour les graphes volumineux et complexes.45 Des techniques comme le découpage en chunks 12 ou la synthèse sont nécessaires.  
  * *Hallucination et Exactitude Factuelle :* Bien que les KGs aident à ancrer les LLMs 7, des erreurs dans le KG lui-même ou une mauvaise interprétation par le LLM peuvent toujours conduire à des résultats incorrects.13 La validation reste cruciale.13  
  * *Complexité d'Intégration :* L'assemblage de ces composants (KG, LLM, framework d'orchestration) requiert une expertise technique significative.

Il apparaît que les frameworks d'orchestration comme LangChain et LlamaIndex excellent principalement dans la connexion des LLMs aux KGs pour la *récupération d'informations* (traduction question-\>requête, exécution, récupération des résultats) et pour la *construction* de KGs. Ils ne résolvent pas intrinsèquement les limitations fondamentales des LLMs en matière de *raisonnement profond sur* les données structurées récupérées. La GraphCypherQAChain de LangChain 22 et les moteurs de requête KG de LlamaIndex 38 se concentrent sur la génération d'une requête, son exécution, et la transmission des résultats (souvent sous forme de texte) à un LLM pour synthèse ou réponse. Il s'agit fondamentalement d'un schéma de récupération et de Q\&A basé sur les faits récupérés. Le raisonnement complexe nécessite souvent de comprendre *comment* les faits sont connectés, d'identifier des chemins, de comparer des structures ou d'appliquer des algorithmes de graphe – tâches avec lesquelles les LLMs ont du mal directement.7 Bien que ces frameworks *puissent* être utilisés pour construire des flux de raisonnement plus complexes (par exemple, avec LangGraph 25 ou des agents personnalisés), les composants de base gèrent principalement la couche d'interface et de récupération. Par conséquent, se fier uniquement à ces chaînes standard pourrait limiter la capacité d'AutoAgent à effectuer des tâches de raisonnement complexes exploitant directement la structure du graphe ; une logique d'agent plus sophistiquée ou une intégration avec des algorithmes natifs de graphe pourrait être nécessaire pour des cas d'usage avancés.

### **C. Recommandation pour AutoAgent (V1 & Évolution)**

* **Approche V1 :**  
  * **Technologie :** Utiliser **LangChain** en raison de sa maturité, de sa flexibilité, de son support explicite pour la génération Cypher (GraphCypherQAChain 22) et des agents avec état (LangGraph 25).  
  * **Modèle d'Interaction :** Se concentrer sur **NL-to-Cypher pour la Récupération**. Utiliser GraphCypherQAChain 22 pour les requêtes des agents. Fournir des informations claires sur le schéma dans les prompts.25  
  * **Raisonnement :** S'appuyer sur la capacité du LLM à raisonner sur le *contexte textuel récupéré*. Ne pas attendre de raisonnement profond multi-sauts sur le graphe en V1.  
  * **Mises à Jour :** Éviter les mises à jour directes du KG par les agents LLM en V1. Enregistrer les modifications proposées pour revue/exécution humaine.  
  * **Validation :** Implémenter une validation basique du Cypher généré (vérification de syntaxe) si possible, ou au minimum gérer gracieusement les erreurs d'exécution de requête.  
* **Évolution Post-V1 :**  
  * **Explorer LlamaIndex :** Évaluer l'index de graphe de propriétés de LlamaIndex (39) pour une extraction et une récupération potentiellement plus structurées si la récupération V1 s'avère limitante.  
  * **RAG Avancé :** Expérimenter avec les stratégies RAG avancées offertes par LangChain/LlamaIndex (récupération parent-enfant, recherche hybride avec Neo4jVector 22).  
  * **Couche Sémantique / Appels de Fonctions :** Implémenter une couche sémantique avec des requêtes Cypher prédéfinies et validées que les agents peuvent appeler avec des paramètres.22 Cela échange la flexibilité contre la fiabilité et le contrôle, atténuant les risques d'une mauvaise génération de requêtes.  
  * **Explorer les GNNs :** Si un raisonnement structurel profond devient critique, investiguer l'intégration d'embeddings GNN (potentiellement via des bibliothèques compatibles avec LangChain/LlamaIndex) pour fournir un contexte structurel plus riche aux agents LLM.7 C'est une voie exigeante en termes de recherche et développement.  
  * **Raisonnement Agentique :** Utiliser des frameworks comme LangGraph 25 ou développer une logique d'agent personnalisée pour un raisonnement multi-étapes impliquant des requêtes KG itératives et une gestion d'état.  
* **Tableau : Comparaison des Techniques d'Interaction LLM-KG**

| Technique | Maturité | Complexité Implémentation (V1 / Post-V1) | Potentiel Raisonnement Profond | Fiabilité | Support Outils (LC/LI) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| NL-to-Cypher \+ Contexte Texte | Élevée | Moyenne / Moyenne | Faible | Moyenne | Élevé (Core) |
| Couche Sémantique / Appels de Fonctions | Moyenne | Moyenne / Élevée | Limité (par fonctions) | Élevée | Moyen (Intégration) |
| Embeddings GNN \+ LLM | Faible | Élevée / Très Élevée | Moyen | Variable | Faible (Recherche) |
| Agents Spécifiques Graphe (LangGraph/Custom) | Moyenne | Élevée / Très Élevée | Moyen à Élevé | Variable | Moyen à Élevé |

\*Justification :\* Ce tableau aide AutoAgent à choisir la stratégie technique appropriée pour différentes phases, en équilibrant capacités, faisabilité et risques, basé sur les sources.\[7, 14, 21, 22, 25, 26, 28, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45\]

## **IV. Faciliter l'Interaction Humaine avec le Graphe Projet**

Le passage d'une structure de fichiers familière à une représentation en graphe pose des défis significatifs pour l'interaction humaine. Une conception soignée de l'interface utilisateur (UI) et de l'expérience utilisateur (UX) est essentielle pour permettre au superviseur humain d'explorer, de comprendre et d'interagir efficacement avec le graphe de connaissances du projet.

### **A. Bonnes Pratiques UI/UX pour l'Exploration de Graphes**

La visualisation de graphes, en particulier de graphes denses et volumineux typiques des projets logiciels complexes, présente des défis inhérents. La principale difficulté est de gérer la charge cognitive de l'utilisateur 48 et de fournir des mécanismes de navigation intuitifs qui compensent la perte des repères hiérarchiques habituels.

Les principes fondamentaux de l'Interaction Homme-Machine (HCI) et de l'UX s'appliquent : clarté, cohérence, efficacité, familiarité (lorsque possible), et contrôle utilisateur.48 Spécifiquement pour les graphes :

* **Algorithmes de Disposition (Layout) :** Utiliser des algorithmes de disposition appropriés (dirigés par la force, hiérarchiques, circulaires) pour révéler la structure inhérente du graphe.50 Permettre à l'utilisateur de choisir ou de paramétrer ces algorithmes peut être bénéfique.  
* **Techniques d'Interaction Standard :** Supporter les interactions de base comme le zoom, le panoramique (pan), et le déplacement manuel des nœuds (drag and drop).24 Des interactions comme le double-clic pour centrer ou développer un nœud 52, le survol (hover) pour afficher des détails rapides (infobulles, tooltips) 54, et la sélection de nœuds/arêtes pour mettre en évidence les connexions ou afficher des panneaux de propriétés détaillées 52 sont essentielles.  
* **Filtrage et Recherche :** Indispensables pour gérer la complexité visuelle. L'interface doit permettre de filtrer les nœuds et les relations par libellé, type de relation, ou valeurs de propriétés.24 Une fonction de recherche textuelle robuste sur les propriétés des nœuds/relations est également nécessaire.53  
* **Zoom Sémantique / Niveau de Détail :** Afficher des vues simplifiées à des niveaux de zoom élevés (vue d'ensemble) et révéler progressivement plus de détails (propriétés, relations moins importantes, étiquettes) lorsque l'utilisateur zoome.48 Cela réduit l'encombrement visuel initial.  
* **Vues Contextuelles :** Fournir des mécanismes pour isoler et visualiser le voisinage d'un nœud sélectionné, suivre des chemins spécifiques entre nœuds, ou afficher des sous-graphes pertinents pour une tâche donnée (par exemple, tous les éléments liés à une exigence spécifique).50  
* **Importance des Études Utilisateurs :** Compte tenu de la nouveauté du paradigme pour de nombreux utilisateurs, il est crucial de mener des études d'utilisabilité avec le superviseur cible pour évaluer l'efficacité de l'interface, identifier les points de friction et itérer sur la conception.46

### **B. Atténuation de la Perte de Familiarité avec le Système de Fichiers**

Le principal défi est la perte du modèle mental hiérarchique et spatial fourni par l'arborescence de fichiers classique.54 Une vue purement graphique, bien que puissante pour révéler des connexions transversales, peut sembler désordonnée et désorientante pour la navigation ciblée.

Plusieurs stratégies peuvent aider à combler ce fossé :

* **Vues Hiérarchiques Alternatives :** Proposer des vues alternatives qui rendent certaines parties du graphe de manière hiérarchique, en se basant sur des relations spécifiques comme CONTIENT pour simuler la structure des dossiers et fichiers.3  
* **Navigation par Chemin :** Permettre à l'utilisateur de "naviguer" le long de chemins relationnels spécifiques, imitant le parcours de répertoires (par exemple, suivre les relations CONTIENT depuis un nœud Projet).  
* **Fil d'Ariane (Breadcrumbs) :** Afficher le chemin de navigation actuel ou le contexte sélectionné au sein du graphe pour aider l'utilisateur à s'orienter.  
* **Vues Hybrides :** Combiner la visualisation de graphe avec des vues plus traditionnelles comme des arbres (pour la hiérarchie) ou des listes (pour les résultats de recherche ou les ensembles de nœuds filtrés), potentiellement liées entre elles 54 (qui illustre de nombreux motifs "overview-detail").  
* **Primauté de la Recherche :** Mettre l'accent sur une fonction de recherche puissante et un filtrage efficace comme principal moyen de localiser des artefacts spécifiques, plutôt que de compter sur une navigation manuelle exhaustive.

Pour surmonter efficacement la perte de familiarité avec le système de fichiers, il est probable que des interfaces qui n'imposent pas un passage exclusif à une vue purement graphique soient nécessaires. Les systèmes de fichiers offrent une métaphore hiérarchique forte et bien ancrée.54 Les vues purement graphiques, dépourvues de cette hiérarchie intrinsèque, peuvent entraîner une désorientation et une charge cognitive accrue.48 Il ne suffit pas de montrer le graphe ; l'interface utilisateur doit activement aider l'utilisateur à construire un modèle mental et à naviguer efficacement.50 Offrir plusieurs vues intégrées (graphe, arbre basé sur les relations CONTIENT, liste de résultats de recherche) permet aux utilisateurs de choisir la représentation la plus appropriée à leur tâche actuelle.54 Par exemple, l'exploration de la structure du code pourrait utiliser une vue hiérarchique, tandis que la compréhension des dépendances transversales pourrait bénéficier de la vue graphique. La recherche serait privilégiée pour trouver une fonction spécifique. Par conséquent, une interface utilisateur flexible offrant de multiples représentations liées des données sous-jacentes du graphe est probablement plus efficace qu'une vue unique et exclusivement graphique pour atténuer la perte de la métaphore du système de fichiers.

### **C. Outils de Visualisation et d'Interaction**

Un écosystème d'outils existe pour visualiser et interagir avec les graphes Neo4j :

* **Outils Natifs Neo4j :**  
  * *Neo4j Browser :* Outil intégré, idéal pour les développeurs pour exécuter des requêtes Cypher, explorer le schéma et obtenir une visualisation de base des résultats.50 Ses capacités de style sont limitées et il n'est pas conçu pour les utilisateurs finaux non techniques.50 Une nouvelle version améliore la visualisation et intègre des requêtes en langage naturel.50  
  * *Neo4j Bloom :* Outil d'exploration plus convivial destiné aux analystes ou utilisateurs non-développeurs. Interface pointer-cliquer, options de style avancées, gestion de "perspectives" (vues filtrées/stylisées), requêtes en langage naturel, capacités d'édition visuelle du graphe.50 Semble bien adapté au superviseur d'AutoAgent.  
  * *Neo4j Visualization Library (NVL) :* Bibliothèque JavaScript qui alimente Browser et Bloom. Permet de construire des visualisations de graphe personnalisées et intégrées dans des applications web.50 Offre une grande personnalisation et est conçue pour être performante sur de grands graphes. Un wrapper React est disponible.50  
* **Bibliothèques Open Source :** Cytoscape.js, Sigma.js, react-force-graph, ipysigma (Python/Jupyter), GraphXR, Gephi.24 Ces bibliothèques nécessitent un effort d'intégration et offrent des fonctionnalités et une scalabilité variables.  
* **Bibliothèques Commerciales :** KeyLines 50, yFiles.51 Riches en fonctionnalités, orientées entreprise, adaptées à l'intégration dans des applications personnalisées.  
* **Tableaux de Bord (Dashboarding) :** NeoDash permet de construire rapidement des tableaux de bord interactifs (tables, graphes, graphiques) à partir de données Neo4j via des requêtes Cypher.50  
* **Plugins IDE :**  
  * *VS Code :* L'extension officielle Neo4j 61 fournit l'édition Cypher, la gestion des connexions, l'exécution de requêtes, la gestion des paramètres. La visualisation de graphe est annoncée comme une fonctionnalité à venir. Le plugin Sourcegraph 62 permet la recherche et la navigation de code à travers les dépôts, mais n'est pas directement lié au KG du projet.  
  * *IntelliJ/GoLand :* Le plugin officiel Neo4j 52 offre un support Cypher avancé, une connexion à la base de données, l'exploration des métadonnées, l'exécution de requêtes, une vue graphique basique des résultats, et la visualisation du plan d'exécution (EXPLAIN). Un plugin tiers "Code Graph" 53 visualise les relations d'appel dans le code Java/Kotlin et synchronise la vue graphique avec l'éditeur.

Bien que des outils autonomes comme Bloom soient précieux pour l'exploration, l'intégration de la visualisation et de la navigation du graphe directement dans l'environnement de développement intégré (IDE) (VS Code/GoLand) est essentielle pour minimiser le changement de contexte et intégrer de manière transparente le workflow basé sur le graphe avec les tâches de codage et de débogage. Les développeurs passent la majorité de leur temps dans l'IDE. Basculer constamment entre l'IDE et un outil de visualisation de graphe distinct crée une friction et interrompt le flux de travail. Les plugins IDE existants pour Neo4j 52 permettent l'exécution de Cypher et une certaine visualisation de base des *résultats de requêtes*. Des plugins comme Sourcegraph 62 ou Code Graph 53 offrent une navigation dans le code mais ne sont pas directement liés à un KG Neo4j spécifique au projet. Le scénario idéal implique un plugin IDE qui permet de naviguer dans le *KG du projet* (représentant fichiers, fonctions, exigences, etc.) et de lier directement les nœuds du graphe au code ou à l'artefact correspondant dans l'IDE. Étant donné que les outils existants ne fournissent pas entièrement cette vue intégrée du KG projet, la réalisation d'un workflow véritablement transparent pourrait nécessiter l'extension des plugins existants ou le développement d'intégrations IDE personnalisées pour AutoAgent.

### **D. Recommandation pour AutoAgent (V1)**

* **Outil Principal (Superviseur) :** Utiliser **Neo4j Bloom** 50 comme interface principale d'interaction et d'exploration pour le superviseur en V1. Sa convivialité, sa nature pointer-cliquer et ses capacités de requête en langage naturel le rendent approprié pour un superviseur unique potentiellement moins technique.  
* **Intégration IDE (Développement) :** Utiliser les **plugins Neo4j officiels pour GoLand/VS Code** 52 pour l'exécution de requêtes Cypher et la visualisation de base des résultats pendant le développement et le débogage.  
* **Atténuation (Perte Familiarité) :** Configurer des perspectives dans Bloom pour offrir des vues simplifiées. S'appuyer fortement sur les capacités de recherche et de filtrage de Bloom. Fournir une formation au superviseur sur les concepts de graphe et l'utilisation de Bloom.  
* **UI Personnalisée (Post-V1) :** Prévoir le développement d'une interface front-end personnalisée (par exemple, en React) utilisant des bibliothèques comme NVL 50, react-force-graph 50, ou yFiles 51 après la V1 si Bloom s'avère insuffisant ou si des interactions/visualisations plus spécifiques sont nécessaires. Envisager d'intégrer des vues hybrides (graphe \+ arbre/liste).  
* **Amélioration Plugin IDE (Post-V1) :** Investiguer l'extension des plugins IDE existants ou en construire des personnalisés post-V1 pour fournir une intégration plus profonde entre le KG projet et l'éditeur de code (par exemple, clic droit sur le code \-\> montrer le nœud dans le graphe, clic sur le nœud \-\> naviguer vers le code).

## **V. Automatisation des Tâches du Workflow via le Graphe et les LLMs**

L'un des avantages majeurs de la représentation du projet en KG est la possibilité d'automatiser certaines tâches du workflow en interrogeant le graphe et en utilisant les LLMs pour générer des artefacts ou des analyses.

### **A. Analyse de Faisabilité de la Génération Automatisée d'Artefacts**

Le concept consiste à exploiter les informations structurées et interconnectées du KG pour fournir un contexte précis à un LLM, qui est ensuite chargé de générer ou de mettre à jour des artefacts de projet. Ces artefacts peuvent inclure des glossaires, des sections de documentation, des rapports d'état, voire des ébauches initiales de cas de test.

Le KG sert de source de vérité structurée. Des requêtes Cypher peuvent extraire des données spécifiques pour alimenter le LLM.7 Par exemple, interroger tous les nœuds étiquetés TermeDomaine avec leur propriété definition permet de générer un glossaire. Interroger les nœuds Fonction et leurs nœuds Exigence liés peut fournir la base pour générer des squelettes de documentation.

Le LLM agit comme le générateur, transformant les données structurées du KG en texte en langage naturel ou en d'autres formats structurés.7 L'ingénierie de prompts est essentielle pour guider le LLM vers le résultat souhaité.19 L'utilisation de prompts enrichis par l'ontologie du KG peut améliorer la qualité des résultats.37

La faisabilité de cette automatisation varie en fonction de la complexité de la tâche :

* **Faisabilité Élevée (Risque Faible) :** Générer des artefacts qui sont essentiellement des résumés ou des reformatages de données déjà structurées et validées dans le KG. Exemples : glossaires à partir de termes définis, listes d'exigences par statut, rapports de dépendances basés sur les relations explicites. La précision dépend principalement de la qualité des données du KG 64 (suggère que les LLMs sont fiables pour des tâches spécifiques et moins complexes).  
* **Faisabilité Moyenne (Risque Modéré) :** Générer une documentation nécessitant une certaine synthèse ou interprétation des données du graphe. Exemples : résumer le but d'une fonction en se basant sur ses connexions (fonctions appelées, exigences liées), générer des paragraphes d'introduction pour des composants. Cela nécessite un bon prompting et comporte un risque d'hallucination ou d'imprécision.13  
* **Faisabilité Plus Faible (Risque Élevé) :** Générer des artefacts complexes exigeant une compréhension profonde, une inférence complexe ou de la créativité. Exemples : générer des cas de test complets et non triviaux, suggérer des refactorisations architecturales basées sur des motifs de graphe complexes. Ces tâches sont très sensibles aux limitations intrinsèques des LLMs en matière de raisonnement et de planification à long terme.14

Dans tous les cas, les artefacts générés automatiquement doivent être systématiquement validés par un humain pour garantir leur exactitude et leur pertinence.13

### **B. Outils et Techniques Pertinents**

* **Interrogation du Graphe :** Requêtes Cypher exécutées via les pilotes Neo4j ou intégrées dans des frameworks d'orchestration comme LangChain ou LlamaIndex.22  
* **Intégration LLM :** Utilisation de chaînes LangChain/LlamaIndex pour transmettre les résultats des requêtes KG comme contexte aux LLMs.22  
* **Ingénierie de Prompts :** Conception minutieuse de prompts spécifiant la tâche, le contexte (données KG fournies), le format de sortie souhaité, et potentiellement des exemples (few-shot prompting).19 Les prompts guidés par l'ontologie peuvent être bénéfiques.37  
* **Automatisation du Workflow :** Scripts (Go ou Python) ou intégrations dans les pipelines CI/CD 72 pour déclencher la génération d'artefacts en réponse à des événements spécifiques (par exemple, un commit, une modification d'exigence).

### **C. Recommandation pour AutoAgent (V1 & V2)**

* **V1 (Faible Risque, Haute Valeur) :**  
  * **Génération de Glossaire :** Générer/mettre à jour automatiquement un glossaire du projet (par exemple, fichier Markdown) en interrogeant tous les nœuds avec un libellé spécifique (par exemple, TermeDomaine) et leur propriété definition depuis le KG. Déclencher manuellement ou sur commit.  
  * **Rapport de Dépendances :** Générer un rapport simple listant les dépendances entre les composants/modules logiciels basé sur les relations DEPENDS\_ON (ou APPELLE) dans le KG.  
  * **Rapport de Statut des Exigences :** Générer une liste d'exigences groupées par leur propriété statut dans le KG.  
* **V2 (Risque Modéré, Valeur Potentielle) :**  
  * **Fragments de Documentation :** Expérimenter la génération de sections de documentation pour des fonctions/modules en interrogeant leurs connexions (par exemple, exigences liées, fonctions appelées) et en fournissant ce contexte à un LLM avec un prompt de template spécifique. Nécessite une validation humaine attentive 66 (mentionne l'efficacité des LLMs pour la documentation).  
  * **Ébauche de Tests Basiques :** Explorer la génération de squelettes de fonctions de test (sans la logique complète) basés sur les signatures de fonctions et les exigences associées récupérées du KG. L'humain complète les détails. (75 utilise KG+LLM pour la génération de pilotes de fuzzing).

Le domaine où l'automatisation est la plus prometteuse et la moins risquée concerne les tâches où le LLM est principalement utilisé pour *transformer* ou *résumer* des données structurées déjà présentes et validées au sein du KG. Les KGs stockent des faits et des relations structurés.1 Les LLMs excellent dans la génération de langage naturel et le formatage de texte.19 Des tâches comme la génération d'un glossaire à partir de nœuds Terme ou d'un rapport à partir de nœuds Exigence impliquent d'interroger des données structurées et de demander au LLM de les formater dans une sortie textuelle spécifique (par exemple, Markdown). Cela tire parti des forces des deux composants : le KG pour des données précises, le LLM pour la présentation. La précision dépend principalement des données du KG. En revanche, les tâches exigeant que le LLM *infère* des informations non explicites dans le graphe ou *génère* un contenu nouveau et complexe (comme une logique de test complète) sont beaucoup plus sujettes aux limitations des LLMs telles que l'hallucination et les erreurs de raisonnement.14 Par conséquent, concentrer l'automatisation V1 sur des tâches qui sont essentiellement des transformations de données structurées en texte minimise les risques et maximise la probabilité de générer des artefacts utiles et précis.

## **VI. Adaptation des Pratiques d'Ingénierie Logicielle pour un Workflow Centré sur LLM**

L'introduction d'un LLM comme acteur central du développement et l'utilisation d'un KG comme représentation principale du projet nécessitent une adaptation significative des pratiques traditionnelles d'ingénierie logicielle, bien au-delà de la simple organisation des artefacts.

### **A. Impact sur les Stratégies de Test (Au-delà du TDD)**

Bien qu'AutoAgent prévoie déjà le Test-Driven Development (TDD), l'utilisation de code généré par IA introduit de nouveaux défis. Les LLMs peuvent générer du code qui passe les tests unitaires de base mais contient des erreurs subtiles, des vulnérabilités de sécurité, ou qui ne correspond pas parfaitement à l'intention initiale.71 Les stratégies de test doivent donc évoluer :

* **Validation Sémantique :** Les tests doivent vérifier si le code généré implémente *correctement l'intention* décrite dans le prompt ou dérivée du KG, et pas seulement s'il s'exécute sans erreur.  
* **Tests de Robustesse :** Évaluer comment le code généré gère les cas limites, les entrées inattendues, ou les variations dans le contexte ou les prompts qui l'ont généré.  
* **Tests de Sécurité Explicites :** Intégrer systématiquement des tests de sécurité pour détecter les vulnérabilités potentiellement introduites par l'IA.71 L'analyse statique (SAST) et dynamique (DAST) devient encore plus cruciale.71 Des outils comme Infer 76 ou SonarQube 71 peuvent être utilisés.  
* **Tests de Biais :** Si pertinent pour l'application, tester les biais potentiels hérités des données d'entraînement du LLM.21  
* **Tests de Régression des Prompts :** Toute modification des prompts ou du modèle LLM sous-jacent peut nécessiter de rejouer les suites de tests pour s'assurer que le code généré reste correct et sûr.

Des techniques comme les tests basés sur les propriétés, les tests métamorphiques, le fuzzing 75, ou même des tests contradictoires (adversarial testing) sur les prompts pourraient être envisagées. Le rôle humain évolue de l'écriture exhaustive de tous les tests vers la conception de stratégies de test globales, la spécification de cas de test complexes ou sémantiques, et la validation critique des tests éventuellement générés par l'IA.81

### **B. Patrons de Conception, Abstractions et Granularité du Code**

L'interaction avec les LLMs soulève des questions sur les choix de conception :

* **Patrons de Conception :** Les LLMs peuvent avoir du mal à comprendre et à appliquer de manière cohérente les patrons de conception spécifiques à un projet ou les contraintes architecturales établies.82 Le code généré peut entrer en conflit avec les normes existantes.82 L'impact des différents patrons sur la performance des LLMs reste un domaine peu exploré.82 Bien que les LLMs puissent potentiellement aider à explorer des alternatives architecturales ou à comprendre les compromis 83, leur tendance à l'hallucination et leur manque de précision nécessitent une supervision humaine rigoureuse pour les tâches d'architecture.84  
* **Abstractions :** Le niveau d'abstraction optimal dans un contexte LLM-centric est une question ouverte. Faut-il privilégier un code plus explicite et moins abstrait pour faciliter la compréhension par le LLM, ou les LLMs modernes sont-ils capables de gérer des niveaux d'abstraction élevés?  
* **Granularité :** La taille idéale des unités de code générées par LLM est également à déterminer. Des fonctions plus petites et autonomes pourraient être plus faciles à spécifier (via le contexte KG), à générer de manière fiable, et à valider individuellement. Les LLMs pourraient cependant être capables de gérer la génération de composants plus larges, bien que cela augmente potentiellement la complexité de la validation.

### **C. Gestion des Dépendances dans un Contexte de Graphe**

Actuellement, les dépendances sont souvent gérées via des fichiers manifestes (go.mod, package.json). Le KG projet offre la possibilité de modéliser explicitement ces dépendances, tant internes (entre modules/fonctions via les relations APPELLE ou DEPENDS\_ON 3) qu'externes (vers des bibliothèques tierces).

Cela permettrait des analyses de dépendances plus sophistiquées directement via des requêtes sur le graphe (par exemple, "Trouver toutes les fonctions dépendant de la bibliothèque X version Y", "Analyser l'impact de la mise à jour d'une dépendance Z sur le reste du projet"). Le principal défi est de maintenir la synchronisation entre les informations de dépendance dans le KG et l'état réel du code et des manifestes de build, ce qui nécessiterait des outils pour parser ces fichiers et mettre à jour le graphe en conséquence.

### **D. Repenser les Processus de Revue et de Validation du Code**

La revue de code traditionnelle, ligne par ligne, devient inefficace face à de grands volumes de code généré par IA.79 De plus, les réviseurs humains peuvent manquer des erreurs subtiles ou des failles de sécurité spécifiques aux artefacts générés par IA.77

Le focus de la revue de code doit donc se déplacer :

* **De :** Vérification détaillée de la syntaxe et de la logique ligne par ligne.  
* **Vers :**  
  * Validation du prompt/spécification utilisé pour la génération.  
  * Évaluation de l'alignement avec les exigences et l'architecture.71  
  * Recherche active de vulnérabilités de sécurité.71  
  * Jugement sur la pertinence, la maintenabilité et l'élégance de la solution proposée par l'IA.  
  * Assurance de la compréhensibilité (le développeur ou superviseur doit pouvoir expliquer le fonctionnement du code généré 77).

La revue elle-même peut être augmentée par l'IA : utiliser des outils IA pour effectuer des analyses statiques, des scans de sécurité, des vérifications de style, et pour suggérer des points d'attention aux réviseurs humains.78

La pratique du pair programming évolue vers une collaboration Homme-IA. Il est essentiel de définir clairement les rôles.85 L'humain apporte la vision stratégique, la compréhension du contexte global et la validation critique, tandis que l'IA fournit la vitesse, les suggestions de code, et le feedback immédiat.79

Les méthodes de validation doivent combiner tests automatisés rigoureux (70), analyses statiques/dynamiques (71), et une revue humaine ciblée sur les aspects conceptuels et sécuritaires (70).

### **E. Gestion de la Dette Technique Induite par l'IA**

Si l'IA peut accélérer le développement, elle peut aussi introduire de nouvelles formes de dette technique 78 :

* Code fonctionnel mais difficile à comprendre ou à maintenir par les humains en raison d'une logique opaque ou non idiomatique générée par le LLM.  
* Incohérences introduites parce que le LLM n'a pas pleinement saisi le contexte du projet ou les standards de codage.82  
* Érosion potentielle des compétences des développeurs due à une dépendance excessive.78  
* Vulnérabilités de sécurité non détectées par l'IA ni par les processus de revue classiques.77  
* Dépendances implicites envers des versions spécifiques d'outils IA ou de leurs comportements.

Les stratégies d'atténuation incluent :

* Documentation explicite de l'utilisation de l'IA.70  
* Processus de validation robustes et ciblés sur le code généré par IA.70  
* Application stricte des standards de codage, potentiellement aidée par des linters ou des outils IA configurés pour le projet.70  
* Prévoir du temps pour le refactoring du code IA afin d'améliorer sa clarté et sa maintenabilité.  
* Utiliser des outils pour surveiller le comportement du code IA en production.71  
* Sensibiliser les développeurs aux risques spécifiques et aux formes de dette technique liées à l'IA.77

Le KG pourrait potentiellement aider à suivre les artefacts générés par IA et les éléments de dette technique associés en les annotant avec des métadonnées spécifiques.

### **F. Recommandation pour AutoAgent**

* **Tests :** Augmenter le TDD avec des tests de validation sémantique (vérification de l'intention), des tests de robustesse (cas limites, variations de prompt), et intégrer obligatoirement des scans SAST/DAST 71 dans le pipeline CI/CD.  
* **Conception/Architecture :** Définir explicitement les principes architecturaux et les patrons de conception clés (potentiellement comme nœuds/propriétés dans le KG). Utiliser ces définitions pour guider et contraindre les prompts de génération du LLM. Commencer par des tâches de génération de plus petite granularité.  
* **Revue de Code :** Mettre en place un processus de revue hybride : outils IA pour les vérifications automatisées (style, bugs simples, scans de sécurité 79), et superviseur humain se concentrant sur la validation du prompt, l'adéquation architecturale, la surveillance de la sécurité, et la correction globale.71 Exiger que le superviseur (interagissant avec le LLM) puisse expliquer la logique complexe générée par l'IA.  
* **Dette Technique :** Suivre explicitement les composants générés par IA (potentiellement via des métadonnées KG). Prioriser les revues et les tests pour ces composants. Cultiver une culture d'évaluation critique des sorties de l'IA.77

L'adaptation fondamentale à travers les pratiques d'ingénierie logicielle (test, revue, conception) dans un contexte LLM-centric implique un déplacement de l'effort cognitif humain principal. Dans l'ingénierie logicielle traditionnelle, les humains spécifient, implémentent, testent et révisent.79 Avec les LLMs, une grande partie de l'implémentation est déléguée à l'IA.66 La valeur ajoutée humaine se déplace donc. L'écriture détaillée du code devient moins critique. En revanche, la spécification claire de *ce que* le LLM doit générer (via des prompts précis, le contexte du KG, des contraintes explicites) devient primordiale, car le principe "garbage in, garbage out" s'applique pleinement.19 Parallèlement, la validation rigoureuse que la sortie de l'IA *correspond réellement* à la spécification et respecte les standards de qualité (sécurité, maintenabilité, architecture) devient l'activité principale d'assurance qualité, remplaçant une grande partie de la revue et des tests traditionnels axés sur l'implémentation.70 Cela implique un besoin accru de compétences en spécification précise, en ingénierie de prompts, et en techniques de validation avancées, au-delà de la simple compétence en codage.

## **VII. Outillage Essentiel pour le Workflow Augmenté**

La mise en œuvre réussie d'un workflow augmenté par IA et basé sur un KG dépend de la disponibilité et de l'intégration d'un ensemble d'outils appropriés.

### **A. Outils Requis**

* **Base de Données KG :** Neo4j (déjà choisi). Nécessite une infrastructure, soit auto-hébergée, soit via un service cloud comme Neo4j AuraDB.1  
* **Visualisation/Interaction KG :**  
  * Pour le développement : Neo4j Browser.50  
  * Pour le superviseur (V1) : Neo4j Bloom.50  
  * Potentiellement post-V1 : Une UI personnalisée utilisant des bibliothèques comme NVL, yFiles, etc..50  
* **Intégration IDE :** Plugins Neo4j pour GoLand/VS Code.52 Un besoin potentiel d'extensions personnalisées pour une intégration plus profonde du KG projet pourrait émerger post-V1. Sourcegraph 62 peut être considéré pour une recherche de code plus large.  
* **Gestion des Métadonnées :** Des processus ou des outils sont nécessaires pour assurer l'application cohérente des métadonnées. Cela pourrait commencer par de simples scripts et évoluer vers des outils dédiés si la complexité augmente.23 Des options open source comme DataHub ou Amundsen existent mais pourraient être surdimensionnées au début.23  
* **Scripts de Peuplement/Maintenance du Graphe :** Des scripts personnalisés (par exemple, en Go ou Python) utilisant les pilotes Neo4j sont essentiels pour analyser les artefacts du projet (code, commits, exigences, etc.) et peupler/mettre à jour le KG de manière fiable et reproductible. Maintenir la synchronisation du KG avec l'état réel du projet est un défi clé.  
* **Orchestration LLM :** Bibliothèques comme LangChain ou LlamaIndex pour gérer les interactions avec les LLMs et les intégrations KG.22  
* **Pipeline CI/CD :** Outils standards comme Jenkins, GitLab CI, GitHub Actions, etc. Ce pipeline devra être adapté pour 72 :  
  * Intégrer les scripts de mise à jour du KG (par exemple, déclenchés par un commit).  
  * Intégrer les étapes de génération automatisée d'artefacts.  
  * Inclure les étapes de test améliorées (SAST, DAST, validation sémantique).71  
  * Potentiellement utiliser les métriques du pipeline pour des analyses basées sur le KG (par exemple, suivre les échecs de build liés à des nœuds spécifiques du KG).  
* **Outils de Validation/Test :** Analyseurs statiques (par exemple, SonarQube, Infer 71), analyseurs dynamiques, scanners de sécurité (par exemple, OWASP ZAP 74), et potentiellement des frameworks pour des tests plus avancés (basés sur les propriétés, métamorphiques).

### **B. Considérations "Construire vs. Acheter"**

* **Acheter/Utiliser l'Existant :** Il est recommandé de s'appuyer sur les outils existants et matures autant que possible : Neo4j (AuraDB), Bloom, Browser, les plugins IDE officiels, LangChain/LlamaIndex, les plateformes CI/CD standards, et les outils de test éprouvés.  
* **Construire/Personnaliser :** Le développement personnalisé sera probablement nécessaire pour : les scripts de peuplement et de synchronisation du KG, potentiellement des composants UI/visualisation spécifiques (post-V1), potentiellement des extensions IDE personnalisées (post-V1), et les scripts d'automatisation spécifiques (par exemple, générateur de glossaire).

### **C. Recommandation pour AutoAgent (V1 & Post-V1)**

* **Essentiels V1 :**  
  * Instance Neo4j (AuraDB recommandé pour la simplicité de gestion).  
  * Neo4j Browser (pour le développement), Neo4j Bloom (pour le superviseur).  
  * IDEs standards (GoLand/VS Code) avec les plugins Neo4j.  
  * Scripts personnalisés (Go/Python) pour le peuplement initial du KG à partir du code source et de l'historique Git.  
  * Bibliothèque LangChain pour l'interaction LLM.  
  * Plateforme CI/CD existante, adaptée pour exécuter les scripts de peuplement et les tests de base.  
  * Outil d'analyse statique de base intégré au CI/CD.  
* **Ajouts Post-V1 :**  
  * Développer des scripts de synchronisation KG personnalisés pour plus de types d'artefacts (exigences, problèmes depuis un tracker).  
  * Investiguer/construire des composants de visualisation personnalisés ou des extensions IDE si un besoin clair émerge.  
  * Implémenter des outils de test plus sophistiqués (DAST, scanners de sécurité) dans le CI/CD.  
  * Considérer une approche de gestion des métadonnées plus dédiée si la complexité le justifie.

## **VIII. Évolution du Rôle Humain et Compétences Requises**

L'adoption d'un workflow augmenté par IA et centré sur un KG transforme profondément le rôle du superviseur humain, s'éloignant de l'exécution directe pour se rapprocher de la stratégie, de la conception et de la validation.

### **A. Glissement des Responsabilités du Superviseur**

Le superviseur passera moins de temps sur des tâches comme :

* Le codage direct et détaillé.  
* La revue de code ligne par ligne exhaustive.  
* La création manuelle de nombreux artefacts (documentation de base, rapports simples).

Et consacrera plus de temps à :

* **Architecture et Conception :** Définir les exigences de haut niveau, spécifier les tâches pour les agents LLM, prendre des décisions architecturales clés, s'assurer de la cohérence avec les patrons de conception établis.82  
* **Stratégie et Orchestration :** Guider le processus de développement global, gérer l'interaction entre les différents agents (si applicable post-V1), prioriser les tâches et les objectifs.  
* **Validation et Assurance Qualité :** Évaluer de manière critique les sorties de l'IA (code, tests, documentation), garantir leur exactitude, leur sécurité, et leur conformité aux standards.70 Concevoir et superviser les stratégies de validation.  
* **Ingénierie de Prompts :** Concevoir des prompts efficaces et fournir le contexte nécessaire (souvent via des requêtes KG) pour guider les agents LLM vers les résultats souhaités.19  
* **Curation du KG :** Superviser la santé, la précision et la pertinence du graphe de connaissances du projet, potentiellement en affinant le schéma ou les relations au fil du temps.  
* **Maîtrise des Outils :** Comprendre et utiliser efficacement la suite d'outils IA et KG mis en place.

### **B. Compétences Cruciales**

Cette évolution du rôle rend plusieurs compétences particulièrement cruciales :

* **Ingénierie de Prompts Avancée :** Savoir concevoir des prompts clairs, précis, contextuels et contraints pour obtenir des réponses fiables et pertinentes des LLMs.19 Comprendre les différentes techniques (zero-shot, few-shot, chain-of-thought, injection de contexte).19  
* **Analyse Critique des Sorties IA :** Capacité à évaluer rigoureusement le code, le texte et les autres artefacts générés par l'IA pour détecter les erreurs, les omissions, les failles de sécurité, les incohérences logiques et les biais potentiels.70 Ne pas accepter aveuglément les suggestions de l'IA.  
* **Littératie en Graphes de Connaissances :** Comprendre les concepts fondamentaux des KGs (nœuds, arêtes, propriétés, libellés), maîtriser les bases du langage de requête Cypher pour l'inspection et la récupération de contexte, et saisir les principes de la modélisation de graphes.91 Être capable d'interpréter les visualisations de graphes.50  
* **Maîtrise des Outils de Validation et de Monitoring :** Être à l'aise avec les frameworks de test, les outils d'analyse statique et dynamique, les scanners de sécurité, et potentiellement les outils de monitoring spécifiques à l'IA.70  
* **Pensée Systémique :** Comprendre comment les différents composants du système augmenté (KG, LLMs, agents, outils, processus humain) interagissent et s'influencent mutuellement.  
* **Expertise du Domaine :** Reste essentielle pour définir les exigences métier, valider la correction sémantique des sorties de l'IA, et guider la modélisation du KG.

Le rôle du superviseur évolue donc vers celui d'un **concepteur d'interaction homme-IA et d'un contrôleur qualité**. L'agent LLM effectuant une grande partie de la génération de code et potentiellement d'autres tâches 66, l'interaction principale du superviseur se fait désormais *avec le système IA* (via les prompts, les requêtes KG, la validation) plutôt qu'exclusivement avec le code lui-même.85 Concevoir des interactions efficaces (bons prompts, contexte KG pertinent) est la clé pour obtenir les résultats souhaités 19, ce qui relève de la conception d'interaction. Parallèlement, comme la sortie de l'IA peut être imparfaite 71, l'humain doit agir comme le garant ultime de la qualité, appliquant un jugement critique et des techniques de validation rigoureuses.70 Ce rôle combine donc des compétences techniques, analytiques et de communication 68 pour façonner l'entrée de l'IA et valider sa sortie.

## **IX. Soutenabilité à Long Terme : Scalabilité et Maintenance**

La mise en place d'un workflow augmenté est un investissement initial, mais sa viabilité à long terme dépend de la capacité à gérer sa maintenance et sa scalabilité de manière soutenable.

### **A. Défis et Coûts de Maintenance du Système de Workflow Augmenté**

La maintenance de ce système complexe va bien au-delà de la simple administration de la base de données Neo4j.

* **Maintenance du KG :**  
  * *Qualité et Cohérence des Données :* Assurer l'exactitude, résoudre les conflits entre sources, supprimer les informations obsolètes est un effort continu.94 Cela nécessite des règles de validation, potentiellement des mécanismes de détection de données périmées basés sur le ML, et des boucles de feedback utilisateur.95  
  * *Évolution du Schéma :* Adapter le schéma du KG à mesure que les besoins du projet ou les sources de données évoluent est souvent un processus manuel, complexe et potentiellement coûteux en temps.10 Les modifications doivent être planifiées pour éviter de casser les intégrations existantes (requêtes, scripts, prompts LLM).59 Le versionnement du schéma peut aider.95  
  * *Coût :* La maintenance des KGs requiert un effort soutenu de personnel qualifié (ingénieurs de données, experts du domaine), ce qui impacte le coût total de possession (TCO).96  
* **Maintenance de l'Outillage :** Mise à jour et correction des bugs dans les scripts personnalisés (peuplement, automatisation), les composants UI éventuels, et les extensions IDE.  
* **Maintenance de l'Intégration LLM :**  
  * *Ingénierie de Prompts :* Les prompts devront probablement être affinés à mesure que les modèles LLM évoluent, que le contexte du projet change, ou que de nouvelles tâches sont introduites.19 C'est un processus itératif continu.20  
  * *Changements d'API/Modèle :* Les APIs des fournisseurs LLM ou les modèles sous-jacents peuvent changer, nécessitant des mises à jour du code d'intégration.  
  * *Gestion des Dépendances :* La dépendance à des versions spécifiques de LLM ou à leurs comportements introduit un risque de maintenance.  
* **Maintenance du Workflow Global :** L'ensemble du système (KG \+ LLM \+ Outils \+ Processus Humain) doit être géré comme une unité cohérente. Un changement dans une partie a souvent des répercussions sur les autres. Cela nécessite un versionnement robuste et des tests du workflow lui-même.

Le coût total de possession et la complexité à long terme ne résident pas seulement dans la maintenance de la base de données Neo4j, mais dans l'effort continu requis pour maintenir l'*écosystème complet*. Le système comprend le KG, les LLMs, le code d'intégration (LangChain), les scripts personnalisés, les outils d'interface utilisateur et les processus humains (). La maintenance du KG implique la qualité des données, l'évolution du schéma, etc..10 L'intégration LLM nécessite un ajustement continu des prompts et une adaptation aux changements de modèle.19 Les outils personnalisés (scripts, UI) exigent une maintenance logicielle standard. Les compétences humaines doivent être mises à jour (). Ces composants sont interdépendants : un changement de schéma affecte les prompts et les scripts.95 Un changement de LLM affecte les prompts et les sorties attendues. Par conséquent, le coût réel de la maintenance est la somme de la maintenance de toutes ces parties interconnectées, rendant la "maintenance du workflow" potentiellement plus significative que la simple "maintenance du KG".96

### **B. Stratégies de Scalabilité (Scaling Neo4j, Évolution du Workflow)**

* **Scalabilité de Neo4j :**  
  * *Scaling Vertical (Scale-Up) :* Augmenter les ressources (CPU, RAM, stockage) d'une instance unique.11 Simple mais limité par les capacités d'un seul serveur.  
  * *Scaling Horizontal (Scale-Out) :* Utiliser le Causal Clustering de Neo4j pour la scalabilité en lecture et la tolérance aux pannes.11 Des répliques gèrent les requêtes de lecture.98  
  * *Sharding/Fédération (Neo4j Fabric) :* Pour les graphes de très grande taille ou une scalabilité complexe en écriture, distribuer des partitions du graphe sur plusieurs bases de données/clusters.11 Permet l'exécution de requêtes en parallèle, l'isolement des données (par exemple, pour la conformité), et la réduction de la latence.98 Adresse le volume de données et le débit.98 Nécessite une modélisation de données et une conception de requêtes attentives. Neo4j revendique une scalabilité jusqu'à des milliards de nœuds et des trillions de relations.11  
  * *Options Cloud (AuraDB) :* Le service géré prend en charge la scalabilité de l'infrastructure.98  
  * *Indexation :* Une indexation appropriée est cruciale pour les performances des requêtes à grande échelle.11 Il faut équilibrer le surcoût des index en écriture par rapport à la vitesse des requêtes.  
* **Scalabilité du Workflow :**  
  * *Conception Modulaire :* Concevoir le schéma KG, les outils, et la logique des agents de manière modulaire pour faciliter l'évolution et le remplacement des composants.  
  * *Automatisation :* Automatiser les mises à jour du KG, les tests, et la génération d'artefacts pour gérer la complexité croissante du projet.  
  * *Traitement Asynchrone :* Utiliser des files d'attente de messages ou des tâches asynchrones pour les mises à jour non critiques du KG ou le traitement en arrière-plan.  
  * *Monitoring des Performances :* Surveiller les performances des requêtes KG, les temps de réponse LLM, et les temps d'exécution globaux du workflow pour identifier les goulots d'étranglement.72

### **C. Assurer la Viabilité à Long Terme**

* **Adoption Incrémentale :** Commencer petit, démontrer la valeur ajoutée, et itérer.100 Aligner l'adoption sur des modèles de maturité reconnus.102  
* **Responsabilités Claires :** Définir clairement qui est responsable de la maintenance du KG, des outils, et du workflow global.  
* **Documentation :** Documenter de manière exhaustive le schéma KG, l'utilisation des outils, les prompts, et les processus du workflow.70  
* **Formation Continue :** Former continuellement le superviseur et potentiellement d'autres membres de l'équipe aux compétences requises.68  
* **Revue Régulière :** Examiner périodiquement l'efficacité du workflow, des outils, et du schéma KG, en apportant les ajustements nécessaires.

## **X. Feuille de Route d'Adoption Incrémentale pour AutoAgent**

L'intégration de ces concepts avancés dans AutoAgent doit se faire de manière pragmatique et progressive, en commençant par des éléments fondamentaux et en évoluant vers des capacités plus sophistiquées.

### **A. Principes Directeurs**

* **Commencer Petit, Prouver la Valeur :** Concentrer la V1 sur les éléments centraux, à fort impact et à faible risque.100  
* **Alignement sur la Maturité :** Structurer les phases en fonction d'une maturité croissante en IA/KG.102 V1 correspond aux niveaux Fondamental/Actif ; Post-V1 aux niveaux Opérationnel/Systémique.  
* **Itérer et Adapter :** Être prêt à ajuster la feuille de route en fonction des apprentissages de la V1 et de l'évolution rapide des technologies IA/KG.  
* **Focus sur l'Expérience Superviseur :** S'assurer que les outils et processus V1 sont utilisables et apportent une réelle valeur ajoutée au superviseur unique.

### **B. Recommandations pour AutoAgent V1 (Maturité Fondamentale/Active)**

* **Schéma et Peuplement KG :** Implémenter le schéma V1 essentiel (Code, Exigence, Test, Commit, Utilisateur) avec des identifiants hybrides UUID/nom et des métadonnées de base (). Développer les scripts initiaux pour peupler le graphe à partir de l'historique Git et des sources d'exigences. Utiliser les contraintes UNIQUE.15  
* **Interaction LLM :** Utiliser LangChain GraphCypherQAChain pour la récupération basique NL-to-Cypher (). Concentrer les prompts sur la récupération de faits spécifiques ou de relations simples. Accepter les limitations en matière de raisonnement profond.  
* **Interaction Humaine :** Utiliser Neo4j Bloom comme interface principale pour le superviseur (). Fournir une formation. Utiliser les plugins IDE pour les requêtes développeur.  
* **Automatisation :** Implémenter des automatisations à faible risque : génération de glossaire, rapports simples de dépendances/statuts ().  
* **Pratiques d'Ingénierie Logicielle :** Se concentrer sur la mise en place d'une analyse statique de base (SAST) dans le CI/CD. Adapter légèrement le processus de revue pour inclure la validation des prompts/sorties pour les tâches automatisées. Suivre manuellement l'utilisation de l'IA.  
* **Outillage :** Neo4j AuraDB, Bloom, Plugins IDE, LangChain, scripts de peuplement de base, CI/CD adapté ().  
* **Objectif V1 :** Établir la fondation KG, démontrer la récupération basique d'informations du graphe par le LLM, fournir une valeur initiale au superviseur via l'exploration Bloom et une automatisation simple.

### **C. Recommandations pour l'Évolution Post-V1 (Maturité Opérationnelle/Systémique)**

* **Schéma et Peuplement KG :** Étendre le schéma (Décisions, Risques, Problèmes, Docs). Implémenter des scripts pour une extraction de métadonnées plus riche et la synchronisation avec davantage de sources (par exemple, outil de suivi des problèmes). Affiner le schéma en fonction de l'utilisation V1.  
* **Interaction LLM :** Explorer la Couche Sémantique/Appels de Fonctions pour une interaction agent plus fiable (). Expérimenter avec LangGraph pour des tâches agent multi-étapes. Évaluer LlamaIndex ou des stratégies RAG avancées de LangChain si nécessaire. Envisager les GNNs uniquement si un raisonnement structurel profond s'avère essentiel et réalisable.  
* **Interaction Humaine :** Développer des composants UI personnalisés (React) si Bloom est insuffisant (). Améliorer l'intégration IDE pour une navigation graphe-code transparente.  
* **Automatisation :** Aborder les tâches d'automatisation V2 : génération de fragments de documentation, ébauche de tests basiques (). Explorer l'analyse d'impact basée sur le graphe.  
* **Pratiques d'Ingénierie Logicielle :** Mettre en œuvre une validation plus rigoureuse du code IA (DAST, scans de sécurité). Formaliser le suivi de la dette technique liée à l'IA (potentiellement dans le KG). Affiner les processus de revue pour la collaboration homme-IA. Définir explicitement les contraintes architecturales pour guider le LLM.  
* **Outillage :** Composants UI/IDE personnalisés, outils de test avancés, potentiellement des outils de gestion des métadonnées ().  
* **Concepts Radicaux (Exploratoires) :** Envisager d'abandonner progressivement la vue traditionnelle du système de fichiers pour certaines tâches, en s'appuyant davantage sur la navigation graphique. Explorer la génération d'expériences interactives ou de simulations directement à partir du KG.  
* **Objectif Post-V1 :** Approfondir l'intégration du KG, permettre des comportements d'agent plus complexes, fournir une interaction humaine plus riche, automatiser des tâches plus complexes, et intégrer pleinement le workflow centré sur le graphe.

### **D. Tableau : Feuille de Route Priorisée des Fonctionnalités**

| Fonctionnalité/Capacité | Description | Priorité V1 (Haute/Moy/Faible) | Priorité Post-V1 (Haute/Moy/Faible) | Snippets Clés | Niveau Maturité Adressé (Ex: Gartner) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Schéma KG Essentiel (Code, Req, Test...) | Établir les types de nœuds/relations de base | Haute | Faible (Extension) | 1 | Fondamental (Awareness) |
| Identifiants Hybrides UUID \+ Alias | Stratégie d'ID de nœud combinant unicité et lisibilité | Haute | Faible | 15 | Fondamental (Awareness) |
| Scripts Peuplement KG Basiques | Peupler le graphe depuis Git/Sources Exigences | Haute | Faible (Extension) | 4 | Fondamental (Awareness) |
| Interface Neo4j Bloom | Outil d'exploration pour le superviseur | Haute | Moyenne (Complément) | 50 | Actif (Active) |
| LangChain NL-to-Cypher | Capacité de requête basique pour l'agent LLM | Haute | Moyenne (Affiner/Remplacer) | 22 | Actif (Active) |
| Génération de Glossaire | Exemple d'automatisation simple | Moyenne | Faible | 64 | Actif (Active) |
| Schéma KG Étendu (Risque, Décision...) | Inclure plus de contexte projet | Faible | Haute |  | Opérationnel (Operational) |
| Couche Sémantique/Appels Fonctions | Interaction agent fiable via fonctions prédéfinies | Faible | Haute | 22 | Opérationnel (Operational) |
| UI/Visualisation Personnalisée | Interface superviseur sur mesure si Bloom insuffisant | Faible | Haute | 50 | Opérationnel/Systémique |
| Automatisation Avancée (Docs, Tests) | Génération LLM plus complexe | Faible | Moyenne | 66, | Systémique (Systemic) |
| Intégration IDE Améliorée | Lien transparent graphe-code dans l'IDE | Faible | Moyenne | 52 | Systémique (Systemic) |
| Abstraction Complète Système Fichiers | Dépendance principale à la vue graphe (exploratoire) | Faible | Faible |  | Transformationnel (Transformational) |

*Justification de la Valeur du Tableau :* Ce tableau fournit un plan clair, actionnable et priorisé pour AutoAgent. Il répond directement au besoin de la requête pour une feuille de route incrémentale 100, lie les fonctionnalités à des recherches/bonnes pratiques spécifiques (snippets), et ancre le phasage dans des concepts établis de maturité d'adoption de l'IA 102, rendant les recommandations concrètes et justifiables.

## **XI. Conclusion**

L'adoption d'un workflow de développement logiciel augmenté par l'IA et centré sur un graphe de connaissances représente une opportunité significative pour le projet AutoAgent d'optimiser radicalement ses processus. La capacité à modéliser l'ensemble des artefacts et contextes du projet (code, exigences, tests, commits, décisions, etc.) au sein d'un KG Neo4j unifié offre une base solide pour une compréhension holistique et une automatisation ciblée.

Les recommandations clés de ce rapport soulignent une approche pragmatique et incrémentale. Pour la V1, il est conseillé de se concentrer sur l'établissement d'un schéma KG essentiel, l'utilisation d'identifiants hybrides (UUID \+ alias), le peuplement initial du graphe, et la mise en place d'interactions LLM basiques via LangChain pour la récupération d'informations. L'interface humaine pour le superviseur devrait s'appuyer sur Neo4j Bloom, complétée par les plugins IDE standards. L'automatisation V1 devrait cibler des tâches à faible risque comme la génération de glossaires ou de rapports simples.

L'évolution post-V1 pourra ensuite explorer des schémas plus riches, des techniques d'interaction LLM-KG plus avancées (comme une couche sémantique ou LangGraph), des interfaces utilisateur personnalisées, une automatisation plus complexe, et une adaptation plus profonde des pratiques d'ingénierie logicielle (tests sémantiques, revue de code hybride, gestion de la dette technique IA).

Cependant, la mise en œuvre de ce paradigme n'est pas sans défis. Les limitations actuelles des LLMs en matière de raisonnement complexe sur graphe, la nécessité d'une ingénierie de prompts rigoureuse, la gestion de la charge cognitive pour l'interaction humaine avec le graphe, et la maintenance à long terme de l'écosystème complet (KG, LLM, outils, processus, compétences) nécessitent une attention proactive. Le rôle du superviseur humain évolue considérablement, exigeant de nouvelles compétences en conception d'interaction homme-IA, en analyse critique des sorties IA, et en littératie des graphes de connaissances.

En suivant la feuille de route proposée, AutoAgent peut naviguer ces complexités et réaliser progressivement la valeur stratégique d'un workflow véritablement augmenté, où le graphe de connaissances sert de cerveau central et l'IA agit comme un collaborateur puissant, sous la direction éclairée du superviseur humain. Les prochaines étapes consistent à démarrer l'implémentation des éléments prioritaires de la V1, en gardant à l'esprit l'objectif à long terme et les adaptations nécessaires.

## **XII. Références**

1 Neo4j Blog. (March 12, 2025). How to Build a Knowledge Graph in 7 Steps.  
12 Darekar, K. (March 10, 2025). Knowledge Graph Extraction and Challenges. Neo4j Blog.  
90 Neo4j Blog. (Date Unknown). Building Knowledge Graphs With Claude and Neo4j: A No-Code MCP.  
28 ArXiv Preprint. (Date Unknown). Title related to KG construction and LLM interaction for Q\&A.  
105 Wu, T., & Banerjee, P. (2014). Title related to RDF KGs. Frontiers in Artificial Intelligence.  
9 ArXiv Preprint. (Date Unknown). Procedure Model for Building Knowledge Graphs for Industry.  
8 ResearchGate Publication. (Date Unknown). A Knowledge Graph-based Integration Approach for Research Digital Artifacts.  
6 Mao, Z., Garijo, D., & Fakhraei, S. (2019). Title related to extracting scientific software metadata. QSS.  
2 Daytona.io Blog. (Date Unknown). Building a Knowledge Graph of Your Codebase.  
3 FalkorDB Blog. (July 22, 2024). Code Graph: From Visualization to Integration.  
4 Neo4j Blog. (Date Unknown). Codebase Knowledge Graph.  
5 DZone Article. (Date Unknown). Enhancing Code Analysis With Code Graphs.  
13 Constitutional Discourse Blog. (Date Unknown). Knowledge Graphs and LLMs: How Can We Move From Structured Knowledge to AI-Generated Answers? Part II.  
21 DZone Article. (Date Unknown). Supercharge LLMs with Knowledge Graphs.  
106 Lettria Blog. (Date Unknown). LLM vs Knowledge Graph: Why Your Business Needs Both.  
29 medRxiv Preprint. (Date Unknown). Title related to Medical KG and LLM for diagnosis prediction.  
15 Neo4j GraphAcademy. (Date Unknown). Importing Data \- Unique IDs and Constraints.  
18 Mangesh. (Apr 15, Year Unknown). Neo4j Tutorial: Establishing Constraints in Graph Databases. Dev.to.  
16 Neo4j GraphAcademy. (Date Unknown). Cypher Indexes & Constraints \- Identify Properties.  
17 Tutorialspoint. (Date Unknown). Neo4j \- Create Unique Constraint.  
35 LangChain Python API Reference. (Date Unknown). langchain\_neo4j.chains.graph\_qa.cypher.GraphCypherQAChain.  
25 Neo4j Blog. (Date Unknown). Creating a Neo4j GraphRAG Workflow using LangChain and LangGraph.  
22 Neo4j Labs. (Nov 6 2025). GenAI Ecosystem \- LangChain.  
36 LangChain JS Documentation. (Date Unknown). Cypher Chain.  
26 Neo4j Blog. (Date Unknown). Enhanced QA Integrating Unstructured Knowledge Graph Using Neo4j.  
38 LlamaIndex Documentation. (Date Unknown). Using Knowledge Graph with Neo4jGraphStore.  
39 Neo4j Labs. (Nov 6 2025). GenAI Ecosystem \- LlamaIndex.  
41 LlamaIndex Documentation. (Date Unknown). Using Knowledge Graph.  
40 Neo4j Blog. (Date Unknown). Customizing Property Graph Index in LlamaIndex.  
42 Neo4j Blog. (Date Unknown). Building NLP Applications with LlamaIndex and Neo4j.  
14 ArXiv Preprint. (Date Unknown). Title related to LLM-powered activity-centric KGs.  
34 OpenReview Paper. (16 Mar 2025). ReKnoS: Enhancing Reasoning over Knowledge Graphs using Super-Relations.  
43 Hacker News Comment. (Date Unknown). Comment on LLM reasoning limitations.  
44 ArXiv Preprint. (Date Unknown). Title related to benchmarking LLM graph reasoning.  
45 ArXiv Preprint. (Date Unknown). Title related to LLM intuition-aware KG reasoning for recommendations.  
30 ArXiv Preprint. (Date Unknown). KG-RAR: Step-by-Step Knowledge Graph Based Retrieval-Augmented Reasoning.  
7 Abedu, M. K., et al. (2024b). Title related to KG-based repository Q\&A. ArXiv Preprint.  
31 ArXiv Preprint. (Date Unknown). Linguistic Graph Knowledge Distillation (LinguGKD).  
32 ArXiv Preprint. (Date Unknown). Graph Neural Prompting (GNP).  
33 ArXiv Preprint. (Date Unknown). GraphGPT: Aligning Large Language Models with Graph Structures via Graph Instruction Tuning.  
50 de Jong, N. (February 19, 2025). 15 Best Graph Visualization Tools for Your Neo4j Graph Database. Neo4j Blog.  
60 Synergy Codes Blog. (Date Unknown). Top 10 Free Graph Visualization Software to Simplify Complex Data.  
107 Grønbæk, K., et al. (2020). Title related to KirigamiTable. Taylor & Francis Online.  
55 ArXiv Preprint. (Date Unknown). Title related to Semantic UI retrieval.  
54 Min, B. (2025). Malleable Overview-Detail Interfaces. CHI '25 Paper.  
46 ArXiv Preprint. (Date Unknown). AGENTiGraph: Adaptive Generative ENgine for Task-based Interaction and Graphical Representation.  
56 Wintersberger, P., et al. (2022). Title related to HCI guidelines for H-AI collaboration. PMC NCBI.  
57 PMC NCBI Article. (Date Unknown). Title related to usability evaluation of a KG-based recommender system.  
48 FasterCapital Content. (Date Unknown). Cognitive Load Management in Data Visualization.  
49 Bass Connections, Duke University. (Date Unknown). Project: Improving Data Visualization with Cognitive Science (2025-2026).  
28 ArXiv Preprint. (Date Unknown). Title related to LLM accuracy for repository Q\&A using KGs..7  
75 ArXiv Preprint. (Date Unknown). CodeGraphGPT: Automating Fuzz Driver Generation using Code Knowledge Graphs and Large Language Models.  
7 Abedu, M. K., et al. (2024b). Title related to KG-based repository Q\&A with CoT. ArXiv Preprint..7  
47 TigerGraph Glossary. (Date Unknown). Knowledge Graph LLM.  
64 ArXiv Preprint. (Date Unknown). Title related to LLMs for enterprise modeling.  
65 Journal of Medical Internet Research (JMIR). (2025). Title related to LLM construction of sepsis KG.  
37 LTIMindtree Blog. (Date Unknown). Using Knowledge Graphs and Large Language Models to Accelerate Software Delivery.  
108 ICSE 2025 LLM4Code Workshop Paper. (Date Unknown). Knowledge Graph-Based Repository-Level Code Generation.  
27 NVIDIA Developer Blog. (Date Unknown). Insights, Techniques, and Evaluation for LLM-Driven Knowledge Graphs.  
89 ArXiv Preprint. (Date Unknown). Survey on LLMs and LLM-based agents for software engineering.  
66 ResearchGate Publication. (Date Unknown). The Future of AI-Driven Software Engineering.  
81 Fan, A., et al. (2023). Title related to LLMs in software engineering. ResearchGate Publication.  
109 ArXiv Preprint. (Date Unknown). Paper2Code: Automating Code Generation from Scientific Papers.  
76 ArXiv Preprint. (Date Unknown). Title related to testing and static analysis of LLM-generated C code.  
79 CodeAnt AI Blog. (Date Unknown). AI vs Traditional Code Review.  
86 Graphite Blog. (Date Unknown). Exploring the benefits of pair reviewing in code reviews.  
85 Zencoder AI Blog. (Date Unknown). Best Practices for Pair Programming with AI Coding Agents.  
82 ArXiv Preprint. (Date Unknown). Title related to Code LLMs and design patterns.  
84 ResearchGate Publication. (Date Unknown). Generative AI for Software Architecture: Applications, Trends, Challenges, and Future Directions.  
83 GSSI Seminar Abstract. (March 18, 2025). Software Architecture Design meets LLM Technology: Applications, Challenges and Opportunities.  
51 yWorks Website. (Date Unknown). Visualizing a Neo4j Graph Database.  
110 Reddit Comment. (Date Unknown). Comment on Obsidian graph view and Neo4j visualization.  
58 Neo4j Documentation. (Date Unknown). Visualize your data in Neo4j.  
23 lakeFS Blog. (Date Unknown). Metadata Management Tools.  
24 PuppyGraph Blog. (Date Unknown). Knowledge Graph Tools.  
72 Mergify Blog. (Date Unknown). CI/CD Pipeline Best Practices.  
73 Spacelift Blog. (Date Unknown). CI/CD Best Practices.  
74 Zeet Blog. (Date Unknown). 20 Most Important CICD Pipeline Best Practices.  
95 Milvus Blog. (Date Unknown). How do you keep a knowledge graph updated?  
59 PageOn.ai Blog. (Date Unknown). How to Build a Knowledge Graph.  
19 OpenAI Documentation. (Date Unknown). Prompt engineering \- Six strategies for getting better results.  
20 GeeksforGeeks. (Date Unknown). Prompt Engineering Best Practices.  
67 Geniusee Blog. (Date Unknown). Prompt Engineering Best Practices.  
68 SingleStore Blog. (Date Unknown). A Complete Guide to Prompt Engineering.  
69 Flyaps Blog. (Date Unknown). Prompt Engineering: Things You Must Know to Gain Maximum Value From Gen AI Tools.  
91 Antelmi, A., Offertucci, V., & Pellegrino, M. A. (2024). KGSnap\! in Practice: a Block-based Programming Environment for Enabling Knowledge Graph Literacy. CEUR Workshop Proceedings.  
92 Antelmi, A. (Date Unknown). Profile page mentioning license literacy. University of Turin.  
93 University of Turin Publication List. (Date Unknown). Listing of KGSnap\! paper.  
70 Leanware Blog. (Date Unknown). Best Practices for Using AI in Code Generation.  
71 Digma AI Blog. (Date Unknown). Taming the Code Generation Beast: How Responsible is Your AI Adoption in Java?  
80 IBM Think Blog. (Date Unknown). What are the key components to AI code review?  
77 Jit Blog. (Date Unknown). AI-Generated Code: The Security Blind Spot Your Team Can’t Ignore.  
96 Coveo Blog. (Date Unknown). Knowledge Graphs: High Performance or High Maintenance?  
94 Milvus Blog. (Date Unknown). What are the challenges in maintaining a knowledge graph?  
10 MDPI Applied Sciences Journal Article. (Date Unknown). Title related to dynamic adaptations in KG construction.  
97 GraphBuild Blog. (Date Unknown). Navigating the Complexities of Knowledge Graph Creation.  
78 Trace3 Blog. (Date Unknown). Beyond Autocomplete: How AI is Rewriting Software Development.  
87 SEI Insights. (Date Unknown). AI-Augmented Software Engineering.  
88 Dagstuhl Perspectives Workshop Report. (Date Unknown). Report on Technical Debt Management.  
111 Aimprosoft Blog. (Date Unknown). How AI Can Help Accelerate Software Development.  
12 Darekar, K. (March 10, 2025). Knowledge Graph Extraction and Challenges. Neo4j Blog..12  
99 HigherGov Contract Opportunity. (Date Unknown). Exploring the Ability to Enhance Scalability for Knowledge Graphs.  
11 Tom Sawyer Software Blog. (Date Unknown). Neo4j Knowledge Graphs: Data Connectivity and Intelligence.  
98 Neo4j Blog. (Date Unknown). Achieve Unrivaled Speed and Scalability With Neo4j.  
61 VS Code Marketplace. (Date Unknown). Neo4j for VS Code Extension.  
62 VS Code Marketplace. (Date Unknown). Sourcegraph Extension.  
112 Neo4j Website. (Date Unknown). Homepage content.  
63 YouTube Video. (Date Unknown). Video demonstrating Sourcegraph VS Code plugin.  
50 de Jong, N. (February 19, 2025). 15 Best Graph Visualization Tools for Your Neo4j Graph Database. Neo4j Blog..50  
53 JetBrains Marketplace. (Date Unknown). Code Graph Plugin.  
52 Neo4j Blog. (Date Unknown). Cypher and GQL in Your JetBrains IDE: Announcing the New Neo4j Plugin.  
58 Neo4j Documentation. (Date Unknown). Visualize your data in Neo4j..58  
102 Damco Group Blog. (Date Unknown). Understanding AI Maturity Models.  
113 Veritis Blog. (Date Unknown). AI Maturity Model: A CEO’s Guide to Scaling AI for Success.  
103 BTIT Consulting Website. (Date Unknown). AI Adoption Maturity Frameworks.  
104 BMC Blogs. (Date Unknown). AI Maturity Models Explained.  
100 PageOn.ai Blog. (Date Unknown). How to Build a Knowledge Graph.  
101 Moore, M. (Date Unknown). Setting a Roadmap for an Enterprise Graph Strategy. Neo4j Blog.  
114 DataCamp Tutorial. (Date Unknown). Knowledge Graph RAG Tutorial.  
115 ArXiv Preprint. (Date Unknown). Title related to LLM interaction with KGs for visualization and analysis.  
1 Neo4j Blog. (March 12, 2025). How to Build a Knowledge Graph in 7 Steps..1  
12 Darekar, K. (March 10, 2025). Knowledge Graph Extraction and Challenges. Neo4j Blog..12  
4 Neo4j Blog. (Date Unknown). Codebase Knowledge Graph..4  
3 FalkorDB Blog. (July 22, 2024). Code Graph: From Visualization to Integration..3  
15 Neo4j GraphAcademy. (Date Unknown). Importing Data \- Unique IDs and Constraints..15  
18 Mangesh. (Apr 15, Year Unknown). Neo4j Tutorial: Establishing Constraints in Graph Databases. Dev.to..18  
22 Neo4j Labs. (Nov 6 2025). GenAI Ecosystem \- LangChain..22  
35 LangChain Python API Reference. (Date Unknown). langchain\_neo4j.chains.graph\_qa.cypher.GraphCypherQAChain..35  
38 LlamaIndex Documentation. (Date Unknown). Using Knowledge Graph with Neo4jGraphStore..38  
39 Neo4j Labs. (Nov 6 2025). GenAI Ecosystem \- LlamaIndex..39  
7 Inaccessible URL..4  
14 Inaccessible URL..5  
34 OpenReview Paper. (16 Mar 2025). ReKnoS: Enhancing Reasoning over Knowledge Graphs using Super-Relations..34  
30 ArXiv Preprint. (Date Unknown). KG-RAR: Step-by-Step Knowledge Graph Based Retrieval-Augmented Reasoning..30

#### **Works cited**

1. How to Build a Knowledge Graph in 7 Steps \- Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/knowledge-graph/how-to-build-knowledge-graph/](https://neo4j.com/blog/knowledge-graph/how-to-build-knowledge-graph/)  
2. www.daytona.io, accessed May 2, 2025, [https://www.daytona.io/dotfiles/building-a-knowledge-graph-of-your-codebase\#:\~:text=A%20code%20knowledge%20graph%20is,calls%2C%20inheritance%2C%20data%20flow)](https://www.daytona.io/dotfiles/building-a-knowledge-graph-of-your-codebase#:~:text=A%20code%20knowledge%20graph%20is,calls%2C%20inheritance%2C%20data%20flow\))  
3. Code Graph: From Visualization to Integration \- FalkorDB, accessed May 2, 2025, [https://www.falkordb.com/blog/code-graph/](https://www.falkordb.com/blog/code-graph/)  
4. Codebase Knowledge Graph: Code Analysis with Graphs \- Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/developer/codebase-knowledge-graph/](https://neo4j.com/blog/developer/codebase-knowledge-graph/)  
5. Enhancing Code Analysis With Code Graphs \- DZone, accessed May 2, 2025, [https://dzone.com/articles/enhancing-code-analysis-with-code-graphs](https://dzone.com/articles/enhancing-code-analysis-with-code-graphs)  
6. A framework for creating knowledge graphs of scientific software metadata, accessed May 2, 2025, [https://direct.mit.edu/qss/article/2/4/1423/108045/A-framework-for-creating-knowledge-graphs-of](https://direct.mit.edu/qss/article/2/4/1423/108045/A-framework-for-creating-knowledge-graphs-of)  
7. Synergizing LLMs and Knowledge Graphs: A Novel Approach to Software Repository-Related Question Answering \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2412.03815v1](https://arxiv.org/html/2412.03815v1)  
8. A Knowledge Graph-based Integration Approach for Research Digital Artifacts | Request PDF \- ResearchGate, accessed May 2, 2025, [https://www.researchgate.net/publication/373066797\_A\_Knowledge\_Graph-based\_Integration\_Approach\_for\_Research\_Digital\_Artifacts](https://www.researchgate.net/publication/373066797_A_Knowledge_Graph-based_Integration_Approach_for_Research_Digital_Artifacts)  
9. Procedure Model for Building Knowledge Graphs for Industry Applications \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2409.13425v1](https://arxiv.org/html/2409.13425v1)  
10. Construction of Knowledge Graphs: Current State and Challenges \- MDPI, accessed May 2, 2025, [https://www.mdpi.com/2078-2489/15/8/509](https://www.mdpi.com/2078-2489/15/8/509)  
11. Neo4j Knowledge Graph | Tom Sawyer Software, accessed May 2, 2025, [https://blog.tomsawyer.com/neo4j-knowledge-graphs-data-connectivity-and-intelligence](https://blog.tomsawyer.com/neo4j-knowledge-graphs-data-connectivity-and-intelligence)  
12. Knowledge Graph Extraction and Challenges \- Graph Database & Analytics \- Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/developer/knowledge-graph-extraction-challenges/](https://neo4j.com/blog/developer/knowledge-graph-extraction-challenges/)  
13. Knowledge Graphs and LLMs: How Can We Move from Structured Knowledge to AI-Generated Answers? – Part II. \- Constitutional Discourse, accessed May 2, 2025, [https://constitutionaldiscourse.com/knowledge-graphs-and-llms-how-can-we-move-from-structured-knowledge-to-ai-generated-answers-part-ii/](https://constitutionaldiscourse.com/knowledge-graphs-and-llms-how-can-we-move-from-structured-knowledge-to-ai-generated-answers-part-ii/)  
14. LLM-Powered Knowledge Graphs for Enterprise Intelligence and Analytics \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2503.07993v1](https://arxiv.org/html/2503.07993v1)  
15. Unique IDs and Constraints | GraphAcademy, accessed May 2, 2025, [https://graphacademy.neo4j.com/courses/importing-cypher/2-creating-nodes/2-unique-ids/](https://graphacademy.neo4j.com/courses/importing-cypher/2-creating-nodes/2-unique-ids/)  
16. Identifying What Constraints and Indexes to Create | GraphAcademy \- Neo4j, accessed May 2, 2025, [https://graphacademy.neo4j.com/courses/cypher-indexes-constraints/1-introduction/02-identify-properties/](https://graphacademy.neo4j.com/courses/cypher-indexes-constraints/1-introduction/02-identify-properties/)  
17. Neo4j Create Unique Constraint \- Tutorialspoint, accessed May 2, 2025, [https://www.tutorialspoint.com/neo4j/neo4j\_create\_unique\_constraint.htm](https://www.tutorialspoint.com/neo4j/neo4j_create_unique_constraint.htm)  
18. \# Neo4j Tutorial: Establishing Constraints in Graph Databases ..., accessed May 2, 2025, [https://dev.to/mangesh28/-neo4j-tutorial-establishing-constraints-in-graph-databases-4o46](https://dev.to/mangesh28/-neo4j-tutorial-establishing-constraints-in-graph-databases-4o46)  
19. Prompt engineering \- OpenAI API, accessed May 2, 2025, [https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)  
20. Prompt Engineering Best Practices for AI Models | GeeksforGeeks, accessed May 2, 2025, [https://www.geeksforgeeks.org/prompt-engineering-best-practices/](https://www.geeksforgeeks.org/prompt-engineering-best-practices/)  
21. Supercharging LLMs With Knowledge Graphs for Smarter, Fairer AI \- DZone, accessed May 2, 2025, [https://dzone.com/articles/supercharge-llms-with-knowledge-graphs](https://dzone.com/articles/supercharge-llms-with-knowledge-graphs)  
22. LangChain Neo4j Integration \- Neo4j Labs, accessed May 2, 2025, [https://neo4j.com/labs/genai-ecosystem/langchain/](https://neo4j.com/labs/genai-ecosystem/langchain/)  
23. Metadata Management Tools: Types, Features & Benefits \- lakeFS, accessed May 2, 2025, [https://lakefs.io/blog/metadata-management-tools/](https://lakefs.io/blog/metadata-management-tools/)  
24. Knowledge Graph Tools: The Ultimate Guide \- PuppyGraph, accessed May 2, 2025, [https://www.puppygraph.com/blog/knowledge-graph-tools](https://www.puppygraph.com/blog/knowledge-graph-tools)  
25. Create a Neo4j GraphRAG Workflow Using LangChain and LangGraph, accessed May 2, 2025, [https://neo4j.com/blog/developer/neo4j-graphrag-workflow-langchain-langgraph/](https://neo4j.com/blog/developer/neo4j-graphrag-workflow-langchain-langgraph/)  
26. Enhanced QA Integrating Unstructured Knowledge Graph Using Neo4j and LangChain, accessed May 2, 2025, [https://neo4j.com/blog/developer/unstructured-knowledge-graph-neo4j-langchain/](https://neo4j.com/blog/developer/unstructured-knowledge-graph-neo4j-langchain/)  
27. Insights, Techniques, and Evaluation for LLM-Driven Knowledge Graphs | NVIDIA Technical Blog, accessed May 2, 2025, [https://developer.nvidia.com/blog/insights-techniques-and-evaluation-for-llm-driven-knowledge-graphs/](https://developer.nvidia.com/blog/insights-techniques-and-evaluation-for-llm-driven-knowledge-graphs/)  
28. Synergizing LLMs and Knowledge Graphs: A Novel Approach to Software Repository-Related Question Answering \- arXiv, accessed May 2, 2025, [https://arxiv.org/pdf/2412.03815?](https://arxiv.org/pdf/2412.03815)  
29. Large Language Models and Medical Knowledge Grounding for Diagnosis Prediction, accessed May 2, 2025, [https://www.medrxiv.org/content/10.1101/2023.11.24.23298641v2.full](https://www.medrxiv.org/content/10.1101/2023.11.24.23298641v2.full)  
30. arxiv.org, accessed May 2, 2025, [https://arxiv.org/pdf/2503.01642](https://arxiv.org/pdf/2503.01642)  
31. Large Language Model Meets Graph Neural Network in Knowledge Distillation \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2402.05894v2](https://arxiv.org/html/2402.05894v2)  
32. Graph Neural Prompting with Large Language Models \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2309.15427v2](https://arxiv.org/html/2309.15427v2)  
33. GraphGPT: Graph Instruction Tuning for Large Language Models \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2310.13023v2](https://arxiv.org/html/2310.13023v2)  
34. Reasoning of Large Language Models over Knowledge Graphs with ..., accessed May 2, 2025, [https://openreview.net/forum?id=rTCJ29pkuA](https://openreview.net/forum?id=rTCJ29pkuA)  
35. GraphCypherQAChain — LangChain documentation, accessed May 2, 2025, [https://python.langchain.com/api\_reference/neo4j/chains/langchain\_neo4j.chains.graph\_qa.cypher.GraphCypherQAChain.html](https://python.langchain.com/api_reference/neo4j/chains/langchain_neo4j.chains.graph_qa.cypher.GraphCypherQAChain.html)  
36. Neo4j Cypher graph QA \- LangChain.js, accessed May 2, 2025, [https://js.langchain.com/v0.1/docs/modules/chains/additional/cypher\_chain/](https://js.langchain.com/v0.1/docs/modules/chains/additional/cypher_chain/)  
37. Using Knowledge Graphs and Large Language Models to Accelerate Software Delivery | LTIMindtree Blog, accessed May 2, 2025, [https://www.ltimindtree.com/blogs/using-knowledge-graphs-and-large-language-models-to-accelerate-software-delivery/](https://www.ltimindtree.com/blogs/using-knowledge-graphs-and-large-language-models-to-accelerate-software-delivery/)  
38. Neo4j Graph Store \- LlamaIndex, accessed May 2, 2025, [https://docs.llamaindex.ai/en/stable/examples/index\_structs/knowledge\_graph/Neo4jKGIndexDemo/](https://docs.llamaindex.ai/en/stable/examples/index_structs/knowledge_graph/Neo4jKGIndexDemo/)  
39. LlamaIndex \- Neo4j Labs, accessed May 2, 2025, [https://neo4j.com/labs/genai-ecosystem/llamaindex/](https://neo4j.com/labs/genai-ecosystem/llamaindex/)  
40. Customizing Property Graph Index in LlamaIndex \- Graph Database & Analytics \- Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/developer/property-graph-index-llamaindex/](https://neo4j.com/blog/developer/property-graph-index-llamaindex/)  
41. Knowledge Graph Index \- LlamaIndex, accessed May 2, 2025, [https://docs.llamaindex.ai/en/stable/examples/index\_structs/knowledge\_graph/KnowledgeGraphDemo/](https://docs.llamaindex.ai/en/stable/examples/index_structs/knowledge_graph/KnowledgeGraphDemo/)  
42. Unleashing the Power of NLP with LlamaIndex and Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/developer/nlp-llamaindex-neo4j/](https://neo4j.com/blog/developer/nlp-llamaindex-neo4j/)  
43. Chain of Recursive Thoughts: Make AI think harder by making it argue with itself, accessed May 2, 2025, [https://news.ycombinator.com/item?id=43835445](https://news.ycombinator.com/item?id=43835445)  
44. Exploring the Limitations of Graph Reasoning in Large Language Models \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2402.01805v1](https://arxiv.org/html/2402.01805v1)  
45. LLM's Intuition-aware Knowledge Graph Reasoning for Cold-start Sequential Recommendation \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2412.12464v1](https://arxiv.org/html/2412.12464v1)  
46. AGENTiGraph: An Interactive Knowledge Graph Platform for LLM-based Chatbots Utilizing Private Data \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2410.11531v1](https://arxiv.org/html/2410.11531v1)  
47. Knowledge Graph LLM \- TigerGraph, accessed May 2, 2025, [https://www.tigergraph.com/glossary/knowledge-graph-llm/](https://www.tigergraph.com/glossary/knowledge-graph-llm/)  
48. Visualization Techniques: Cognitive Load Management: Cognitive Load Management in Data Visualization \- FasterCapital, accessed May 2, 2025, [https://www.fastercapital.com/content/Visualization-Techniques--Cognitive-Load-Management--Cognitive-Load-Management-in-Data-Visualization.html](https://www.fastercapital.com/content/Visualization-Techniques--Cognitive-Load-Management--Cognitive-Load-Management-in-Data-Visualization.html)  
49. Improving Data Visualization With Cognitive Science (2025-2026) | Bass Connections, accessed May 2, 2025, [https://bassconnections.duke.edu/project/improving-data-visualization-cognitive-science-2025-2026/](https://bassconnections.duke.edu/project/improving-data-visualization-cognitive-science-2025-2026/)  
50. 15 Best Graph Visualization Tools for Your Neo4j Graph Database, accessed May 2, 2025, [https://neo4j.com/blog/graph-visualization/neo4j-graph-visualization-tools/](https://neo4j.com/blog/graph-visualization/neo4j-graph-visualization-tools/)  
51. Visualizing a Neo4j Graph Database \- yWorks, accessed May 2, 2025, [https://www.yworks.com/pages/visualizing-a-neo4j-graph-database](https://www.yworks.com/pages/visualizing-a-neo4j-graph-database)  
52. The JetBrains IDE Plugin for Graph Database Developers \[Community Post\] \- Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/cypher-and-gql/jetbrains-ide-plugin-graph-database/](https://neo4j.com/blog/cypher-and-gql/jetbrains-ide-plugin-graph-database/)  
53. Code Graph \- IntelliJ IDEs Plugin \- JetBrains Marketplace, accessed May 2, 2025, [https://plugins.jetbrains.com/plugin/24968-code-graph](https://plugins.jetbrains.com/plugin/24968-code-graph)  
54. Malleable Overview-Detail Interfaces \- Bryan Min, accessed May 2, 2025, [https://www.bryanmin.me/papers/chi25-malleable-odi.pdf](https://www.bryanmin.me/papers/chi25-malleable-odi.pdf)  
55. Leveraging Multimodal LLM for Inspirational User Interface Search \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2501.17799v3](https://arxiv.org/html/2501.17799v3)  
56. Managing human-AI collaborations within Industry 5.0 scenarios via knowledge graphs: key challenges and lessons learned \- PMC, accessed May 2, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11586345/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11586345/)  
57. Usability Evaluation of a Knowledge Graph–Based Dementia Care Intelligent Recommender System: Mixed Methods Study, accessed May 2, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10565620/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10565620/)  
58. Visualize your data in Neo4j \- Getting Started, accessed May 2, 2025, [https://neo4j.com/docs/getting-started/graph-visualization/graph-visualization/](https://neo4j.com/docs/getting-started/graph-visualization/graph-visualization/)  
59. How to Build a Knowledge Graph for Beginners\[+Step & Tips\] \- PageOn.ai, accessed May 2, 2025, [https://www.pageon.ai/blog/how-to-build-a-knowledge-graph](https://www.pageon.ai/blog/how-to-build-a-knowledge-graph)  
60. Top 10 free graph visualization software to simplify complex data \- Synergy Codes, accessed May 2, 2025, [https://www.synergycodes.com/blog/top-10-free-graph-visualization-software-to-simplify-complex-data](https://www.synergycodes.com/blog/top-10-free-graph-visualization-software-to-simplify-complex-data)  
61. Neo4j for VS Code \- Visual Studio Marketplace, accessed May 2, 2025, [https://marketplace.visualstudio.com/items?itemName=neo4j-extensions.neo4j-for-vscode](https://marketplace.visualstudio.com/items?itemName=neo4j-extensions.neo4j-for-vscode)  
62. Search by Sourcegraph \- Visual Studio Marketplace, accessed May 2, 2025, [https://marketplace.visualstudio.com/items?itemName=sourcegraph.sourcegraph](https://marketplace.visualstudio.com/items?itemName=sourcegraph.sourcegraph)  
63. Quick introduction to Sourcegraph VSCode plugin \+ structural search trick \- YouTube, accessed May 2, 2025, [https://www.youtube.com/watch?v=qoo9MdvvuxQ](https://www.youtube.com/watch?v=qoo9MdvvuxQ)  
64. Applying Large Language Models in Knowledge Graph-based Enterprise Modeling: Challenges and Opportunities \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2501.03566v1](https://arxiv.org/html/2501.03566v1)  
65. Large Language Model–Driven Knowledge Graph Construction in Sepsis Care Using Multicenter Clinical Databases: Development and Usability Study, accessed May 2, 2025, [https://www.jmir.org/2025/1/e65537](https://www.jmir.org/2025/1/e65537)  
66. (PDF) The Future of AI-Driven Software Engineering \- ResearchGate, accessed May 2, 2025, [https://www.researchgate.net/publication/388371819\_The\_Future\_of\_AI-Driven\_Software\_Engineering](https://www.researchgate.net/publication/388371819_The_Future_of_AI-Driven_Software_Engineering)  
67. Mastering prompt engineering: Best practices for state-of-the-art AI solutions \- Geniusee, accessed May 2, 2025, [https://geniusee.com/single-blog/prompt-engineering-best-practices](https://geniusee.com/single-blog/prompt-engineering-best-practices)  
68. A Complete Guide to Prompt Engineering | Build AI Applications With SingleStore, accessed May 2, 2025, [https://www.singlestore.com/blog/a-complete-guide-to-prompt-engineering/](https://www.singlestore.com/blog/a-complete-guide-to-prompt-engineering/)  
69. Prompt Engineering Tools: Best Practices You Must Know to Benefit From Gen AI \- Flyaps, accessed May 2, 2025, [https://flyaps.com/blog/prompt-engineering-things-you-must-know-to-gain-maximum-value-from-gen-ai-tools/](https://flyaps.com/blog/prompt-engineering-things-you-must-know-to-gain-maximum-value-from-gen-ai-tools/)  
70. Best Practices for Using AI in Software Development 2025 \- Leanware, accessed May 2, 2025, [https://www.leanware.co/insights/best-practices-ai-software-development](https://www.leanware.co/insights/best-practices-ai-software-development)  
71. Taming the code generation beast — How responsible is your AI adoption in Java \- Digma, accessed May 2, 2025, [https://digma.ai/taming-the-code-generation-beast-how-responsible-is-your-ai-adoption-in-java/](https://digma.ai/taming-the-code-generation-beast-how-responsible-is-your-ai-adoption-in-java/)  
72. Essential CI/CD Pipeline Best Practices: A Complete Guide to Mastering Continuous Integration and Delivery, accessed May 2, 2025, [https://blog.mergify.com/ci-cd-pipeline-best-practices/](https://blog.mergify.com/ci-cd-pipeline-best-practices/)  
73. CI/CD Best Practices \- Top 11 Tips for Successful Pipelines \- Spacelift, accessed May 2, 2025, [https://spacelift.io/blog/ci-cd-best-practices](https://spacelift.io/blog/ci-cd-best-practices)  
74. 20 Most Important CICD Pipeline Best Practices \- Zeet.co, accessed May 2, 2025, [https://zeet.co/blog/cicd-pipeline-best-practices](https://zeet.co/blog/cicd-pipeline-best-practices)  
75. A Code Knowledge Graph-Enhanced System for LLM-Based Fuzz Driver Generation \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2411.11532v1](https://arxiv.org/html/2411.11532v1)  
76. Helping LLMs Improve Code Generation Using Feedback from Testing and Static Analysis, accessed May 2, 2025, [https://arxiv.org/html/2412.14841v1](https://arxiv.org/html/2412.14841v1)  
77. AI-Generated Code: The Security Blind Spot Your Team Can't Ignore \- Jit.io, accessed May 2, 2025, [https://www.jit.io/resources/devsecops/ai-generated-code-the-security-blind-spot-your-team-cant-ignore](https://www.jit.io/resources/devsecops/ai-generated-code-the-security-blind-spot-your-team-cant-ignore)  
78. Beyond Autocomplete: How AI is Rewriting Software Development \- Trace3 Blog, accessed May 2, 2025, [https://blog.trace3.com/beyond-autocomplete-how-ai-is-rewriting-software-development](https://blog.trace3.com/beyond-autocomplete-how-ai-is-rewriting-software-development)  
79. AI Code Review vs. Traditional Code Review \- CodeAnt AI, accessed May 2, 2025, [https://www.codeant.ai/blogs/ai-vs-traditional-code-review](https://www.codeant.ai/blogs/ai-vs-traditional-code-review)  
80. AI Code Review \- IBM, accessed May 2, 2025, [https://www.ibm.com/think/insights/ai-code-review](https://www.ibm.com/think/insights/ai-code-review)  
81. Large Language Models for Software Engineering: Survey and Open Problems | Request PDF \- ResearchGate, accessed May 2, 2025, [https://www.researchgate.net/publication/378732714\_Large\_Language\_Models\_for\_Software\_Engineering\_Survey\_and\_Open\_Problems](https://www.researchgate.net/publication/378732714_Large_Language_Models_for_Software_Engineering_Survey_and_Open_Problems)  
82. Do Code LLMs Understand Design Patterns? \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2501.04835v1](https://arxiv.org/html/2501.04835v1)  
83. Software Architecture Design meets LLM Technology: Applications, Challenges and Opportunities \- Gran Sasso Science Institute, accessed May 2, 2025, [https://www.gssi.it/seminars/seminars-2025/item/25742-software-architecture-design-meets-llm-technology-applications-challenges-and-opportunities](https://www.gssi.it/seminars/seminars-2025/item/25742-software-architecture-design-meets-llm-technology-applications-challenges-and-opportunities)  
84. (PDF) Generative AI for Software Architecture. Applications, Trends, Challenges, and Future Directions \- ResearchGate, accessed May 2, 2025, [https://www.researchgate.net/publication/389877715\_Generative\_AI\_for\_Software\_Architecture\_Applications\_Trends\_Challenges\_and\_Future\_Directions](https://www.researchgate.net/publication/389877715_Generative_AI_for_Software_Architecture_Applications_Trends_Challenges_and_Future_Directions)  
85. Best Practices for Pair Programming with AI Coding Agents \- Zencoder, accessed May 2, 2025, [https://zencoder.ai/blog/best-practices-for-pair-programming-with-ai-coding-agents](https://zencoder.ai/blog/best-practices-for-pair-programming-with-ai-coding-agents)  
86. Exploring the benefits of pair reviewing in code reviews \- Graphite, accessed May 2, 2025, [https://graphite.dev/guides/benefits-pair-reviewing-code-reviews](https://graphite.dev/guides/benefits-pair-reviewing-code-reviews)  
87. AI-Augmented Software Engineering \- SEI CMU, accessed May 2, 2025, [https://insights.sei.cmu.edu/ai-augmented-software-engineering/](https://insights.sei.cmu.edu/ai-augmented-software-engineering/)  
88. Reframing Technical Debt \- DROPS \- Schloss Dagstuhl, accessed May 2, 2025, [https://drops.dagstuhl.de/storage/04dagstuhl-reports/volume14/issue11/24452/DagRep.14.11.16/DagRep.14.11.16.pdf](https://drops.dagstuhl.de/storage/04dagstuhl-reports/volume14/issue11/24452/DagRep.14.11.16/DagRep.14.11.16.pdf)  
89. From LLMs to LLM-based Agents for Software Engineering: A Survey of Current, Challenges and Future \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2408.02479v2](https://arxiv.org/html/2408.02479v2)  
90. Building Knowledge Graphs With Claude and Neo4j: A No-Code MCP Approach, accessed May 2, 2025, [https://neo4j.com/blog/developer/knowledge-graphs-claude-neo4j-mcp/](https://neo4j.com/blog/developer/knowledge-graphs-claude-neo4j-mcp/)  
91. KGSnap\! in Practice: a Block-based Programming Environment for Enabling Knowledge Graph Literacy \- CEUR-WS.org, accessed May 2, 2025, [https://ceur-ws.org/Vol-3773/paper6.pdf](https://ceur-ws.org/Vol-3773/paper6.pdf)  
92. Alessia Antelmi \- Parallel Computing \[alpha\] \- Marco Aldinucci, accessed May 2, 2025, [https://alpha.di.unito.it/alessia-antelmi/](https://alpha.di.unito.it/alessia-antelmi/)  
93. Parallel computing papers \- Marco Aldinucci, accessed May 2, 2025, [https://alpha.di.unito.it/parallel-computing-papers/](https://alpha.di.unito.it/parallel-computing-papers/)  
94. What are the challenges in maintaining a knowledge graph? \- Milvus Blog, accessed May 2, 2025, [https://blog.milvus.io/ai-quick-reference/what-are-the-challenges-in-maintaining-a-knowledge-graph](https://blog.milvus.io/ai-quick-reference/what-are-the-challenges-in-maintaining-a-knowledge-graph)  
95. How do you keep a knowledge graph updated? \- Milvus, accessed May 2, 2025, [https://milvus.io/ai-quick-reference/how-do-you-keep-a-knowledge-graph-updated](https://milvus.io/ai-quick-reference/how-do-you-keep-a-knowledge-graph-updated)  
96. Knowledge Graphs: High Performance or High Maintenance? \- Coveo, accessed May 2, 2025, [https://www.coveo.com/blog/knowledge-graphs/](https://www.coveo.com/blog/knowledge-graphs/)  
97. Navigating the Complexities of Knowledge Graph Creation, accessed May 2, 2025, [https://graph.build/blog/navigating-the-complexities-of-knowledge-graph-creation](https://graph.build/blog/navigating-the-complexities-of-knowledge-graph-creation)  
98. Achieve Unrivaled Speed and Scalability With Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/machine-learning/achieve-unrivaled-speed-and-scalability-neo4j/](https://neo4j.com/blog/machine-learning/achieve-unrivaled-speed-and-scalability-neo4j/)  
99. Exploring the ability to Enhance Scalability For Knowledge Graphs For Enterprise Solutions, accessed May 2, 2025, [https://www.highergov.com/contract-opportunity/exploring-the-ability-to-enhance-scalability-for-k-af25b-t002-sbir-5cff3/](https://www.highergov.com/contract-opportunity/exploring-the-ability-to-enhance-scalability-for-k-af25b-t002-sbir-5cff3/)  
100. Step-by-Step Guide to Building a Knowledge Graph in 2025 \- PageOn.ai, accessed May 2, 2025, [https://www.pageon.ai/blog/knowledge-graph](https://www.pageon.ai/blog/knowledge-graph)  
101. Your Roadmap for an Enterprise Graph Strategy \- Neo4j, accessed May 2, 2025, [https://neo4j.com/blog/knowledge-graph/roadmap-enterprise-graph-strategy/](https://neo4j.com/blog/knowledge-graph/roadmap-enterprise-graph-strategy/)  
102. AI Maturity Models for Achieving Sustainable AI Transformation \- Damco Solutions, accessed May 2, 2025, [https://www.damcogroup.com/blogs/understanding-ai-maturity-models](https://www.damcogroup.com/blogs/understanding-ai-maturity-models)  
103. AI Adoption Maturity Frameworks | BTIT Consulting Limited, accessed May 2, 2025, [https://btit.nz/ai-adoption-maturity-frameworks](https://btit.nz/ai-adoption-maturity-frameworks)  
104. Gartner's AI Maturity Model: Maximize Your Business Impact – BMC Software | Blogs, accessed May 2, 2025, [https://www.bmc.com/blogs/ai-maturity-models/](https://www.bmc.com/blogs/ai-maturity-models/)  
105. Large language models for intelligent RDF knowledge graph construction: results from medical ontology mapping \- Frontiers, accessed May 2, 2025, [https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1546179/full](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1546179/full)  
106. LLM vs Knowledge Graph: Why your business needs both \- Lettria, accessed May 2, 2025, [https://www.lettria.com/blogpost/llm-vs-knowledge-graph-why-your-business-needs-both](https://www.lettria.com/blogpost/llm-vs-knowledge-graph-why-your-business-needs-both)  
107. Full article: A design space for reconfigurable interactive desktop environments (RIDEs), accessed May 2, 2025, [https://www.tandfonline.com/doi/full/10.1080/0144929X.2024.2447920](https://www.tandfonline.com/doi/full/10.1080/0144929X.2024.2447920)  
108. Knowledge Graph Based Repository-Level Code Generation (Virtual Talk) (LLM4Code 2025\) \- Conferences, accessed May 2, 2025, [https://conf.researchr.org/details/icse-2025/llm4code-2025-papers/26/Knowledge-Graph-Based-Repository-Level-Code-Generation-Virtual-Talk-](https://conf.researchr.org/details/icse-2025/llm4code-2025-papers/26/Knowledge-Graph-Based-Repository-Level-Code-Generation-Virtual-Talk-)  
109. \[R\] Paper2Code: Automating Code Generation from Scientific Papers in Machine Learning, accessed May 2, 2025, [https://www.reddit.com/r/MachineLearning/comments/1k7pkvc/r\_paper2code\_automating\_code\_generation\_from/](https://www.reddit.com/r/MachineLearning/comments/1k7pkvc/r_paper2code_automating_code_generation_from/)  
110. Is there a plugin that outlines regions in graph view? : r/ObsidianMD \- Reddit, accessed May 2, 2025, [https://www.reddit.com/r/ObsidianMD/comments/1adu7e2/is\_there\_a\_plugin\_that\_outlines\_regions\_in\_graph/](https://www.reddit.com/r/ObsidianMD/comments/1adu7e2/is_there_a_plugin_that_outlines_regions_in_graph/)  
111. AI-Powered Software Development \- Aimprosoft, accessed May 2, 2025, [https://www.aimprosoft.com/blog/ai-faster-software-development/](https://www.aimprosoft.com/blog/ai-faster-software-development/)  
112. Neo4j Graph Database & Analytics | Graph Database Management System, accessed May 2, 2025, [https://neo4j.com/](https://neo4j.com/)  
113. AI Maturity Model – A CEO's Guide to Scaling AI for Success \- Veritis, accessed May 2, 2025, [https://www.veritis.com/blog/ai-maturity-model-a-ceos-guide-to-scaling-ai-for-success/](https://www.veritis.com/blog/ai-maturity-model-a-ceos-guide-to-scaling-ai-for-success/)  
114. Using a Knowledge Graph to Implement a RAG Application \- DataCamp, accessed May 2, 2025, [https://www.datacamp.com/tutorial/knowledge-graph-rag](https://www.datacamp.com/tutorial/knowledge-graph-rag)  
115. A Preliminary Roadmap for LLMs as Assistants in Exploring, Analyzing, and Visualizing Knowledge Graphs \- arXiv, accessed May 2, 2025, [https://arxiv.org/html/2404.01425v1](https://arxiv.org/html/2404.01425v1)