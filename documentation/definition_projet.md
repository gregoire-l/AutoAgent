# **AutoAgent \- Définition du Projet v1.0**

## **1\. Vision et Objectifs**

**Vision :** Créer une "équipe virtuelle" d'agents logiciels autonomes capable d'exécuter des missions complexes déléguées par un utilisateur technique, avec un haut standard de qualité, de fiabilité et d'efficacité.

**Objectif Principal :** Développer AutoAgent comme un outil personnel avancé pour l'utilisateur principal, permettant de gagner du temps en automatisant des tâches complexes (recherche, analyse, développement, etc.) tout en garantissant des livrables de haute qualité conformes aux meilleures pratiques.

**Objectifs Secondaires :**

* Construire un framework robuste, performant, modulaire, maintenable et extensible basé sur les meilleures pratiques de développement logiciel (en Go).  
* Fournir une interface utilisateur unifiée, claire et centralisée pour la gestion des missions et le suivi des agents.  
* Explorer la scalabilité potentielle pour une utilisation par d'autres utilisateurs (non prioritaire initialement).

## **2\. Utilisateur Cible**

L'utilisateur principal est une personne technique (ayant des notions de programmation) qui utilisera AutoAgent pour déléguer et gérer des projets complexes. L'interface devra répondre aux besoins de gestion de projet (suivi des missions, validation des livrables) tout en permettant un accès aux aspects techniques (gestion/debug des agents, potentiellement via CLI ou interface dédiée).

## **3\. Proposition de Valeur Unique**

AutoAgent se différenciera par :

* **Focus sur la Qualité et le Processus :** Intégration des meilleures pratiques, validation systématique des livrables, processus structuré.  
* **Architecture Multi-Agents Spécialisée :** Structure hiérarchique avec agents experts (Orchestrateur, CTO, UX/UI, Vérificateurs...) et communication coordonnée.  
* **Haute Autonomie et Robustesse :** Capacité à exécuter des missions longues avec des points d'interaction définis, et une architecture conçue pour la tolérance aux pannes.  
* **Interface Unifiée :** Une plateforme centralisée pour gérer l'ensemble du cycle de vie des missions.  
* **Personnalisation (Vision) :** Potentiel d'adaptation aux préférences de l'utilisateur via un agent "double numérique".

## **4\. Périmètre Fonctionnel**

AutoAgent est conçu comme un système **généraliste**, capable de s'adapter à une large variété de missions complexes. Sa capacité à gérer une mission dépendra principalement des ressources allouées et de la disponibilité d'agents spécialisés pertinents.

## **5\. Architecture Générale**

### **5.1. Structure des Agents**

* **Hiérarchie Dynamique :** Une structure hiérarchique flexible (Orchestrateur \> Spécialistes Intermédiaires \> Agents Spécialisés) dont la complexité et les rôles s'adaptent à la mission. Un agent "chef de projet" (Orchestrateur) reste le point d'entrée principal.  
* **Agents Prédéfinis :** Un ensemble initial d'agents avec des rôles, spécialités et prompts systèmes définis (ex: Project Manager, CTO, UX/UI Designer, Domain Specialist, Verifier Agent).  
* **Capacités Basées sur les Outils :** Les capacités d'un agent LLM sont définies par l'accès qui lui est accordé à différents "outils" (tools) pour interagir avec le système et l'extérieur.

### **5.2. Communication Inter-Agents**

* **Communication Verticale Privilégiée :** La communication principale suit la hiérarchie (superviseur \<-\> subordonné).  
* **Communication Latérale Possible :** Les agents de même niveau peuvent communiquer si nécessaire, selon leur propre décision (autonomie). Un protocole standardisé peut être défini si justifié (coût/bénéfice en tokens).  
* **Résolution de Conflits :** Des agents "Vérificateurs" dédiés valident les tâches selon des critères prédéfinis. Les désaccords sont escaladés hiérarchiquement, jusqu'à l'utilisateur si nécessaire. L'anticipation des conflits est privilégiée.

### **5.3. Gestion de l'État et de la Mémoire Externe**

Une architecture multi-couches est adoptée pour gérer l'état persistant et fournir un contexte dynamique aux agents LLM :

* **Base de Données Principale (État Structuré) : Dgraph** \[cite: 2.6\]. Choisi pour sa capacité native à modéliser les graphes (idéal pour les hiérarchies de tâches, dépendances, relations agents) et son potentiel d'unification état/contexte.  
* **Orchestration des Workflows : Temporal** \[cite: 3.5\]. Fortement recommandé pour gérer l'exécution fiable, stateful et tolérante aux pannes des tâches complexes et longues, simplifiant la logique de robustesse des agents.  
* **Couche de Contexte Dynamique (Mémoire Vive) : Hybride** \[cite: 4.6\].  
  * **Base Vectorielle (Recherche Sémantique) : Qdrant** (recommandé) ou alternative (Weaviate, pgvector si Postgres était choisi). Pour rechercher dans les logs, documents, historique conversationnel.  
  * **Base Graphe (Contexte Relationnel) : Dgraph** (instance principale ou dédiée). Pour explorer les liens entre tâches, agents, concepts.  
  * **Cache Distribué : Redis**. Pour optimiser les accès fréquents.  
