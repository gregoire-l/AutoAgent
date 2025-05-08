# **Guide Pratique : Rédaction de Spécifications Fonctionnelles Détaillées pour AutoAgent V1 (Développement Assisté par LLM et TDD)**

## **1\. Introduction**

Ce guide fournit des recommandations et des pratiques éprouvées pour la rédaction de spécifications fonctionnelles détaillées dans le cadre du projet AutoAgent V1. L'objectif est de produire des spécifications suffisamment précises et non ambiguës pour guider efficacement un Large Language Model (LLM) dans la génération de code, tout en permettant au développeur humain unique de pratiquer le Test-Driven Development (TDD) et de valider le système. Le contexte spécifique – développement assisté par IA, TDD central, interface "Chat \+ Canvas" interactive, et supervision humaine unique – exige une approche adaptée des techniques classiques d'ingénierie des exigences.

L'enjeu principal est de trouver un équilibre : les spécifications doivent être assez formelles pour être interprétables par une machine, mais rester suffisamment claires et pragmatiques pour être utilisables par le développeur humain pour la conception des tests et la validation finale. Des spécifications de haute qualité sont un catalyseur essentiel pour exploiter pleinement le potentiel des LLMs en développement logiciel.1 Elles réduisent l'ambiguïté, facilitent la communication (même avec une IA) et servent de base solide pour la vérification et la validation.

## **2\. Contexte et Défis du Projet AutoAgent V1**

AutoAgent V1 est un système multi-agents développé en Go et React, utilisant Neo4j, Temporal et gVisor. Son objectif est de fournir un outil personnel pour déléguer, suivre et valider des missions via une interface utilisateur combinant un chat et un canvas interactif. Le développement est majoritairement assisté par un LLM (type Gemini), supervisé par un unique développeur technique qui utilise le TDD comme principal mécanisme de validation.

Les défis spécifiques incluent :

* **Guidage de l'LLM :** Les spécifications doivent être structurées et détaillées pour minimiser les erreurs logiques ou sémantiques dans le code généré par l'LLM.1 Des prompts clairs et spécifiques sont essentiels.3  
* **Support du TDD :** Les spécifications doivent faciliter la dérivation de cas de tests *avant* l'écriture ou la génération du code. Les critères d'acceptation doivent être directement traduisibles en assertions de test.5  
* **Clarté pour le Superviseur Humain :** Le format doit rester compréhensible et non ambigu pour le développeur unique qui supervise, valide et potentiellement débugge le code.7  
* **Spécification de l'UI Interactive :** L'interface "Chat \+ Canvas" nécessite des techniques pour décrire efficacement les interactions complexes et la synchronisation dynamique entre ses composants.8  
* **Intégration des Exigences Non Fonctionnelles (NFRs) :** Les aspects comme la stabilité, la réactivité perçue et la sécurité de base doivent être intégrés de manière pragmatique dès la V1.

## **3\. Format Recommandé pour les Spécifications V1 : User Story \+ Critères d'Acceptation (Gherkin)**

Après analyse comparative des formats courants (User Stories, Use Cases détaillés, BDD/Gherkin, spécifications formelles), le format combinant **User Story \+ Critères d'Acceptation (AC) rédigés en Gherkin (Given/When/Then)** est recommandé pour AutoAgent V1.

### **3.1. Analyse Comparative des Formats**

* **User Stories \+ AC (Format Libre) :**  
  * *Avantages :* Centré sur l'utilisateur, favorise la discussion, format agile populaire.10  
  * *Inconvénients :* Les AC en format libre peuvent manquer de structure pour l'LLM et être difficiles à automatiser pour le TDD. L'ambiguïté est un risque.12  
* **Use Cases Détaillés :**  
  * *Avantages :* Très structurés, décrivent les interactions système en détail, utiles pour les flux complexes.10  
  * *Inconvénients :* Peuvent devenir lourds et longs à rédiger, moins adaptés à l'itération rapide d'Agile. Moins directement orientés vers des tests spécifiques que Gherkin.10  
* **BDD / Gherkin (Given/When/Then) :**  
  * *Avantages :* Très structuré, langage naturel compréhensible par tous (humains et potentiellement LLMs), directement lié aux tests automatisés (support TDD/BDD), réduit l'ambiguïté, sert de documentation vivante.5  
  * *Inconvénients :* Peut être verbeux pour des scénarios simples. Nécessite une discipline dans la rédaction.

### **3.2. Justification de la Recommandation (User Story \+ Gherkin AC)**

Ce format hybride capitalise sur les forces de chaque approche :

* **Clarté pour l'LLM :** La structure Given/When/Then de Gherkin est plus facilement parsable et interprétable par un LLM que des AC en prose libre. Elle fournit un cadre logique (précondition, action, résultat) qui peut guider la génération de code.1 Des prompts bien formatés améliorent la qualité de la sortie de l'LLM.4  
* **Support du TDD :** Gherkin est conçu pour le BDD, qui est une extension du TDD.7 Chaque scénario Given/When/Then correspond directement à un cas de test. Les Then clauses se traduisent naturellement en assertions de test, permettant au développeur d'écrire les tests *avant* de solliciter l'LLM pour le code.5  
* **Compréhension Humaine :** La User Story fournit le contexte métier ("Pourquoi?"), tandis que les scénarios Gherkin décrivent le comportement attendu ("Quoi?") dans un langage naturel structuré, clair et non ambigu pour le superviseur unique.7  
* **Adaptation à l'UI Interactive :** Gherkin peut décrire des séquences d'interactions utilisateur. En combinant les When (actions utilisateur dans le chat ou sur le canvas) et les Then (résultats observés dans le chat et/ou sur le canvas), on peut spécifier le comportement de l'interface complexe. L'intégration de références à des wireframes dans les scénarios peut clarifier davantage les éléments visuels.19

