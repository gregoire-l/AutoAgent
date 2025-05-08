# **Guide Technique: Checklist Universelle et Adaptative pour la Clarification des Exigences d'une Mission par un Agent IA Orchestrateur**

## **1\. Introduction**

### **1.1 Le Défi de la Clarification des Exigences dans la Collaboration IA-Humain**

L'ingénierie des exigences (RE), processus critique pour le succès de tout projet, est intrinsèquement complexe. Elle implique de découvrir, d'analyser, de spécifier et de valider les besoins des parties prenantes, souvent confrontées à des défis tels que l'ambiguïté du langage naturel, les besoins implicites non exprimés, la difficulté d'aligner les visions des différentes parties prenantes et la nature évolutive des exigences elles-mêmes.1 Les échecs de projets sont fréquemment attribués à des exigences mal définies ou mal comprises 1, soulignant la nécessité de méthodes robustes pour leur élicitation et leur clarification.

L'introduction d'agents d'intelligence artificielle (IA), en particulier ceux basés sur des grands modèles de langage (LLMs) avancés, dans le rôle d'interlocuteur pour la clarification des exigences, présente à la fois des opportunités et de nouveaux défis. Si l'IA peut potentiellement automatiser et même améliorer certaines parties du processus 3, elle introduit également des complexités spécifiques. Assurer une compréhension mutuelle précise entre l'humain et l'IA est primordial. Il faut gérer les limitations inhérentes aux LLMs, telles que la tendance à "halluciner" (générer des informations plausibles mais incorrectes) 5, les biais potentiels issus des données d'entraînement 5, et la nécessité de maintenir la confiance de l'utilisateur tout au long de l'interaction.7 Une dépendance excessive à l'égard des capacités d'inférence de l'IA sans validation rigoureuse peut conduire à des erreurs coûteuses.7 L'élicitation des exigences, déjà ardue entre humains 1, requiert donc une approche encore plus structurée et vigilante lorsqu'une IA est impliquée.

### **1.2 Le Rôle de l'Agent IA Orchestrateur et la Nécessité d'une Checklist Adaptative**

Dans le contexte du système d'agents IA "AutoAgent", l'agent "Orchestrateur", propulsé par un LLM avancé (type Gemini 1.5/2.5), a pour fonction principale de dialoguer avec un utilisateur humain pour définir une nouvelle "Mission" avant son lancement. L'objectif critique est de garantir que l'Orchestrateur collecte de manière **fiable et exhaustive** toutes les informations **essentielles** pour comprendre et exécuter correctement la mission \[User Query\].

Une simple checklist statique s'avère insuffisante pour cette tâche. Les missions peuvent varier considérablement en complexité, en clarté initiale et en domaine d'application. De plus, les utilisateurs expriment leurs besoins de manières diverses, fournissant parfois des informations complètes d'emblée, tandis que d'autres nécessitent un guidage plus approfondi. Un agent IA efficace doit donc pouvoir adapter son approche de clarification.10 Il doit naviguer la conversation de manière fluide, en posant les bonnes questions au bon moment, en évitant les redondances et en approfondissant lorsque nécessaire. Ce besoin d'adaptation plaide pour l'utilisation d'une **checklist interne "universelle" mais "adaptable"** \[User Query\]. Cette checklist sert de structure de référence interne pour l'IA, garantissant que toutes les dimensions critiques d'une mission sont considérées, tout en permettant une flexibilité dans l'ordre, la formulation et même l'omission de questions spécifiques en fonction du contexte conversationnel et des informations déjà fournies ou inférées.10

### **1.3 Tirer Parti des LLMs pour Augmenter l'Ingénierie des Exigences Traditionnelle**

Les processus traditionnels d'ingénierie des exigences englobent des activités clés telles que l'élicitation (collecte des besoins via interviews, workshops, observation, etc.), l'analyse (structuration, modélisation), la spécification (documentation formelle ou semi-formelle) et la validation (vérification de la correction et de la complétude).9 Historiquement, ces activités sont largement manuelles et gourmandes en ressources.

L'avènement des LLMs avancés, tels que ceux de la classe Gemini 1.5/2.5, offre un potentiel de transformation qui dépasse la simple automatisation de tâches répétitives comme la documentation.3 Leurs capacités étendues en matière de compréhension du langage naturel, d'analyse de contexte sur de larges fenêtres 15, de raisonnement (bien que probabiliste), de génération proactive de suggestions et de gestion dynamique du dialogue 10 ouvrent la voie à une élicitation et une clarification des exigences potentiellement plus *intelligentes* et perspicaces.3 L'IA peut devenir un partenaire actif dans le processus, aidant à identifier les ambiguïtés, à suggérer des risques ou des hypothèses non considérés, et à structurer l'information de manière plus efficace.4

### **1.4 Objectif et Structure de ce Guide**

L'objectif de ce guide technique est de fournir un **cadre détaillé et fondé sur des preuves**, ainsi qu'une **checklist adaptable**, pour la clarification des exigences d'une mission par un agent IA Orchestrateur. Ce guide est spécifiquement conçu pour informer la conception de la logique de clarification de l'agent Orchestrateur d'AutoAgent, en exploitant les synergies entre les meilleures pratiques d'ingénierie des exigences, les principes cognitifs et les capacités des LLMs modernes.

Les sections suivantes aborderont :

* Les **catégories d'informations fondamentales** nécessaires à la définition d'une mission, basées sur les standards reconnus.  
* Des **stratégies de questionnement adaptatives** pour l'IA, visant à obtenir des informations détaillées et à découvrir l'implicite.  
* L'intégration des **principes cognitifs et de communication** pour optimiser l'interaction IA-Humain.  
* L'exploitation spécifique des **capacités avancées des LLMs** pour améliorer le processus.  
* Une proposition de **structure de checklist flexible** avec un "Noyau Dur V1" d'informations indispensables.  
* Des **directives opérationnelles** concrètes pour l'implémentation dans l'agent Orchestrateur.

Toutes les recommandations s'appuient sur des sources reconnues dans les domaines de l'ingénierie des exigences, de la gestion de projet, des sciences cognitives, de l'interaction homme-machine (IHM) et de la recherche sur l'IA conversationnelle et l'ingénierie logicielle assistée par IA.

## **2\. Catégories d'Informations Fondamentales pour la Définition d'une Mission**

### **2.1 Catégories Clés Issues des Standards RE/PM**

Pour assurer une définition de mission complète et robuste, il est essentiel de s'appuyer sur les cadres établis en gestion de projet et en analyse métier. Les standards comme le *Guide PMBOK®* (Project Management Body of Knowledge) du PMI et le *BABOK® Guide* (Business Analysis Body of Knowledge) de l'IIBA, ainsi que les pratiques Agiles, convergent sur un ensemble de catégories d'informations fondamentales.20 Une synthèse de ces catégories, adaptées au contexte d'une "Mission" définie par un agent IA, est présentée ci-dessous :

1. **Objectifs de la Mission (SMART):** Le but ultime de la mission. Qu'est-ce que la mission doit accomplir et pourquoi est-ce important?20 Les objectifs doivent être Spécifiques, Mesurables, Atteignables, Pertinents et Temporellement définis (SMART) pour garantir la clarté et la faisabilité.20 C'est le point de départ essentiel qui justifie l'investissement en ressources.12  
2. **Périmètre (Inclus/Exclus):** Définit clairement les frontières de la mission.20 Il précise ce qui fait partie intégrante du travail à réaliser (inclus) et ce qui n'en fait délibérément pas partie (exclus). Une définition explicite des exclusions est cruciale pour gérer les attentes des parties prenantes et prévenir le "scope creep" (dérive du périmètre).23 Cela inclut une description du travail requis.23  
3. **Livrables:** Les résultats tangibles ou intangibles que la mission doit produire.20 Qu'est-ce qui sera concrètement remis à la fin de la mission (ex: un rapport, un logiciel, une analyse, une configuration)?  
4. **Critères d'Acceptation:** Les conditions spécifiques et mesurables que les livrables doivent remplir pour être considérés comme terminés et acceptés par les parties prenantes.23 Comment le succès ou l'achèvement de chaque livrable sera-t-il évalué?  
5. **Parties Prenantes et Rôles:** Les individus, groupes ou systèmes qui sont affectés par la mission, qui y participent, ou qui ont une influence ou une autorité sur celle-ci.20 Identifier les utilisateurs finaux, le sponsor, les membres de l'équipe (potentiellement d'autres agents IA), les experts métier, etc., ainsi que leurs rôles et responsabilités respectifs est fondamental.25  
6. **Contraintes:** Les limitations ou restrictions qui encadrent la mission et peuvent impacter son exécution.20 Elles peuvent être liées au temps (délais), au budget, aux ressources (humaines, matérielles, logicielles), à la technologie, à la réglementation, à des facteurs politiques, etc.  
7. **Hypothèses:** Les facteurs ou conditions considérés comme vrais, réels ou certains lors de la planification, sans preuve formelle.2 Ces hypothèses doivent être documentées car si elles s'avèrent fausses, elles peuvent représenter un risque significatif pour la mission.  
8. **Risques (Identification Initiale):** Les événements ou conditions incertains qui, s'ils se produisent, pourraient avoir un impact négatif (ou parfois positif) sur les objectifs de la mission.20 Il s'agit ici d'une identification préliminaire des risques les plus évidents ou critiques.  
9. **Métriques de Succès et KPIs:** Indicateurs quantifiables utilisés pour mesurer le succès de la mission au-delà des simples critères d'acceptation des livrables.20 Comment l'atteinte des objectifs sera-t-elle mesurée de manière continue ou finale?  
10. **Contexte (Alignement Stratégique, Arrière-plan):** La justification de la mission dans un cadre plus large.20 Pourquoi cette mission est-elle entreprise maintenant? Comment s'inscrit-elle dans la stratégie globale de l'utilisateur ou de l'organisation? Quel est l'historique pertinent ou l'environnement opérationnel?  
11. **Dépendances:** Les liens entre la mission et d'autres tâches, projets, systèmes ou ressources externes.20 De quoi la mission dépend-elle pour démarrer ou progresser? Quels autres éléments dépendent des résultats de cette mission?  
12. **Exigences de Transition (si applicable):** Les capacités spécifiques que la solution (le livrable de la mission) doit posséder pour faciliter le passage de l'état actuel à l'état futur souhaité.12 Exemples : migration de données existantes, formation des utilisateurs, déploiement parallèle.

### **2.2 Évaluation de la Criticité dans un Contexte Piloté par l'IA**

L'intervention d'un agent Orchestrateur doté de capacités LLM avancées modifie potentiellement la manière dont ces catégories sont abordées lors de la clarification initiale. La capacité de l'IA à analyser de grandes quantités de texte et de dialogue (grâce aux larges fenêtres de contexte) 15 et à en extraire des informations pertinentes 3 signifie qu'elle pourrait potentiellement *inférer* des éléments appartenant à certaines catégories sans poser de question explicite. Par exemple, à partir d'une description détaillée de la mission fournie par l'utilisateur ou de documents joints, l'IA pourrait déduire le contexte stratégique, identifier des parties prenantes potentielles, ou même anticiper certains risques ou contraintes.4

Cette capacité d'inférence ne diminue pas l'importance intrinsèque des catégories, mais elle peut réduire la nécessité de poser des questions directes *pour chaque catégorie* dès le début de l'interaction. Si l'IA détecte avec une confiance élevée qu'une information (par exemple, une contrainte de délai) est déjà clairement énoncée, elle pourrait se concentrer sur d'autres aspects moins clairs.