* **Stockage Fichiers/Artefacts : Solution compatible S3** (ex: MinIO auto-hébergé) \[cite: 6.5\]. Pour les livrables, logs volumineux, etc., organisés par projet.  
* **Synchronisation : Approche Événementielle** (via NATS, Kafka ou équivalent) \[cite: 4.6\]. Pour maintenir une cohérence (éventuelle) entre la base Dgraph, le stockage S3 et la couche contexte (Qdrant), assurant le découplage.  
* **Interaction LLM : Outils (Tools)** \[cite: 5.6\]. Fonctions Go spécifiques permettant aux LLMs d'interagir de manière contrôlée et sécurisée avec toutes les couches de mémoire/état (CRUD tâches, requêtes contexte, gestion artefacts...).

### **5.4. Robustesse et Tolérance aux Pannes**

L'architecture intègre la robustesse à plusieurs niveaux \[cite: 6.5\] :

* **Temporal :** Assure la résilience de l'exécution des workflows de tâches (exécution durable, retries, timeouts).  
* **Pattern Superviseur :** La hiérarchie d'agents gère le cycle de vie et la surveillance des agents subordonnés (détection pannes, redémarrage, réassignation).  
* **Outils Robustes :** Validation stricte des entrées, gestion granulaire des erreurs, idempotence si applicable.  
* **Découplage :** L'utilisation de Temporal et d'un bus d'événements limite la propagation des pannes.  
* **Anticipation de l'Incertitude :** Les agents sont encouragés à identifier et gérer l'incertitude.

### **5.5. Sécurité**

* **Sandboxing : Conteneurs Docker** \[cite: 12\]. Chaque agent (ou groupe d'agents) s'exécute dans un environnement isolé avec des ressources contrôlées.  
* **Accès Contrôlé :** Les permissions (accès réseau, fichiers, outils) sont définies en fonction du rôle et du niveau hiérarchique de l'agent.  
* **Sécurité des Outils :** Validation systématique des entrées et autorisation basée sur le rôle de l'agent appelant pour chaque outil \[cite: 5.6\].

## **6\. Technologie et Implémentation**

* **Langage Principal : Go**. Choisi pour sa performance, sa gestion de la concurrence et son écosystème adapté aux systèmes distribués.  
* **Base de Données Principale : Dgraph**.  
* **Moteur de Workflow : Temporal**.  
* **Base Vectorielle : Qdrant** (recommandé).  
* **Cache : Redis**.  
* **Stockage Objets : MinIO** (ou compatible S3).  
* **Bus d'Événements : NATS** (léger, performant en Go) ou Kafka (plus robuste pour des besoins très larges).  
* **Interface LLM :** Interaction avec les APIs LLM (ex: Google Gemini) via des clients Go. Stratégie de rotation de clés acceptée pour cet usage personnel, tout en priorisant la qualité sur l'économie extrême de tokens.  
* **Frontend (Vision) :** Stack moderne en Go (htmx, templ, Tailwind CSS via écosystème Go). Interface claire, épurée, avec une identité visuelle forte. Concept "node-based" à explorer pour la visualisation/gestion.  
* **Développement :** Approche Test-Driven Development (TDD) encouragée \[cite: AutoAgent/functionnality.md\].

## **7\. Fonctionnalités Clés**

* Gestion de projets/missions complexes via une interface unifiée.  
* Décomposition automatique/assistée des missions en tâches hiérarchiques.  
* Exécution autonome et parallèle des tâches par des agents spécialisés.  
* Gestion de l'état persistante et robuste.  
* Accès à un contexte dynamique pertinent pour les agents LLM.  
* Validation systématique des étapes et des livrables.  
* Création et exécution de code/scripts par les agents dans un sandbox sécurisé.  
* Gestion des ressources (temps, tokens, etc.) définie par l'utilisateur et appliquée par le système.

## **8\. Apprentissage et Personnalisation**

* **V1 :** Systeme de templating basique pour les prompts, modifiables manuellement.  
* **Vision Future :**  
  * Agent "Double Numérique" pour apprendre les préférences utilisateur et réduire les interactions répétitives.  
  * Système de feedback utilisateur post-mission.  
  * Potentiellement, amélioration dynamique des prompts (méta-prompting).

## **9\. Mesure du Succès**

* Satisfaction de l'utilisateur principal.  
* Taux de réussite des missions déléguées.  
* Qualité perçue des livrables.  
* Analyse du feedback utilisateur après chaque mission.  
* Efficacité ressentie (gain de temps pour l'utilisateur).

## **10\. Prochaines Étapes Immédiates**

* Définir le schéma détaillé de Dgraph pour les types Project, Mission, Task, Agent, Artifact et leurs relations (prédicats/arêtes).  
* Préciser l'intégration entre Temporal et Dgraph pour la gestion de l'état des tâches.  
* Évaluer plus en détail l'utilisation de Dgraph pour le contexte relationnel vs une instance dédiée.  
* Définir les tools LLM de base pour l'interaction avec Dgraph.  
* Esquisser l'architecture du bus d'événements pour la synchronisation Dgraph \-\> Qdrant.