Cette approche combine la vision utilisateur de la User Story avec la précision comportementale et la testabilité de Gherkin, répondant ainsi aux exigences clés du projet AutoAgent V1.

## **4\. Rédaction de Critères d'Acceptation (AC) Efficaces en Gherkin**

Des AC bien rédigés sont cruciaux pour guider l'LLM et permettre un TDD efficace. Ils doivent être SMART : Spécifiques, Mesurables, Atteignables, Réalistes et **Testables**.12 Dans notre contexte, l'accent est mis sur la **Testabilité** (pour TDD) et la **Spécificité/Non-ambiguïté** (pour l'LLM et l'humain).

### **4.1. Directives pour la Rédaction**

1. **Un Scénario par Comportement :** Chaque scénario Gherkin doit tester un aspect unique du comportement de la fonctionnalité.18 Évitez de combiner plusieurs règles métier ou chemins d'exécution dans un seul scénario.  
2. **Langage Clair et Cohérent :** Utilisez le vocabulaire défini dans le glossaire du projet. Évitez le jargon technique non défini. Le langage doit être simple et direct pour être compris par l'LLM et l'humain.20  
3. **Focus sur le "Quoi", pas le "Comment" :** Les AC décrivent le comportement observable externe, pas les détails d'implémentation.11 L'LLM et le développeur décident du "comment".  
4. **Préconditions Claires (Given) :** Définissez précisément l'état initial du système nécessaire pour le scénario.15  
5. **Actions Spécifiques (When) :** Décrivez l'action ou l'événement déclencheur de manière non ambiguë.15 Pour l'UI, cela peut être une commande chat ou une interaction canvas.  
6. **Résultats Vérifiables (Then) :** Décrivez les résultats attendus de manière mesurable et vérifiable. Ces résultats doivent être directement traduisibles en assertions de test TDD.15 Incluez les changements d'état attendus (données, UI).  
7. **Utilisation de Données Concrètes :** Utilisez des exemples de données spécifiques dans les scénarios plutôt que des termes génériques (e.g., "nom='Mission Alpha'" plutôt que "un nom de mission valide").14  
8. **Couvrir les Cas d'Erreur et Limites :** Créez des scénarios spécifiques pour les cas d'erreur, les entrées invalides et les conditions limites.22 Cela est crucial pour la robustesse et guide l'LLM dans la génération de code défensif.

### **4.2. Exemples (Fonctionnalité B2 \- Visualisation Arbre Tâches)**

**User Story:** As a AutoAgent User, I want to see the hierarchical structure of tasks within a mission on the canvas, so that I can understand the mission breakdown and dependencies.

**Bons AC (Gherkin) :**

Gherkin

Feature: B2 \- Visualisation de l'Arbre des Tâches sur le Canvas

  Scenario: Afficher l'arbre des tâches pour une mission existante  
    Given une mission "Refonte Site Web" existe avec les tâches suivantes:  
| ID | Nom Tâche | Parent ID |  
| T1 | Analyse Besoins | \--- |  
| T2 | Design Maquettes | T1 |  
| T3 | Développement Front | T2 |  
| T4 | Développement Back | T2 |  
    And l'utilisateur a sélectionné la mission "Refonte Site Web"  
    When le canvas affiche la vue des tâches pour la mission sélectionnée  
    Then un nœud "T1: Analyse Besoins" doit être visible sur le canvas  
    And un nœud "T2: Design Maquettes" doit être visible sur le canvas  
    And un nœud "T3: Développement Front" doit être visible sur le canvas  
    And un nœud "T4: Développement Back" doit être visible sur le canvas  
    And une connexion visuelle doit exister entre le nœud T1 et le nœud T2  
    And une connexion visuelle doit exister entre le nœud T2 et le nœud T3  
    And une connexion visuelle doit exister entre le nœud T2 et le nœud T4  
    \# Ref: Wireframe\_Canvas\_V1.png: TaskNode, TaskConnection

  Scenario: Afficher un message si la mission n'a pas de tâches  
    Given une mission "Documentation Initiale" existe mais ne contient aucune tâche  
    And l'utilisateur a sélectionné la mission "Documentation Initiale"  
    When le canvas tente d'afficher la vue des tâches  
    Then un message "Aucune tâche définie pour cette mission." doit être visible sur le canvas à la place de l'arbre  
    And aucun nœud de tâche ne doit être visible sur le canvas

  Scenario: Gérer une structure de tâches très profonde (Cas Limite)  
    Given une mission "Test Profondeur" existe avec 10 niveaux de tâches imbriquées (T1 \-\> T2 \-\>... \-\> T10)  
    And l'utilisateur a sélectionné la mission "Test Profondeur"  
    When le canvas affiche la vue des tâches  
    Then tous les 10 nœuds de tâches doivent être rendus sur le canvas  
    And toutes les 9 connexions entre les niveaux doivent être visibles  
    And le rendu doit s'achever en moins de 3 secondes \# NFR intégrée

  Scenario: Erreur lors de la récupération des tâches depuis le backend  
    Given l'utilisateur a sélectionné la mission "Projet X"  
    When le canvas tente de récupérer les tâches et une erreur backend se produit (ex: base de données indisponible)  
    Then un message d'erreur clair doit être affiché sur le canvas: "Erreur: Impossible de charger les tâches. Veuillez réessayer."  
    And l'interface doit rester stable sans planter

**Mauvais AC (Exemples et Pourquoi) :**