Cependant, cette approche introduit un nouveau point critique : la **validation des inférences de l'IA**. Les LLMs fonctionnent de manière probabiliste et sont susceptibles de générer des erreurs, des interprétations erronées ou des hallucinations.5 Par conséquent, toute information que l'IA croit avoir inférée (contexte, risque, contrainte, etc.) doit être explicitement présentée à l'utilisateur pour validation. La charge de travail passe donc potentiellement d'une élicitation initiale exhaustive pour toutes les catégories à une élicitation ciblée sur les lacunes et une validation rigoureuse des informations déduites par l'IA.

Malgré le potentiel d'inférence, certaines catégories demeurent fondamentales et nécessitent presque toujours une définition explicite et une confirmation directe de la part de l'utilisateur. C'est notamment le cas des **Objectifs**, des **Livrables** et des **Critères d'Acceptation**, qui constituent le cœur de la mission et définissent ce qui doit être fait et comment le succès sera mesuré.

### **Tableau 2.1: Catégories d'Informations Fondamentales pour la Clarification de Mission**

Le tableau suivant synthétise les catégories d'informations essentielles, leur pertinence, l'approche d'élicitation traditionnelle, les adaptations possibles avec une IA avancée, leur criticité dans ce contexte, et une référence aux standards PMBOK/BABOK.

