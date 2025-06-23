# **Analyse de Faisabilité Technologique pour le Modèle "Quantum Project Management" (QPM) dans le Cadre du Projet AutoAgent**

## **1\. Résumé Exécutif**

Le présent rapport évalue la faisabilité technologique de la mise en œuvre du modèle de gestion de projet agentique avancé "Quantum Project Management" (QPM) pour le projet AutoAgent. L'analyse se concentre sur l'état de l'art des algorithmes et des architectures logicielles applicables, en distinguant ce qui relève de l'ingénierie mature, de la R\&D appliquée, ou de la recherche fondamentale.

La conclusion générale est que le modèle QPM, dans sa vision la plus ambitieuse – notamment la gestion exhaustive de "tous les futurs possibles" et la mise à jour bayésienne globale instantanée – repousse les limites des capacités actuelles de l'intelligence artificielle et de l'ingénierie logicielle. Sa réalisation intégrale aujourd'hui relève en grande partie de la recherche fondamentale et appliquée. Cependant, plusieurs piliers du QPM s'appuient sur des concepts dont certains aspects sont plus matures et peuvent faire l'objet d'une implémentation pragmatique et évolutive au sein d'AutoAgent. Une approche par phases, débutant par des composants robustes et intégrant progressivement des fonctionnalités plus avancées via une R\&D ciblée, est la voie la plus réaliste.

**Tableau de Synthèse : Composants QPM et Maturité Technologique**