* Then l'arbre des tâches s'affiche correctement. (Non spécifique, non mesurable, non testable)  
* When l'utilisateur regarde le canvas. (Action utilisateur non précise)  
* Given une mission complexe. (Précondition vague, données non concrètes)  
* Then le système doit gérer les erreurs. (Trop général, quel type d'erreur? Quel comportement attendu?)

En suivant ces directives et en se concentrant sur des scénarios comportementaux spécifiques et vérifiables, les AC Gherkin deviennent un outil puissant pour le TDD et pour guider l'LLM dans la génération de code robuste et conforme aux attentes.

## **5\. Spécification des Interactions UI (Chat \+ Canvas)**

L'interface combinant un chat textuel et un canvas graphique interactif présente des défis uniques pour la spécification. Il est essentiel de décrire clairement non seulement les actions possibles dans chaque partie, mais aussi leur synchronisation.

### **5.1. Techniques de Description**

1. **Scénarios Gherkin Détaillés :** Utilisez les scénarios Gherkin pour décrire les flux d'interaction.  
   * Les actions When peuvent spécifier une commande entrée dans le chat (When the user enters the command: /create task...) ou une interaction directe sur le canvas (When the user clicks on the 'Complete' button of Task T3 on the canvas).  
   * Les résultats Then doivent décrire les changements attendus dans *les deux* parties de l'UI si nécessaire (Then the system confirms task creation in the chat: "OK: Task '...' created." AND a new task node appears on the canvas).  
2. **Références Explicites aux Éléments d'UI :** Dans les scénarios Gherkin ou les descriptions associées, faites référence aux éléments spécifiques de l'interface (boutons, champs, types de nœuds sur le canvas). L'utilisation d'identifiants clairs est recommandée.  
3. **Description de la Synchronisation :** Explicitez le comportement de synchronisation attendu. Par exemple :  
   * "**Given** Task T2 is selected on the canvas, **Then** the chat interface should display the details of Task T2."  
   * "**When** the user updates the status of Task T4 via the chat command /update task T4 status=Done, **Then** the status indicator on the Task T4 node on the canvas should immediately update to 'Done'."  
   * L'approche Server-Driven UI (SDUI), où le serveur dicte l'état de l'UI, peut être un modèle conceptuel utile ici, même si l'implémentation est locale. Le serveur (ou le backend Go dans ce cas) devient la source de vérité, et les changements sont poussés vers les deux composants UI (Chat et Canvas).23 Les tests de synchronisation dans Compose (similaires à ceux d'Android 24) peuvent nécessiter des mécanismes d'attente (waitForIdle, waitUntil) pour s'assurer que l'UI est stable avant les assertions.

### **5.2. Rôle des Maquettes Filaires (Wireframes)**

Les maquettes filaires (wireframes) ou prototypes simples sont **fortement recommandés** et devraient faire partie intégrante de la spécification pour AutoAgent V1.

* **Clarification Visuelle :** Ils fournissent une représentation visuelle indispensable de la disposition, des éléments clés et du flux général, que le texte seul peine à transmettre.19 Ceci est particulièrement vrai pour le canvas interactif.9  
* **Support à la Compréhension (Humain & LLM) :** Ils aident le développeur humain et potentiellement l'LLM (surtout les modèles multimodaux 26) à comprendre la structure attendue de l'interface.  
* **Lien avec les Descriptions Textuelles :**  
  * **Référencement :** Annotez les éléments clés sur les wireframes (e.g., "MissionNode", "TaskDetailsPanel", "ChatInput") et référencez ces annotations directement dans les scénarios Gherkin ou les AC.19 Par exemple : Then a new mission node labeled "..." appears on the canvas ().  
  * **Complémentarité :** Les wireframes montrent le "où" et le "quoi" (structure, éléments), tandis que les Gherkin décrivent le "quand" et le "comment" (déclencheurs, comportements, états).27  
* **Focus sur la Structure :** Utilisez des wireframes basse fidélité pour se concentrer sur la structure et la fonctionnalité, pas sur l'esthétique, conformément aux principes agiles.25

L'intégration de wireframes annotés, liés aux scénarios Gherkin, fournit une spécification beaucoup plus claire et moins ambiguë pour l'interface complexe d'AutoAgent, bénéfique tant pour le TDD que pour le guidage de l'LLM.

## **6\. Intégration des Exigences Non Fonctionnelles (NFRs) \- V1**

Même pour une V1, certaines exigences non fonctionnelles de base (stabilité, performance perçue, sécurité) doivent être prises en compte. Les ignorer complètement peut entraîner des problèmes majeurs plus tard. Dans un contexte Agile et LLM-assisté, l'intégration doit être pragmatique.

### **6.1. Approches d'Intégration**

1. **Comme Contraintes Globales :** Définir certaines NFRs comme des contraintes générales s'appliquant à l'ensemble du système ou à des groupes de fonctionnalités. Celles-ci peuvent être documentées séparément mais référencées dans les spécifications pertinentes.  
   * *Exemple :* "Toutes les interactions utilisateur dans l'UI doivent avoir un temps de réponse perçu inférieur à 2 secondes sous charge nominale." 11  
   * *Exemple :* "Toute communication entre agents doit utiliser des canaux sécurisés (TLS)."  
2. **Comme Critères d'Acceptation Spécifiques :** Pour les NFRs directement liées à une fonctionnalité ou une User Story, les intégrer comme des AC spécifiques et mesurables dans les scénarios Gherkin.11  
   * *Exemple (Performance) :*  
     Gherkin  
     Scenario: Charger un arbre de tâches volumineux  
       Given une mission "Big Project" contient 1000 tâches  
       And l'utilisateur sélectionne la mission "Big Project"  
       When le canvas affiche la vue des tâches  
       Then l'affichage complet de l'arbre doit prendre moins de 5 secondes \# NFR

   * *Exemple (Stabilité/Gestion Erreur) :*  
     Gherkin  
     Scenario: Erreur de persistance lors de la création de mission  
       Given l'utilisateur entre la commande: /create mission name="Fail Mission" goal="Test DB Error"  
       When une erreur se produit lors de l'écriture dans Neo4j  
       Then le système doit afficher un message d'erreur clair dans le chat: "ERREUR: Impossible de sauvegarder la mission."  
       And aucun nœud "Fail Mission" ne doit apparaître sur le canvas \# NFR: Stabilité UI  
       And l'application ne doit pas planter \# NFR: Stabilité

3. **Via la Definition of Done (DoD) :** Inclure des standards de qualité liés aux NFRs dans la DoD générale de l'équipe (même si l'équipe est d'une seule personne).  
   * *Exemple DoD :* "Le code généré/écrit inclut une gestion basique des exceptions pour les opérations I/O."  
   * *Exemple DoD :* "Les tests unitaires couvrent les cas nominaux et les cas d'erreur identifiés dans les AC."

### **6.2. Considérations pour l'LLM et le TDD**

* **Clarté pour l'LLM :** Les NFRs exprimées comme des AC Gherkin spécifiques et mesurables (e.g., temps de réponse, gestion d'erreur spécifique) sont plus susceptibles d'être comprises et prises en compte par l'LLM lors de la génération de code que des déclarations générales.3 Des prompts spécifiques peuvent inclure ces contraintes.28  
* **Testabilité (TDD) :** Les NFRs intégrées comme AC mesurables peuvent être testées. Les tests de performance (même simples), les tests de gestion d'erreur, et les tests de robustesse peuvent être écrits dans le cadre du cycle TDD.

Pour AutoAgent V1, une combinaison est recommandée : définir quelques contraintes globales clés (sécurité de base, objectif de réactivité générale) et intégrer les NFRs spécifiques (gestion d'erreurs précises, limites de performance pour des opérations critiques) directement dans les AC Gherkin des fonctionnalités concernées.

## **7\. Bonnes Pratiques pour la Clarté et la Cohérence**

Assurer la clarté et la cohérence est primordial lorsque les spécifications doivent être interprétées à la fois par un humain et une IA. L'ambiguïté est l'ennemi de la génération de code fiable et du développement piloté par les tests.12

1. **Glossaire de Termes Unifié :**  
   * **Définition :** Maintenir un glossaire centralisé définissant précisément tous les termes métier et techniques clés du projet (ex: Mission, Tâche, Agent, Artefact, Statut, Canvas, Nœud, Connexion).  
   * **Pourquoi :** Assure une compréhension commune et évite les interprétations multiples par le développeur et l'LLM.1 L'LLM peut être informé de ce glossaire.  
   * **Pratique :** Lier les termes dans les spécifications (User Stories, AC) vers leurs définitions dans le glossaire.  
2. **Niveau de Détail Cohérent :**  
   * **Définition :** Maintenir un niveau de détail similaire pour des fonctionnalités de complexité comparable. Éviter de sur-spécifier des détails triviaux tout en étant vague sur des aspects critiques.  
   * **Pourquoi :** Aide l'LLM à comprendre l'importance relative des différentes parties et facilite l'estimation et la planification pour le développeur.  
   * **Pratique :** Se concentrer sur le *comportement observable* et les *règles métier essentielles* dans les AC. Les détails d'implémentation sont laissés au développeur/LLM, guidés par les tests TDD.  
3. **Éviter l'Ambiguïté du Langage Naturel :**  
   * **Pourquoi :** Le langage naturel est intrinsèquement ambigu. Les LLMs, bien que performants, peuvent mal interpréter les subtilités, les pronoms imprécis, les termes vagues ("rapidement", "facilement", "améliorer").4  
   * **Techniques :**  
     * Privilégier la structure Gherkin Given/When/Then qui impose une séquence logique.15  
     * Utiliser des verbes d'action précis et des noms spécifiques (issus du glossaire).  
     * Quantifier lorsque possible (e.g., "moins de 2 secondes" au lieu de "rapide").21  
     * Utiliser des exemples concrets dans les scénarios.14  
     * Relire les spécifications en se mettant à la place de quelqu'un (ou quelque chose) qui ne connaît pas le contexte implicite.  
4. **Structure Claire du Document :**  
   * Utiliser une structure de document cohérente pour chaque spécification de fonctionnalité (comme le template proposé ci-dessous).16  
   * Utiliser des titres, listes à puces, et formatage (Markdown) pour améliorer la lisibilité et la capacité de l'LLM à parser l'information.4  
5. **Revue et Validation :**  
   * Bien que le développeur soit unique, une relecture critique des spécifications avant de les utiliser pour le TDD ou le prompting LLM est essentielle pour détecter les ambiguïtés ou omissions.

En appliquant ces pratiques, les spécifications d'AutoAgent V1 deviendront une base de communication plus fiable et efficace, réduisant les erreurs et les itérations coûteuses dues à des malentendus.

## **8\. Template de Spécification Fonctionnelle (Markdown)**

Voici une proposition de template Markdown pour documenter une fonctionnalité "Must-Have" d'AutoAgent V1, intégrant les recommandations précédentes.

# **Fonctionnalité : \[ID Fonctionnalité\] \- \[Nom Clair de la Fonctionnalité\]**

**(Exemple : A1 \- Création de Mission)**

**Date de Dernière Modification :** YYYY-MM-DD

**Statut :** (Draft | En Revue | Approuvé | Implémenté)

## ---

**1\. User Story**

En tant que,  
Je veux \[Action/Objectif de la fonctionnalité\],  
Afin de.  
**(Exemple : En tant qu'Utilisateur AutoAgent, Je veux définir une nouvelle mission avec un nom et un objectif via l'interface de chat, Afin de pouvoir commencer à déléguer des tâches dans le contexte de cette mission.)**

## ---

**2\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** \[ID Fonctionnalité\] \- \[Nom Clair de la Fonctionnalité\]

Scenario: \[Description concise du scénario nominal 1\]  
Given \[Précondition(s) initiale(s), état du système/données\]  
\* Utiliser des données concrètes.  
When \[Action(s) utilisateur ou événement(s) système déclencheur(s)\]  
\* Préciser l'interface (Chat ou Canvas) si pertinent.  
Then  
\* Décrire les changements dans le Chat.  
\* Décrire les changements sur le Canvas ().  
\* Décrire les changements d'état persistants (e.g., base de données).  
\* Inclure les NFRs mesurables si applicable.  
And...  
Scenario: \[Description concise du scénario nominal 2\]  
Given...  
When...  
Then...  
Scenario: \[Description d'un cas d'erreur ou limite 1\]  
Given \[Précondition menant à l'erreur/limite\]  
When \[Action déclenchant l'erreur/limite\]  
Then \[Comportement attendu du système face à l'erreur\]  
\* Message d'erreur spécifique (Chat/Canvas).  
\* Absence de changement d'état indésirable.  
\* Stabilité de l'application.  
**(Ajouter autant de scénarios que nécessaire pour couvrir les cas nominaux, les variations, les cas d'erreur et les limites)**

## ---

**3\. Références UI**

* **Wireframe(s) Associé(s):**  
  * \[Lien/Nom Fichier Wireframe 1\] (e.g., Wireframe\_Chat\_V1.png)  
  * \[Lien/Nom Fichier Wireframe 2\] (e.g., Wireframe\_Canvas\_V1.png)  
  * *(Intégrer les images ou fournir des liens clairs)*  
* **Éléments Clés Référencés (depuis les wireframes) :**  
  * WireframeID:ElementID: Description (e.g., Canvas\_V1:MissionNode: Représentation visuelle d'une mission sur le canvas).  
  * Chat\_V1:ChatInput: Zone de saisie du chat.  
  * ...

## ---

**4\. Considérations Non Fonctionnelles (V1)**

*(Lister ici les NFRs spécifiques à cette fonctionnalité qui ne sont pas déjà couvertes par des AC Gherkin mesurables. Référencer les NFRs globales si applicable.)*

* **Performance :** (e.g., L'interaction X doit rester fluide même avec Y éléments sur le canvas).  
* **Stabilité :** (e.g., La fonctionnalité doit gérer correctement les interruptions réseau pendant l'opération Z).  
* **Sécurité :** (e.g., Les données saisies pour cette fonctionnalité doivent être validées côté serveur pour prévenir XSS).

## ---

**5\. Termes du Glossaire Associés**

* \](lien-vers-glossaire\#terme1)  
* \](lien-vers-glossaire\#terme2)  
* ...

### ---

**8.1. Explication des Sections du Template**

* **ID Fonctionnalité & Nom :** Identification unique et claire.  
* **Date & Statut :** Pour le suivi des versions.  
* **User Story :** Fournit le contexte métier et la valeur utilisateur.10  
* **Critères d'Acceptation (Gherkin) :** Le cœur de la spécification comportementale, structurée pour le TDD et l'LLM.13 Inclut cas nominaux, erreurs, limites.  
* **Références UI :** Lien vers les wireframes et identification des éléments clés pour la clarté visuelle et la référence dans les AC.19  
* **Considérations Non Fonctionnelles :** Capture les exigences de qualité spécifiques non exprimées comme des AC Gherkin.11  
* **Termes du Glossaire :** Assure la cohérence terminologique en liant aux définitions.1

Ce template fournit une structure standardisée et complète pour spécifier les fonctionnalités d'AutoAgent V1, en alignement avec les meilleures pratiques adaptées au contexte du projet.

## **9\. Conclusion et Recommandations**

Pour répondre efficacement aux besoins spécifiques du projet AutoAgent V1 – développement assisté par LLM, TDD central, interface Chat+Canvas, et supervision unique – ce guide recommande une approche structurée et pragmatique de la spécification fonctionnelle.

**Récapitulatif des Recommandations Clés :**

1. **Adopter le Format User Story \+ Critères d'Acceptation (Gherkin) :** Combiner la vision utilisateur avec des scénarios comportementaux précis, structurés et testables.10  
2. **Rédiger des AC Gherkin Efficaces :** Se concentrer sur la clarté, la spécificité, la testabilité. Utiliser des exemples concrets et couvrir systématiquement les cas d'erreur et les limites.12  
3. **Spécifier l'UI Interactive avec Précision :** Utiliser Gherkin pour décrire les flux d'interaction Chat/Canvas, expliciter la synchronisation, et intégrer des **références à des wireframes annotés** comme partie intégrante de la spécification.8  
4. **Intégrer les NFRs Pragmaticquement :** Définir des contraintes globales et incorporer des NFRs spécifiques et mesurables directement dans les AC Gherkin lorsque possible.11  
5. **Assurer Clarté et Cohérence :** Utiliser un glossaire de projet, maintenir un niveau de détail cohérent, et appliquer des techniques pour minimiser l'ambiguïté du langage naturel.1  
6. **Utiliser le Template Fourni :** Adopter la structure Markdown proposée pour standardiser la documentation des fonctionnalités.

**Bénéfices pour AutoAgent V1 :**

L'application rigoureuse de ces pratiques apportera des bénéfices directs au projet :

* **Guidage Amélioré de l'LLM :** Des spécifications claires et structurées réduiront les erreurs et ambiguïtés dans le code généré.1  
* **Efficacité du TDD :** Les AC Gherkin fournissent une base directe pour l'écriture des tests *avant* la génération du code, renforçant le cycle TDD.5  
* **Clarté pour le Développeur :** Le format assure une compréhension partagée (même avec soi-même et l'IA) du comportement attendu, facilitant la supervision, le débogage et la validation.7  
* **Gestion de la Complexité UI :** L'approche combinant Gherkin et wireframes permet de mieux maîtriser la spécification de l'interface Chat+Canvas.  
* **Base Solide pour la V1 :** Des spécifications robustes contribuent à une première version plus stable, mieux définie et plus facile à faire évoluer.

En conclusion, bien que le développement assisté par LLM offre des gains de productivité potentiels, il ne dispense pas d'une ingénierie des exigences rigoureuse. Au contraire, la qualité des spécifications devient encore plus critique. En investissant le temps nécessaire pour rédiger des spécifications détaillées, claires et testables selon les principes décrits ici, le projet AutoAgent V1 se dote des moyens pour réussir son développement complexe et innovant.

## **10\. Références**

* 10 UXCam Blog. (2025, January 13). *User Stories vs Use Cases: Key Differences & Examples*.  
* 13 Inflectra. *Behavior-Driven Development (BDD)*.  
* 14 Stack Overflow. (User contribution). *Behavior Driven Development (BDD) scenario vs User scenario or Use case difference*.  
* 26 Frontiers in Computer Science. (2025). *Detailed categorization of LLMs in requirement engineering*. (Hypothetical reference based on content)  
* 2 PromptHub. (2025, April). *Using LLMs for Code Generation: A Guide to Improving Accuracy and Addressing Common Issues*. (Hypothetical date based on content)  
* 1 Zhang, et al. (2025, March 23). *Requirements are All You Need: From Requirements to Code with LLMs*. ResearchGate.  
* 5 Qt Blog. (2025, April 4). *TDD vs. BDD: A Comparison of Testing Approaches*.  
* 7 Wikipedia. *Behavior-driven development*.  
* 30 TestGrid Blog. *TDD vs BDD: Which is Better?*  
* 17 AccelQ Blog. *TDD vs BDD: Unpacking the Debate for Modern Software Development*.  
* 31 Softkraft Blog. *Agile Requirements Gathering: Techniques, Process & Best Practices*.  
* 32 QAT Global Blog. *Guide to User Requirements*.  
* 11 Agile Business Consortium. *DSDM Project Framework: Requirements and User Stories*.  
* 16 ChatPRD.ai Resources. *PRD for Cursor: Best Practices for Using PRDs with AI-Assisted Development*. (Hypothetical source based on content)  
* 29 Ambassador Blog. *AI in Software Development: Designing Specs for the Future*.  
* 3 Leanware Blog. *Best Practices for Using AI in Software Development*.  
* 12 The Product Manager. (2024, October 11). *How to Write Excellent Acceptance Criteria (With Examples)*.  
* 20 Agilemania. *What is User Story and Acceptance Criteria?*  
* 6 BairesDev Blog. *TDD vs. BDD: The Smart Developer’s Guide to Better Software*.  
* 18 TestRail Blog. *Acceptance Criteria in Agile: Examples & Best Practices*.  
* 15 Visual Paradigm Guides. (2023, September 15). *Give / When / Then Acceptance Criteria for User Stories in Agile Development*.  
* 21 Scrum Alliance Resources. *What You Need to Know About Acceptance Criteria*.  
* 33 Microsoft Learn. *ASP.NET Core Blazor error handling*. (Version aspnetcore-9.0)  
* 22 Intellisoft Blog. (2024, October 7). *User Story Acceptance Criteria Explained with Examples*.  
* 34 aqua cloud Blog. *Acceptance Criteria in Testing: Definition, Examples & Best Practices*.  
* 4 Syncfusion Blogs. (2024, November 19). *Top 10 Prompt Engineering Criteria for Effective LLM Interaction*.  
* 35 Pedro Alonso Blog. *LLM Prompting Techniques for Developers*.  
* 28 Potpie AI Wiki. *How to write good prompts for generating code from LLMs*.  
* 8 UXPin Studio Blog. (2023, April 12). *Chat User Interface Design: Best Practices & Examples*.  
* 36 NICE inContact Help. *Set Up the V1 (ASPX) Chat Interface*.  
* 37 Oracle Blogs | Intelligent Advisor. *Tips and Tricks 6: Designing for Chat Interfaces*.  
* 38 IREB Requirements Engineering Magazine. *The Context-Canvas*.  
* 39 OpenAI Blog. (Date not specified). *Introducing canvas*.  
* 9 Lucid Tech Blog. (2023, August 25). *Design for Canvas-Based Applications*.  
* 19 Balsamiq Learn. *Wireframing for Agile User Stories*.  
* 25 MockFlow Blog. *Why Use Wireframes in Agile Project Management?*  
* 27 UX Stack Exchange. (User contributions). *Are wireframes appropriate for requirements documentation?*  
* 40 Rocket Software Docs. *Understanding Dynamic UI rules*. (MXWeb DG 10.5.2)  
* 23 VideoSDK Developer Hub. *Server Driven UI (SDUI) Guide*.  
* 24 Android Developers. *Testing your Compose layout: Synchronization*.  
* 10 Analysis based on UXCam Blog. (2025, January 13). *User Stories vs Use Cases*.  
* 13 Analysis based on Inflectra. *Behavior-Driven Development (BDD)*.  
* 1 Analysis based on Zhang, et al. (2025, March 23). *Requirements are All You Need*. ResearchGate.  
* 5 Analysis based on Qt Blog. (2025, April 4). *TDD vs. BDD*.  
* 12 Analysis based on The Product Manager. (2024, October 11). *How to Write Excellent Acceptance Criteria*.  
* 15 Analysis based on Visual Paradigm Guides. (2023, September 15). *Give / When / Then Acceptance Criteria*.  
* 22 Analysis based on Intellisoft Blog. (2024, October 7). *User Story Acceptance Criteria Explained*.  
* 4 Analysis based on Syncfusion Blogs. (2024, November 19). *Top 10 Prompt Engineering Criteria*.  
* 8 Analysis based on UXPin Studio Blog. (2023, April 12). *Chat User Interface Design*.  
* 9 Analysis based on Lucid Tech Blog. (2023, August 25). *Design for Canvas-Based Applications*.  
* 19 Analysis based on Balsamiq Learn. *Wireframing for Agile User Stories*.  
* 23 Analysis based on VideoSDK Developer Hub. *Server Driven UI (SDUI) Guide*.

#### **Sources des citations**

1. (PDF) Requirements are All You Need: From Requirements to Code ..., consulté le avril 29, 2025, [https://www.researchgate.net/publication/383285794\_Requirements\_are\_All\_You\_Need\_From\_Requirements\_to\_Code\_with\_LLMs](https://www.researchgate.net/publication/383285794_Requirements_are_All_You_Need_From_Requirements_to_Code_with_LLMs)  
2. Using LLMs for Code Generation: A Guide to Improving Accuracy and Addressing Common Issues \- PromptHub, consulté le avril 29, 2025, [https://www.prompthub.us/blog/using-llms-for-code-generation-a-guide-to-improving-accuracy-and-addressing-common-issues](https://www.prompthub.us/blog/using-llms-for-code-generation-a-guide-to-improving-accuracy-and-addressing-common-issues)  
3. Best Practices for Using AI in Software Development 2025 \- Leanware, consulté le avril 29, 2025, [https://www.leanware.co/insights/best-practices-ai-software-development](https://www.leanware.co/insights/best-practices-ai-software-development)  
4. 10 Essential Prompt Engineering Criteria to Kickstart Your Success, consulté le avril 29, 2025, [https://www.syncfusion.com/blogs/post/10-prompt-engineering-criteria/amp](https://www.syncfusion.com/blogs/post/10-prompt-engineering-criteria/amp)  
5. TDD vs BDD: Which Testing Approach Is Right For Your Team? \- Qt, consulté le avril 29, 2025, [https://www.qt.io/quality-assurance/blog/tdd-vs-bdd-comparison-testing-approaches](https://www.qt.io/quality-assurance/blog/tdd-vs-bdd-comparison-testing-approaches)  
6. TDD vs. BDD: The Smart Developer's Guide to Better Software \- BairesDev, consulté le avril 29, 2025, [https://www.bairesdev.com/blog/tdd-vs-bdd/](https://www.bairesdev.com/blog/tdd-vs-bdd/)  
7. Behavior-driven development \- Wikipedia, consulté le avril 29, 2025, [https://en.wikipedia.org/wiki/Behavior-driven\_development](https://en.wikipedia.org/wiki/Behavior-driven_development)  
8. Chat User Interface Design – A Quick Introduction to Chat UI | UXPin, consulté le avril 29, 2025, [https://www.uxpin.com/studio/blog/chat-user-interface-design/](https://www.uxpin.com/studio/blog/chat-user-interface-design/)  
9. Design for canvas-based applications \- Lucid Software, consulté le avril 29, 2025, [https://lucid.co/techblog/2023/08/25/design-for-canvas-based-applications](https://lucid.co/techblog/2023/08/25/design-for-canvas-based-applications)  
10. User Stories vs Use Cases \- Key Difference & Examples \- UXCam, consulté le avril 29, 2025, [https://uxcam.com/blog/user-stories-vs-use-cases/](https://uxcam.com/blog/user-stories-vs-use-cases/)  
11. Chapter 15: Requirements and user stories \- Agile Business Consortium, consulté le avril 29, 2025, [https://www.agilebusiness.org/dsdm-project-framework/requirements-and-user-stories.html](https://www.agilebusiness.org/dsdm-project-framework/requirements-and-user-stories.html)  
12. How To Write Excellent Acceptance Criteria (With Examples) \- The ..., consulté le avril 29, 2025, [https://theproductmanager.com/general/how-to-write-excellent-acceptance-criteria-with-examples/](https://theproductmanager.com/general/how-to-write-excellent-acceptance-criteria-with-examples/)  
13. Behavior Driven Development (BDD) | Inflectra \- Inflectra Corporation, consulté le avril 29, 2025, [https://www.inflectra.com/Ideas/Topic/Behavior-Driven-Development.aspx](https://www.inflectra.com/Ideas/Topic/Behavior-Driven-Development.aspx)  
14. Behavior Driven Development (BDD) scenario vs user scenario or use case differences?, consulté le avril 29, 2025, [https://stackoverflow.com/questions/35440948/behavior-driven-development-bdd-scenario-vs-user-scenario-or-use-case-differen](https://stackoverflow.com/questions/35440948/behavior-driven-development-bdd-scenario-vs-user-scenario-or-use-case-differen)  
15. Give / When / Then Acceptance Criteria for User Stories in Agile ..., consulté le avril 29, 2025, [https://guides.visual-paradigm.com/give-when-then-acceptance-criteria-for-user-stories-in-agile-development/](https://guides.visual-paradigm.com/give-when-then-acceptance-criteria-for-user-stories-in-agile-development/)  
16. Resources / Best Practices for Using PRDs with Cursor \- ChatPRD, consulté le avril 29, 2025, [https://www.chatprd.ai/resources/PRD-for-Cursor](https://www.chatprd.ai/resources/PRD-for-Cursor)  
17. TDD vs BDD \- Understanding the Differences \- ACCELQ, consulté le avril 29, 2025, [https://www.accelq.com/blog/tdd-vs-bdd/](https://www.accelq.com/blog/tdd-vs-bdd/)  
18. Acceptance Criteria in Agile Testing \- TestRail, consulté le avril 29, 2025, [https://www.testrail.com/blog/acceptance-criteria-agile/](https://www.testrail.com/blog/acceptance-criteria-agile/)  
19. Using wireframes with agile user stories \- Balsamiq, consulté le avril 29, 2025, [https://balsamiq.com/learn/articles/wireframing-agile-user-stories/](https://balsamiq.com/learn/articles/wireframing-agile-user-stories/)  
20. What is User Story and Acceptance Criteria | The 2024 Guide \- Agilemania, consulté le avril 29, 2025, [https://agilemania.com/what-is-user-story-and-acceptance-criteria](https://agilemania.com/what-is-user-story-and-acceptance-criteria)  
21. Acceptance Criteria: Everything You Need to Know Plus Examples, consulté le avril 29, 2025, [https://resources.scrumalliance.org/Article/need-know-acceptance-criteria](https://resources.scrumalliance.org/Article/need-know-acceptance-criteria)  
22. Acceptance Criteria for User Stories: Check Examples & Tips ..., consulté le avril 29, 2025, [https://intellisoft.io/user-story-acceptance-criteria-explained-with-examples/](https://intellisoft.io/user-story-acceptance-criteria-explained-with-examples/)  
23. Server Driven UI: Building Flexible Cross-Platform Applications ..., consulté le avril 29, 2025, [https://www.videosdk.live/developer-hub/social/server-driven-ui-guide-updated](https://www.videosdk.live/developer-hub/social/server-driven-ui-guide-updated)  
24. Synchronize your tests | Jetpack Compose \- Android Developers, consulté le avril 29, 2025, [https://developer.android.com/develop/ui/compose/testing/synchronization](https://developer.android.com/develop/ui/compose/testing/synchronization)  
25. Why Use Wireframes in Agile Project Management \- MockFlow, consulté le avril 29, 2025, [https://mockflow.com/blog/why-use-wireframes-in-agile-project-management](https://mockflow.com/blog/why-use-wireframes-in-agile-project-management)  
26. Research directions for using LLM in software requirement engineering: a systematic review, consulté le avril 29, 2025, [https://www.frontiersin.org/articles/10.3389/fcomp.2025.1519437](https://www.frontiersin.org/articles/10.3389/fcomp.2025.1519437)  
27. Are wireframes appropriate for requirements documentation?, consulté le avril 29, 2025, [https://ux.stackexchange.com/questions/4130/are-wireframes-appropriate-for-requirements-documentation](https://ux.stackexchange.com/questions/4130/are-wireframes-appropriate-for-requirements-documentation)  
28. How to write good prompts for generating code from LLMs \- GitHub, consulté le avril 29, 2025, [https://github.com/potpie-ai/potpie/wiki/How-to-write-good-prompts-for-generating-code-from-LLMs](https://github.com/potpie-ai/potpie/wiki/How-to-write-good-prompts-for-generating-code-from-LLMs)  
29. AI in Software Development: Designing Specs with AI for Faster, Accurate Requirements, consulté le avril 29, 2025, [https://www.getambassador.io/blog/ai-software-development-designing-specs](https://www.getambassador.io/blog/ai-software-development-designing-specs)  
30. TDD VS BDD: Detailed Comparison \- TestGrid, consulté le avril 29, 2025, [https://testgrid.io/blog/tdd-vs-bdd-which-is-better/](https://testgrid.io/blog/tdd-vs-bdd-which-is-better/)  
31. 10 Powerful Techniques for Better Agile Requirements Gathering \- SoftKraft, consulté le avril 29, 2025, [https://www.softkraft.co/agile-requirements-gathering/](https://www.softkraft.co/agile-requirements-gathering/)  
32. Comprehensive Guide to User Requirements for Software Success \- QAT Global, consulté le avril 29, 2025, [https://qat.com/guide-user-requirements/](https://qat.com/guide-user-requirements/)  
33. Handle errors in ASP.NET Core Blazor apps | Microsoft Learn, consulté le avril 29, 2025, [https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/handle-errors?view=aspnetcore-9.0](https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/handle-errors?view=aspnetcore-9.0)  
34. Acceptance Criteria in Testing: Complete Guide for Testers \- aqua cloud, consulté le avril 29, 2025, [https://aqua-cloud.io/acceptance-criteria-in-testing/](https://aqua-cloud.io/acceptance-criteria-in-testing/)  
35. LLM Prompting Techniques for Developers \- Pedro Alonso, consulté le avril 29, 2025, [https://www.pedroalonso.net/blog/llm-prompting-techniques-developers/](https://www.pedroalonso.net/blog/llm-prompting-techniques-developers/)  
36. Set Up Customer Chat Interface \- HELP CENTER, consulté le avril 29, 2025, [https://help.nice-incontact.com/content/acd/channels/chat/chatprofiles/setupchatinterface.htm](https://help.nice-incontact.com/content/acd/channels/chat/chatprofiles/setupchatinterface.htm)  
37. Tips and Tricks 6: Designing for Chat Interfaces \- Oracle Blogs, consulté le avril 29, 2025, [https://blogs.oracle.com/ia/post/tips-and-tricks-6-designing-for-chat-interfaces](https://blogs.oracle.com/ia/post/tips-and-tricks-6-designing-for-chat-interfaces)  
38. The Context-Canvas \- Requirements Engineering Magazine \- IREB, consulté le avril 29, 2025, [https://re-magazine.ireb.org/articles/the-context-canvas](https://re-magazine.ireb.org/articles/the-context-canvas)  
39. Introducing canvas, a new way to write and code with ChatGPT. \- OpenAI, consulté le avril 29, 2025, [https://openai.com/index/introducing-canvas/](https://openai.com/index/introducing-canvas/)  
40. Understanding Dynamic UI rules \- Rocket Software Documentation, consulté le avril 29, 2025, [https://docs.rocketsoftware.com/bundle/mxweb\_dg\_1052/page/mvg1653054427582.html](https://docs.rocketsoftware.com/bundle/mxweb_dg_1052/page/mvg1653054427582.html)