| Catégorie | Description | Pertinence (Pourquoi c'est important) | Élicitation Traditionnelle | Approche Augmentée par IA (Inférence/Adaptation Possible) | Criticité (Contexte IA) | Mapping Standard (Exemple) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Objectifs (SMART)** | Buts spécifiques, mesurables, atteignables, pertinents, temporels.20 | Définit la finalité et la direction de la mission ; justifie l'effort. | Directe (Interview, Workshop) | Peut analyser la description pour extraire/proposer des objectifs ; **Validation cruciale**. Peut aider à raffiner en SMART. | **Très Élevée** | PMBOK (Scope), BABOK (Strat Analysis) |
| **Périmètre (In/Out)** | Frontières claires de ce qui est inclus et exclu.23 | Évite la dérive (scope creep) ; gère les attentes. | Directe (Interview, Workshop) | Peut inférer des inclusions/exclusions basées sur la description ou des missions similaires ; **Validation cruciale**. Peut suggérer des exclusions communes.4 | **Très Élevée** | PMBOK (Scope), BABOK (Req Analysis) |
| **Livrables** | Résultats tangibles/intangibles produits par la mission.20 | Définit ce qui doit être concrètement produit. | Directe (Interview, Workshop) | Peut identifier des livrables potentiels à partir des objectifs/description ; **Validation cruciale**. | **Très Élevée** | PMBOK (Scope), BABOK (Req Analysis) |
| **Critères d'Accept.** | Conditions pour l'acceptation formelle des livrables.23 | Assure la qualité et la satisfaction ; définit "terminé". | Directe (Interview, Workshop) | Peut suggérer des critères basés sur les livrables ou standards ; **Validation cruciale**. | **Très Élevée** | PMBOK (Scope), BABOK (Solution Eval) |
| **Parties Prenantes** | Individus/groupes affectés ou influents.12 | Assure que les besoins clés sont considérés ; identifie les sources d'info et d'approbation. | Directe (Interview, Analyse) | Peut identifier des rôles/personnes mentionnés dans le contexte ; **Validation importante**. Peut suggérer des rôles typiques. | **Élevée** | PMBOK (Stakeholder), BABOK (Elicitation) |
| **Contraintes** | Limitations (temps, budget, ressources, tech, etc.).20 | Définit le cadre opérationnel ; impacte la faisabilité et les options. | Directe (Interview, Analyse Doc) | Peut extraire des contraintes explicites du texte 4 ; peut suggérer des contraintes typiques (ex: budget si non mentionné) ; **Validation importante**. | **Élevée** | PMBOK (Scope), BABOK (Req Analysis) |
| **Hypothèses** | Conditions supposées vraies pour la planification.2 | Identifie les dépendances sur des facteurs incertains ; base de l'analyse de risque. | Directe (Interview, Workshop) | Peut identifier des hypothèses implicites dans le discours de l'utilisateur ; peut suggérer des hypothèses communes 4 ; **Validation importante**. | **Moyenne à Élevée** | PMBOK (Scope), BABOK (Req Analysis) |
| **Risques (Initiaux)** | Événements incertains à impact négatif potentiel.20 | Permet une planification proactive et une atténuation précoce. | Directe (Brainstorming, Analyse) | Peut suggérer des risques basés sur le type de mission, les technologies mentionnées, ou sa base de connaissances 4 ; **Validation importante**. | **Moyenne à Élevée** | PMBOK (Risk), BABOK (Strat Analysis) |
| **Métriques Succès/KPIs** | Indicateurs quantifiables de l'atteinte des objectifs.20 | Permet une évaluation objective du succès au-delà des livrables. | Directe (Interview, Workshop) | Peut suggérer des KPIs pertinents basés sur les objectifs ; **Validation importante**. | **Moyenne** | PMBOK (Scope), BABOK (Solution Eval) |
| **Contexte** | Justification stratégique, historique, environnement.20 | Assure l'alignement ; fournit des informations pour de meilleures décisions. | Directe (Interview, Analyse Doc) | Peut extraire le contexte de documents ou descriptions longues 15 ; **Validation utile**. | **Moyenne** | BABOK (Strat Analysis) |
| **Dépendances** | Liens avec d'autres tâches/projets/ressources.20 | Impacte le planning et la coordination ; identifie les prérequis et successeurs. | Directe (Analyse, Workshop) | Peut identifier des dépendances mentionnées explicitement ; peut suggérer des dépendances typiques ; **Validation utile**. | **Moyenne** | PMBOK (Schedule), BABOK (Req Analysis) |
| **Exigences Transition** | Capacités nécessaires pour la mise en œuvre/adoption.12 | Assure une transition fluide et l'adoption réussie de la solution. | Directe (Interview, Analyse) | Peut suggérer des besoins de transition communs (ex: formation si nouveau logiciel) ; **Validation si applicable**. | **Faible à Moyenne** | BABOK (Transition Req) |

*Note : La criticité est évaluée dans le contexte de ce qui est essentiel pour que l'IA puisse commencer à travailler sur la mission de manière fiable. Certains éléments de criticité "Moyenne" ou "Faible" peuvent devenir très importants au cours de l'exécution.*

## **3\. Stratégies de Questionnement Adaptatives pour l'Élicitation IA-Humain**

Une fois les catégories d'informations fondamentales établies, l'efficacité de l'agent IA Orchestrateur dépendra de sa capacité à poser les bonnes questions, de la bonne manière et au bon moment. Une approche adaptative est essentielle, tirant parti des capacités de l'IA tout en respectant les principes d'une bonne communication.

### **3.1 Conception de Questions Ouvertes et de Sondage Efficaces**

Pour obtenir des informations riches et détaillées, l'Orchestrateur doit privilégier les questions ouvertes plutôt que les questions fermées. Les questions ouvertes, commençant souvent par "Quoi", "Comment", "Pourquoi", "Décrivez", encouragent l'utilisateur à élaborer ses pensées et à fournir du contexte, allant au-delà d'un simple "oui" ou "non".14

* **Exemple (Objectif):** Plutôt que "L'objectif est-il d'augmenter les ventes?" (fermé), préférer "Quel est le principal problème métier que cette mission vise à résoudre?" ou "Comment le succès de cette mission sera-t-il mesuré?" (ouvert).

En complément, l'IA doit maîtriser l'art du **sondage (probing)**. Il s'agit de poser des questions de suivi pour approfondir un sujet, clarifier une ambiguïté ou explorer des aspects connexes.31 Ces questions peuvent viser à :

* **Demander plus de détails :** "Pourriez-vous nous en dire plus sur cet aspect spécifique?"  
* **Clarifier la signification :** "Que signifie exactement 'améliorer l'efficacité' dans ce contexte?"  
* **Explorer les causes ou les conséquences :** "Quelles sont les causes de ce problème?" ou "Quel serait l'impact si cette contrainte n'était pas respectée?"  
* **Obtenir des exemples concrets :** "Pouvez-vous donner un exemple de situation où cela se produit?"

Il est également utile de distinguer les **questions de rappel (recall)**, qui font appel à la mémoire simple (ex: "Quel outil utilisez-vous actuellement?"), des **questions de processus (process)**, qui nécessitent une réflexion et une analyse plus profondes (ex: "Quels sont les avantages et inconvénients de votre processus actuel?").30 L'IA devrait utiliser une combinaison de ces types de questions pour obtenir une image complète.

### **3.2 Techniques d'Adaptation des Questions Pilotées par l'IA**

L'un des avantages majeurs d'un Orchestrateur basé sur un LLM avancé est sa capacité à adapter dynamiquement le questionnement, rendant l'interaction plus efficace et moins robotique.

* **Omission Contextuelle:** Grâce à sa capacité d'analyser le contexte fourni par l'utilisateur (dans la description initiale, les documents ou les tours de parole précédents) via sa large fenêtre de contexte 15, l'IA peut identifier les informations déjà présentes ou fortement implicites \[User Query\]. Si l'IA évalue avec une confiance suffisante qu'une information (ex: une contrainte de délai clairement énoncée) est déjà connue, elle peut choisir d'omettre la question correspondante de sa checklist interne pour éviter la redondance. Cela nécessite un mécanisme fiable d'évaluation de la confiance de l'inférence.  
* **Reformulation Dynamique:** Si l'utilisateur semble confus, utilise un langage ambigu, ou si ses réponses précédentes indiquent une incompréhension, l'IA peut reformuler ses questions.3 Elle peut adapter le niveau de langage, utiliser des synonymes, ou décomposer une question complexe en sous-questions plus simples pour faciliter la compréhension.  
* **Génération Dynamique de Slots (Questions):** Au lieu de se limiter strictement à une checklist prédéfinie, les LLMs peuvent identifier des sujets émergents ou des lacunes d'information spécifiques au cours de la conversation et générer dynamiquement de nouvelles questions (ou "slots" à remplir) pour explorer ces points.32 Par exemple, si l'utilisateur mentionne une technologie spécifique non anticipée, l'IA pourrait générer des questions sur les contraintes ou les dépendances liées à cette technologie.

### **3.3 Utilisation de l'IA pour Découvrir les Exigences Implicites et les Besoins Latents**

Les exigences implicites sont des attentes non formulées par les utilisateurs mais considérées comme essentielles, souvent basées sur des standards, des expériences passées ou des pratiques courantes.33 Ne pas les identifier peut conduire à l'insatisfaction de l'utilisateur, même si toutes les exigences explicites sont remplies.33 Les méthodes traditionnelles pour les découvrir incluent l'étude de marché, l'analyse des concurrents, l'observation des utilisateurs et la connaissance des standards de l'industrie.33

Un agent IA conversationnel peut jouer un rôle actif dans la découverte de ces besoins cachés :

* **Exploitation de la Base de Connaissances:** Les LLMs sont entraînés sur d'immenses corpus de données 3, incluant potentiellement des informations sur les standards de l'industrie, les meilleures pratiques et les attentes communes des utilisateurs pour différents types de missions ou de produits. L'IA peut comparer la mission décrite par l'utilisateur avec ces connaissances.  
* **Suggestions Proactives Basées sur le Contexte:** Si l'IA identifie des aspects typiquement attendus pour une mission similaire mais non mentionnés par l'utilisateur, elle peut poser des questions ciblées ou faire des suggestions. Par exemple : "Pour les missions d'analyse de données client, la conformité RGPD est souvent une contrainte majeure. Est-ce quelque chose que nous devons prendre en compte ici?" ou "Les utilisateurs s'attendent généralement à une fonction de recherche dans ce type d'interface. Est-ce prévu?".35  
* **Questions "Et si...":** Poser des questions hypothétiques basées sur le contexte peut révéler des attentes implicites. "Et si le volume de données à traiter doublait soudainement? Le système devrait-il pouvoir gérer cela?" (Sonde les attentes de scalabilité implicites).  
* **Analyse du Langage:** L'IA peut analyser le langage de l'utilisateur pour détecter des indices d'hypothèses sous-jacentes ou de besoins non exprimés directement.35

Cette capacité de l'IA à puiser dans une vaste base de connaissances pour suggérer des exigences implicites potentielles constitue un avantage significatif par rapport à une élicitation purement humaine, où l'analyste pourrait ne pas avoir conscience de toutes les normes ou attentes pertinentes.

### **3.4 Questionnement des Hypothèses par l'IA**

Les hypothèses non vérifiées sont une source majeure de risque dans les projets.23 L'IA peut aider à identifier et à remettre en question les hypothèses potentiellement problématiques formulées par l'utilisateur ou même implicites dans ses déclarations.

* **Identification des Hypothèses:** L'IA peut être entraînée ou promptée pour repérer les formulations indiquant une hypothèse (ex: "Je suppose que...", "Nous partirons du principe que...", "Évidemment, nous aurons accès à...") ou les déclarations qui semblent reposer sur des prémisses non établies.  
* **Techniques de Questionnement Doux:** Pour éviter de paraître conflictuelle, l'IA doit utiliser des techniques de questionnement prudentes :  
  * **Demande de Justification/Preuve:** "Pourriez-vous préciser sur quoi repose l'hypothèse que l'API externe sera disponible 24/7?"  
  * **Exploration des Conséquences:** "Quelle serait l'alternative ou l'impact sur la mission si cette hypothèse (ex: disponibilité des données) s'avérait incorrecte?"  
  * **Présentation d'Alternatives/Contradictions:** "J'ai noté que nous supposons X, mais une contrainte mentionnée précédemment (Y) semble potentiellement en conflit. Pouvons-nous clarifier cela?".2  
  * **Rappel des Risques:** "Considérer ceci comme une hypothèse introduit un risque de \[type de risque\]. Avons-nous un plan de secours?"

En systématisant le questionnement des hypothèses, l'IA peut aider à rendre la planification de la mission plus robuste et à identifier les risques plus tôt.

## **4\. Principes Cognitifs pour une Interaction IA-Humain Optimisée**

La conception de l'interaction entre l'agent Orchestrateur et l'utilisateur humain doit tenir compte des principes de la psychologie cognitive et de la communication pour être efficace, efficiente et agréable. L'objectif est de faciliter la transmission d'informations précises tout en minimisant la friction et la charge mentale pour l'utilisateur.

### **4.1 Minimisation de la Charge Cognitive de l'Utilisateur**

La **charge cognitive** désigne la quantité d'effort mental requise pour traiter l'information et effectuer une tâche.39 Une charge cognitive excessive, en particulier la charge *extrinsèque* (liée à la manière dont l'information est présentée), peut nuire à la performance, augmenter la frustration et réduire la qualité des informations recueillies.8 L'IA Orchestrateur doit être conçue pour minimiser cette charge.

Stratégies pour la conception de l'interaction IA :

* **Structuration Logique du Dialogue:** Organiser la conversation en suivant une progression logique, par exemple en regroupant les questions par catégorie (Objectifs, puis Périmètre, etc.).45 Utiliser des transitions claires entre les sujets ("Maintenant que nous avons défini les objectifs, parlons du périmètre de la mission.").  
* **Progressivité (Progressive Disclosure):** Commencer par des questions générales et de haut niveau avant de plonger dans les détails spécifiques.41 Ne pas submerger l'utilisateur avec toutes les questions possibles dès le début. Introduire la complexité graduellement.42 Par exemple, clarifier l'objectif principal avant de discuter des contraintes techniques détaillées.  
* **Langage Clair et Concis:** L'IA doit utiliser un langage simple, direct et sans ambiguïté, en évitant le jargon technique excessif, sauf si le contexte ou le profil de l'utilisateur l'indique comme approprié.23 La clarté réduit l'effort d'interprétation.  
* **Découpage de l'Information (Chunking):** Présenter les informations ou les résumés en petits morceaux gérables plutôt qu'en longs blocs de texte.41 De même, décomposer les questions complexes en sous-questions plus simples.45  
* **Utilisation de l'Espace Blanc et de la Mise en Forme (si interface textuelle):** Une bonne mise en forme (listes à puces, paragraphes courts) améliore la lisibilité et réduit la charge visuelle.41  
* **Validation et Feedback Immédiats:** Fournir un retour rapide sur la compréhension de l'IA (paraphrase, résumé) permet à l'utilisateur de savoir qu'il a été compris et réduit l'incertitude.41  
* **Minimiser les Interruptions Inutiles:** Éviter de couper la parole à l'utilisateur ou de changer de sujet abruptement.

### **4.2 Atténuation des Biais Cognitifs**

Les **biais cognitifs** sont des schémas de pensée systématiques qui peuvent conduire à des jugements irrationnels ou à des décisions erronées.46 Ils peuvent affecter aussi bien l'utilisateur qui exprime ses besoins que l'IA qui les interprète ou génère des suggestions.48 Une conception consciente de l'interaction peut aider à atténuer certains de ces biais.

Stratégies d'atténuation par l'IA :

* **Neutralité dans la Formulation (contre Biais de Cadrage/Ancrage):** L'IA doit formuler ses questions de manière neutre, sans suggérer de réponse ou introduire d'ancre numérique ou conceptuelle non justifiée.30 Par exemple, au lieu de "Pensez-vous qu'un délai de 2 semaines est suffisant?" (ancrage), demander "Quel est le délai souhaité ou requis pour cette mission?".  
* **Recherche Active de Contre-Exemples (contre Biais de Confirmation):** L'IA peut être explicitement programmée pour poser des questions qui encouragent l'utilisateur à considérer des informations ou des perspectives qui contredisent ses affirmations initiales.46 Exemples : "Quels sont les inconvénients potentiels de l'approche que vous proposez?", "Existe-t-il des données ou des expériences passées qui pourraient remettre en question cette hypothèse?".  
* **Encourager la Structuration (contre Biais d'Optimisme/Planning Fallacy):** Inciter l'utilisateur à utiliser des cadres structurés comme SMART pour les objectifs 20 ou à décomposer les tâches peut encourager une réflexion plus réaliste. L'IA peut aussi rappeler les données historiques si disponibles.46  
* **Solliciter des Perspectives Multiples (contre Pensée de Groupe/Groupthink):** Si le contexte implique plusieurs parties prenantes, l'IA peut demander comment d'autres pourraient voir la situation ou quels seraient leurs besoins spécifiques.46 "Comment le service marketing percevrait-il cette fonctionnalité?"  
* **Baser les Suggestions sur des Données (contre Biais de Disponibilité):** Lorsque l'IA fait des suggestions (ex: risques, NFRs), elle devrait idéalement les baser sur des patterns observés dans des missions similaires ou des standards reconnus, plutôt que sur des exemples anecdotiques ou la dernière interaction.46  
* **Détection de Biais dans l'IA:** Des mécanismes internes peuvent être mis en place pour que l'IA évalue ses propres réponses ou interprétations à la recherche de biais potentiels, par exemple en utilisant des prompts de réflexion ou des vérifications croisées.49

En agissant comme un partenaire qui pose systématiquement des questions pour élargir la perspective et challenger les affirmations initiales, l'IA peut favoriser une collecte d'exigences plus complète et objective, compensant certaines tendances humaines naturelles à la simplification ou à la confirmation.

### **4.3 Simulation de l'Écoute Active par l'IA**

L'**écoute active** est une compétence de communication fondamentale qui implique de se concentrer pleinement sur l'interlocuteur, de comprendre son message, d'y répondre de manière réfléchie et de retenir l'information.54 Bien qu'une IA ne "ressente" pas d'empathie, elle peut simuler les comportements clés de l'écoute active pour améliorer la communication, la confiance et la qualité de l'information recueillie.58

Techniques de simulation par l'IA :

* **Attention Simulée:** Traiter l'intégralité de l'input de l'utilisateur, maintenir le contexte de la conversation sur plusieurs tours 10, et éviter les réponses génériques ou hors sujet.  
* **Signaux d'Écoute:** Utiliser des accusés de réception verbaux courts et appropriés ("Compris.", "D'accord.", "Je vois.") pour indiquer que l'input est en cours de traitement.54  
* **Feedback (Paraphrase et Résumé):** C'est l'une des techniques les plus puissantes. L'IA doit régulièrement reformuler dans ses propres mots ce qu'elle a compris des déclarations clés de l'utilisateur ("Si je comprends bien, l'objectif principal est de...", "Donc, pour résumer les contraintes identifiées jusqu'à présent...").54 Cela permet à l'utilisateur de corriger immédiatement toute mauvaise interprétation et renforce le sentiment d'être compris.  
* **Questions de Clarification:** Poser des questions pertinentes lorsque l'information est ambiguë, incomplète ou contradictoire est un élément essentiel de l'écoute active que l'IA peut exécuter efficacement.54  
* **Suspension du Jugement (Ton Neutre):** L'IA doit maintenir un ton objectif et respectueux, évitant les formulations qui pourraient être interprétées comme critiques ou prescriptives, sauf si elle fournit des suggestions basées sur des données et clairement identifiées comme telles.56  
* **Réponse Appropriée:** Les réponses de l'IA doivent être directement liées à ce que l'utilisateur a dit, en s'appuyant sur les informations fournies et en faisant avancer la conversation de manière constructive.54

Il est crucial que cette simulation reste authentique dans son objectif : améliorer la clarté et la compréhension mutuelle, et non tromper l'utilisateur sur les capacités émotionnelles de l'IA.59

### **Tableau 4.1: Principes Cognitifs dans la Clarification des Exigences IA-Humain**

| Principe / Biais Cognitif | Description | Impact sur les Exigences si Ignoré | Stratégie / Technique IA | Exemple d'Interaction / Prompt IA |
| :---- | :---- | :---- | :---- | :---- |
| **Charge Cognitive (Extrinsèque)** | Effort mental lié à la présentation de l'info.41 | Fatigue de l'utilisateur, erreurs, informations incomplètes, mauvaise expérience.43 | Structuration du dialogue, progressivité, langage clair, chunking, feedback immédiat (paraphrase/résumé).41 | "D'accord, nous avons couvert les objectifs. Passons maintenant au périmètre. Pour commencer, quelles sont les fonctionnalités principales qui doivent absolument être incluses?" |
| **Biais de Confirmation** | Chercher/favoriser l'info qui confirme ses croyances.46 | Exigences incomplètes (risques/alternatives ignorés), mauvaise évaluation des options. | Poser des questions cherchant des contre-exemples ou des inconvénients ; demander des perspectives alternatives ; challenger doucement les affirmations fortes.46 | "Vous avez décrit les avantages de cette approche. Quels pourraient être les inconvénients potentiels ou les risques associés?" |
| **Biais d'Ancrage** | Se fier excessivement à la première info reçue.46 | Estimations (coût, délai) irréalistes ; résistance à ajuster les plans face à de nouvelles infos. | Éviter les questions suggestives/chargées ; demander des justifications pour les estimations initiales ; encourager l'utilisation de fourchettes ; présenter des données comparatives.30 | "Quel est le budget estimé pour cette mission? Sur quelles informations cette estimation est-elle basée?" |
| **Biais d'Optimisme / Planning Fallacy** | Surestimer les résultats positifs, sous-estimer temps/coûts/risques.46 | Délais/budgets dépassés ; mauvaise allocation des ressources ; frustration des parties prenantes. | Inciter à la décomposition des tâches ; demander des estimations basées sur des expériences passées ; utiliser des cadres (SMART) ; suggérer des marges de sécurité.46 | "Pourriez-vous décomposer cette tâche principale en sous-tâches plus petites? Avez-vous une expérience passée sur la durée de tâches similaires?" |
| **Manque d'Écoute Active** | Ne pas comprendre pleinement le message de l'interlocuteur.54 | Mauvaises interprétations, exigences incorrectes ou incomplètes, perte de confiance de l'utilisateur. | Paraphrase régulière ; résumés périodiques ; questions de clarification ciblées ; accusés de réception verbaux ; ton neutre.54 | "Si j'ai bien compris, vous souhaitez que le système \[X\] et \[Y\]. Est-ce exact?... D'accord. Pour résumer notre discussion jusqu'à présent, nous avons défini \[points clés\]. Est-ce correct?" |

## **5\. Exploiter les Capacités Avancées des LLMs pour une Clarification Améliorée**

Au-delà des principes généraux d'interaction, les capacités spécifiques des LLMs avancés (type Gemini 1.5/2.5) peuvent être mises à profit pour rendre le processus de clarification des exigences non seulement plus efficace, mais aussi plus perspicace.

### **5.1 Analyse Contextuelle : Exploiter les Larges Fenêtres de Contexte**

Les LLMs récents se distinguent par leurs **larges fenêtres de contexte (Large Context Windows \- LCW)**, leur permettant de traiter et de prendre en compte une quantité massive d'informations (des centaines de milliers, voire des millions de tokens, équivalant à des livres entiers ou de longues conversations) en une seule fois.15

**Bénéfices pour la Clarification des Exigences:**

* **Réduction du Questionnement Explicite:** L'IA peut analyser en profondeur la description initiale de la mission fournie par l'utilisateur, ainsi que tout document pertinent (spécifications antérieures, emails, transcriptions de réunions), pour en extraire directement des informations clés : contraintes mentionnées, dépendances suggérées, parties prenantes citées, contexte général.4 Cela évite de poser des questions dont les réponses sont déjà implicitement ou explicitement présentes dans le matériel fourni.  
* **Cohérence et Compréhension Globale:** En ayant accès à l'ensemble de la conversation ou à de vastes documents, l'IA peut mieux maintenir la cohérence, repérer les contradictions potentielles sur de longues distances, et comprendre les nuances et les interdépendances au sein de missions complexes.15 Elle peut relier des points discutés à différents moments de l'interaction.  
* **Traitement Multimodal:** Certains modèles avec LCW peuvent traiter des informations multimodales (texte, images, audio, vidéo).15 Dans le contexte d'AutoAgent, cela pourrait permettre à l'utilisateur de fournir des exigences via différents médias (ex: décrire un processus en parlant, fournir une maquette d'interface).

**Limitations et Stratégies de Mitigation:**

* **Performance Dégradée ("Lost in the Middle"):** Les modèles peuvent avoir tendance à accorder moins d'attention aux informations situées au milieu d'un très long contexte.16  
  * *Mitigation:* Utiliser des techniques de prompt engineering spécifiques pour attirer l'attention sur certaines parties (ex: "En te référant spécifiquement à la section 3 du document fourni...") ; structurer les prompts longs de manière logique ; potentiellement utiliser des modèles explicitement optimisés pour la rétention d'informations sur de longues séquences.16  
* **Risque Accru d'Hallucination/Erreur:** Plus le contexte est vaste, plus il y a de points d'ancrage potentiels pour que le LLM génère des inférences incorrectes ou des faits plausibles mais faux.5  
  * *Mitigation:* **Validation Explicite Systématique** de toute information inférée par l'IA. Utilisation de **Retrieval-Augmented Generation (RAG)** pour baser les réponses sur des informations spécifiques extraites de sources fiables (les documents fournis par l'utilisateur, par exemple) plutôt que sur la connaissance paramétrique générale du modèle.6 Implémentation de **scores de confiance** pour les inférences de l'IA.6  
* **Coût Calculatoire et Latence:** Le traitement de contextes très larges demande plus de ressources de calcul, ce qui peut augmenter le coût par requête et le temps de réponse.16  
  * *Mitigation:* Stratégies efficaces de gestion du contexte (ex: résumés progressifs de la conversation, ne passer que les parties les plus pertinentes du contexte) ; optimisation de l'infrastructure sous-jacente.29  
* **Risque de Confusion du Modèle:** Fournir un contexte excessif ou non pertinent peut paradoxalement nuire à la performance en "noyant" les informations importantes.60  
  * *Mitigation:* Conception soignée des prompts pour ne fournir que le contexte jugé nécessaire et pertinent pour la tâche immédiate.

### **5.2 Génération Proactive : L'IA comme Force de Proposition**

Plutôt que de se contenter de collecter passivement les informations fournies par l'utilisateur, l'Orchestrateur peut exploiter sa base de connaissances et ses capacités de raisonnement pour suggérer proactivement des éléments pertinents que l'utilisateur aurait pu omettre.3

**Applications dans la Clarification des Exigences:**

* **Suggestion de Risques Potentiels:** En se basant sur le type de mission (ex: développement logiciel, analyse de données, automatisation de processus), le secteur d'activité, les technologies mentionnées, ou les dépendances identifiées, l'IA peut proposer une liste de risques fréquemment rencontrés dans des contextes similaires.4 *Exemple: "Les missions impliquant l'intégration de systèmes tiers présentent souvent des risques liés à la compatibilité des API et à la gestion des erreurs de communication. Devrions-nous ajouter ces points à notre liste de risques à surveiller?"*  
* **Suggestion d'Hypothèses Implicites:** L'IA peut identifier des affirmations de l'utilisateur qui reposent sur des hypothèses non dites et les rendre explicites pour discussion.4 *Exemple: "Vous avez mentionné vouloir analyser les logs du serveur. Cela suppose que nous aurons les accès nécessaires et que les logs sont dans un format exploitable. Est-ce bien le cas?"*  
* **Suggestion d'Exclusions de Périmètre:** Pour aider à délimiter clairement la mission, l'IA peut proposer des éléments qui sont souvent considérés comme hors périmètre pour des missions de ce type.4 *Exemple: "Pour une mission de développement initial, la documentation utilisateur détaillée et la formation sont parfois traitées comme des projets séparés. Est-ce que cela s'applique ici, ou font-elles partie intégrante de cette mission?"*  
* **Suggestion d'Exigences Non Fonctionnelles (NFRs):** Selon la nature de la mission (ex: interaction utilisateur, traitement de données sensibles), l'IA peut suggérer des NFRs pertinentes à considérer (performance, sécurité, utilisabilité, maintenabilité, etc.).12 *Exemple: "Puisque cette mission implique le traitement de données personnelles, devrions-nous définir des exigences spécifiques en matière de sécurité et de confidentialité des données?"*

**Validation Indispensable:** Il est crucial de rappeler que ces suggestions de l'IA ne sont que des hypothèses ou des pistes de réflexion. Elles doivent **impérativement** être présentées comme telles et soumises à la validation (confirmation, modification ou rejet) de l'utilisateur. L'IA ne doit jamais imposer ces éléments.

### **5.3 Gestion Dynamique du Dialogue**

Contrairement aux systèmes basés sur des scripts rigides, les LLMs permettent une gestion de dialogue beaucoup plus flexible et adaptative, se rapprochant d'une conversation naturelle.10

**Stratégies d'Adaptation du Flux Conversationnel:**

* **Profondeur Basée sur la Clarté:** Si l'utilisateur fournit d'emblée des objectifs très clairs, spécifiques et mesurables, l'IA peut passer plus rapidement sur cette catégorie et aborder les suivantes. Inversement, si les objectifs sont vagues ou ambigus, l'IA doit consacrer plus de temps à des questions exploratoires (le "Pourquoi") avant de passer aux détails de mise en œuvre (le "Quoi" et le "Comment") \[User Query\].  
* **Gestion des Changements de Sujet:** L'IA doit être capable de suivre l'utilisateur s'il dévie du sujet ou souhaite aborder un point différent, tout en maintenant un état interne des catégories de la checklist qui restent à couvrir.10 Elle peut accuser réception du nouveau sujet, le traiter si possible, puis proposer de revenir aux points en suspens ("D'accord, nous pouvons discuter de \[nouveau sujet\]. Ensuite, pourrions-nous revenir aux contraintes budgétaires que nous n'avions pas encore abordées?").  
* **Gestion des Interruptions et des Incertitudes:** L'IA doit pouvoir gérer les interruptions, les réponses partielles, ou les moments où l'utilisateur exprime une incertitude ("Je ne suis pas sûr de ça pour le moment").11 Elle peut proposer de noter le point pour y revenir plus tard ou poser des questions pour aider l'utilisateur à réfléchir.  
* **Sondage Basé sur la Confiance:** Si l'IA infère une information mais avec un faible niveau de confiance, cela devrait déclencher automatiquement une question de clarification ou de validation ciblée.

### **5.4 Synthèse et Reformulation de l'Information**

Les LLMs excellent dans le traitement, la synthèse et la restructuration du langage naturel.3 Cette capacité peut être exploitée pour améliorer la clarté et l'utilité des exigences collectées.

**Applications dans la Clarification des Exigences:**

* **Structuration de l'Input Non Structuré:** Transformer les réponses conversationnelles et parfois désorganisées de l'utilisateur en déclarations d'exigences plus structurées, comme des user stories ("En tant que \[rôle\], je veux \[action\] afin de \[bénéfice\]") ou des exigences fonctionnelles plus formelles.7  
* **Résumés Concis:** Générer périodiquement des résumés clairs et concis des points clés abordés et des décisions prises, pour validation par l'utilisateur et pour maintenir une vision d'ensemble.3  
* **Amélioration de la Clarté et de la Précision:** Proposer des reformulations des déclarations de l'utilisateur pour les rendre moins ambiguës, plus précises ou plus complètes, toujours sous réserve de la confirmation de l'utilisateur.63 *Exemple: Utilisateur: "Le système doit être rapide." IA: "Pourriez-vous préciser ce que 'rapide' signifie dans ce contexte? Par exemple, un temps de réponse inférieur à 2 secondes pour les requêtes courantes serait-il acceptable?"*  
* **Traduction de Formats:** Convertir les exigences exprimées en langage naturel dans des formats plus spécifiques si nécessaire, comme le langage Gherkin (Given/When/Then) pour les scénarios de test comportementaux 63, ou même générer des ébauches de modèles (ex: diagrammes de cas d'utilisation, si l'IA a cette capacité).

### **5.5 Adresser les Limitations des LLMs**

Pour garantir la fiabilité du processus, la conception de l'Orchestrateur doit intégrer des mécanismes pour atténuer les limitations connues des LLMs.

* **Limitations Clés à Gérer:**  
  * **Hallucinations:** Génération d'informations fausses, illogiques ou non pertinentes.5  
  * **Connaissances Obsolètes:** Les LLMs "généralistes" ont une date limite de connaissance basée sur leurs données d'entraînement.27  
  * **Biais:** Reproduction des biais présents dans les données d'entraînement.5  
  * **Limites de la Fenêtre de Contexte:** Oubli ou mauvaise interprétation d'informations dans de très longues interactions, malgré les LCW.26  
  * **Manque de Compréhension Profonde:** Les LLMs manipulent des patterns linguistiques sans véritable compréhension sémantique ou raisonnement causal.6  
* **Stratégies de Mitigation Intégrées à l'Orchestrateur:**  
  * **Prompt Engineering Rigoureux:** Utiliser des prompts clairs, spécifiques, et contextuellement riches. Appliquer des techniques avancées comme le Chain-of-Thought (CoT) pour décomposer le raisonnement, le Few-Shot Prompting pour guider par l'exemple, ou le Chain-of-Verification (CoVe) pour l'auto-vérification.3  
  * **Retrieval-Augmented Generation (RAG):** Lorsque des informations factuelles ou spécifiques sont nécessaires (ex: standards, détails techniques), privilégier la récupération d'informations dans une base de connaissances externe et fiable (fournie par l'utilisateur ou l'organisation) et demander à l'IA de baser sa réponse sur ces informations récupérées.6 Cela "ancre" l'IA dans des faits vérifiables.  
  * **Boucles de Validation Explicites:** Ne jamais accepter une inférence, une suggestion ou une reformulation de l'IA sans la confirmation explicite de l'utilisateur. C'est une règle fondamentale.  
  * **Score de Confiance Interne:** L'IA devrait évaluer son propre niveau de confiance pour chaque information clé comprise ou générée. Un score faible doit déclencher une demande de clarification ou indiquer l'incertitude à l'utilisateur.6  
  * **Techniques de Mitigation des Biais:** Utiliser des prompts qui encouragent la neutralité et la prise en compte de perspectives diverses. Si RAG est utilisé, s'assurer que les sources de connaissances sont elles-mêmes diversifiées et vérifiées. Des prompts spécifiques peuvent demander à l'IA de vérifier ses propres suggestions à la recherche de biais.49  
  * **Primauté du Jugement Humain:** Concevoir l'interaction de manière à ce qu'il soit clair que l'IA est un assistant et que la décision finale et la responsabilité des exigences définies incombent à l'utilisateur humain.7

### **Tableau 5.1: Exploitation des Capacités LLM dans la Clarification des Exigences**

| Capacité LLM | Description | Exemple d'Application RE | Stratégie de Prompt Engineering | Limitation(s) Clé(s) | Stratégie de Mitigation |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Analyse Contexte Large (LCW)** | Traiter et comprendre de grandes quantités de texte/dialogue en une fois.15 | Extraire contraintes/besoins de longs documents ; vérifier la cohérence sur toute la conversation ; comprendre les interdépendances complexes. | Prompt demandant l'extraction ciblée d'infos spécifiques du contexte fourni ; prompt demandant la vérification de cohérence entre parties A et B du contexte. | Performance dégradée au milieu ("Lost in the Middle") 16 ; Coût/Latence 16 ; Risque accru d'hallucination/confusion.5 | Prompts ciblés ; RAG ; **Validation systématique** ; Scores de confiance ; Gestion optimisée du contexte. |
| **Génération Proactive** | Suggérer des éléments (risques, hypothèses, NFRs, exclusions) non mentionnés par l'utilisateur.3 | Identifier des risques oubliés ; clarifier des hypothèses implicites ; proposer des NFRs standards ; délimiter le périmètre plus clairement. | "Basé sur \[contexte mission\], quels sont les risques/NFRs/exclusions typiques? Suggère les plus pertinents à l'utilisateur pour validation." | Suggestions potentiellement non pertinentes, erronées (hallucination), ou basées sur des biais.5 | Présenter comme suggestions (non faits) ; **Validation utilisateur obligatoire** ; Baser sur RAG si possible ; Prompts de détection de biais. |
| **Gestion Dynamique Dialogue** | Adapter le flux conversationnel au contexte et à l'utilisateur.10 | Approfondir si ambigu, accélérer si clair ; gérer les digressions ; prioriser les questions en fonction des besoins émergents. | Prompts conditionnels basés sur l'état interne (infos manquantes/confiance) ; instructions pour gérer les interruptions et l'incertitude ; prompts adaptant la stratégie selon la clarté initiale. | Peut perdre le fil des objectifs principaux si mal géré ; difficulté à revenir aux points clés après digression. | Maintenir un état interne clair des catégories couvertes/restantes ; utiliser des prompts pour recentrer la conversation ; résumés réguliers. |
| **Synthèse & Reformulation** | Restructurer, résumer, clarifier le langage.3 | Créer des user stories/exigences structurées ; résumer la discussion pour validation ; reformuler pour plus de clarté ; traduire en Gherkin. | "Résume les points clés suivants..." ; "Reformule cette déclaration pour être plus précise (format SMART)..." ; "Convertis cette exigence en format Gherkin." | Peut introduire des erreurs ou changer le sens lors de la reformulation/synthèse 26 ; peut simplifier à l'excès. | **Validation utilisateur obligatoire** de toute reformulation/synthèse ; Comparaison côte à côte de l'original et de la reformulation ; CoT pour les synthèses complexes. |

## **6\. Une Structure de Checklist Adaptative pour l'Agent IA Orchestrateur**

Pour guider l'Orchestrateur dans sa tâche de clarification tout en permettant la flexibilité requise, une structure de checklist interne, organisée mais adaptable, est nécessaire. Cette checklist ne doit pas être vue comme un script rigide, mais comme une carte des territoires informationnels à explorer et à valider.

### **6.1 Organisation par Catégories Fondamentales**

La structure de la checklist interne de l'IA devrait être organisée autour des **catégories d'informations fondamentales** identifiées dans la Section 2 (Objectifs, Périmètre, Livrables, Critères d'Acceptation, Parties Prenantes, Contraintes, Hypothèses, Risques, Métriques de Succès, Contexte, Dépendances, Exigences de Transition). Cette organisation fournit un cadre logique et assure que toutes les dimensions essentielles d'une définition de mission sont potentiellement couvertes.

### **6.2 Questions Clés et Sondes par Catégorie**

Pour chaque catégorie de la checklist, un ensemble de **questions ouvertes clés** et de **sondes potentielles** devrait être défini. Ces questions servent de point de départ à l'IA pour explorer chaque catégorie. Elles doivent être formulées conformément aux principes de la Section 3 (ouvertes, neutres, claires).

**Exemple pour la Catégorie "Contraintes":**

* **Question Clé Ouverte:** "Quelles sont les limitations ou contraintes principales (par exemple, en termes de temps, budget, ressources, technologie, réglementation) qui pourraient affecter cette mission?" 20  
* **Sonde (si réponse vague ou incomplète):** "Y a-t-il un délai spécifique ou une date butoir pour l'achèvement de cette mission?"  
* **Sonde (si budget non mentionné):** "Existe-t-il des contraintes budgétaires spécifiques à prendre en compte?"  
* **Sonde (technologie):** "Y a-t-il des technologies spécifiques qui doivent être utilisées ou évitées?"  
* **Question liée à l'Implicite/Suggestion IA:** "Souvent, la disponibilité limitée des experts métier peut être une contrainte. Est-ce un facteur à considérer pour cette mission?" 4

L'IA n'a pas besoin de poser toutes les questions listées pour chaque catégorie. Elle sélectionne les questions pertinentes en fonction des informations déjà disponibles ou inférées et du déroulement de la conversation.

### **6.3 Définition du "Noyau Dur V1" d'Informations Indispensables**

Bien que la checklist vise l'exhaustivité, toutes les informations n'ont pas la même criticité pour *démarrer* une mission. Il est pragmatique de définir un **"Noyau Dur V1"**, représentant l'ensemble minimal d'informations absolument indispensables que l'Orchestrateur doit obtenir et valider avant de pouvoir lancer l'exécution de la mission avec un niveau de confiance raisonnable. Ce noyau dur assure que les fondamentaux sont alignés.

Le Noyau Dur V1 devrait typiquement inclure :

1. **Objectif(s) Principal(aux) Clairement Défini(s):** Quelle est la finalité première de la mission? (Doit être suffisamment clair pour guider l'action).  
2. **Livrable(s) Clé(s) Identifié(s):** Qu'est-ce qui doit être produit concrètement?  
3. **Périmètre Essentiel (Inclusions Majeures / Exclusions Critiques):** Quelles sont les frontières fondamentales du travail à réaliser? Qu'est-ce qui est absolument *dedans* et qu'est-ce qui est absolument *dehors*?  
4. **Contrainte(s) Critique(s):** Y a-t-il des limitations non négociables (ex: un délai impératif, une ressource indispensable mais limitée)?  
5. **Critère(s) d'Acceptation Fondamental(aux):** Comment saura-t-on, au minimum, que le livrable clé est acceptable?

L'Orchestrateur doit prioriser la clarification et la validation de ces éléments du Noyau Dur V1. Une fois ce noyau sécurisé, la mission pourrait potentiellement être lancée (selon la nature de la mission et la tolérance au risque), tout en continuant éventuellement à clarifier les détails des autres catégories en parallèle ou de manière asynchrone si nécessaire. Définir ce noyau V1 apporte un équilibre crucial entre la rigueur de la clarification et l'efficacité opérationnelle, évitant de bloquer le démarrage d'une mission pour des détails secondaires si les fondamentaux sont clairs et validés.

### **6.4 Lignes Directrices pour une Navigation Flexible de la Checklist**

L'Orchestrateur doit utiliser la checklist comme un guide interne flexible, et non comme un script linéaire à dérouler.10 Les principes de navigation suivants sont recommandés :

* **Questionnement Conditionnel:** L'IA ne pose une question relative à une catégorie que si :  
  * L'information pour cette catégorie est manquante.  
  * L'information fournie est ambiguë ou incomplète.  
  * L'information a été inférée par l'IA mais avec une confiance faible ou modérée, nécessitant validation.  
  * Une nouvelle information impacte une catégorie déjà discutée, nécessitant une ré-clarification.  
* **Priorisation Contextuelle:** L'IA peut adapter l'ordre d'exploration des catégories en fonction du contexte. Par exemple, si l'utilisateur insiste sur l'urgence, les contraintes de temps seront explorées plus tôt. Si la mission semble très innovante et mal définie, plus de temps sera consacré aux objectifs et au contexte.  
* **Suivi d'État Interne:** L'IA doit maintenir un état interne pour chaque catégorie (ex: Non Abordé, En Cours de Clarification, Information Inférée \- Non Validée, Validé \- Confiance Élevée). Cela lui permet de savoir où elle en est et quels points restent à couvrir, même si la conversation n'est pas linéaire.  
* **Flexibilité face à l'Utilisateur:** Si l'utilisateur souhaite aborder une catégorie spécifique ("Parlons des risques maintenant"), l'IA doit s'adapter, mettre à jour son état interne, et reprendre les autres points plus tard.  
* **Itération et Raffinement:** La clarification n'est pas nécessairement un processus unique. L'IA peut avoir besoin de revenir sur certaines catégories si des informations ultérieures créent des conflits ou soulèvent de nouvelles questions.

## **7\. Directives Opérationnelles pour l'Agent Orchestrateur d'AutoAgent**

Pour traduire le cadre et la checklist définis précédemment en une logique opérationnelle pour l'agent Orchestrateur d'AutoAgent, les directives suivantes sont proposées.

### **7.1 Implémentation de la Logique de Sélection de Questions Sensible au Contexte**

L'Orchestrateur doit intégrer un **module de gestion d'état de la clarification**. Ce module suivra, pour chaque catégorie d'information de la checklist (Section 2), le niveau de complétude et le niveau de confiance associé aux informations détenues.

* **État Initial:** Toutes les catégories sont marquées comme "Non Abordées".  
* **Traitement de l'Input Utilisateur:** À chaque tour de parole de l'utilisateur, l'IA analyse l'input 10 pour :  
  * Extraire des informations pertinentes pour les différentes catégories.  
  * Mettre à jour l'état de complétude et de confiance pour ces catégories. Si l'information est extraite directement, la confiance peut être élevée ; si elle est inférée, la confiance initiale sera plus basse.  
* **Logique de Décision (Prochaine Action):** Pour choisir la prochaine question ou action, l'Orchestrateur évalue l'état interne :  
  1. **Priorité 1 : Valider les Inférences à Faible Confiance:** Si des informations ont été inférées avec une confiance faible ou modérée, générer une question de validation explicite.  
  2. **Priorité 2 : Combler les Lacunes du Noyau Dur V1:** Si des éléments du Noyau Dur V1 (Section 6.3) sont manquants ou peu clairs (état "Non Abordé" ou "En Cours"), sélectionner une question clé ouverte pour cette catégorie.  
  3. **Priorité 3 : Combler les Autres Lacunes:** Si le Noyau Dur V1 est complet et validé, sélectionner une question pour une autre catégorie non encore validée avec une confiance élevée.  
  4. **Priorité 4 : Approfondir (si nécessaire):** Si toutes les catégories semblent couvertes mais que la confiance globale est insuffisante ou que des ambiguïtés subsistent, poser des questions de sondage ou demander un résumé/confirmation générale.  
  5. **Priorité 5 : Proposer des Suggestions Proactives:** Si le contexte s'y prête (voir 7.2), proposer une suggestion (risque, NFR, etc.).

### **7.2 Intégration des Mécanismes de Suggestion Proactive**

L'Orchestrateur doit disposer de déclencheurs pour activer ses capacités de suggestion proactive.4

* **Déclencheurs:** Peuvent être basés sur des mots-clés dans la description de la mission, le type de mission identifié, les technologies mentionnées, ou l'analyse comparative avec des missions similaires dans la base de connaissances (si RAG est utilisé).  
* **Génération de la Suggestion:** Utiliser un prompt spécifique demandant au LLM de générer des suggestions pertinentes (risques, hypothèses, NFRs, exclusions) basées sur le contexte actuel de la mission.  
* **Présentation à l'Utilisateur:** Formuler la suggestion de manière non affirmative et inviter à la discussion. *Exemple : "En analysant la description, il semble que nous pourrions rencontrer un risque lié à \[risque spécifique\]. Est-ce pertinent pour cette mission et devrions-nous l'explorer davantage?"*  
* **Mise à Jour de l'État:** Enregistrer la réponse de l'utilisateur et mettre à jour l'état de la catégorie correspondante (Risques, Hypothèses, etc.).

### **7.3 Conception du Moteur de Dialogue Dynamique**

Le système de gestion de dialogue doit être conçu pour la flexibilité.10

* **Gestion d'État Robuste:** Le suivi de l'état de clarification (Section 7.1) est essentiel pour permettre les conversations non linéaires.  
* **Traitement des Interruptions/Digressions:** Mettre en place une logique pour reconnaître quand l'utilisateur change de sujet, stocker le contexte de la discussion précédente, et planifier de revenir aux points en suspens.  
* **Gestion de l'Ambigüité:** Lorsque l'input utilisateur est ambigu, l'IA doit privilégier la demande de clarification plutôt que de faire une supposition risquée. Utiliser des prompts spécifiques pour générer des questions de clarification efficaces.

### **7.4 Incorporation des Vérifications de Biais et du Score de Confiance**

La fiabilité exige des mécanismes de contrôle internes.

* **Score de Confiance:** Le LLM sous-jacent (ou un module d'évaluation séparé) devrait attribuer un score de confiance à ses interprétations, inférences et même à ses propres suggestions. Ce score influence la logique de décision (une faible confiance déclenche une validation).  
* **Vérifications de Biais:** Intégrer des étapes ou des prompts spécifiques visant à identifier les biais potentiels.49  
  * *Prompt d'Auto-Réflexion:* "Examine les exigences collectées jusqu'à présent. Y a-t-il des signes de biais d'optimisme excessif, de confirmation, ou une négligence des perspectives de certaines parties prenantes?"  
  * *Vérification Croisée (si possible):* Comparer les exigences avec des checklists de biais connues ou des exemples de missions équilibrées.

### **7.5 Stratégies de Prompt Engineering pour les Tâches d'Élicitation**

L'efficacité de l'Orchestrateur dépendra fortement de la qualité des prompts utilisés pour piloter le LLM. Voici des exemples de structures de prompts adaptées 3 :

* **Prompt \- Compréhension Initiale & Identification des Lacunes:**  
  Rôle: Assistant expert en clarification de mission.  
  Contexte: L'utilisateur a fourni la description initiale de la mission suivante : "\[Insérer description utilisateur\]". L'historique de la conversation est : "\[Insérer historique pertinent\]". L'état actuel de la clarification est : "\[Insérer état des catégories\]".  
  Tâche:  
  1\. Analyse la description et l'historique.  
  2\. Identifie les objectifs, livrables, contraintes et autres catégories d'information clés mentionnés explicitement ou implicitement.  
  3\. Évalue la clarté et la complétude de chaque information identifiée (Score de Confiance : Faible/Moyen/Élevé).  
  4\. Identifie les 1-2 lacunes d'information les plus critiques ou les points nécessitant une validation prioritaire, en particulier concernant le Noyau Dur V1 (Objectif, Livrable, Périmètre, Contrainte Critique, Critère d'Acceptation).  
  5\. Formule une question ouverte, neutre et polie pour aborder la lacune la plus prioritaire ou pour valider l'inférence la moins fiable.  
  Output: Question à poser à l'utilisateur.

* **Prompt \- Validation d'une Inférence:**  
  Rôle: Assistant de clarification.  
  Contexte: Basé sur "\[élément de contexte spécifique\]", j'ai inféré que "\[inférence spécifique, ex: le budget est limité à Y\]". Mon niveau de confiance est \[Faible/Moyen\].  
  Tâche: Formule une question directe et polie pour confirmer ou infirmer cette inférence auprès de l'utilisateur.  
  Output: Question de validation.

* **Prompt \- Suggestion Proactive (Exemple Risque):**  
  Rôle: Assistant de clarification proactif.  
  Contexte: La mission décrite concerne \[type de mission, ex: migration de base de données\]. Les technologies impliquées incluent \[technologies\].  
  Tâche:  
  1\. Identifie 1-2 risques courants associés à ce type de mission et de technologies, qui n'ont pas encore été discutés.  
  2\. Formule une suggestion concise présentant ces risques potentiels à l'utilisateur et demande si ces risques sont pertinents et devraient être considérés.  
  Output: Suggestion et question pour l'utilisateur.

* **Prompt \- Résumé Périodique:**  
  Rôle: Assistant de clarification.  
  Contexte: Historique de la conversation : "\[Insérer historique pertinent\]".  
  Tâche: Génère un résumé concis (max 3 points clés) des principales informations validées concernant \[catégories spécifiques, ex: les objectifs et les livrables principaux\]. Termine en demandant confirmation à l'utilisateur.  
  Output: Résumé et question de confirmation.

* **Prompt \- Utilisation de Chain-of-Thought (CoT) pour Analyser une Réponse Complexe:**  
  Rôle: Analyste d'exigences.  
  Contexte: L'utilisateur a répondu "\[Insérer réponse complexe/ambiguë de l'utilisateur\]" à la question "\[Question précédente\]".  
  Tâche (pense étape par étape):  
  1\. Identifie les points clés ou les différentes idées contenues dans la réponse de l'utilisateur.  
  2\. Évalue l'ambiguïté ou le manque de spécificité pour chaque point clé.  
  3\. Identifie les informations supplémentaires nécessaires pour clarifier chaque point ambigu.  
  4\. Formule une ou plusieurs questions de sondage ciblées et ouvertes pour obtenir ces informations supplémentaires. Priorise la clarification la plus importante.  
  Output: Question(s) de sondage pour l'utilisateur.

Ces prompts doivent être adaptés et affinés en fonction du LLM spécifique utilisé et des retours obtenus lors des tests et de l'utilisation réelle. L'itération sur la conception des prompts est essentielle.66

## **8\. Conclusion**

### **8.1 Récapitulatif du Cadre de Clarification Augmenté par l'IA**

Ce guide a présenté un cadre détaillé pour la clarification des exigences d'une mission dans un contexte de collaboration entre un utilisateur humain et un agent IA Orchestrateur avancé. Le cadre repose sur l'intégration synergique de plusieurs piliers :

* **Fondations RE/PM:** Utilisation des catégories d'informations éprouvées (Objectifs, Périmètre, Livrables, Contraintes, etc.) issues des standards comme PMBOK et BABOK comme structure de base.  
* **Questionnement Adaptatif:** Passage d'une approche de checklist statique à un dialogue dynamique où l'IA pose des questions ouvertes et de sondage, adapte ses questions au contexte, et cherche activement à découvrir les besoins implicites et à challenger les hypothèses.  
* **Principes Cognitifs:** Conception de l'interaction pour minimiser la charge cognitive de l'utilisateur, atténuer les biais cognitifs (tant chez l'humain que potentiellement dans l'IA), et simuler les techniques d'écoute active pour améliorer la compréhension mutuelle et la confiance.  
* **Exploitation des Capacités LLM:** Tirer parti des fonctionnalités avancées des LLMs (large fenêtre de contexte, génération proactive de suggestions, gestion dynamique du dialogue, synthèse et reformulation) pour rendre le processus plus efficace et perspicace, tout en intégrant des stratégies pour mitiger leurs limitations (hallucinations, biais, etc.).  
* **Checklist Flexible et Noyau Dur V1:** Proposition d'une structure de checklist interne adaptable, guidant l'IA sans la contraindre, et définition d'un ensemble minimal d'informations critiques (Noyau Dur V1) à valider pour assurer un lancement de mission fiable.

### **8.2 Bénéfices et Perspectives Futures**

L'adoption d'une telle approche pour l'agent Orchestrateur d'AutoAgent promet plusieurs bénéfices par rapport aux méthodes de clarification purement manuelles ou aux automations plus simples :

* **Fiabilité et Exhaustivité Accrues:** La structure basée sur les standards et la capacité de l'IA à explorer systématiquement toutes les catégories (tout en s'adaptant) augmentent la probabilité de collecter toutes les informations essentielles.  
* **Efficacité Améliorée:** L'automatisation de l'extraction, la suggestion proactive et l'adaptation contextuelle peuvent accélérer le processus de clarification.  
* **Découverte d'Insights:** La capacité de l'IA à suggérer des risques, des hypothèses ou des exigences implicites basées sur sa vaste connaissance peut révéler des aspects que l'utilisateur n'aurait pas considérés.  
* **Expérience Utilisateur Optimisée:** La prise en compte des principes cognitifs vise à rendre l'interaction moins fastidieuse et plus naturelle pour l'utilisateur.

Les perspectives futures dans ce domaine sont prometteuses. Les recherches pourraient se concentrer sur l'amélioration des capacités de l'IA à détecter encore plus finement les besoins implicites et les états émotionnels subtils de l'utilisateur, le développement de techniques de mitigation des biais encore plus robustes, la création de stratégies de dialogue dynamique plus sophistiquées capables de gérer des conversations multi-tours très complexes, et l'intégration transparente d'informations multimodales (diagrammes, audio, vidéo) dans le processus de clarification des exigences.15 L'objectif ultime est de créer des agents IA qui ne sont pas seulement des collecteurs d'informations, mais de véritables partenaires intelligents dans la définition et la réussite des missions.

#### **Sources des citations**

1. Requirement Gathering Methods, consulté le mai 1, 2025, [https://www.umsl.edu/\~sauterv/analysis/F2015/Requirement%20Gathering%20Methods.html.htm](https://www.umsl.edu/~sauterv/analysis/F2015/Requirement%20Gathering%20Methods.html.htm)  
2. Conversation with an Artificial Intelligence \- Requirements Engineering Magazine \- IREB, consulté le mai 1, 2025, [https://re-magazine.ireb.org/articles/conversation-with-an-artificial-intelligence](https://re-magazine.ireb.org/articles/conversation-with-an-artificial-intelligence)  
3. Research directions for using LLM in software requirement engineering: a systematic review, consulté le mai 1, 2025, [https://www.frontiersin.org/articles/10.3389/fcomp.2025.1519437](https://www.frontiersin.org/articles/10.3389/fcomp.2025.1519437)  
4. The Evolution of Requirements Management Tools in the AI Era ..., consulté le mai 1, 2025, [https://argondigital.com/blog/general/the-evolution-of-requirements-management-tools-in-the-ai-era/](https://argondigital.com/blog/general/the-evolution-of-requirements-management-tools-in-the-ai-era/)  
5. LLM Hallucination—Types, Causes, and Solutions \- Nexla, consulté le mai 1, 2025, [https://nexla.com/ai-infrastructure/llm-hallucination/](https://nexla.com/ai-infrastructure/llm-hallucination/)  
6. How to Reduce LLM Hallucinations with Agentic AI (Simple Techniques for Making Large Language Models More Reliable) \- Magnimind Academy, consulté le mai 1, 2025, [https://magnimindacademy.com/blog/how-to-reduce-llm-hallucinations-with-agentic-ai-simple-techniques-for-making-large-language-models-more-reliable/](https://magnimindacademy.com/blog/how-to-reduce-llm-hallucinations-with-agentic-ai-simple-techniques-for-making-large-language-models-more-reliable/)  
7. Enhancing Business Requirements with AI: The Power of ..., consulté le mai 1, 2025, [https://visuresolutions.com/blog/enhancing-business-requirements-with-ai/](https://visuresolutions.com/blog/enhancing-business-requirements-with-ai/)  
8. Evaluating the Effectiveness of Conversational Agents in Statistical Analysis \- arXiv, consulté le mai 1, 2025, [https://www.arxiv.org/pdf/2502.08114](https://www.arxiv.org/pdf/2502.08114)  
9. Requirements Elicitation – Software Engineering | GeeksforGeeks, consulté le mai 1, 2025, [https://www.geeksforgeeks.org/software-engineering-requirements-elicitation/](https://www.geeksforgeeks.org/software-engineering-requirements-elicitation/)  
10. Conversation Routines: A Prompt Engineering Framework for Task-Oriented Dialog Systems, consulté le mai 1, 2025, [https://arxiv.org/html/2501.11613v3](https://arxiv.org/html/2501.11613v3)  
11. Dialogue Method for Dialogue Management | Restackio, consulté le mai 1, 2025, [https://www.restack.io/p/dialogue-management-answer-dialogue-method-cat-ai](https://www.restack.io/p/dialogue-management-answer-dialogue-method-cat-ai)  
12. Types of Requirements | BABOK classification Schema \- Techcanvass, consulté le mai 1, 2025, [https://techcanvass.com/blogs/types-of-requirements-as-per-babok.aspx](https://techcanvass.com/blogs/types-of-requirements-as-per-babok.aspx)  
13. Requirements Elicitation in Software Engineering: A Complete Guide \- Testbytes, consulté le mai 1, 2025, [https://www.testbytes.net/blog/requirements-elicitation/](https://www.testbytes.net/blog/requirements-elicitation/)  
14. Requirements Elicitation Techniques | 10+ Effective RET in 2025, consulté le mai 1, 2025, [https://skillcubator.com/requirements-elicitation-techniques/](https://skillcubator.com/requirements-elicitation-techniques/)  
15. LLMs with largest context windows \- Codingscape, consulté le mai 1, 2025, [https://codingscape.com/blog/llms-with-largest-context-windows](https://codingscape.com/blog/llms-with-largest-context-windows)  
16. What is a context window for Large Language Models? | McKinsey, consulté le mai 1, 2025, [https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-a-context-window](https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-a-context-window)  
17. From LLMs to LLM-based Agents for Software Engineering: A Survey of Current, Challenges and Future \- arXiv, consulté le mai 1, 2025, [https://arxiv.org/html/2408.02479v2](https://arxiv.org/html/2408.02479v2)  
18. arxiv.org, consulté le mai 1, 2025, [https://arxiv.org/abs/2411.11582](https://arxiv.org/abs/2411.11582)  
19. Exploring LLMs for Verifying Technical System Specifications Against Requirements This research in the projects OptiFlex and EKI was funded by dtec.bw \- arXiv, consulté le mai 1, 2025, [https://arxiv.org/html/2411.11582v1](https://arxiv.org/html/2411.11582v1)  
20. The 10 Essential Project Elements for Successful Projects, consulté le mai 1, 2025, [https://www.knowledgehut.com/blog/project-management/project-elements](https://www.knowledgehut.com/blog/project-management/project-elements)  
21. CEG Article \- BABOK Guide 2.0: What's in it for You?, consulté le mai 1, 2025, [https://www.corpedgroup.com/ba/CareerBA-BABOKInItForYou.asp](https://www.corpedgroup.com/ba/CareerBA-BABOKInItForYou.asp)  
22. Business Analysis Body of Knowledge (BABOK): Complete Guide, consulté le mai 1, 2025, [https://www.knowledgehut.com/blog/business-management/what-is-babok](https://www.knowledgehut.com/blog/business-management/what-is-babok)  
23. Mastering Project Scope Statements: Key Tips for PMP Exam, consulté le mai 1, 2025, [https://projectmanagementacademy.net/resources/blog/project-scope-statement-pmp/](https://projectmanagementacademy.net/resources/blog/project-scope-statement-pmp/)  
24. Project Scope: Definition and Step-by-Step Guide to Writing It, consulté le mai 1, 2025, [https://agilemania.com/what-is-project-scope](https://agilemania.com/what-is-project-scope)  
25. Partnering \- Project Manager \- Business Analyst Collaboration, consulté le mai 1, 2025, [https://www.pmi.org/learning/library/business-analyst-project-manager-collaboration-6512](https://www.pmi.org/learning/library/business-analyst-project-manager-collaboration-6512)  
26. What i an LLM Hallucination? Why Should We Care? | LITSLINK Blog, consulté le mai 1, 2025, [https://litslink.com/blog/what-i-an-llm-hallucination-why-should-we-care](https://litslink.com/blog/what-i-an-llm-hallucination-why-should-we-care)  
27. LLMpatronous: Harnessing the Power of LLMs For Vulnerability Detection \- arXiv, consulté le mai 1, 2025, [https://arxiv.org/html/2504.18423v1](https://arxiv.org/html/2504.18423v1)  
28. Reducing LLM Hallucinations: A Developer's Guide \- Zep, consulté le mai 1, 2025, [https://www.getzep.com/ai-agents/reducing-llm-hallucinations](https://www.getzep.com/ai-agents/reducing-llm-hallucinations)  
29. How Companies are Using LLMs to Power Customer Risk Assessment \- NexGen Cloud, consulté le mai 1, 2025, [https://www.nexgencloud.com/blog/case-studies/how-companies-are-using-llms-to-power-customer-risk-assessment](https://www.nexgencloud.com/blog/case-studies/how-companies-are-using-llms-to-power-customer-risk-assessment)  
30. Requirement gathering questions: Using interviews \- PM Majik, consulté le mai 1, 2025, [https://www.pmmajik.com/requirement-gathering-questions-using-interviews/](https://www.pmmajik.com/requirement-gathering-questions-using-interviews/)  
31. Requirements Gathering Techniques for Agile Product Teams, consulté le mai 1, 2025, [https://www.jamasoftware.com/requirements-management-guide/requirements-gathering-and-management-processes/11-requirements-gathering-techniques-for-agile-product-teams/](https://www.jamasoftware.com/requirements-management-guide/requirements-gathering-and-management-processes/11-requirements-gathering-techniques-for-agile-product-teams/)  
32. A Career Interview Dialogue System using Large Language Model-based Dynamic Slot Generation \- ACL Anthology, consulté le mai 1, 2025, [https://aclanthology.org/2025.coling-main.106.pdf](https://aclanthology.org/2025.coling-main.106.pdf)  
33. What is Implicit Requirements? \- Shorter Loop, consulté le mai 1, 2025, [https://shorterloop.com/product-management-glossary/pm-glossary-terms/implicit-requirements](https://shorterloop.com/product-management-glossary/pm-glossary-terms/implicit-requirements)  
34. What Is Implicit Requirements? A Guide for Product Managers, consulté le mai 1, 2025, [https://www.launchnotes.com/glossary/implicit-requirements-in-product-management-and-operations](https://www.launchnotes.com/glossary/implicit-requirements-in-product-management-and-operations)  
35. Conversational Agents and Personalization: Crafting Tailored AI Interactions for Users, consulté le mai 1, 2025, [https://smythos.com/ai-agents/conversational-agents/conversational-agents-and-personalization/](https://smythos.com/ai-agents/conversational-agents/conversational-agents-and-personalization/)  
36. The Personalization of Conversational Agents in Health Care: Systematic Review, consulté le mai 1, 2025, [https://www.jmir.org/2019/11/e15360/](https://www.jmir.org/2019/11/e15360/)  
37. Challenges And Limitations Of Nlp In Conversational Ai \- FasterCapital, consulté le mai 1, 2025, [https://fastercapital.com/topics/challenges-and-limitations-of-nlp-in-conversational-ai.html](https://fastercapital.com/topics/challenges-and-limitations-of-nlp-in-conversational-ai.html)  
38. Recalibrating assumptions on AI \- Chatham House, consulté le mai 1, 2025, [https://www.chathamhouse.org/sites/default/files/2023-04/2023-04-05-recalibrating-ai-holland-michel.pdf](https://www.chathamhouse.org/sites/default/files/2023-04/2023-04-05-recalibrating-ai-holland-michel.pdf)  
39. Cognitive load recognition in simulated flight missions: an ... \- Frontiers, consulté le mai 1, 2025, [https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2025.1542774/full](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2025.1542774/full)  
40. Cognitive load recognition in simulated flight missions: an EEG ..., consulté le mai 1, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11920153/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11920153/)  
41. Cognitive Load and UX | Aguayo's Blog, consulté le mai 1, 2025, [https://aguayo.co/en/blog-aguayo-user-experience/cognitive-load/](https://aguayo.co/en/blog-aguayo-user-experience/cognitive-load/)  
42. What is Cognitive Load? | IxDF, consulté le mai 1, 2025, [https://www.interaction-design.org/literature/topics/cognitive-load](https://www.interaction-design.org/literature/topics/cognitive-load)  
43. Evaluating the Effectiveness of Conversational Agents in Statistical Analysis \- arXiv, consulté le mai 1, 2025, [https://arxiv.org/html/2502.08114v2](https://arxiv.org/html/2502.08114v2)  
44. Reducing Cognitive Load and Improving Warfighter Problem Solving With Intelligent Virtual Assistants \- Frontiers, consulté le mai 1, 2025, [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.554706/full](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.554706/full)  
45. Human Factor Principles in UX Design \- UX Magazine, consulté le mai 1, 2025, [https://uxmag.com/articles/human-factor-principles-in-ux-design](https://uxmag.com/articles/human-factor-principles-in-ux-design)  
46. Cognitive Biases Every Project Manager Should Know, consulté le mai 1, 2025, [https://www.projectengineer.net/cognitive-biases-every-project-manager-should-know/](https://www.projectengineer.net/cognitive-biases-every-project-manager-should-know/)  
47. Cognitive bias mitigation \- Wikipedia, consulté le mai 1, 2025, [https://en.wikipedia.org/wiki/Cognitive\_bias\_mitigation](https://en.wikipedia.org/wiki/Cognitive_bias_mitigation)  
48. www.ijrar.org, consulté le mai 1, 2025, [https://www.ijrar.org/papers/IJRAR1944546.pdf](https://www.ijrar.org/papers/IJRAR1944546.pdf)  
49. arxiv.org, consulté le mai 1, 2025, [https://arxiv.org/pdf/2503.05516](https://arxiv.org/pdf/2503.05516)  
50. Bias Mitigation Strategies | Restackio, consulté le mai 1, 2025, [https://www.restack.io/p/bias-mitigation-answer-strategies-cat-ai](https://www.restack.io/p/bias-mitigation-answer-strategies-cat-ai)  
51. Exploring Conversational Agents as an Effective Tool for Measuring Cognitive Biases in Decision-Making \- arXiv, consulté le mai 1, 2025, [https://arxiv.org/pdf/2401.06686](https://arxiv.org/pdf/2401.06686)  
52. Exploring Conversational Agents as an Effective Tool for Measuring Cognitive Biases in Decision-Making \- arXiv, consulté le mai 1, 2025, [https://arxiv.org/html/2401.06686v1](https://arxiv.org/html/2401.06686v1)  
53. Mitigating Cognitive Biases in Clinical Decision-Making Through Multi-Agent Conversations Using Large Language Models: Simulation Study, consulté le mai 1, 2025, [https://www.jmir.org/2024/1/e59439/](https://www.jmir.org/2024/1/e59439/)  
54. wayne.edu, consulté le mai 1, 2025, [https://wayne.edu/learning-communities/pdf/becoming-active-listener-13.pdf](https://wayne.edu/learning-communities/pdf/becoming-active-listener-13.pdf)  
55. Active Listening \- StatPearls \- NCBI Bookshelf, consulté le mai 1, 2025, [https://www.ncbi.nlm.nih.gov/books/NBK442015/](https://www.ncbi.nlm.nih.gov/books/NBK442015/)  
56. Active Listening: Using Listening Skills to Coach Others | CCL \- Ccl.org, consulté le mai 1, 2025, [https://www.ccl.org/articles/leading-effectively-articles/coaching-others-use-active-listening-skills/](https://www.ccl.org/articles/leading-effectively-articles/coaching-others-use-active-listening-skills/)  
57. Effective Active Listening: Examples, Techniques & Exercises \[2024 ..., consulté le mai 1, 2025, [https://asana.com/resources/active-listening](https://asana.com/resources/active-listening)  
58. Enhancing Interpersonal Awareness with AI Simulations \- Hyperspace, consulté le mai 1, 2025, [https://hyperspace.mv/enhancing-interpersonal-awareness-with-ai-simulations/](https://hyperspace.mv/enhancing-interpersonal-awareness-with-ai-simulations/)  
59. If I Hear You Correctly: Building and Evaluating Interview Chatbots with Active Listening Skills \- ResearchGate, consulté le mai 1, 2025, [https://www.researchgate.net/publication/341690491\_If\_I\_Hear\_You\_Correctly\_Building\_and\_Evaluating\_Interview\_Chatbots\_with\_Active\_Listening\_Skills](https://www.researchgate.net/publication/341690491_If_I_Hear_You_Correctly_Building_and_Evaluating_Interview_Chatbots_with_Active_Listening_Skills)  
60. What does large context window in LLM mean for future of devs? : r ..., consulté le mai 1, 2025, [https://www.reddit.com/r/ExperiencedDevs/comments/1jwhsa9/what\_does\_large\_context\_window\_in\_llm\_mean\_for/](https://www.reddit.com/r/ExperiencedDevs/comments/1jwhsa9/what_does_large_context_window_in_llm_mean_for/)  
61. Large Language Models Use Cases Across Various Industries \- Signity Software Solutions, consulté le mai 1, 2025, [https://www.signitysolutions.com/blog/large-language-models-use-cases](https://www.signitysolutions.com/blog/large-language-models-use-cases)  
62. tmgthb/Autonomous-Agents: Autonomous Agents (LLMs) research papers. Updated Daily. \- GitHub, consulté le mai 1, 2025, [https://github.com/tmgthb/Autonomous-Agents](https://github.com/tmgthb/Autonomous-Agents)  
63. Best Practices for AI Requirements Elicitation \- Modern Requirements, consulté le mai 1, 2025, [https://www.modernrequirements.com/blogs/best-practices-for-ai-requirements-elicitation-techniques/](https://www.modernrequirements.com/blogs/best-practices-for-ai-requirements-elicitation-techniques/)  
64. What Should We Engineer in Prompts? Training Humans in Requirement-Driven LLM Use, consulté le mai 1, 2025, [https://arxiv.org/html/2409.08775v3](https://arxiv.org/html/2409.08775v3)  
65. Prompt Engineering 101: Mastering Effective LLM Communication \- KDnuggets, consulté le mai 1, 2025, [https://www.kdnuggets.com/prompt-engineering-101-mastering-effective-llm-communication](https://www.kdnuggets.com/prompt-engineering-101-mastering-effective-llm-communication)  
66. Prompt engineering: The process, uses, techniques, applications and best practices, consulté le mai 1, 2025, [https://www.leewayhertz.com/prompt-engineering/](https://www.leewayhertz.com/prompt-engineering/)  
67. www.launchnotes.com, consulté le mai 1, 2025, [https://www.launchnotes.com/glossary/implicit-requirements-in-product-management-and-operations\#:\~:text=Market%20research%20and%20customer%20interviews%20are%20effective%20ways%20to%20uncover,they%20don't%20articulate%20it.](https://www.launchnotes.com/glossary/implicit-requirements-in-product-management-and-operations#:~:text=Market%20research%20and%20customer%20interviews%20are%20effective%20ways%20to%20uncover,they%20don't%20articulate%20it.)  
68. What Are User Needs? \+Methods To Understand and Prioritize Them, consulté le mai 1, 2025, [https://survicate.com/blog/user-needs/](https://survicate.com/blog/user-needs/)  
69. ReqGenie: GPT-Powered Conversational-AI for Requirements ..., consulté le mai 1, 2025, [https://www.researchgate.net/publication/386320436\_ReqGenie\_GPT-Powered\_Conversational-AI\_for\_Requirements\_Elicitation](https://www.researchgate.net/publication/386320436_ReqGenie_GPT-Powered_Conversational-AI_for_Requirements_Elicitation)  
70. Mastering Agents: Evaluating AI Agents \- Galileo AI, consulté le mai 1, 2025, [https://www.galileo.ai/blog/mastering-agents-evaluating-ai-agents](https://www.galileo.ai/blog/mastering-agents-evaluating-ai-agents)  
71. Conversational Agents: Goals, Technologies, Vision and Challenges \- PMC, consulté le mai 1, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC8704682/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8704682/)  
72. US20240289863A1 \- Systems and methods for providing adaptive ai-driven conversational agents \- Google Patents, consulté le mai 1, 2025, [https://patents.google.com/patent/US20240289863A1/en](https://patents.google.com/patent/US20240289863A1/en)  
73. When building artificial intelligence, is simpler better? New research at Binghamton challenges assumptions, consulté le mai 1, 2025, [https://www.binghamton.edu/news/story/5311/when-building-artificial-intelligence-is-simpler-better-new-research-at-binghamton-challenges-assumptions](https://www.binghamton.edu/news/story/5311/when-building-artificial-intelligence-is-simpler-better-new-research-at-binghamton-challenges-assumptions)  
74. Conversational AI Chatbot Online: Transforming Customer Engagement \- FastBots.ai, consulté le mai 1, 2025, [https://fastbots.ai/blog/conversational-ai-chatbot-online-revolutionising-customer-engagement](https://fastbots.ai/blog/conversational-ai-chatbot-online-revolutionising-customer-engagement)  
75. A Comprehensive Guide to AI-powered and Enterprise Chatbots: Types, Applications, Benefits, and Implementation \- LeewayHertz, consulté le mai 1, 2025, [https://www.leewayhertz.com/ai-chatbots/](https://www.leewayhertz.com/ai-chatbots/)  
76. Build Your AI Chatbot with NLP in Python \- Analytics Vidhya, consulté le mai 1, 2025, [https://www.analyticsvidhya.com/blog/2021/10/complete-guide-to-build-your-ai-chatbot-with-nlp-in-python/](https://www.analyticsvidhya.com/blog/2021/10/complete-guide-to-build-your-ai-chatbot-with-nlp-in-python/)  
77. 5 Real-World Project Risk Management Case Studies You Should Know \- Intelegain, consulté le mai 1, 2025, [https://www.intelegain.com/5-real-world-project-risk-management-case-studies-you-should-know/](https://www.intelegain.com/5-real-world-project-risk-management-case-studies-you-should-know/)  
78. 30+ Must-Read Project Management Case Studies: Real-World Insights for Success, consulté le mai 1, 2025, [https://www.upgrad.com/blog/project-management-case-studies-with-examples/](https://www.upgrad.com/blog/project-management-case-studies-with-examples/)  
79. 40 LLM Projects to Upgrade Your AI Skillset in 2025 \- ProjectPro, consulté le mai 1, 2025, [https://www.projectpro.io/article/llm-project-ideas/881](https://www.projectpro.io/article/llm-project-ideas/881)