| Composant QPM | Approches/Algorithmes Clés | Niveau de Maturité (TRL 1-9) | Bibliothèques Open-Source Notables (avec mention Go/service) | Défis d'Intégration pour AutoAgent |
| :---- | :---- | :---- | :---- | :---- |
| Décomposition Dynamique des Tâches (structure hiérarchique) | Planification Hiérarchique (HTN) | TRL 6-7 (pour HTN classiques) ; TRL 2-3 (pour génération dynamique de méthodes par agents) | SHOP2 (Common Lisp, via service externe) 3 ; Recherche sur heuristiques HTN (ex: Olz et al., 2024 4) | Intégration de SHOP2 comme service (parsing de sortie) ; Développement R\&D pour la génération et validation de méthodes par les agents QPM. |
| Planification sous Incertitude (évaluation probabiliste locale) | Processus Décisionnels de Markov Partiellement Observables (POMDPs) | TRL 3-5 (pour problèmes de taille limitée/abstraits) ; TRL 1-2 (pour application globale à QPM) | pomdp-py (Python) 5, POMDPs.jl (Julia) 6 (via services externes) | Explosion combinatoire 7 ; Complexité de modélisation ; Intégration de solveurs externes ; Scalabilité pour des sous-problèmes QPM. |
| Langage de Définition de Plan | PDDL, PPDDL | TRL 7-8 (PDDL classique) ; TRL 3-4 (PPDDL et solveurs associés) | Nombreux planificateurs PDDL (CLI, via service externe) 8 ; Parsers PDDL (Python 9) | Adéquation limitée de PDDL standard pour le raisonnement probabiliste riche de QPM ; Moindre support pour PPDDL. |
| Exploration de l'Espace des Plans | Recherche d'Arbre Monte-Carlo (MCTS) | TRL 4-6 (pour applications générales hors jeux) | Implémentations MCTS variées (Python, C++) ; Adaptation nécessaire pour QPM. | Définition de l'espace d'états/actions QPM ; Fonction d'évaluation ; Intégration avec le KG. |
| Sélection d'Actions Basée sur le Gain d'Information | Optimisation basée sur la théorie de l'information (ex: Mutual Information) | TRL 3-5 (en recherche appliquée) | Peu de bibliothèques génériques ; Développement spécifique requis. | Définition et calcul efficace du gain d'information pour les "Points de Levier" QPM ; Intégration avec MCTS et KG. |
| Représentation des Connaissances Probabilistes (KG) | Modèles de Graphes Probabilistes, Extensions de KG avec probabilités (propriétés, types de nœuds/relations distincts) | TRL 3-4 (pour modélisations ad-hoc dans KGs existants) ; TRL 2-3 (pour KG nativement et dynamiquement probabiliste à grande échelle) | Neo4j (pour la base factuelle) 10 ; Recherche sur l'intégration de réseaux bayésiens dans les KG.11 | Modélisation de "tous les futurs possibles" et des probabilités dans Neo4j sans sacrifier la performance ; Gestion de la taille du "graphe de potentiel". |
| Mise à Jour Bayésienne Globale | Propagation de croyance sur le graphe de potentiel | TRL 2-3 (pour l'échelle et la globalité de QPM) | Développement spécifique majeur requis. | Complexité computationnelle de la mise à jour de *tous* les chemins après chaque action ; Scalabilité. |

**Principales Conclusions et Recommandations Stratégiques pour AutoAgent :**

1. **Faisabilité Globale de QPM :** La construction d'un système QPM complet tel que décrit est une ambition à long terme nécessitant des avancées significatives en R\&D. La faisabilité actuelle se situe autour de **TRL 2-3** sur une échelle de 1 (purement théorique) à 5 (ingénierie mature).  
2. **Briques les Plus Solides :**  
   * L'utilisation de **Neo4j comme KG pour les faits établis** et la structure de base du projet.  
   * La **décomposition hiérarchique des tâches (HTN)** comme principe organisationnel, en utilisant des planificateurs existants comme service pour des plans déterministes ou avec une incertitude limitée.  
   * L'utilisation de **Go pour le backend et de Temporal pour l'exécution de tâches atomiques** constitue une base technique solide.  
3. **Briques les Plus Risquées (Nécessitant une R\&D Substantielle) :**  
   * La représentation et la gestion du **"graphe de potentiel" exhaustif** avec ses probabilités associées dans Neo4j.  
   * L'**exploration massive parallèle** par des essaims d'agents proposant dynamiquement des décompositions et des chemins.  
   * La **mise à jour bayésienne globale** des probabilités de tous les chemins après chaque action.  
   * La sélection d'actions par **"Point de Levier"** maximisant un gain d'information défini sur l'ensemble du graphe de potentiel.  
4. **Recommandation Stratégique pour AutoAgent V1 :**  
   * Adopter une **architecture évolutive**, commençant par une version pragmatique (V1) qui implémente les aspects les plus matures.  
   * **V1 devrait se concentrer sur :**  
     * Un KG Neo4j pour les faits, les décompositions de tâches prédéfinies (méthodes HTN simplifiées) et les états actuels.  
     * Un planificateur HTN-like (potentiellement SHOP2 3 appelé comme service externe) pour générer des plans de tâches structurés à partir de méthodes définies.  
     * Une gestion simple de l'incertitude (ex: estimations de risques/coûts sur les tâches, quelques chemins alternatifs explicites).  
     * L'exécution fiable des tâches via Temporal.  
     * Des agents logiciels avec des rôles plus définis et moins d'autonomie exploratoire que dans la vision QPM complète.  
   * **Feuille de Route R\&D :** Parallèlement, engager des travaux de R\&D ciblés sur les briques risquées, notamment :  
     * Techniques d'approximation et de modélisation pour la représentation probabiliste dans Neo4j.  
     * Algorithmes d'exploration (ex: MCTS adapté) pour un nombre limité d'alternatives ou pour l'optimisation locale.  
     * Mécanismes de mise à jour probabiliste localisée et efficiente.

Cette approche permettra à AutoAgent de fournir de la valeur de manière incrémentale tout en construisant les fondations et l'expertise nécessaires pour se rapprocher progressivement de la vision QPM.

## **2\. Analyse du Pilier 1 : Planification sous Incertitude et Décomposition Dynamique**

Le modèle QPM s'appuie de manière critique sur une capacité à décomposer dynamiquement et de façon probabiliste les tâches. Cette exigence se rapproche conceptuellement de la planification hiérarchique (HTN) et de la planification sous incertitude, notamment via les Processus Décisionnels de Markov Partiellement Observables (POMDPs). Cette section évalue la pertinence et la maturité des algorithmes et frameworks associés.

### **Introduction aux Besoins de Planification de QPM**

Le QPM postule une gestion de projet où le système ne suit pas un plan unique et rigide, mais explore un "graphe de potentiel" représentant une multitude de futurs possibles (chemins d'exécution). La décomposition des tâches doit être dynamique, c'est-à-dire s'adapter à l'évolution du contexte et aux nouvelles informations, et probabiliste, chaque chemin étant évalué en termes de coût, risque, valeur et probabilité de succès.

### **Hierarchical Task Networks (HTN) pour la Décomposition des Tâches**

**Concept et Pertinence :** Les HTN offrent un paradigme de planification où les tâches complexes sont décomposées en sous-tâches plus simples, de manière hiérarchique, jusqu'à atteindre des actions primitives exécutables.12 Cette approche est naturellement alignée avec la structuration de projets complexes et la décomposition de missions en étapes gérables, un aspect central du QPM. Les HTN permettent d'encoder des connaissances expertes sous forme de "méthodes", qui spécifient comment une tâche abstraite peut être raffinée en un ensemble de sous-tâches.13 Cette capacité à structurer la connaissance du domaine est un atout.

**Maturité et Outils :** La planification HTN est un domaine de recherche relativement mature avec des systèmes bien établis. SHOP2 (Simple Hierarchical Ordered Planner 2\) est un exemple notable, reconnu pour ses performances et sa flexibilité.3 SHOP2 planifie en suivant l'ordre d'exécution des tâches, ce qui lui permet de connaître l'état courant à chaque étape de la planification. Il supporte des tâches partiellement ordonnées, l'inférence axiomatique pour déduire des faits non explicites, et des appels à des fonctions externes, par exemple pour des évaluations numériques (coûts, durées).3 Ces fonctionnalités sont pertinentes pour les besoins d'évaluation du QPM.

**Intégration Open Source et Go :** SHOP2 est disponible en open-source, implémenté en Common Lisp.3 Pour une intégration dans l'écosystème AutoAgent (backend Go), SHOP2 serait vraisemblablement utilisé comme un service externe. Le backend Go invoquerait le planificateur SHOP2 via une interface en ligne de commande (utilisant le package os/exec de Go 15) et parserait ensuite le plan résultant (généralement une séquence d'actions) pour l'intégrer dans le KG d'AutoAgent et le moteur d'exécution Temporal. Des recherches plus récentes explorent de nouvelles heuristiques pour la planification HTN optimale 4, mais les bibliothèques HTN matures et largement adoptées, en dehors de la lignée SHOP/SHOP2, sont moins courantes.

Un défi majeur se présente lorsque l'on considère le Principe 2 du QPM : "Exploration Massive" par des "essaims d'agents" qui explorent et *proposent* des décompositions de tâches. Les HTN traditionnels, y compris SHOP2, opèrent sur un ensemble de méthodes prédéfinies qui encapsulent la connaissance du domaine.13 Si les agents QPM proposent dynamiquement des décompositions, ils génèrent de facto de nouvelles méthodes HTN ou des fragments de méthodes à la volée. Les planificateurs HTN standards ne sont pas conçus pour cette génération dynamique de méthodes par des agents autonomes. Cela soulève des questions fondamentales : comment ces méthodes proposées sont-elles validées, intégrées au modèle de planification global et utilisées par le planificateur HTN central? Chaque agent exécute-t-il son propre mini-planificateur, ou contribuent-ils à un modèle HTN partagé et évolutif? Cette divergence indique un besoin significatif en R\&D pour développer ou adapter des frameworks HTN capables de gérer des règles de décomposition générées dynamiquement par de multiples agents. Des inspirations pourraient être tirées de l'Apprentissage par Démonstration (LfD) appliqué aux HTN 14, mais dans un contexte multi-agent et en ligne, ce qui complexifie considérablement le problème. La maturité pour un tel composant "HTN avec génération dynamique de méthodes pour QPM" serait donc significativement plus basse (TRL 2-3) que pour l'utilisation standard d'HTN (TRL 6-7).

### **Processus Décisionnels de Markov Partiellement Observables (POMDPs) pour la Planification Probabiliste**

**Concept et Pertinence :** Les POMDPs constituent le cadre mathématique formel pour la prise de décision séquentielle sous incertitude lorsque l'état du système n'est que partiellement observable.17 L'agent maintient une "distribution de croyance" (belief state) sur les états possibles du monde et choisit des actions pour maximiser une récompense attendue sur un horizon potentiellement infini.19 Ceci correspond étroitement aux principes du QPM d'évaluation probabiliste des chemins et de mise à jour bayésienne de l'état du projet en fonction des observations.

Maturité et Outils : Bien que théoriquement très puissants, la résolution de POMDPs est notoirement difficile sur le plan computationnel. Le problème est PSPACE-complet pour des horizons finis et peut être indécidable pour des horizons infinis, même sans représentations factorisées.19 L'espace des croyances est continu, et la fonction de valeur, qui associe une valeur à chaque état de croyance, peut devenir extrêmement complexe à représenter et à calculer.7  
Des avancées significatives ont été réalisées avec les solveurs basés sur l'itération de la valeur par points (Point-Based Value Iteration \- PBVI).22 Ces approches approximent la fonction de valeur sur un ensemble fini de points de croyance, ce qui a permis de traiter des problèmes avec des milliers d'états, là où les méthodes exactes étaient limitées à quelques dizaines d'états.22 Néanmoins, même "plusieurs milliers d'états" peuvent s'avérer insuffisants pour l'espace d'états potentiellement gigantesque induit par le "graphe de potentiel" du QPM. Les POMDPs à long horizon (par exemple, plus de 15 étapes de décision) restent un défi.23  
**Intégration Open Source et Go :** Des bibliothèques open-source pour les POMDPs existent, notamment pomdp-py (écrite en Python/Cython) 5 et POMDPs.jl (écrite en Julia).6 pomdp-py vise à fournir des interfaces intuitives et à encourager une communauté de développeurs. POMDPs.jl tire parti des performances du langage Julia et offre un framework pour spécifier et résoudre des MDPs et POMDPs. L'intégration de ces bibliothèques dans un backend Go se ferait probablement en les exposant comme des services externes, invoqués par Go, qui recevrait en retour des politiques ou des valeurs d'actions.

Explosion Combinatoire et Application au QPM : La principale limitation des POMDPs reste l'explosion combinatoire.7 Comme le souligne une analyse 7, "l'explosion combinatoire des composantes linéaires dans la fonction de valeur est la raison majeure pour laquelle les POMDPs sont impraticables pour la plupart des applications". Cette mise en garde est particulièrement pertinente pour le QPM.  
L'ambition du QPM de gérer "tous les futurs possibles" et d'effectuer une évaluation probabiliste sur cet ensemble suggère un espace d'états et de croyances d'une taille immense. Appliquer un modèle POMDP complet à l'intégralité du "graphe de potentiel" du QPM pour un projet de complexité réaliste est donc vraisemblablement infaisable sur le plan computationnel. Une stratégie d'atténuation consisterait à utiliser les POMDPs de manière plus ciblée : pour modéliser et résoudre des sous-problèmes spécifiques présentant une forte incertitude et une observabilité partielle (par exemple, la décision optimale pour une tâche critique particulière) plutôt que pour la planification globale du projet. Alternativement, des modèles POMDP très abstraits pourraient être envisagés, mais au prix d'une perte de fidélité. Cela implique que le QPM devra probablement s'appuyer sur des approximations de son raisonnement probabiliste idéal, en utilisant les principes des POMDPs mais avec des abstractions significatives ou des solveurs heuristiques. La maturité pour une "planification POMDP globale pour QPM" est très faible (TRL 1-2), tandis que pour des "POMDPs localisés" elle pourrait atteindre TRL 3-4, en fonction de l'échelle des sous-problèmes.

### **Planning Domain Definition Language (PDDL) comme Langage Commun**

**Concept et Pertinence :** PDDL est un langage standardisé pour décrire les problèmes de planification en IA, facilitant la comparabilité et la réutilisation des recherches et des planificateurs.26 Il sépare la description du domaine (éléments communs à tous les problèmes du domaine) de la description du problème spécifique (état initial, buts). Des extensions comme PDDL2.1 ont introduit la gestion du temps et des ressources numériques via les actions duratives et les fluents numériques 27, et PDDL2.2 a ajouté les "Timed Initial Literals" (TILs) pour modéliser des faits qui deviennent vrais à des moments spécifiques, indépendamment des actions du planificateur.28

**Maturité et Outils :** PDDL est largement utilisé dans la communauté de la planification, notamment pour les Compétitions Internationales de Planification (IPC). De nombreux planificateurs PDDL existent, souvent disponibles sous forme d'exécutables en ligne de commande, ce qui permettrait leur intégration avec un backend Go.8 Des outils de support, comme des extensions pour VS Code 29 et des parseurs Python 9, sont également disponibles. Il n'a pas été identifié de planificateurs PDDL natifs Go matures et largement adoptés.

**Applicabilité au QPM :** PDDL pourrait servir de langage d'interfaçage pour définir les actions primitives au sein des méthodes HTN ou pour communiquer avec des planificateurs externes. Cependant, PDDL standard manque de mécanismes natifs pour le raisonnement probabiliste riche et la gestion des états de croyance qui sont au cœur du QPM. Une extension, PPDDL (Probabilistic PDDL) 19, existe pour modéliser les effets probabilistes des actions et les sémantiques MDP, mais elle est moins universellement supportée par les planificateurs prêts à l'emploi que PDDL classique.

### **Replanification Dynamique et Gestion des Nouvelles Informations**

**Défi :** Le Principe 5 du QPM ("Mise à Jour Bayésienne") stipule que "le résultat de chaque action est un fait qui met à jour les probabilités de tous les chemins, élaguant les futurs impossibles". Cela implique une replanification ou une adaptation continue du "plan" (ou plutôt de l'évaluation des potentiels) à mesure que de nouvelles informations sont acquises.

**Approches :**

* **Replanification HTN :** Des recherches ont porté sur l'intégration de la génération de plans HTN, de leur exécution et de leur réparation (par exemple, le système HOTRiDE 30). Des approches utilisant MCTS pour sélectionner la méthode optimale pour une tâche composée HTN, couplées à un monitoring du plan pour détecter les anomalies et déclencher la replanification, ont été proposées.30  
* **Réparation de Plan vs. Replanification à partir de Zéro :** La réparation de plan vise à modifier minimalement un plan existant pour l'adapter à un nouveau contexte. Cette approche peut être plus rapide que de replanifier intégralement et peut conduire à des plans plus stables, c'est-à-dire plus similaires au plan original.31 La stabilité est une propriété désirable, notamment pour la prévisibilité et la coordination. Des travaux récents sur la "plan commitment" (engagement de plan) 32 explorent la réparation de plan en minimisant l'impact négatif sur les autres agents ou les ressources partagées, ce qui pourrait être pertinent pour l'évaluation des chemins par QPM, sensible aux ressources.  
* **PDDL en Environnements Dynamiques :** Des planificateurs PDDL peuvent être utilisés dans des environnements dynamiques, surtout si les changements exogènes sont déterministes ou peuvent être anticipés.8 Les TILs de PDDL 2.2 28 permettent de modéliser des changements dans le monde qui ne sont pas le résultat des actions du planificateur.

Un aspect crucial du QPM est le coût computationnel de sa mise à jour bayésienne. Le Principe 5 implique une mise à jour des probabilités de *tous* les chemins dans le "graphe de potentiel" après *chaque* action. Si ce graphe est aussi vaste que le suggère la notion de "tous les futurs possibles", cette étape de mise à jour globale pourrait représenter un goulot d'étranglement majeur, potentiellement plus coûteux que la génération initiale d'un plan ou d'une stratégie. Le nombre de chemins peut croître de manière exponentielle (ou pire) avec la complexité du projet. La propagation de l'impact de nouvelles informations (résultat d'une action) à travers une telle structure est une tâche formidable. Cela suggère un besoin impérieux de mécanismes de propagation de croyance extrêmement efficaces, ou d'approximations substantielles, telles que la focalisation des mises à jour sur les chemins les plus probables, l'utilisation de techniques d'échantillonnage, ou des mises à jour paresseuses. La maturité technologique pour ce mécanisme spécifique de mise à jour bayésienne globale, tel que décrit pour QPM, est faible (TRL 2-3) en raison de ces préoccupations fondamentales de scalabilité.

## **3\. Analyse du Pilier 2 : Exploration de l'Espace des Plans et Sélection d'Actions**

Le modèle QPM envisage une exploration d'un "arbre des futurs possibles" et une sélection d'actions qui maximisent le gain d'information ou font progresser les chemins les plus probables. Cette approche est explicitement comparée à la Recherche d'Arbre Monte-Carlo (MCTS). Cette section examine MCTS et d'autres algorithmes de recherche pertinents.

### **Introduction aux Besoins d'Exploration de QPM**

Le Principe 4 du QPM ("Exécution par Point de Levier") est central ici. Il ne s'agit pas d'exécuter un plan prédéfini, mais de choisir l'action qui, à un instant donné, offre le meilleur potentiel pour réduire l'incertitude globale du projet ou pour faire avancer de manière significative les scénarios les plus prometteurs. Cela nécessite une exploration continue de l'espace des plans potentiels et une évaluation de l'impact informationnel des actions.

### **Monte Carlo Tree Search (MCTS)**

**Concept et Pertinence :** MCTS est un algorithme de recherche heuristique particulièrement adapté aux grands espaces de décision, popularisé par ses succès dans les jeux comme Go.33 Il construit itérativement un arbre de recherche en utilisant des simulations aléatoires (playouts) pour estimer la valeur des actions. Ses quatre étapes caractéristiques – sélection, expansion, simulation et rétropropagation (backpropagation) – permettent d'équilibrer l'exploration de nouvelles options et l'exploitation des options connues comme étant prometteuses.33 Cette capacité à naviguer dans de vastes espaces et à s'adapter dynamiquement en fonction des résultats des simulations en fait un candidat solide pour l'exploration du "graphe de potentiel" du QPM.

Applications au-delà des Jeux (Focus Post-2020) :  
L'adaptabilité de MCTS a conduit à son application dans divers domaines au-delà des jeux :

* **Robotique :** MCTS est utilisé pour la planification de mouvement, la navigation en environnement incertain ou partiellement observable, et l'allocation de tâches multi-robots.33 Une thèse de 2023 36 souligne l'utilisation de MCTS pour la robotique autonome, souvent couplé à des réseaux de neurones (Apprentissage par Renforcement Profond), et propose "Monte-Carlo Path Planning (MCPP)" pour la planification de trajectoire de robots dans des contextes POMDP. Une publication de 2024 30 décrit l'utilisation de MCTS pour la sélection de méthodes optimales dans la planification HTN, avec un monitoring pour déclencher la replanification.  
* **Autres Domaines Complexes :** Des applications ont été explorées dans l'optimisation de parcours d'apprentissage personnalisés, en biotechnologie pour l'optimisation de voies de synthèse de médicaments, et dans l'optimisation du parcours client en marketing.35 Ces exemples démontrent la capacité de MCTS à gérer des problèmes séquentiels avec des contraintes de ressources et des objectifs à long terme.

**Maturité :** MCTS est une technique bien établie et comprise dans le domaine des jeux (TRL 7-9 pour ces applications). Son application à la planification générale, à la robotique et à d'autres systèmes complexes est un domaine de recherche actif mais qui a déjà produit des déploiements réussis et des résultats significatifs. Pour des adaptations spécifiques à des problèmes comme ceux du QPM, la maturité se situerait entre TRL 4 et TRL 6, en fonction de la complexité de l'adaptation requise.

### **Recherche sur Graphes ET/OU (AND/OR Graph Search)**

**Concept et Pertinence :** Les graphes ET/OU sont une structure de données utile pour représenter des problèmes qui peuvent être décomposés en sous-problèmes, où certains sous-problèmes représentent des alternatives (nœuds OU) et d'autres doivent tous être résolus (nœuds ET).38 Cela correspond bien à la nature de la décomposition des tâches en planification, où une tâche peut avoir plusieurs méthodes de décomposition (OU), et une méthode peut se décomposer en plusieurs sous-tâches qui doivent toutes être accomplies (ET). AO\* est un algorithme de recherche heuristique conçu pour trouver des plans de solution dans de tels graphes.34

**Applicabilité au QPM :** Le "graphe de potentiel" du QPM pourrait être conceptualisé comme un vaste graphe ET/OU. Les tâches se décomposent en sous-tâches (nœuds ET si toutes les sous-tâches sont nécessaires, ou nœuds OU s'il existe des manières alternatives d'accomplir la tâche mère). Un algorithme comme AO\* pourrait alors être utilisé pour rechercher un "graphe solution", c'est-à-dire un plan conditionnel garantissant l'atteinte du but. L'algorithme AO\* est décrit comme étant plus adaptatif aux environnements dynamiques et particulièrement utile dans des scénarios où les conditions sont incertaines ou en constante évolution 40, ce qui correspond aux besoins du QPM.

**Maturité :** Il s'agit d'une technique classique de recherche en IA. Bien que fondamentale, elle est moins mise en avant dans la littérature récente sur les systèmes "agentiques" par rapport à MCTS ou à l'apprentissage par renforcement. Néanmoins, les algorithmes de base sont bien compris. La maturité des algorithmes fondamentaux se situe autour de TRL 4-5.

### **Algorithmes d'Optimisation Basés sur le Gain d'Information**

**Concept et Pertinence :** Le concept de "Point de Levier" du QPM met l'accent sur la maximisation du gain d'information. Cela implique de sélectionner des actions qui réduisent au mieux l'incertitude sur l'état du monde ou sur les probabilités de succès des chemins potentiels. Le gain d'information, souvent dérivé de l'entropie en théorie de l'information, quantifie la réduction de l'incertitude.41 Il est fondamental dans l'apprentissage des arbres de décision pour la sélection des attributs les plus discriminants. Dans le contexte de la planification, le gain d'information peut guider l'exploration vers des actions qui révèlent le plus d'informations pertinentes sur l'environnement ou sur la faisabilité de la tâche. Des approches de planification information-théorique existent, par exemple, pour guider des robots dans des tâches de cartographie ou pour la conception séquentielle d'expériences, en maximisant des mesures comme l'information mutuelle (MI) ou l'Information Mutuelle Quadratique de Cauchy-Schwarz (CSQMI).44

**Applicabilité au QPM :** Cette approche est directement alignée avec le Principe 4 du QPM. Le principal défi réside dans la définition et le calcul efficace du gain d'information pour des tâches et des chemins de projet complexes. Il faut déterminer quelle information est la plus précieuse à acquérir à un moment donné pour élaguer l'arbre des futurs ou pour confirmer la viabilité des chemins les plus prometteurs.

**Maturité :** Les concepts théoriques de la théorie de l'information sont très matures (TRL 9). Leur application comme moteur principal de décision dans des agents de planification à usage général est davantage un sujet de recherche active (TRL 3-5).

### **Intégration des Algorithmes de Recherche avec un Knowledge Graph (Neo4j)**

**Défi :** Neo4j est conçu pour stocker et interroger des faits et des relations explicites. Les algorithmes de recherche comme MCTS ou AO\* explorent un espace d'états et d'actions, qui est de nature dynamique. Le KG doit fournir la structure (actions possibles, transitions d'états, préconditions, effets) pour cette exploration.

Approches et Faisabilité :  
Le KG peut représenter l'état connu actuel du projet, les décompositions de tâches possibles (par exemple, sous forme de méthodes HTN stockées), et les résultats connus ou probabilistes des actions. Les algorithmes de recherche interrogeraient Neo4j pour obtenir les états successeurs possibles, les actions applicables et leurs effets (potentiellement probabilistes). Les nœuds d'un arbre MCTS pourraient correspondre à des états (ou des distributions de croyance sur les états) dérivés des informations contenues dans le KG.  
Une publication très récente (soumission à COLING 2025\) décrit le framework "Reasoning with Trees (RwT)" qui intègre des Grands Modèles de Langage (LLM) avec des KGs en utilisant MCTS pour la réponse à des questions sur des graphes de connaissances (KGQA).43 RwT reformule KGQA comme un problème de prise de décision discret. Le LLM sert d'heuristique pour guider MCTS, et MCTS raffine les chemins de raisonnement sur le KG. Cet exemple, bien que portant sur KGQA, est hautement pertinent car il démontre une intégration fonctionnelle de MCTS avec un KG pour une tâche de raisonnement complexe.  
L'utilisation d'un KG comme Neo4j dans ce contexte soulève une question importante : le KG est-il un simple entrepôt de données statiques, ou joue-t-il un rôle plus dynamique dans la définition du processus de recherche? Pour QPM, qui doit explorer un "arbre des futurs possibles", Neo4j pourrait stocker non seulement l'état actuel du projet, mais aussi les *règles* du domaine du projet (comment les tâches peuvent être décomposées, quelles actions sont possibles, leurs résultats probabilistes). L'algorithme de recherche (MCTS, AO\*) "exécuterait" ou "simulerait" alors ces règles en interrogeant le KG. Par exemple, à partir d'un état S, l'algorithme demanderait à Neo4j : "Quelles actions sont applicables?". Neo4j retournerait les définitions d'actions. L'algorithme simulerait une action, interrogerait à nouveau Neo4j pour connaître les effets, mettrait à jour sa représentation interne de l'état suivant (ou de l'état de croyance), et continuerait. Dans ce scénario, Neo4j n'est pas seulement un magasin passif, mais un composant actif qui définit la dynamique de transition d'état pour la recherche. La performance des requêtes Cypher adressées au KG devient alors un facteur critique pour la vitesse globale de l'algorithme de recherche. Utiliser Neo4j dans ce rôle de "modèle actif" pour une recherche complexe est une approche avancée. La maturité pour ce type spécifique d'intégration se situe autour de TRL 3-4. Les travaux comme RwT 43 suggèrent que la maturité de l'intégration MCTS+KG progresse pour des tâches spécifiques.

**Intégration Go :** Le backend Go d'AutoAgent hébergerait l'algorithme de recherche. Il utiliserait le driver Go officiel de Neo4j 47 pour interagir avec le KG. La performance des requêtes graphiques et la manière dont les données du graphe sont transformées en structures utilisables par l'algorithme de recherche seront des aspects cruciaux de l'implémentation.

## **4\. Analyse du Pilier 3 : Représentation des Connaissances pour un État Probabiliste**

Le modèle QPM exige un Graphe de Connaissances (KG) capable de représenter non seulement des faits établis, mais aussi des hypothèses, des chemins d'exécution potentiels et leurs probabilités associées. Ce "Graphe de Potentiel" est fondamental pour l'exploration et l'évaluation probabiliste des futurs.

### **Introduction aux Besoins de Représentation des Connaissances de QPM**

Le KG du QPM doit être dynamique et probabiliste. Il doit pouvoir encoder l'incertitude inhérente à la gestion de projet (durées de tâches, succès des actions, disponibilité des ressources) et permettre une mise à jour de ces probabilités à mesure que le projet avance et que de nouvelles informations sont acquises (Principe 5 : Mise à Jour Bayésienne).

### **Approches Établies pour la Représentation de l'Incertitude dans les Bases de Données Graphe**

Plusieurs approches existent pour modéliser l'incertitude et les informations probabilistes dans des contextes graphiques :

* **Modèles Graphiques Probabilistes (PGM) et Réseaux Bayésiens (BN) :** Ce sont les outils standards pour représenter les relations probabilistes entre variables.11 Un KG peut être étendu pour modéliser un réseau bayésien en considérant les nœuds du graphe comme des variables aléatoires et les arêtes comme des dépendances conditionnelles, auxquelles sont associées des distributions de probabilité.11  
* **Ontologies Probabilistes :** Des ontologies personnalisées peuvent être conçues pour décrire explicitement les éléments probabilistes (variables aléatoires, dépendances, distributions de probabilité) et être superposées à un KG existant. Une étude 11 présente une technique où le réseau bayésien est modélisé comme une couche *au sein même* du KG, ce qui est pertinent pour l'objectif du QPM d'avoir un KG probabiliste intégré.  
* **Plongements de Graphes de Connaissances Probabilistes (Probabilistic Knowledge Graph Embeddings) :** Cette ligne de recherche explore la représentation de l'incertitude directement dans les plongements vectoriels des entités et relations du KG. Cela permet, par exemple, d'obtenir des distributions a posteriori sur les vecteurs de plongement, ce qui peut être utile pour estimer l'incertitude des prédictions de liens.51 Cette approche est cependant plus axée sur l'incertitude structurelle du graphe que sur la modélisation explicite des probabilités de chemins d'exécution.  
* **Modèles Logiques Probabilistes (ex: Markov Logic Networks \- MLNs) :** Ces modèles combinent la puissance expressive de la logique du premier ordre avec la sémantique probabiliste des modèles graphiques. Ils permettent de définir des règles logiques pondérées. L'inférence dans les MLNs peut être computationnellement exigeante.

### **Extension/Modélisation de Neo4j pour une Représentation Probabiliste (Faits vs. Potentiels)**

**Capacités Standards de Neo4j :** Neo4j est une base de données orientée graphe de propriétés, excellant dans la représentation et l'interrogation de relations explicites et factuelles.10 Il ne supporte pas nativement les types de données probabilistes, les distributions de probabilité comme propriétés, ni les opérations d'inférence probabiliste complexes.

Stratégies de Modélisation pour QPM dans Neo4j :  
Pour représenter l'aspect probabiliste du QPM dans Neo4j, plusieurs stratégies de modélisation peuvent être envisagées :

1. **Probabilités comme Propriétés :** La solution la plus simple consiste à stocker les probabilités (ex: probabilité de succès d'une tâche, probabilité d'un effet d'action particulier) comme des propriétés numériques sur les nœuds ou les relations. Les requêtes Cypher devraient alors explicitement manipuler ces propriétés pour calculer, par exemple, la probabilité d'un chemin comme le produit des probabilités des arêtes qui le composent.  
2. **Types de Nœuds/Relations Distincts :** Utiliser des labels différents pour distinguer les "faits" (ex: :FactTask, :ExecutedAction) des "potentiels" (ex: :PotentialTask, :HypotheticalAction). Les éléments potentiels porteraient des propriétés de probabilité. Cela permettrait de séparer clairement le certain de l'incertain dans le modèle.  
3. **Approche par Couches (inspirée de** 11**) :** Maintenir un graphe factuel "propre" et performant. Superposer les informations probabilistes, soit en liant les nœuds factuels à des nœuds spécifiques représentant des "distributions de probabilité", soit en ayant une structure de graphe distincte pour les potentiels qui référence le graphe factuel.  
4. **Objets "Chemin" :** Représenter des chemins d'exécution potentiels entiers comme des nœuds eux-mêmes, avec des propriétés pour leur probabilité globale, coût, risque, et valeur. Cette approche risque de devenir rapidement ingérable si l'on tente de matérialiser "tous" les chemins possibles.

**Considérations de Performance :**

* L'interrogation des faits établis doit rester rapide. Les requêtes probabilistes complexes (ex: "trouver les M chemins les plus probables vers le but G") pourraient être lentes si elles nécessitent des traversées extensives et des calculs à la volée sur un grand nombre de chemins potentiels.  
* L'indexation des propriétés utilisées pour stocker les probabilités sera cruciale.  
* La taille même d'un "graphe de potentiel" qui matérialiserait tous les futurs possibles dans Neo4j est une préoccupation majeure. Le Principe 1 du QPM, "Le KG représente tous les futurs possibles", s'il est pris littéralement comme une exigence de matérialisation explicite de chaque chemin, conduirait à une explosion combinatoire. Pour tout projet non trivial, le nombre de chemins d'exécution possibles est astronomique. Stocker chacun de ces chemins explicitement sous forme de nœuds et de relations dans Neo4j dépasserait rapidement les limites de stockage et de performance. Il est plus réaliste de concevoir le "graphe de potentiel" non pas comme une énumération statique de tous les futurs, mais comme une représentation compacte des *règles du domaine et des faits actuels* à partir desquels les futurs potentiels peuvent être *générés ou explorés* par un algorithme (comme discuté dans la section sur le Pilier 2). Dans cette optique, Neo4j stockerait les éléments de base des plans (tâches, actions, règles de décomposition, résultats probabilistes). Le "graphe de potentiel" serait alors implicitement défini par ces règles. Les algorithmes d'exploration (Pilier 2\) parcourraient ce graphe implicite, ne matérialisant les chemins que durant leur processus de recherche, sans nécessairement persister chaque chemin exploré dans Neo4j, à moins qu'il ne fasse partie d'une solution prometteuse ou qu'il doive être mémorisé pour des mises à jour bayésiennes. Ainsi, le KG contiendrait le "potentiel" en définissant le processus génératif des futurs, et non en les énumérant tous. La maturité d'une modélisation pour une exploration à la demande est plus élevée (TRL 4-5) que celle d'une matérialisation exhaustive de tous les futurs (TRL 1-2).

### **Systèmes de KG Alternatifs Nativement Conçus pour le Raisonnement Incertain**

Bien qu'il existe de nombreuses bases de données graphe alternatives à Neo4j (telles que ArangoDB, Dgraph, OrientDB, JanusGraph, TigerGraph 52), peu d'entre elles sont nativement conçues dès le départ pour un raisonnement probabiliste complexe de la même manière qu'un solveur PGM dédié ou un moteur de logique probabiliste. Cayley, par exemple, est écrit en Go et inspiré par le Knowledge Graph de Google, supportant RDF.53 Dgraph est une base de données graphe distribuée. Ces alternatives ne résolvent pas intrinsèquement le défi de la représentation probabiliste de manière plus directe que Neo4j sans une modélisation personnalisée et des couches de raisonnement supplémentaires.

Cela met en lumière une dichotomie entre le rôle de "base de données" et celui de "moteur de raisonnement". Le QPM nécessite les deux : un entrepôt persistant pour les connaissances du projet (faits, hypothèses actuelles les plus probables) ET une capacité de raisonnement probabiliste puissante. Il est peu probable qu'un unique système "KG probabiliste" commercial ou open-source excelle dans les deux à l'échelle envisagée par QPM. Neo4j peut servir d'entrepôt de connaissances, mais le traitement probabiliste intensif (évaluations de nombreux chemins, mises à jour bayésiennes complexes) pourrait devoir être effectué dans une couche de calcul séparée, implémentée en Go, qui utiliserait des bibliothèques spécialisées ou même des raisonneurs probabilistes externes. Ces composants externes opéreraient sur des données extraites de Neo4j. Dans cette vision, le "KG" n'est pas seulement la base de données, mais la base de données *plus* les mécanismes de raisonnement qui opèrent sur elle. La maturité de Neo4j en tant que magasin passif est élevée (TRL 7-9). Sa maturité en tant que raisonneur probabiliste actif à grande échelle est faible (TRL 2-3). L'approche hybride est donc plus pragmatique.

## **5\. Synthèse Architecturale et Conclusion**

Cette section vise à lier les analyses des trois piliers précédents pour évaluer la faisabilité globale de la construction d'un système basé sur le modèle QPM et proposer une esquisse architecturale pragmatique pour une première version d'AutoAgent.

### **Architectures de Systèmes d'Agents Autonomes Documentées Intégrant les Piliers du QPM**

La littérature sur les agents autonomes décrit diverses architectures, mais trouver un système existant qui intègre explicitement et de manière mature les trois piliers du QPM – planification dynamique et probabiliste (HTN/POMDP), exploration de type MCTS pour le gain d'information sur un graphe global de plans, et un KG probabiliste gérant "tous les futurs" avec mises à jour bayésiennes globales – est hautement improbable. Chacun de ces piliers, poussé à l'échelle et à la complexité envisagées par QPM, représente une frontière de recherche.

Les architectures d'agents classiques incluent :

* **Architectures à Couches :** Des systèmes comme INTERRAP 54 combinent des couches réactives (pour les réponses rapides à l'environnement) et délibératives (pour la planification à long terme), souvent avec une couche de coopération pour l'interaction multi-agents. C'est un schéma courant.  
* **Architectures Cognitives :** Des architectures comme Sigma 55 ou celles discutées lors de tutoriels à AAMAS 56 visent à modéliser de manière intégrée le comportement intelligent, couvrant la perception, la mémoire, le raisonnement, l'apprentissage et parfois les aspects sociaux et affectifs. Ce sont souvent des plateformes de recherche avancées.  
* **Architectures Basées sur la Logique :** L'architecture AAA (Autonomous Agent Architecture) 57 utilise Answer Set Prolog pour la représentation des connaissances et les composants de raisonnement (observation, interprétation, planification, récupération d'erreur) au sein d'une boucle Observe-Pense-Agis.  
* **Architectures Pragmatiques Simples :** Des modèles plus simples se concentrent sur les composants essentiels de mémoire, planification et action.58

Bien que ces architectures fournissent des cadres conceptuels, l'intégration spécifique des éléments avancés du QPM est ce qui le rend novateur. Des composants individuels existent : MCTS est utilisé en planification robotique, parfois dans des contextes POMDP 36 ; les HTN sont employés pour la décomposition de tâches par des agents 59 ; les KGs sont utilisés par les agents, et leurs extensions probabilistes sont un sujet de recherche.11 Le framework RwT 43, qui combine MCTS et KG pour le raisonnement, est un exemple récent de l'intégration de deux de ces piliers pour une tâche spécifique.  
Les systèmes multi-agents (SMA) basés sur les LLM émergent également 60, où les LLM agissent comme des orchestrateurs, intégrant la planification, la perception et l'action. Ces systèmes mettent l'accent sur la collaboration et la délégation de tâches. Bien qu'ils ne correspondent pas directement au noyau algorithmique spécifique du QPM, ils représentent une tendance vers des systèmes agentiques plus flexibles.  
Le modèle QPM, par sa combinaison et l'ampleur de ses ambitions (gestion de tous les futurs, mise à jour bayésienne sur tous les chemins, gain d'information sur le graphe global des plans), apparaît comme une composition originale de techniques avancées. L'effort principal de R\&D pour QPM ne réside pas seulement dans la maturation de composants individuels, mais surtout dans l'intégration synergique et la mise à l'échelle de ces composants pour qu'ils fonctionnent ensemble comme envisagé. La maturité d'un système QPM *entièrement intégré tel que décrit* est donc faible, se situant probablement autour de TRL 2-3.

### **Évaluation Globale de la Faisabilité (Échelle 1-5)**

Sur une échelle de 1 (purement théorique) à 5 (ingénierie mature), la faisabilité de construire aujourd'hui un système complet basé sur le modèle QPM se situe autour de **2 à 2.5**. Cela indique qu'une R\&D appliquée significative, voire des percées en recherche fondamentale sur certains aspects, sont nécessaires.

**Briques Technologiques les Plus Risquées (TRL Faible) :**

* **État Probabiliste Global et Mises à Jour Bayésiennes (Principes QPM 1 & 5\) :** La représentation et la mise à jour cohérente des probabilités à travers "tous les futurs possibles" dans un KG massif constituent le risque principal (TRL 1-3). Cela touche aux limites fondamentales de la scalabilité des POMDPs et des capacités des KGs actuels pour le raisonnement probabiliste dynamique à grande échelle.  
* **Exploration Parallèle Massive et Proposition par Essaims d'Agents (Principe QPM 2\) :** Coordonner des essaims d'agents pour explorer de manière significative et proposer des décompositions de tâches et des chemins d'exécution valides et cohérents à grande échelle, puis intégrer ces propositions dans un modèle probabiliste unifié, est extrêmement complexe (TRL 2-4). Cela implique des défis en coordination multi-agents, planification distribuée, et génération dynamique de méthodes pour des structures de type HTN.  
* **Exécution par "Point de Levier" Basée sur le Gain d'Information sur le Graphe Global des Plans (Principe QPM 4\) :** Définir et calculer efficacement un gain d'information significatif à travers un vaste graphe de futurs potentiels de projet pour identifier les "Points de Levier" optimaux est un défi de recherche majeur (TRL 2-4).

**Briques Technologiques les Plus Solides (TRL Élevé) :**

* **Décomposition Hiérarchique des Tâches (Conceptuellement) :** L'idée de décomposer les projets hiérarchiquement est bien établie. Les planificateurs HTN comme SHOP2 3 offrent un point de départ mature pour la décomposition *structurée* des tâches, même si QPM requiert une génération dynamique de ces structures (TRL 5-7 pour une utilisation standard des HTN).  
* **MCTS pour l'Exploration d'Arbres (Algorithme de Base) :** L'algorithme MCTS lui-même est bien compris et des bibliothèques existent. Son adaptation comme moteur d'exploration principal est faisable, bien que son application efficace à l'espace de problème spécifique de QPM nécessite de la R\&D (TRL 4-6 pour MCTS comme outil général).  
* **Graphe de Connaissances pour les Données Factuelles (Neo4j) :** Utiliser Neo4j pour stocker les faits du projet, les tâches définies, les ressources et les états *actuels* est une technologie mature 10 (TRL 7-9 pour cet usage de base).  
* **Backend Go et Temporal pour l'Exécution des Tâches :** Go est un langage mature pour les systèmes backend.15 Temporal est adapté à l'exécution fiable de tâches atomiques. Ce sont des choix d'ingénierie solides pour la plateforme AutoAgent elle-même (TRL 8-9).

### **Proposition d'Architecture Pragmatique pour une V1 d'AutoAgent (Évolutive vers QPM)**

L'objectif est de fournir de la valeur rapidement tout en créant une fondation pour les fonctionnalités plus avancées du QPM. Il convient de se concentrer sur ce qui est réalisable avec les technologies matures actuelles, tout en prévoyant des points d'extension pour la R\&D future.

**Principes Clés pour la V1 :**

* **Simplifier la Portée Probabiliste :** Au lieu de "tous les futurs", se concentrer sur un ensemble limité d'alternatives prometteuses ou sur un plan principal adaptable avec des bornes d'incertitude.  
* **Humain dans la Boucle :** Tirer parti de l'expertise humaine pour les décompositions complexes et les décisions stratégiques, les agents jouant un rôle d'assistance.  
* **Conception Modulaire :** Séparer clairement les composants de planification, d'exécution et de connaissance pour permettre une évolution indépendante.

**Esquisse d'Architecture V1 :**

1. **Graphe de Connaissances (Neo4j) :**  
   * Stocke des modèles de projet définis (similaires à des méthodes HTN, mais initialement plus simples et moins dynamiques).  
   * Suit l'état réel du projet, le statut des tâches, les affectations de ressources (faits).  
   * Peut stocker des chemins alternatifs *explicitement définis* ou des options avec des estimations de probabilité simples (par exemple, des risques définis par l'utilisateur).  
   * *Intégration Go :* Utilisation du driver Neo4j pour Go.47 Un OGM (Object-Graph Mapper) comme neo4j-go-ogm 63 pourrait être envisagé pour simplifier le mappage des données si ses performances sont adéquates pour les opérations graphiques complexes requises, en suivant les meilleures pratiques pour l'utilisation de Neo4j avec Go.48  
2. **Composant de Planification (Go) :**  
   * **Planificateur Initial :** Un planificateur de type HTN simplifié ou un moteur de workflow. Pourrait utiliser un sous-ensemble bien défini de PDDL pour la définition des actions si un planificateur PDDL externe est appelé (via os/exec 15).  
   * Décomposition des tâches basée sur des méthodes prédéfinies stockées dans Neo4j.  
   * Se concentre sur la génération d'un plan principal, avec éventuellement quelques alternatives explicites pour les tâches critiques.  
   * *Évolution Future :* Intégrer un planificateur HTN plus sophistiqué (ex: SHOP2 3 en tant que service). Introduire des POMDPs localisés pour les sous-tâches à forte incertitude.  
3. **Composant d'Exploration/Sélection d'Actions (Go) :**  
   * **V1 :** Des heuristiques plus simples pour la sélection d'actions. Si plusieurs chemins explicites sont planifiés, utiliser une analyse coût/bénéfice/risque simple.  
   * Pas d'exploration MCTS complète de "tous les futurs" initialement.  
   * *Évolution Future :* Introduire MCTS pour explorer les variations autour du plan actuel ou pour sélectionner entre quelques stratégies de haut niveau. Connecter MCTS à Neo4j pour les informations d'état, en s'inspirant de l'intégration MCTS+KG vue dans des travaux comme RwT.43  
4. **Moteur d'Exécution (Go \+ Temporal) :**  
   * Temporal gère l'exécution fiable des tâches primitives.  
   * Reçoit les tâches du composant de Planification/Sélection d'Actions.  
   * Rapporte les résultats des tâches (succès, échec, données produites) au système.  
5. **Couche Agent (Go) :**  
   * **V1 :** Les agents pourraient être plus spécialisés, exécutant des types spécifiques de tâches ou surveillant la progression. Moins d'"exploration massive" et plus d'"exécution dirigée et de collecte d'informations".  
   * *Évolution Future :* Développer les capacités des agents à proposer des modifications de plan ou de nouvelles décompositions de tâches (R\&D nécessaire, en lien avec la problématique de génération dynamique de méthodes HTN).  
6. **Couche Probabiliste et Mises à Jour Bayésiennes (Go) :**  
   * **V1 :** Rudimentaire. Les résultats des tâches mettent à jour de simples compteurs de succès/échec ou des indicateurs de risque dans Neo4j. Pas de mise à jour bayésienne globale à travers "tous les chemins".  
   * *Évolution Future :* Développer des modèles probabilistes plus sophistiqués pour les tâches clés incertaines. Implémenter des mises à jour bayésiennes localisées. Rechercher des approximations scalables pour une propagation de croyance plus large (R\&D nécessaire, en lien avec le défi du coût de la mise à jour bayésienne globale).

Chemin Évolutif :  
L'approche la plus viable consiste à adopter une architecture évolutive.66 Compte tenu de la nature hautement R\&D du QPM complet, une telle approche n'est pas seulement une bonne pratique, mais elle est essentielle pour la viabilité du projet AutoAgent. Il ne faut pas tenter de construire la vision complète du QPM en V1. Les recommandations d'Anthropic pour la construction d'agents LLM, qui partagent certaines caractéristiques avec la nature agentique du QPM, suggèrent également de commencer par des modèles simples et composables, et d'augmenter la complexité uniquement lorsque cela est nécessaire.68  
AutoAgent V1 devrait donc implémenter les aspects les plus matures et fondamentaux, fournissant une base stable. Les versions ultérieures pourront ensuite introduire de manière incrémentale davantage de fonctionnalités QPM, à mesure que la recherche progresse et que les technologies sous-jacentes mûrissent. Cela permet de dé-risquer le projet, d'obtenir des retours d'information plus tôt et de fournir de la valeur de manière progressive.  
Le cheminement pourrait être :

* Commencer avec un planificateur hiérarchique déterministe avec des alternatives limitées.  
* Ajouter progressivement des estimations probabilistes aux tâches et aux chemins.  
* Introduire MCTS pour explorer les variations locales du plan ou pour sélectionner des stratégies de haut niveau.  
* Étendre graduellement les capacités des agents à proposer des éléments de plan.  
* Rechercher et prototyper des mécanismes de représentation et de mise à jour d'état probabiliste scalables.

Cette stratégie d'évolution architecturale est la plus à même de concilier l'ambition du modèle QPM avec les réalités de l'ingénierie logicielle et de l'état actuel de la recherche en IA.

## **6\. Références**

* 14 arXiv:2503.01007v1 \- Task Decomposition, HTN, PDDL, POMDP.  
* 19 Müller, F., & Biundo, S. (2011). HTN-Style Planning in Relational POMDPs Using First-Order FSCs. Uni Ulm. \- POMDP, PPDDL, HTN.  
* 12 Wikipedia. Hierarchical task network. \- HTN Overview.  
* 13 GeeksforGeeks. Hierarchical Task Network (HTN) Planning in AI. \- HTN Overview, Applications.  
* 17 Hotaling, N., et al. (2024). pomdp: An R Package for Partially Observable Markov Decision Processes. *The R Journal*. \- POMDP Overview, Solvers.  
* 18 Taylor & Francis. POMDP. \- POMDP Overview.  
* 26 Wikipedia. Planning Domain Definition Language. \- PDDL Overview.  
* 27 Planning.wiki. What is PDDL? \- PDDL Versions, Features.  
* 4 Olz, C., Lodemann, A., & Bercher, P. (2024). A Heuristic for Optimal Total-Order HTN Planning Based on Integer Linear Programming. *ECAI 2024*. \- HTN Heuristics.  
* 3 Nau, D. S., Au, T. C., Ilghami, O., Kuter, U., Murdock, J. W., Wu, D., & Yaman, F. (2003). SHOP2: An HTN planning system. *Journal of Artificial Intelligence Research*. \- SHOP2 HTN Planner.  
* 5 Zheng, K., & Tellex, S. (2020). pomdp\_py: A Framework to Build and Solve POMDP Problems. *ICAPS 2020 Workshop on Planning and Robotics (PlanRob)*. \- pomdp-py Library.  
* 6 Egorov, M., Sunberg, Z. N., Balaban, E., Wheeler, T. A., Gupta, J. K., & Kochenderfer, M. J. (2017). POMDPs.jl: A Framework for Sequential Decision Making under Uncertainty. *Journal of Machine Learning Research*. \- POMDPs.jl Library.  
* 29 Visual Studio Marketplace. PDDL extension. \- PDDL Tools.  
* 9 Interactive Fiction Class. Planning and PDDL. \- PDDL Tutorial, Python Parser.  
* 30 ResearchGate. (Oct 2024). Planning, Monitoring and Replanning Techniques for Handling Abnormity in HTN-Based Planning and Execution. *Journal of Systems Engineering and Electronics*. \- HTN Replanning, MCTS.  
* 31 Fox, M., Gerevini, A., Long, D., & Serina, I. (2006). Plan Stability: Replanning versus Plan Repair. *ICAPS 2006*. \- Plan Repair vs Replanning.  
* 21 Burgard, W., Nebel, B., et al. POMDPs lecture slides. Uni Freiburg. \- POMDP Combinatorial Explosion.  
* 7 Nebel, B. Robotics II: POMDPs lecture slides. Uni Freiburg. \- POMDP Complexity, Combinatorial Explosion.  
* 8 Veiga, T. F., & Ventura, R. (2013). Path-finding in dynamic environments with PDDL-planners. *IEEE SSD*. \- PDDL Dynamic Replanning.  
* 28 Planning.wiki. PDDL 2.2. \- PDDL Timed Initial Literals.  
* 13 GeeksforGeeks. Hierarchical Task Network (HTN) Planning in AI. \- HTN Practical Overview..13  
* 69 Akman, V. CS5811: HTN Planning lecture slides. MTU. \- HTN Practical Overview.  
* 3 Nau, D. S., et al. (2003). SHOP2: An HTN planning system. *JAIR*. \- SHOP2 Details..3  
* 70 Nau, D. S. (2002). SHOP and SHOP2: HTN Planning Systems. *AAAI/IAAI 2002*. \- SHOP2 Overview.  
* 71 GeeksforGeeks. Hierarchical Task Networks (HTNs): Structure, Algorithms, and Applications in AI. \- HTN Applications.  
* 59 ResearchGate. Table: HTN Planners and their Applications. (from a paper on task planning knowledge graphs) \- HTN Applications in Complex Systems, Neo4j.  
* 20 GeeksforGeeks. Partially Observable Markov Decision Process (POMDP) in AI. \- POMDP Tutorial.  
* 5 pomdp-py Documentation. \- pomdp-py Library..5  
* 24 GitHub. JuliaPOMDP/FiniteHorizonPOMDPs.jl. \- POMDPs.jl Extension.  
* 25 JuliaPOMDP GitHub Pages. POMDPs.jl API Documentation. \- POMDPs.jl API.  
* 22 Pineau, J., Gordon, G., & Thrun, S. (2006). Point-based value iteration: An anytime algorithm for POMDPs. *IJCAI 2003*. (Actually 2003, but seminal for modern solvers) \- POMDP Solver Scalability..22 *Note: 22 is a review "Scalable POMDP Solvers: A Unifying View" by Shani, Pineau, Kaplow, 2013, which is appropriate.*  
* 23 arXiv:2411.07032v1 \- Long-horizon POMDPs, ROP-RAS3. (A very recent pre-print, good for state-of-the-art challenges).  
* 72 Segura-Muros, V., et al. (2024). Plan commitment: Replanning versus plan repair in multi-agent dynamic environments. *UPV RiuNet*. \- Plan Repair, Plan Commitment.  
* 32 Segura-Muros, V., et al. (2023). Plan commitment: Replanning versus plan repair. *Eng Appl Artif Intell*. \- Plan Commitment..72  
* 73 Anaplan. Integrated Financial Planning application. \- Example of complex planning system (commercial, not directly AI planning).  
* 74 YouTube. Idempotency in distributed systems. \- General software engineering principle, not directly planning.  
* 75 Enciris Technologies. Whitepaper: Integration of FFmpeg. \- FFmpeg as complex software.  
* 76 Shotstack.io. How to use FFmpeg. \- FFmpeg usage.  
* 77 Toggl.com. Website project plan. \- Example of a complex project.  
* 78 Quora. Examples of websites created from scratch. \- Example of a complex project.  
* 33 Fiveable. Monte Carlo Tree Search. \- MCTS Overview, Applications.  
* 35 Billparker.ai. (2025, Jan). Elements of Monte Carlo Tree Search. \- MCTS Applications beyond games.  
* 41 Number Analytics. (2025, Mar). Boost Accuracy with Information Gain. \- Information Gain.  
* 79 Number Analytics. (2025, Mar). Mastering Information Gain. \- Information Gain.  
* 38 CS StackExchange. Why is And-Or-Graph-Search called a search algorithm? \- AND/OR Graph Search.  
* 80 PuppyGraph Blog. (2025, Mar). Graph Search Algorithms: A Practical Overview. \- Graph Search Overview.  
* 43 Zhang, Y., et al. (2025). Reasoning with Trees: Faithful Question Answering over Knowledge Graph. *COLING 2025 (Preprint/Submission)*. \- MCTS with KG.  
* 46 ACL Anthology. Reasoning with Trees....43  
* 81 Lauer, J., et al. (2024). Lifted Planning: Recent Advances... *IJCAI 2024 Survey*. \- Heuristic Search, Lifted Planning.  
* 82 Yoon, S., Fern, A., & Givan, R. (2007). Using Learned Policies in Heuristic-Search Planning. *IJCAI 2007*. \- Heuristic Search, Learned Policies.  
* 36 Ott, J. (2023). Sample Efficient Monte Carlo Tree Search for Robotics. *PhD Thesis, TU Darmstadt*. \- MCTS in Robotics, POMDPs.  
* 37 ResearchGate. Monte Carlo Tree Search for Multi-Robot Task Allocation. \- MCTS in Robotics.  
* 41 Number Analytics. (2025, Mar). Boost Accuracy with Information Gain..41  
* 42 Activeloop AI. What is Information Gain. \- Information Gain.  
* 44 Zheng, E., et al. (2018). A Robust Approach to Sequential Information Theoretic Planning. *ICML 2018*. \- Information Theoretic Planning.  
* 45 Choudhury, S., et al. (2015). Information-Theoretic Planning with Trajectory Optimization for Dense 3D Mapping. *RSS 2015*. \- Information Theoretic Planning.  
* 83 Cornell University. Active Learning. \- Active Learning (pedagogy, not AI planning).  
* 84 Indiana University. Active Learning: Evidence-based Teaching. \- Active Learning (pedagogy).  
* 11 ResearchGate. (2023). Ontology Modeling for Probabilistic Knowledge Graphs. \- Probabilistic KG, Bayesian Networks in KG.  
* 51 Anonymous Authors. (2019). Probabilistic Knowledge Graph Embeddings. *ICLR 2019 Submission*. \- Probabilistic KG Embeddings.  
* 10 Neo4j Documentation. Tutorial: Create a graph data model. \- Neo4j Data Modeling.  
* 50 Neo4j Blog. (2024, Sep). Vectors and Graphs: Better Together. \- Neo4j, Probabilistic Models (historical context), GraphRAG.  
* 52 Gartner Peer Insights. (2025). Top Neo4j Graph Database Competitors & Alternatives. \- Neo4j Alternatives.  
* 39 Kute, T. AND-OR Graph and Wumpus World. MITU Skillologies. \- AND/OR Graphs.  
* 40 GeeksforGeeks. (2024, Oct). Difference Between A\* and AO\* Algorithm. \- AO\* Algorithm.  
* 53 GeeksforGeeks. (2025, Jan). Top 10 Open Source Graph Databases in 2025\. \- Graph DBs, Cayley (Go).  
* 47 Neo4j Go Driver Manual. Build applications with Neo4j and Go. \- Neo4j Go Driver.  
* 15 LabEx. How to Securely Execute External Commands in Go. \- Go os/exec.  
* 62 Yifan Online. How to execute external commands and programs in Golang? \- Go os/exec.  
* 85 LaunchNotes Glossary. Integration Architecture. \- Software Integration Architecture.  
* 86 LeanIX Wiki. Integration Architecture \- The Definitive Guide. \- Software Integration Architecture.  
* 57 Balduccini, M., & Gelfond, M. (2009). The AAA Architecture for Intelligent Agents. \- AAA Agent Architecture.  
* 54 Müller, J. P. (1994). INTERRAP: An Agent Architecture for Cooperation in Dynamic Environments. *AAAI WS-94-02*. \- INTERRAP Agent Architecture.  
* 60 arXiv:2501.06322v1 \- LLM-based Multi-Agent Systems. (Recent survey on LLM-based MAS).  
* 61 arXiv:2504.21030 \- Model Context Protocol for Multi-Agent Systems. (Recent work on context in MAS).  
* 55 Rosenbloom, P. S. (2016). The Sigma Cognitive Architecture and System. *AAMAS 2016 Tutorial*. \- Sigma Cognitive Architecture.  
* 56 Ricci, A. (2022). “Go to the Children”: Rethinking Intelligent Agent Design... *AAMAS 2022 Blue Sky*. \- Developmental Learning in Cognitive Architectures.  
* 65 LabEx. How to Reliably Execute External Commands in Go. \- Go os/exec error handling.  
* 16 LabEx. How to handle external process errors in Go. \- Go os/exec error handling.  
* 48 Neo4j Blog. Neo4j Driver Best Practices. \- Neo4j Go Driver Best Practices.  
* 49 Neo4j Go Driver Manual. Performance recommendations. \- Neo4j Go Driver Performance.  
* 63 pkg.go.dev. codingfinest/neo4j-go-ogm. \- Go OGM for Neo4j.  
* 64 GitHub. codingfinest/neo4j-go-ogm. \- Go OGM for Neo4j.  
* 1 Wikipedia. Technology readiness level. \- TRL Definition.  
* 2 NASA. Technology Readiness Levels. \- TRL Scale Definition.  
* 58 SmythOS Blog. Understanding Autonomous Agent Architecture. \- Pragmatic Agent Architecture.  
* 68 Anthropic Research. (2024). Building effective agents. \- Pragmatic Agent Architectures, Workflows vs Agents.  
* 66 Thoughtworks Insights. Architecture to operationalize FATTER AI. \- Evolutionary Architecture for AI.  
* 67 Databricks Blog. (2024, Oct). From Generalists to Specialists: The Evolution of AI Systems toward Compound AI. \- Compound AI, Evolutionary Architecture (Microservices analogy).  
* 34 Combined search results on MCTS, AND/OR graphs.  
* 3 Summary of SHOP2 features based on.3  
* 5 Summary of pomdp-py features based on.5  
* 6 Summary of POMDPs.jl features based on.6  
* 31 Summary of plan repair vs replanning based on.31  
* 32 Summary of plan commitment based on.32  
* 43 Summary of RwT framework based on.43

#### **Sources des citations**

1. en.wikipedia.org, consulté le juin 11, 2025, [https://en.wikipedia.org/wiki/Technology\_readiness\_level](https://en.wikipedia.org/wiki/Technology_readiness_level)  
2. Technology Readiness Levels \- NASA, consulté le juin 11, 2025, [https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/)  
3. (PDF) SHOP2: An HTN planning system \- ResearchGate, consulté le juin 11, 2025, [https://www.researchgate.net/publication/220543221\_SHOP2\_An\_HTN\_planning\_system](https://www.researchgate.net/publication/220543221_SHOP2_An_HTN_planning_system)  
4. All publications | Grav, consulté le juin 11, 2025, [https://bercher.net/my-publications/all-publications](https://bercher.net/my-publications/all-publications)  
5. pomdp\_py Documentation — pomdp\_py 1.3.5.1 documentation, consulté le juin 11, 2025, [https://h2r.github.io/pomdp-py/html/](https://h2r.github.io/pomdp-py/html/)  
6. POMDPs.jl: A Framework for Sequential Decision Making under ..., consulté le juin 11, 2025, [https://www.jmlr.org/papers/v18/16-300.html](https://www.jmlr.org/papers/v18/16-300.html)  
7. POMDPs: Partially Observable Markov Decision Processes, consulté le juin 11, 2025, [http://ais.informatik.uni-freiburg.de/teaching/ws11/robotics2/pdfs/rob2-XX-POMDPs.pdf](http://ais.informatik.uni-freiburg.de/teaching/ws11/robotics2/pdfs/rob2-XX-POMDPs.pdf)  
8. (PDF) Path-finding in dynamic environments with PDDL-planners \- ResearchGate, consulté le juin 11, 2025, [https://www.researchgate.net/publication/271549200\_Path-finding\_in\_dynamic\_environments\_with\_PDDL-planners](https://www.researchgate.net/publication/271549200_Path-finding_in_dynamic_environments_with_PDDL-planners)  
9. Planning and PDDL \- Interactive Fiction and Text Generation, consulté le juin 11, 2025, [https://interactive-fiction-class.org/in\_class\_activities/planning/planning-and-pddl.html](https://interactive-fiction-class.org/in_class_activities/planning/planning-and-pddl.html)  
10. Tutorial: Create a graph data model \- Getting Started \- Neo4j, consulté le juin 11, 2025, [https://neo4j.com/docs/getting-started/data-modeling/tutorial-data-modeling/](https://neo4j.com/docs/getting-started/data-modeling/tutorial-data-modeling/)  
11. (PDF) Ontology Modeling for Probabilistic Knowledge Graphs \- ResearchGate, consulté le juin 11, 2025, [https://www.researchgate.net/publication/369410537\_Ontology\_Modeling\_for\_Probabilistic\_Knowledge\_Graphs](https://www.researchgate.net/publication/369410537_Ontology_Modeling_for_Probabilistic_Knowledge_Graphs)  
12. Hierarchical task network \- Wikipedia, consulté le juin 11, 2025, [https://en.wikipedia.org/wiki/Hierarchical\_task\_network](https://en.wikipedia.org/wiki/Hierarchical_task_network)  
13. Hierarchical Task Network (HTN) Planning in AI \- GeeksforGeeks, consulté le juin 11, 2025, [https://www.geeksforgeeks.org/hierarchical-task-network-htn-planning-in-ai/](https://www.geeksforgeeks.org/hierarchical-task-network-htn-planning-in-ai/)  
14. A Feedback-Driven HRC Task Planning Framework based on LLMs \- arXiv, consulté le juin 11, 2025, [https://arxiv.org/html/2503.01007v1](https://arxiv.org/html/2503.01007v1)  
15. How to Securely Execute External Commands in Go \- LabEx, consulté le juin 11, 2025, [https://labex.io/tutorials/go-how-to-securely-execute-external-commands-in-go-431338](https://labex.io/tutorials/go-how-to-securely-execute-external-commands-in-go-431338)  
16. How to handle external process errors | LabEx, consulté le juin 11, 2025, [https://labex.io/tutorials/go-how-to-handle-external-process-errors-431342](https://labex.io/tutorials/go-how-to-handle-external-process-errors-431342)  
17. Pomdp: A Computational Infrastructure for Partially Observable Markov Decision Processes, consulté le juin 11, 2025, [https://rjournal.github.io/articles/RJ-2024-021/](https://rjournal.github.io/articles/RJ-2024-021/)  
18. POMDP – Knowledge and References \- Taylor & Francis, consulté le juin 11, 2025, [https://taylorandfrancis.com/knowledge/Engineering\_and\_technology/Industrial\_engineering\_%26\_manufacturing/POMDP/](https://taylorandfrancis.com/knowledge/Engineering_and_technology/Industrial_engineering_%26_manufacturing/POMDP/)  
19. HTN-Style Planning in Relational POMDPs Using First-Order FSCs \- Uni Ulm, consulté le juin 11, 2025, [https://www.uni-ulm.de/fileadmin/website\_uni\_ulm/iui.inst.090/Publikationen/2011/paper-hierarchicalFOFSCs.pdf](https://www.uni-ulm.de/fileadmin/website_uni_ulm/iui.inst.090/Publikationen/2011/paper-hierarchicalFOFSCs.pdf)  
20. Partially Observable Markov Decision Process (POMDP) in AI \- GeeksforGeeks, consulté le juin 11, 2025, [https://www.geeksforgeeks.org/partially-observable-markov-decision-process-pomdp-in-ai/](https://www.geeksforgeeks.org/partially-observable-markov-decision-process-pomdp-in-ai/)  
21. stochastic, consulté le juin 11, 2025, [https://gki.informatik.uni-freiburg.de/teaching/ws0405/advanced/POMDPs-4up.pdf](https://gki.informatik.uni-freiburg.de/teaching/ws0405/advanced/POMDPs-4up.pdf)  
22. A survey of point-based POMDP solvers \- CiteSeerX, consulté le juin 11, 2025, [https://citeseerx.ist.psu.edu/document?repid=rep1\&type=pdf\&doi=2027b108fbefdb8aef1b6db8806f98fceaa341a9](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=2027b108fbefdb8aef1b6db8806f98fceaa341a9)  
23. Scaling Long-Horizon Online POMDP Planning via Rapid State Space Sampling \- arXiv, consulté le juin 11, 2025, [https://arxiv.org/html/2411.07032v1](https://arxiv.org/html/2411.07032v1)  
24. JuliaPOMDP/FiniteHorizonPOMDPs.jl: POMDPs.jl-compatible interface for defining MDPs and POMDPs with finite horizons \- GitHub, consulté le juin 11, 2025, [https://github.com/JuliaPOMDP/FiniteHorizonPOMDPs.jl](https://github.com/JuliaPOMDP/FiniteHorizonPOMDPs.jl)  
25. API Documentation \- JuliaPOMDP/POMDPs.jl, consulté le juin 11, 2025, [https://juliapomdp.github.io/POMDPs.jl/latest/api/](https://juliapomdp.github.io/POMDPs.jl/latest/api/)  
26. Planning Domain Definition Language \- Wikipedia, consulté le juin 11, 2025, [https://en.wikipedia.org/wiki/Planning\_Domain\_Definition\_Language](https://en.wikipedia.org/wiki/Planning_Domain_Definition_Language)  
27. What is PDDL? \- Planning.wiki, consulté le juin 11, 2025, [https://planning.wiki/guide/whatis/pddl](https://planning.wiki/guide/whatis/pddl)  
28. PDDL 2.2 \- Planning.wiki, consulté le juin 11, 2025, [https://planning.wiki/ref/pddl22](https://planning.wiki/ref/pddl22)  
29. PDDL \- Visual Studio Marketplace, consulté le juin 11, 2025, [https://marketplace.visualstudio.com/items?itemName=jan-dolejsi.pddl](https://marketplace.visualstudio.com/items?itemName=jan-dolejsi.pddl)  
30. Planning, Monitoring and Replanning Techniques for Handling Abnormity in HTN-Based Planning and Execution \- ResearchGate, consulté le juin 11, 2025, [https://www.researchgate.net/publication/385794166\_Planning\_Monitoring\_and\_Replanning\_Techniques\_for\_Handling\_Abnormity\_in\_HTN-Based\_Planning\_and\_Execution](https://www.researchgate.net/publication/385794166_Planning_Monitoring_and_Replanning_Techniques_for_Handling_Abnormity_in_HTN-Based_Planning_and_Execution)  
31. Plan Stability: Replanning Versus Plan Repair \- AAAI, consulté le juin 11, 2025, [https://cdn.aaai.org/ICAPS/2006/ICAPS06-022.pdf](https://cdn.aaai.org/ICAPS/2006/ICAPS06-022.pdf)  
32. (PDF) Plan commitment: Replanning versus plan repair, consulté le juin 11, 2025, [https://www.researchgate.net/publication/370067696\_Plan\_commitment\_Replanning\_versus\_plan\_repair](https://www.researchgate.net/publication/370067696_Plan_commitment_Replanning_versus_plan_repair)  
33. Monte Carlo Tree Search \- (Game Theory) \- Vocab, Definition, Explanations | Fiveable, consulté le juin 11, 2025, [https://library.fiveable.me/key-terms/game-theory/monte-carlo-tree-search](https://library.fiveable.me/key-terms/game-theory/monte-carlo-tree-search)  
34. consulté le janvier 1, 1970, [https.www.geeksforgeeks.org/hierarchical-task-network-htn-planning-in-ai/](http://docs.google.com/https.www.geeksforgeeks.org/hierarchical-task-network-htn-planning-in-ai/)  
35. Elements of Monte Carlo Tree Search \- Typical and Non-typical Applications \- billparker.ai, consulté le juin 11, 2025, [https://www.billparker.ai/2025/01/elements-of-monte-carlo-tree-search.html](https://www.billparker.ai/2025/01/elements-of-monte-carlo-tree-search.html)  
36. Sample Efficient Monte Carlo Tree Search for Robotics \- TUprints, consulté le juin 11, 2025, [https://tuprints.ulb.tu-darmstadt.de/22931/1/Sample\_Efficient\_Monte\_Carlo\_Tree\_Search\_for\_Robotics.pdf](https://tuprints.ulb.tu-darmstadt.de/22931/1/Sample_Efficient_Monte_Carlo_Tree_Search_for_Robotics.pdf)  
37. Monte Carlo Tree Search for Multi-Robot Task Allocation \- ResearchGate, consulté le juin 11, 2025, [https://www.researchgate.net/publication/286780023\_Monte\_Carlo\_Tree\_Search\_for\_Multi-Robot\_Task\_Allocation](https://www.researchgate.net/publication/286780023_Monte_Carlo_Tree_Search_for_Multi-Robot_Task_Allocation)  
38. Why is And-Or-Graph-Search called a search algorithm?, consulté le juin 11, 2025, [https://cs.stackexchange.com/questions/33955/why-is-and-or-graph-search-called-a-search-algorithm](https://cs.stackexchange.com/questions/33955/why-is-and-or-graph-search-called-a-search-algorithm)  
39. 6\. AND-OR Graph \- MITU Skillologies, consulté le juin 11, 2025, [https://mitu.co.in/wp-content/uploads/2022/01/6.-AND-OR-Graph.pdf](https://mitu.co.in/wp-content/uploads/2022/01/6.-AND-OR-Graph.pdf)  
40. Difference Between A\* and AO\* Alogithm \- GeeksforGeeks, consulté le juin 11, 2025, [https://www.geeksforgeeks.org/difference-between-a-and-ao-alogithm/](https://www.geeksforgeeks.org/difference-between-a-and-ao-alogithm/)  
41. 5 Proven Methods to Boost Accuracy with Information Gain \- Number Analytics, consulté le juin 11, 2025, [https://www.numberanalytics.com/blog/bloginformation-gain-accuracy-methods](https://www.numberanalytics.com/blog/bloginformation-gain-accuracy-methods)  
42. What is Information Gain \- Activeloop, consulté le juin 11, 2025, [https://www.activeloop.ai/resources/glossary/information-gain/](https://www.activeloop.ai/resources/glossary/information-gain/)  
43. Reasoning with Trees: Faithful Question Answering ... \- ACL Anthology, consulté le juin 11, 2025, [https://aclanthology.org/2025.coling-main.211.pdf](https://aclanthology.org/2025.coling-main.211.pdf)  
44. A Robust Approach to Sequential Information Theoretic Planning, consulté le juin 11, 2025, [https://sli.csail.mit.edu/spotlight/paper-zheng2018icml/](https://sli.csail.mit.edu/spotlight/paper-zheng2018icml/)  
45. Information-Theoretic Planning with Trajectory Optimization for Dense 3D Mapping \- Ken Goldberg, consulté le juin 11, 2025, [https://goldberg.berkeley.edu/pubs/RSS2015\_InfoTheoretic\_Mapping.pdf](https://goldberg.berkeley.edu/pubs/RSS2015_InfoTheoretic_Mapping.pdf)  
46. Reasoning with Trees: Faithful Question Answering over Knowledge Graph \- ACL Anthology, consulté le juin 11, 2025, [https://aclanthology.org/2025.coling-main.211/](https://aclanthology.org/2025.coling-main.211/)  
47. Build applications with Neo4j and Go \- Neo4j Go Driver Manual, consulté le juin 11, 2025, [https://neo4j.com/docs/go-manual/current/](https://neo4j.com/docs/go-manual/current/)  
48. Neo4j Driver Best Practices \- Graph Database & Analytics, consulté le juin 11, 2025, [https://neo4j.com/blog/developer/neo4j-driver-best-practices/](https://neo4j.com/blog/developer/neo4j-driver-best-practices/)  
49. Performance recommendations \- Neo4j Go Driver Manual, consulté le juin 11, 2025, [https://neo4j.com/docs/go-manual/current/performance/](https://neo4j.com/docs/go-manual/current/performance/)  
50. Vectors and Graphs: Better Together \- Graph Database & Analytics \- Neo4j, consulté le juin 11, 2025, [https://neo4j.com/blog/developer/vectors-graphs-better-together/](https://neo4j.com/blog/developer/vectors-graphs-better-together/)  
51. PROBABILISTIC KNOWLEDGE GRAPH EMBEDDINGS \- OpenReview, consulté le juin 11, 2025, [https://openreview.net/pdf?id=rJ4qXnCqFX](https://openreview.net/pdf?id=rJ4qXnCqFX)  
52. Top Neo4j Graph Database Competitors & Alternatives 2025 | Gartner Peer Insights, consulté le juin 11, 2025, [https://www.gartner.com/reviews/market/cloud-database-management-systems/vendor/neo4j/product/neo4j-graphdatabase/alternatives](https://www.gartner.com/reviews/market/cloud-database-management-systems/vendor/neo4j/product/neo4j-graphdatabase/alternatives)  
53. Top 10 Open Source Graph Databases in 2025 | GeeksforGeeks, consulté le juin 11, 2025, [https://www.geeksforgeeks.org/open-source-graph-databases/](https://www.geeksforgeeks.org/open-source-graph-databases/)  
54. Integrating Agent Interaction into a Planner-Reactor Architecture \- AAAI, consulté le juin 11, 2025, [https://cdn.aaai.org/Workshops/1994/WS-94-02/WS94-02-015.pdf](https://cdn.aaai.org/Workshops/1994/WS-94-02/WS94-02-015.pdf)  
55. AAMAS Tutorial (2016) \- Cognitive Architecture, consulté le juin 11, 2025, [https://cogarch.ict.usc.edu/aamas-tutorial-2016/](https://cogarch.ict.usc.edu/aamas-tutorial-2016/)  
56. “Go to the Children”: Rethinking Intelligent Agent Design and Programming in a Developmental Learning Perspective \- IFAAMAS, consulté le juin 11, 2025, [https://www.ifaamas.org/Proceedings/aamas2022/pdfs/p1809.pdf](https://www.ifaamas.org/Proceedings/aamas2022/pdfs/p1809.pdf)  
57. The Autonomous Agent Architecture \- Marcello Balduccini, consulté le juin 11, 2025, [https://mbal.asklab.net/papers/bg09.pdf](https://mbal.asklab.net/papers/bg09.pdf)  
58. Understanding Autonomous Agent Architecture \- SmythOS, consulté le juin 11, 2025, [https://smythos.com/ai-agents/agent-architectures/autonomous-agent-architecture/](https://smythos.com/ai-agents/agent-architectures/autonomous-agent-architecture/)  
59. HTN Planners and their Applications | Download Table \- ResearchGate, consulté le juin 11, 2025, [https://www.researchgate.net/figure/HTN-Planners-and-their-Applications\_tbl5\_261217494](https://www.researchgate.net/figure/HTN-Planners-and-their-Applications_tbl5_261217494)  
60. Multi-Agent Collaboration Mechanisms: A Survey of LLMs \- arXiv, consulté le juin 11, 2025, [https://arxiv.org/html/2501.06322v1](https://arxiv.org/html/2501.06322v1)  
61. Advancing Multi-Agent Systems Through Model Context Protocol \- arXiv, consulté le juin 11, 2025, [https://arxiv.org/pdf/2504.21030](https://arxiv.org/pdf/2504.21030)  
62. How to execute external commands and programs in Golang? Please provide a sample code and explain how to handle the input and output of the command?, consulté le juin 11, 2025, [https://yifan-online.com/en/km/article/detail/4962](https://yifan-online.com/en/km/article/detail/4962)  
63. gogm package \- github.com/codingfinest/neo4j-go-ogm \- Go Packages, consulté le juin 11, 2025, [https://pkg.go.dev/github.com/codingfinest/neo4j-go-ogm](https://pkg.go.dev/github.com/codingfinest/neo4j-go-ogm)  
64. codingfinest/neo4j-go-ogm: A Neo4j Object Graph Mapping Library for Golang runtime, consulté le juin 11, 2025, [https://github.com/codingfinest/neo4j-go-ogm](https://github.com/codingfinest/neo4j-go-ogm)  
65. How to Reliably Execute External Commands in Go \- LabEx, consulté le juin 11, 2025, [https://labex.io/tutorials/go-how-to-reliably-execute-external-commands-in-go-431339](https://labex.io/tutorials/go-how-to-reliably-execute-external-commands-in-go-431339)  
66. Embracing evolutionary architectures to operationalize FATTER AI \- Thoughtworks, consulté le juin 11, 2025, [https://www.thoughtworks.com/en-us/insights/articles/architecture-operationalize-fatter-ai](https://www.thoughtworks.com/en-us/insights/articles/architecture-operationalize-fatter-ai)  
67. From Generalists to Specialists: The Evolution of AI Systems toward Compound AI | Databricks Blog, consulté le juin 11, 2025, [https://www.databricks.com/blog/generalists-specialists-evolution-ai-systems-toward-compound-ai](https://www.databricks.com/blog/generalists-specialists-evolution-ai-systems-toward-compound-ai)  
68. Building Effective AI Agents \- Anthropic, consulté le juin 11, 2025, [https://www.anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents)  
69. Hierarchical Task Network (HTN) Planning, consulté le juin 11, 2025, [https://pages.mtu.edu/\~nilufer/classes/cs5811/2012-fall/lecture-slides/cs5811-ch11b-htn.pdf](https://pages.mtu.edu/~nilufer/classes/cs5811/2012-fall/lecture-slides/cs5811-ch11b-htn.pdf)  
70. Applications of SHOP and SHOP2 \- CiteSeerX, consulté le juin 11, 2025, [https://citeseerx.ist.psu.edu/document?repid=rep1\&type=pdf\&doi=b6b88ef9be6d38ffd980d2d550fd11d2a30458ac](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=b6b88ef9be6d38ffd980d2d550fd11d2a30458ac)  
71. www.geeksforgeeks.org, consulté le juin 11, 2025, [https://www.geeksforgeeks.org/hierarchical-task-networks-htns-structure-algorithms-and-applications-in-ai/\#:\~:text=Hierarchical%20Task%20Networks%20(HTNs)%20are,%2C%20game%20AI%2C%20and%20automation.](https://www.geeksforgeeks.org/hierarchical-task-networks-htns-structure-algorithms-and-applications-in-ai/#:~:text=Hierarchical%20Task%20Networks%20\(HTNs\)%20are,%2C%20game%20AI%2C%20and%20automation.)  
72. Plan commitment: Replanning versus plan repair \- RiuNet, consulté le juin 11, 2025, [https://riunet.upv.es/handle/10251/212313](https://riunet.upv.es/handle/10251/212313)  
73. Integrated Financial Planning Application \- Anaplan, consulté le juin 11, 2025, [https://www.anaplan.com/applications/integrated-financial-planning-app/](https://www.anaplan.com/applications/integrated-financial-planning-app/)  
74. Building Distributed Applications with Event-driven Architecture • Eric Johnson • GOTO 2023, consulté le juin 11, 2025, [https://www.youtube.com/watch?v=9StQpMLC-5Q](https://www.youtube.com/watch?v=9StQpMLC-5Q)  
75. Whitepaper 1: Integration of FFmpeg into Enciris Technologies Software, consulté le juin 11, 2025, [https://www.enciris.com/4k-capture/whitepaper-1-integration-of-ffmpeg-into-enciris-technologies-software/](https://www.enciris.com/4k-capture/whitepaper-1-integration-of-ffmpeg-into-enciris-technologies-software/)  
76. How to use FFmpeg (with examples) \- Shotstack, consulté le juin 11, 2025, [https://shotstack.io/learn/how-to-use-ffmpeg/](https://shotstack.io/learn/how-to-use-ffmpeg/)  
77. How To Create A Website Project Plan: A Step-by-Step Guide \- Toggl Track, consulté le juin 11, 2025, [https://toggl.com/blog/website-project-plan](https://toggl.com/blog/website-project-plan)  
78. Can you provide some examples of simple yet powerful websites that were created from scratch? \- Quora, consulté le juin 11, 2025, [https://www.quora.com/Can-you-provide-some-examples-of-simple-yet-powerful-websites-that-were-created-from-scratch](https://www.quora.com/Can-you-provide-some-examples-of-simple-yet-powerful-websites-that-were-created-from-scratch)  
79. Mastering Information Gain: Advanced Strategies for Splitting Data Efficiently, consulté le juin 11, 2025, [https://www.numberanalytics.com/blog/advanced-information-gain-data-splitting-strategies](https://www.numberanalytics.com/blog/advanced-information-gain-data-splitting-strategies)  
80. Graph Search Algorithms: A Practical Overview \- PuppyGraph, consulté le juin 11, 2025, [https://www.puppygraph.com/blog/graph-search-algorithms](https://www.puppygraph.com/blog/graph-search-algorithms)  
81. Lifted Planning: Recent Advances in Planning Using First-Order Representations \- IJCAI, consulté le juin 11, 2025, [https://www.ijcai.org/proceedings/2024/0886.pdf](https://www.ijcai.org/proceedings/2024/0886.pdf)  
82. Using Learned Policies in Heuristic-Search Planning \- IJCAI, consulté le juin 11, 2025, [https://www.ijcai.org/Proceedings/07/Papers/330.pdf](https://www.ijcai.org/Proceedings/07/Papers/330.pdf)  
83. Active Learning \- Center for Teaching Innovation, consulté le juin 11, 2025, [https://teaching.cornell.edu/teaching-resources/active-collaborative-learning/active-learning](https://teaching.cornell.edu/teaching-resources/active-collaborative-learning/active-learning)  
84. Active Learning: Evidence-based Teaching: Teaching Resources \- Center for Innovative Teaching & Learning \- Indiana University Bloomington, consulté le juin 11, 2025, [https://citl.indiana.edu/teaching-resources/evidence-based/active-learning.html](https://citl.indiana.edu/teaching-resources/evidence-based/active-learning.html)  
85. Integration Architecture: Definition, Examples, and Applications | LaunchNotes, consulté le juin 11, 2025, [https://www.launchnotes.com/glossary/integration-architecture-in-product-management-and-operations](https://www.launchnotes.com/glossary/integration-architecture-in-product-management-and-operations)  
86. Integration Architecture \- The Definitive Guide | LeanIX, consulté le juin 11, 2025, [https://www.leanix.net/en/wiki/it-architecture/integration-architecture](https://www.leanix.net/en/wiki/it-architecture/integration-architecture)