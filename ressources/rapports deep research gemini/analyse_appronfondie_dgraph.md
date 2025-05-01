# **Évaluation Approfondie de Dgraph v24+ pour AutoAgent V1 : Viabilité, Risques et Alternatives**

## **I. Résumé Exécutif**

Ce rapport présente une évaluation technique approfondie de la base de données graphe distribuée Dgraph, spécifiquement ses versions récentes (v24+) sous la gouvernance de Hypermode Inc., afin de déterminer sa viabilité comme base de données principale pour le projet AutoAgent V1. L'objectif est de valider ou d'invalider ce choix technologique préliminaire en tenant compte des contraintes strictes du projet : auto-hébergement, gratuité (absence de coût de licence), préférence pour une licence open-source permissive (Apache 2.0), intégration avec Go, et exigences élevées en matière de fiabilité et de sécurité.

L'analyse révèle un écosystème Dgraph en pleine mutation suite à son acquisition par Hypermode. Le développement est actif, particulièrement orienté vers l'intégration IA et les fonctionnalités vectorielles, avec un engagement public fort pour rendre Dgraph v25 entièrement open-source sous licence Apache 2.0, incluant des fonctionnalités auparavant commerciales comme les sauvegardes binaires.1 Cependant, des incertitudes persistent quant au calendrier exact de cette transition et à l'équilibre entre le développement de nouvelles fonctionnalités et la stabilisation du cœur de la base de données.

La validation des fonctionnalités clés dans la version OSS v24+ montre que le sharding automatique, la réplication via Raft et une API GraphQL native mature sont présents.3 Le support natif de la recherche vectorielle a été ajouté 5, bien que sa configurabilité semble limitée par rapport aux solutions dédiées.6 Des préoccupations subsistent quant à la robustesse et à la vérification indépendante récente des garanties ACID distribuées dans la version v24+, malgré les affirmations de conformité et les tests Jepsen historiques sur des versions antérieures.8

L'analyse des performances est entravée par un manque critique de benchmarks récents, indépendants et rigoureux comparant Dgraph v24+ à ses alternatives pertinentes (Neo4j Community, ArangoDB Community) pour les charges de travail d'AutoAgent. Les améliorations de performance annoncées pour Dgraph v24.1 sont notables mais non vérifiées indépendamment.10

La complexité opérationnelle d'un cluster Dgraph auto-hébergé en haute disponibilité (configuration minimale de 3 nœuds Zero \+ 3 nœuds Alpha) est jugée élevée, nécessitant des ressources matérielles significatives et une expertise en administration de systèmes distribués.11 Cette complexité contraste fortement avec la simplicité d'un déploiement mono-nœud de Neo4j Community.

Le client Go officiel (dgo) est mature, bien documenté et activement maintenu, couvrant la plupart des fonctionnalités essentielles.13 Cependant, un manque d'exemples clairs ou d'API dédiées pour l'utilisation des nouvelles fonctionnalités de recherche vectorielle de Dgraph v24 a été constaté dans la documentation fournie.

Les risques majeurs identifiés incluent la stabilité et la fiabilité de Dgraph v24+ en production auto-hébergée, comme en témoignent des rapports utilisateurs récents faisant état de problèmes de performance et d'erreurs opérationnelles sous charge.15 La complexité opérationnelle élevée et le manque de vérification indépendante récente des garanties de performance et de consistance constituent également des risques significatifs. La viabilité à long terme dépend de la capacité de Hypermode à stabiliser le produit tout en poursuivant ses objectifs stratégiques liés à l'IA et à sa plateforme Modus.

**Recommandation Finale :** Compte tenu des exigences élevées de fiabilité et de sécurité d'AutoAgent V1, des risques de stabilité avérés sur Dgraph v24+ en environnement auto-hébergé, de la complexité opérationnelle significative et du manque de validation indépendante récente, **il est recommandé de ne pas adopter Dgraph v24+ comme base de données principale pour AutoAgent V1 à ce stade (No-Go)**. Les risques actuels, en particulier concernant la stabilité sous charge, sont jugés trop élevés pour un composant critique du système. Il est conseillé d'évaluer ArangoDB Community Edition comme alternative principale, en raison de sa licence Apache 2.0, de la disponibilité du clustering dans sa version gratuite, et de son écosystème mature, tout en reconnaissant sa propre complexité opérationnelle en mode cluster.

## **II. Introduction**

Le projet AutoAgent V1 ambitionne de créer un système multi-agents sophistiqué, développé en Go, capable de former une "équipe virtuelle" d'agents logiciels autonomes. Ces agents doivent exécuter des missions complexes déléguées par des utilisateurs techniques, en respectant des standards élevés de qualité, de fiabilité et de sécurité. Au cœur de ce système, une base de données principale est requise pour assurer la persistance de l'état structuré, incluant les Missions, les Tâches (avec leurs relations hiérarchiques et dépendances complexes), les Agents déployés et les Artefacts produits. Une exigence clé est la capacité de cette base de données à gérer efficacement des relations dynamiques et potentiellement complexes, pouvant servir de fondation à un futur Knowledge Graph relationnel.

Dans ce contexte, Dgraph, dans ses versions récentes (v24+) sous licence Apache 2.0 suite à la reprise par Hypermode Inc., a été initialement envisagé. Ce choix préliminaire reposait sur plusieurs arguments : sa licence open-source permissive (Apache 2.0), son architecture nativement distribuée (potentiellement incluse dans la version OSS), ses affirmations concernant le support des transactions ACID distribuées, et son alignement technologique avec Go, le langage principal d'AutoAgent.3

Cependant, une préoccupation majeure a rapidement émergé, constituant le risque principal justifiant cette investigation : la **stabilité effective, la viabilité à long terme et la robustesse de l'écosystème Dgraph** suite à son acquisition et son fork par Hypermode Inc..17 La transition d'une entreprise et d'un projet open-source soulève naturellement des questions sur la continuité du support, l'orientation du développement et la fiabilité du produit, surtout pour les versions post-transition.

Le projet AutoAgent V1 opère sous des contraintes fondamentales strictes pour sa base de données principale : la solution doit impérativement être **auto-hébergeable (self-hosted)**, **gratuite (free/gratis, sans coût de licence)**, et de préférence **open-source** avec une **licence permissive** compatible avec les objectifs du projet (idéalement Apache 2.0). La pile technique envisagée pour la V1 inclut Go comme langage principal et Temporal pour l'orchestration des workflows.

Ce rapport détaille les résultats d'une investigation approfondie et critique menée pour évaluer la pertinence réelle de Dgraph v24+ sous Hypermode pour AutoAgent V1. L'analyse s'appuie exclusivement sur des sources primaires vérifiables (documentation officielle, dépôts de code, retours d'expérience techniques crédibles, annonces officielles) et adopte une approche rigoureuse pour valider les affirmations de Dgraph et évaluer les risques associés. L'objectif est de fournir une recommandation claire – "Go" (poursuivre avec Dgraph, en atténuant les risques) ou "No-Go" (rejeter Dgraph et explorer des alternatives) – fondée sur des preuves factuelles et une analyse technique sans complaisance, dans le strict respect des contraintes du projet. Le rapport examine successivement la viabilité de l'écosystème Dgraph actuel, la validation des fonctionnalités clés en version OSS, les performances comparatives (dans la mesure des données disponibles), la complexité opérationnelle en auto-hébergement, la qualité du client Go, et enfin, les alternatives potentielles.

## **III. Évaluation de la Viabilité de l'Écosystème Dgraph (v24+ sous Hypermode)**

L'acquisition de Dgraph Labs par Hypermode Inc. en 2023 17 a marqué un tournant pour le projet. Évaluer la santé et la trajectoire de l'écosystème Dgraph sous cette nouvelle direction est crucial pour déterminer sa fiabilité à long terme pour un projet comme AutoAgent.

### **A. Activité de Développement, Cadence des Releases et Feuille de Route**

Activité de Développement :  
L'analyse du dépôt GitHub principal hypermodeinc/dgraph 3 révèle une activité de développement soutenue. Le nombre total de commits est élevé (plus de 6342 3), suggérant une longue histoire de contributions. Plus important encore, l'activité récente semble significative, avec des commits réguliers et une gestion active des Pull Requests (7 ouvertes) et des Issues (23 ouvertes au moment de l'analyse 3). Des dépôts liés, comme celui du client Go dgo 13, des clients JavaScript 19 et Java 20, ainsi qu'un dépôt expérimental 21, montrent également une activité, indiquant un effort de maintenance sur l'ensemble de l'écosystème. Une comparaison directe et quantitative de la fréquence des commits récents avec Neo4j 22 et ArangoDB 23 est difficile à établir précisément à partir des extraits fournis, mais Dgraph ne semble pas en retard significatif en termes d'activité brute sur son dépôt principal.  
Cadence des Releases :  
La cadence des releases pour Dgraph v24+ semble régulière. La version v24.0.5 était considérée comme prête pour la production.3 Hypermode a annoncé la disponibilité générale de Dgraph v24 en mai 2024, intégrant notamment le support natif des vecteurs.24 Par la suite, la version v24.1 a été publiée début mars 2025, apportant des améliorations de performance significatives (planificateur de requêtes, cache, écritures).10 Une version corrective, v24.1.2, a suivi fin mars 2025.3 Cette séquence de releases (v24.0 \-\> v24.1 \-\> v24.1.2) sur une période d'environ un an indique un cycle de maintenance actif avec des mises à jour mineures et correctives.  
Feuille de Route & Engagement OSS v25 :  
Hypermode a communiqué de manière significative sur l'avenir de Dgraph, en particulier concernant la version v25. L'engagement a été pris de rendre Dgraph v25 entièrement open-source sous licence Apache 2.0, abandonnant le modèle historique de double licence (OSS Apache 2.0 \+ Enterprise commerciale).1 Cette transition, initialement annoncée pour "début 2025" 2 ou "dans les mois à venir" (annonce de mars 2025 1), est une décision stratégique majeure. Les fonctionnalités spécifiques de l'édition Enterprise qui seront intégrées à la version OSS Apache 2.0 incluent : les Sauvegardes Binaires, le Chiffrement au Repos (Encryption at Rest), l'Audit Logging, et le support Multi-Namespace.2 Hypermode a également promis de partager une feuille de route technique plus détaillée.1 Une discussion récente sur le forum (fin mars 2025\) mentionne l'attente d'une version alpha de v25 "dans la semaine à venir" 25, ce qui pourrait indiquer un léger glissement par rapport à l'objectif initial de "début 2025".  
Vision de Hypermode :  
Il est clair que Hypermode positionne Dgraph comme un élément central de sa stratégie axée sur l'IA et les graphes de connaissances.1 Dgraph est vu comme une fondation pour combiner vecteurs, données structurées et modèles d'IA 17, particulièrement pertinent pour des cas d'usage comme le RAG (Retrieval-Augmented Generation), l'explicabilité des modèles et la recherche vectorielle.1 L'intégration avec la plateforme Modus de Hypermode est également un axe de développement.28  
L'acquisition par Hypermode semble avoir insufflé une nouvelle dynamique au développement de Dgraph, avec un accent marqué sur les capacités IA et un engagement fort et potentiellement très bénéfique envers un modèle entièrement open-source permissif pour la v25. Cet engagement répond directement à l'une des contraintes fondamentales d'AutoAgent. Cependant, la feuille de route précise au-delà de la liste des fonctionnalités v25 reste floue, et le calendrier initial pourrait être légèrement dépassé. De plus, la forte orientation vers l'IA et l'intégration dans l'écosystème Hypermode pourrait potentiellement détourner des ressources de la stabilisation et de la correction de bugs du cœur de la base de données, aspects qui ont été soulevés par des utilisateurs récents 15 et qui sont critiques pour AutoAgent. L'équilibre entre innovation rapide et robustesse fondamentale est un point de vigilance.

**Tableau 1 : Comparaison de l'Activité GitHub (Approximation)**

| Indicateur | Dgraph (Hypermode) | Neo4j | ArangoDB |
| :---- | :---- | :---- | :---- |
| Dépôt Principal | hypermodeinc/dgraph 3 | neo4j/neo4j 22 | arangodb/arangodb 23 |
| Étoiles (Stars) | \~20.8k 3 | \~14.2k 22 | \~13.8k 23 |
| Forks | \~1.5k 3 | \~2.4k 22 | \~852 23 |
| Issues Ouvertes (env.) | \~23 3 | *Non spécifié* | \~739 23 |
| PR Ouvertes (env.) | \~6 3 | *Non spécifié* | \~22 23 |
| Release Récente (OSS) | v24.1.2 (Mar 2025\) 3 | 5.19.0 (CE) (Mar 2025\) 36\* | 3.12.0 (Nightly Mar 2025\) 36\* |
| Licence Principale OSS | Apache 2.0 3 (v25 prévu) 2 | GPLv3 (Community Edition) 3 | Apache 2.0 (Community Edition) 23 |

*\*Note : Les versions récentes de Neo4j et ArangoDB sont tirées d'un benchmark 36 et peuvent ne pas représenter la dernière release stable officielle au moment de la lecture.*

Ce tableau fournit un aperçu quantitatif. Dgraph montre une forte popularité (étoiles) comparable à ArangoDB et dépassant Neo4j sur cet indicateur spécifique, bien que Neo4j ait plus de forks. Le nombre d'issues ouvertes pour Dgraph semble nettement inférieur à celui d'ArangoDB, ce qui pourrait indiquer un backlog mieux maîtrisé ou une base d'utilisateurs rapportant moins de problèmes. Tous les projets montrent une activité de release récente. La licence Apache 2.0 de Dgraph (actuelle et future) est un avantage clé par rapport à la GPLv3 de Neo4j CE pour les contraintes d'AutoAgent.

### **B. Santé de la Communauté et Canaux de Support**

Les canaux de support officiels pour la communauté Dgraph incluent principalement le dépôt GitHub pour les bugs et les feature requests 3, le forum de discussion (Discuss) 3, et un serveur Discord.37 Historiquement, Slack était également utilisé 38, et le forum Discuss servait même de plateforme de communication interne et de prise de décision chez Dgraph Labs.39

L'activité sur ces canaux, en particulier le forum Discuss 41, semble réelle. Des fils de discussion récents montrent des utilisateurs rapportant des problèmes techniques parfois complexes, notamment des problèmes de performance avec la v24 15 et des erreurs opérationnelles en cluster auto-hébergé.16 Point positif notable, des ingénieurs de Hypermode (Harshil Goel, Kevin Van Gundy \- CEO) interviennent directement dans ces discussions techniques pour investiguer et proposer des solutions ou des contournements.15 Cela démontre une volonté d'engagement et un suivi actif des retours de la communauté, du moins pour les problèmes jugés critiques.

Cependant, la taille globale de la communauté Dgraph est probablement plus restreinte que celle de concurrents plus établis comme Neo4j.45 Des retours d'utilisateurs passés exprimaient d'ailleurs un souhait de communication accrue et d'une implication plus forte de la communauté par l'équipe de développement.47 Bien que l'équipe Hypermode semble réactive sur des problèmes techniques pointus, la capacité à fournir un support large et constant pour une base d'utilisateurs potentiellement croissante (surtout si v25 tient ses promesses OSS) sous un modèle gratuit reste une interrogation. La fiabilité exigée par AutoAgent nécessite des canaux de support fiables et réactifs en cas de problème, et la pérennité de ce niveau d'engagement direct des ingénieurs pour les utilisateurs gratuits est un facteur à considérer.

### **C. Qualité et Maintenance de la Documentation**

La documentation officielle de Dgraph est désormais hébergée sur docs.hypermode.com/dgraph.3 Un point important, mentionné explicitement à plusieurs endroits dans la documentation elle-même, est qu'elle est **en cours de refonte complète** ("overhauling") dans le but d'améliorer sa clarté et son accessibilité.11

La structure de la documentation couvre les aspects essentiels : concepts généraux 37, guide de démarrage rapide 50, déploiement auto-hébergé 12, liste de contrôle pour la production 11, interface en ligne de commande (CLI) 49, interface web Ratel 51, SDKs (dont Go 14), API GraphQL 4, et langage DQL.6 Des exemples de code et des recommandations de configuration sont présents.11

Néanmoins, le fait que la documentation soit en pleine refonte est à double tranchant. Si cela témoigne d'une reconnaissance des lacunes passées et d'une volonté d'amélioration (des utilisateurs avaient critiqué la documentation 52 et demandé plus de ressources pédagogiques 47), cela implique aussi qu'elle peut être actuellement dans un état instable, potentiellement incomplète, incohérente ou contenir des informations obsolètes pendant cette transition. Pour un projet comme AutoAgent, qui nécessite un auto-hébergement et une compréhension fine du fonctionnement pour garantir la fiabilité, une documentation de haute qualité, stable et exhaustive est primordiale. La complexité inhérente à une base de données graphe distribuée 45 accentue ce besoin. L'état actuel de la documentation représente donc un risque opérationnel : les informations nécessaires au déploiement, à la configuration fine, à la surveillance ou au dépannage pourraient être difficiles à trouver ou inexactes au moment critique.

### **D. Stabilité et Expériences Opérationnelles Rapportées (v24+)**

Plusieurs retours d'expérience récents et crédibles, publiés sur le forum officiel Discuss, soulèvent des inquiétudes quant à la stabilité et à la fiabilité de Dgraph v24+ en environnement de production auto-hébergé.

Un utilisateur a rapporté une **dégradation très significative des performances** après une mise à niveau de v23.1.0 vers v24.0.2.15 Les symptômes observés sous charge de production sur une machine pourtant très performante (48 cœurs EPYC, 1.12 To RAM) étaient alarmants : latence gRPC multipliée par plus de 100 (passant de \~150ms à plus de 20s p75), utilisation CPU beaucoup plus élevée et erratique (atteignant 100% par moments), et paradoxalement, une consommation mémoire bien plus faible qu'en v23 (\~65Go vs \~120Go), suggérant un problème de cache. Les ingénieurs de Hypermode ont lié ce problème aux **changements apportés au mécanisme de cache** (le "Posting List cache" ayant été modifié ou limité en v24). Bien qu'un contournement ait été proposé (réactiver l'ancien cache via un flag dans la v24.0.3), cet incident met en lumière une régression majeure de performance et de stabilité dans une version marquée comme "production-ready".

Un autre utilisateur a signalé des **erreurs récurrentes "Unhealthy connection"** (io.grpc.StatusRuntimeException: UNKNOWN : dispatchTaskOverNetwork: while retrieving connection.: Unhealthy connection) lors de l'exécution de requêtes potentiellement volumineuses sur un cluster v24.0.0 auto-hébergé (6 Alphas, 3 Zeros).16 Ces erreurs semblaient survenir après que l'utilisateur ait augmenté la limite du nombre d'arêtes retournées par une requête, suggérant un lien avec des problèmes de communication interne entre les nœuds du cluster sous forte charge ou lors de requêtes complexes traversant de nombreuses relations. L'investigation était toujours en cours à la fin du fil de discussion, sans résolution définitive identifiée, bien que des pistes liées à des timeouts internes ou à un manque de ressources pour traiter les requêtes distribuées aient été évoquées.

Ces rapports récents font écho à des discussions plus anciennes où des utilisateurs pointaient déjà des difficultés opérationnelles, des fonctionnalités manquantes ou perfectibles (manipulation de listes, filtrage imbriqué en GraphQL), et des problèmes avec des fonctionnalités critiques comme la sauvegarde/restauration (historiquement liée à l'édition Enterprise ou jugée peu fiable).40 Même si Hypermode a reconnu avoir dû stabiliser les opérations de Dgraph Cloud après l'acquisition 24, les problèmes rapportés en auto-hébergement sur la v24+ sont préoccupants.

Ces éléments factuels indiquent que Dgraph v24+, malgré les efforts de développement et les annonces d'améliorations 10, pourrait souffrir de problèmes de stabilité et de fiabilité lorsqu'il est déployé en auto-hébergement et soumis à des charges de travail de production. Les changements internes, notamment au niveau du cache, semblent avoir eu des effets secondaires négatifs. Pour AutoAgent, qui vise un haut standard de fiabilité, ces signaux d'alerte sont critiques et remettent en question la maturité réelle de la version v24+ pour un déploiement en production dans les conditions du projet. L'arrivée future des sauvegardes binaires en OSS dans la v25 2 est une amélioration attendue, mais ne résout pas les problèmes de stabilité fondamentaux observés sur la v24.

## **IV. Validation des Fonctionnalités Clés de Dgraph v24+ (Licence Apache 2.0)**

L'adéquation de Dgraph pour AutoAgent dépend de la disponibilité et de la robustesse de ses fonctionnalités clés dans la version open-source (Apache 2.0) auto-hébergeable.

### **A. Garanties des Transactions ACID Distribuées**

Dgraph affirme supporter des **transactions ACID distribuées** sur l'ensemble du cluster, y compris à travers les shards (partitions de données), et ce, dans sa version open-source.3 Le mécanisme repose sur le **MVCC (Multi-Version Concurrency Control)** pour l'isolation des lectures (snapshot isolation) et le protocole de consensus **Raft** pour garantir la durabilité et la cohérence des écritures à travers les réplicas d'un groupe.8 Les lectures s'effectuent sur un instantané cohérent du graphe à un timestamp donné, tandis que les écritures utilisent un mécanisme de **verrouillage optimiste** : une transaction peut échouer (être "abortée") si une autre transaction concurrente modifie exactement les mêmes données (même arête sur le même nœud) avant son commit.55

Dgraph met en avant sa conformité ACID et le fait d'avoir été testé via **Jepsen**, une suite de tests reconnue pour vérifier la cohérence des systèmes distribués.8 L'analyse Jepsen de Dgraph v1.0.2, réalisée en 2018 9, est un point positif témoignant d'une volonté de rigueur. Cependant, cette analyse, bien que précieuse, date de plusieurs années et portait sur une version ancienne. De plus, elle avait identifié **23 problèmes**, dont certains liés à des anomalies potentielles même avec l'isolation par snapshot (write skew, stale reads sous certaines conditions de partitionnement ou d'horloge).9 Dgraph a publié un article expliquant les efforts complexes déployés pour corriger ces problèmes, soulignant notamment l'importance d'un traçage distribué (via OpenCensus) pour le débogage.56

Il est crucial de noter qu'**aucune analyse Jepsen publique et récente portant spécifiquement sur Dgraph v24+ n'est disponible** dans les sources consultées. Par ailleurs, les problèmes de performance et de cohérence rapportés par les utilisateurs en v23/v24 et liés au système de cache 15 illustrent comment des composants annexes peuvent impacter les garanties effectives, même si les protocoles sous-jacents (Raft, MVCC) sont théoriquement solides.

En conséquence, bien que Dgraph vise des garanties ACID fortes et ait démontré par le passé un engagement envers la vérification (tests Jepsen), il existe un **manque de validation indépendante récente** pour la version v24+. Se fier uniquement aux affirmations de la documentation 8 et aux corrections apportées 15 comporte un risque. Pour AutoAgent, où l'intégrité des données est primordiale, ce manque de vérification récente sur une fonctionnalité aussi critique est une préoccupation majeure.

### **B. Sharding Automatique et Réplication (Disponibilité & Gestion en OSS)**

L'architecture de Dgraph est fondamentalement distribuée. Le **sharding (partitionnement) automatique des données** et la **réplication cohérente** sont présentés comme des caractéristiques natives, incluses dans la version Apache 2.0.3

Le sharding dans Dgraph s'effectue **par prédicat**.57 Cela signifie que toutes les données associées à un prédicat spécifique (par exemple, task.status ou agent.id) sont gérées par le même groupe de serveurs Alpha. Les nœuds **Dgraph Zero** sont responsables de la gestion des métadonnées du cluster et de l'**équilibrage automatique des shards** entre les groupes Alpha, en fonction du volume de données hébergé par chaque groupe.12

La réplication au sein de chaque groupe Alpha (qui gère un ensemble de prédicats) utilise le protocole de consensus **Raft**.8 Pour atteindre la **haute disponibilité (HA)**, une configuration minimale de **3 nœuds Zero et 3 groupes Alpha (chacun avec 3 réplicas, soit 3 nœuds Alpha au total si 1 groupe, ou plus si plusieurs groupes)** est recommandée.11 Cette redondance garantit que le système peut tolérer la perte d'un nœud dans chaque groupe Zero et Alpha tout en maintenant le quorum et en continuant à fonctionner.

La gestion d'un tel cluster en mode auto-hébergé implique le déploiement, la configuration et la surveillance de ces multiples instances Zero et Alpha.11 Bien que l'équilibrage des shards soit automatique une fois le cluster opérationnel 12, la mise en place initiale et la maintenance de cette infrastructure distribuée représentent une complexité non négligeable, comme discuté plus en détail dans la section sur la complexité opérationnelle.

En résumé, le sharding automatique et la réplication basée sur Raft sont bien des fonctionnalités fondamentales et open-source de Dgraph. Elles offrent une base solide pour la scalabilité et la haute disponibilité, alignées avec les besoins potentiels d'AutoAgent. Cependant, l'exploitation de ces capacités en auto-hébergement implique une gestion de cluster distribué intrinsèquement complexe.

### **C. Maturité et Limitations de l'API GraphQL Native**

Dgraph propose une couche **GraphQL native** 3 qui permet de générer automatiquement une API GraphQL (requêtes, mutations) à partir d'un schéma GraphQL défini par l'utilisateur.4 Cette approche vise à simplifier le développement pour les équipes familières avec GraphQL, en réduisant le besoin d'écrire des résolveurs personnalisés pour les opérations CRUD de base.

Cette fonctionnalité semble mature et est présentée comme une interface de premier plan pour interagir avec Dgraph 3, utilisée en production.3 Elle supporte les **requêtes**, les **mutations**, les **subscriptions** (via la directive @withSubscription pour les mises à jour en temps réel), et s'intègre avec **Apollo Federation**, permettant de composer une API unifiée à partir de plusieurs services GraphQL.4 Dgraph étend également la spécification GraphQL standard avec des **directives personnalisées** pour contrôler le comportement, comme @search pour l'indexation et la recherche 58, @embedding et @search(by: \["hnsw(...)"\]) pour la recherche vectorielle 5, ou @default pour les valeurs par défaut.60 Pour une logique métier plus complexe, il est possible de définir des **résolveurs Lambda**.4 L'intégration de la recherche vectorielle directement dans l'API GraphQL via des directives et des requêtes auto-générées (querySimilar\<Type\>ByEmbedding, querySimilar\<Type\>ById) dans la v24 est une avancée notable.5

Cependant, des limitations potentielles existent. Des retours d'utilisateurs historiques ont pointé du doigt l'absence de fonctionnalités GraphQL courantes comme le **filtrage imbriqué (nested filtering)** ou des difficultés avec la manipulation de listes complexes via les mutations GraphQL.47 Bien que la documentation montre des exemples de filtrage simple sur les champs directs ou les relations de premier niveau 58, il n'est pas explicitement confirmé dans les sources fournies si le filtrage imbriqué complexe (filtrer sur des champs de nœuds liés à plusieurs niveaux de profondeur) est désormais pleinement supporté et performant en v24+. La dépendance à la génération automatique peut aussi limiter le contrôle fin sur les requêtes ou les mutations dans des scénarios très spécifiques, nécessitant alors de recourir au langage DQL sous-jacent ou à des Lambdas.

L'API GraphQL native de Dgraph est donc une fonctionnalité puissante et en développement actif, particulièrement attrayante pour son intégration de la recherche vectorielle. Elle peut simplifier considérablement le développement d'API pour AutoAgent. Néanmoins, il est crucial d'évaluer si ses capacités actuelles, notamment en matière de filtrage avancé, sont suffisantes pour les requêtes complexes potentiellement requises par AutoAgent, ou si des limitations pourraient imposer des contournements ou des compromis.

### **D. Capacités Natives de Recherche Vectorielle**

Introduite dans Dgraph v24 5, la **recherche vectorielle native** permet d'intégrer des capacités de recherche sémantique directement dans la base de données graphe.

Disponibilité et Type de Données :  
La fonctionnalité est disponible dans la version OSS v24+. Le type de données utilisé en DQL est float32vector.5 En GraphQL, on utilise un champ de type \[Float\!\] annoté avec la directive @embedding.5 Dgraph permet de stocker plusieurs vecteurs (embeddings) différents sur un même nœud ou une même relation.1  
Indexation :  
L'indexation des vecteurs repose sur l'algorithme HNSW (Hierarchical Navigable Small World) 5, une méthode courante et performante pour la recherche de plus proches voisins en haute dimension.7 L'index est défini dans le schéma DQL via @index(hnsw(...)) 6 ou dans le schéma GraphQL via @search(by: \["hnsw(...)"\]).5  
Paramètres HNSW :  
La configuration de l'index HNSW dans Dgraph semble offrir des options de base :

* metric : Permet de spécifier la métrique de distance à utiliser. Les options supportées sont euclidean, cosine, et dotproduct.5 Le choix dépend de la nature des embeddings utilisés.  
* exponent : Un paramètre simplifié pour ajuster les paramètres internes de HNSW en fonction de la taille attendue du jeu de données vectorielles (par exemple, exponent: 4 suggère une adaptation pour environ 104 vecteurs).6

Il est important de noter que la documentation fournie ne mentionne pas la possibilité de configurer directement des paramètres HNSW plus fins, tels que M (le nombre maximum de voisins par nœud dans les couches \> 0), efConstruction (la taille de la liste dynamique pendant la construction de l'index) ou efSearch (la taille de la liste dynamique pendant la recherche). Ces paramètres sont pourtant cruciaux pour optimiser le compromis entre vitesse de recherche, précision (rappel) et consommation mémoire dans les implémentations HNSW standards.7 Cette apparente limitation dans la configurabilité suggère que l'implémentation HNSW de Dgraph pourrait privilégier la simplicité d'utilisation au détriment de l'optimisation fine possible dans des bases de données vectorielles dédiées ou des bibliothèques spécialisées.

**Interrogation (Querying) :**

* En **DQL**, la fonction similar\_to(predicate, k, $vector) permet de trouver les k nœuds dont le vecteur sur le predicate spécifié est le plus similaire au $vector fourni.5 La fonction mathématique dot peut être utilisée pour calculer explicitement des distances.5  
* En **GraphQL**, Dgraph génère automatiquement des requêtes comme querySimilar\<Type\>ByEmbedding(by: vector\_predicate, topK: k, vector: searchVector) et querySimilar\<Type\>ById(by: vector\_predicate, topK: k, id: objectId).5 Les résultats peuvent inclure la vector\_distance calculée selon la métrique de l'index.59

Intégration :  
Un avantage clé est la capacité de combiner la recherche vectorielle avec d'autres types de filtres (recherche par mot-clé, filtres géospatiaux, traversées de graphe) au sein d'une même requête DQL ou GraphQL.1 Des exemples montrent l'utilisation d'embeddings générés par des modèles HuggingFace.29  
Pour les besoins *de base* en recherche vectorielle d'AutoAgent V1, la fonctionnalité intégrée de Dgraph pourrait être suffisante et éviterait d'introduire une dépendance supplémentaire vers une base de données vectorielle dédiée (comme Qdrant, mentionné dans la requête initiale). Cependant, si les besoins en recherche vectorielle deviennent plus exigeants en termes de volume, de latence ou de précision, les limitations potentielles en termes de configurabilité et les performances inconnues par rapport aux solutions spécialisées devront être sérieusement considérées.

**Tableau 2 : Résumé de la Validation des Fonctionnalités Clés de Dgraph v24+ OSS**

| Fonctionnalité Clé | Revendiquée en OSS v24+? | Source(s) de Validation | Statut Confirmé | Limitations / Préoccupations Clés |
| :---- | :---- | :---- | :---- | :---- |
| Transactions ACID Distr. | Oui | 3 | Partiel / Non Vérifié | Mécanismes (MVCC, Raft) présents. Test Jepsen historique (v1.0.2) a trouvé des problèmes.9 Pas de vérification Jepsen récente pour v24+ \[Insight IV.A\]. |
| Sharding Automatique | Oui | 3 | Oui | Sharding par prédicat. Géré par les nœuds Zero. Fonctionnalité OSS centrale. |
| Réplication Automatique | Oui | 3 | Oui | Basée sur Raft au sein des groupes Alpha. Nécessite 3 nœuds/groupe pour HA. Fonctionnalité OSS centrale. |
| API GraphQL Native | Oui | 3 | Oui | Mature, supporte requêtes, mutations, subscriptions, fédération, vecteurs. Limitations possibles sur filtrage avancé/complexe \[Insight IV.C\]. |
| Recherche Vectorielle Nat. | Oui | 5 | Oui | Index HNSW avec config. de base (metric, exponent). Moins configurable que solutions dédiées \[Insight IV.D\]. Performance vs dédié inconnue. |

## **V. Analyse Comparative des Performances**

Évaluer les performances relatives de Dgraph v24+ par rapport à ses alternatives directes dans le contexte d'AutoAgent (Neo4j Community Edition, ArangoDB Community Edition) est essentiel, mais se heurte à un manque notable de données de benchmarking fiables et récentes.

### **A. Examen des Benchmarks Disponibles**

Les informations de performance disponibles proviennent principalement de sources partiales ou ne sont pas directement comparables :

* **Benchmarks publiés par Dgraph/Hypermode :**  
  * Un benchmark plus ancien (pré-v24, publié en 2017\) comparait Dgraph à Neo4j, affirmant que Dgraph était significativement plus rapide pour le chargement de données (160x) et pour les charges mixtes lecture/écriture (3x à 6x), tout en consommant beaucoup moins de mémoire (5x moins).63 Ces résultats, bien qu'impressionnants, doivent être considérés avec prudence en raison de leur âge, de leur source (Dgraph Labs à l'époque), et des critiques méthodologiques soulevées par la communauté Neo4j concernant la configuration "naïve" de Neo4j utilisée dans le test.63  
  * Plus récemment, Hypermode a communiqué sur les **gains de performance de Dgraph v24.1** par rapport à v24.0.10 Ces gains incluent une amélioration jusqu'à 1000x pour certaines requêtes eq() grâce au nouveau planificateur, une amélioration moyenne de 38.66% des lectures grâce au cache optimisé, des écritures avec index jusqu'à 50% plus rapides, et des requêtes count() jusqu'à 3x plus rapides. Ces chiffres sont spécifiques à des optimisations internes et, bien que prometteurs, manquent de contexte comparatif externe et de validation indépendante pour la charge de travail spécifique d'AutoAgent.  
* **Benchmarks Indépendants / Communautaires :**  
  * Les sources fournies **ne contiennent pas de benchmarks récents, indépendants et rigoureux** comparant Dgraph v24+ à Neo4j Community et ArangoDB Community sur des charges de travail de graphe pertinentes (traversées complexes, écritures concurrentes, requêtes GraphQL).  
  * Des plateformes de comparaison basées sur les avis utilisateurs comme G2 existent.52 Elles attribuent à Dgraph des scores élevés pour le modèle de données, le langage de requête, la recherche intégrée et l'optimisation des requêtes par rapport à Neo4j 52 et ArangoDB.65 Cependant, ces scores reflètent des perceptions subjectives d'utilisateurs et ne constituent pas une mesure de performance technique rigoureuse.  
  * Des articles de blog proposent des comparaisons qualitatives 45, suggérant que Dgraph pourrait exceller sur des débits élevés lecture/écriture sur de grands datasets grâce à son architecture distribuée, tandis que Neo4j serait plus simple d'usage et potentiellement performant sur des traversées complexes sur des datasets plus petits (limités par le nœud unique en CE).  
  * Des benchmarks existent comparant ArangoDB et Neo4j (souvent publiés par ArangoDB 36), montrant généralement ArangoDB comme étant plus performant sur certaines tâches de calcul de graphe et de chargement, mais ces tests n'incluent pas Dgraph.  
* **Tests Jepsen :** Il est important de rappeler que les tests Jepsen 9 évaluent la **correction** et la **cohérence** sous conditions de pannes (partitions réseau, pannes de processus, désynchronisation d'horloges), et non la performance brute en termes de latence ou de débit.

Ce manque critique de données de benchmarking indépendantes et récentes pour Dgraph v24+ face à ses concurrents directs dans le segment gratuit/OSS constitue une lacune majeure pour une prise de décision éclairée basée sur les performances. Se fier aux affirmations des fournisseurs, à des comparaisons qualitatives ou à des benchmarks obsolètes ou non pertinents présente un risque élevé d'erreur d'évaluation.

### **B. Considérations sur les Performances pour les Charges de Travail d'AutoAgent**

En l'absence de benchmarks directs, l'évaluation des performances doit se baser sur l'architecture revendiquée, les optimisations annoncées et les problèmes rapportés, en relation avec le profil de charge probable d'AutoAgent.

* **Profil de Charge d'AutoAgent (inféré) :** Le système AutoAgent, gérant des missions, tâches, agents et artefacts avec des dépendances complexes, impliquera vraisemblablement :  
  * Des **traversées de graphe complexes** pour déterminer les dépendances de tâches, l'état des missions, ou les relations entre artefacts et agents.  
  * Des **écritures concurrentes potentiellement élevées** pour mettre à jour l'état des tâches et des agents en temps réel, ainsi que pour stocker de nouveaux artefacts.  
  * Des **requêtes API** (probablement via GraphQL) pour exposer l'état du système à l'utilisateur ou à d'autres composants.  
  * Potentiellement, des **requêtes de recherche vectorielle** si des capacités sémantiques sont intégrées.  
* **Forces Théoriques de Dgraph :**  
  * L'architecture distribuée native avec sharding par prédicat est conçue pour la **scalabilité horizontale** et le traitement parallèle des requêtes, visant une faible latence même sur de grands volumes de données et pour des jointures/traversées distribuées.3  
  * Les améliorations de **Dgraph v24.1** ciblent spécifiquement l'optimisation des requêtes (planificateur pour eq), l'efficacité du cache (réduction des lectures disque), et la performance des écritures sur prédicats indexés.10  
* **Faiblesses Potentielles / Rapports :**  
  * Les **problèmes de performance rapportés sur v24.0.2 sous charge** 15 indiquent que les performances réelles peuvent dévier des attentes théoriques, possiblement à cause de régressions ou de complexités non maîtrisées dans les nouvelles versions.  
  * Les erreurs "Unhealthy connection" 16 suggèrent des **goulots d'étranglement potentiels dans la communication inter-nœuds** lors de requêtes distribuées complexes ou volumineuses.  
  * Le **planificateur de requêtes**, bien qu'introduit, était initialement limité aux fonctions eq (en v24.1), avec des extensions prévues pour les fonctions de comparaison (gt, lt).10 La maturité de l'optimisation pour des traversées de graphe arbitrairement complexes reste incertaine par rapport à des optimiseurs plus établis comme celui de Cypher (Neo4j).  
* **Comparaison Qualitative avec les Alternatives (OSS/Gratuit) :**  
  * **Neo4j Community Edition :** Limité à un seul nœud, sa performance brute est plafonnée par les ressources de ce serveur.3 Cependant, son optimiseur Cypher est mature, et pour des requêtes complexes sur un dataset tenant sur un seul nœud, il pourrait être très performant. L'absence de distribution simplifie l'analyse des performances.  
  * **ArangoDB Community Edition :** Offre le clustering, permettant une scalabilité horizontale.23 Son langage AQL est puissant. Les performances dépendront fortement de la configuration du cluster et de la nature des requêtes (document, graphe, ou mixte). Sa complexité se situe entre Neo4j CE et Dgraph HA.

En conclusion, bien que l'architecture distribuée de Dgraph semble théoriquement adaptée aux charges de travail potentiellement distribuées et complexes d'AutoAgent, l'incertitude demeure. Le manque de benchmarks indépendants récents et les rapports préoccupants sur la stabilité et les performances de la v24 sous charge rendent difficile toute prédiction fiable. Les améliorations annoncées en v24.1 sont positives sur le papier, mais nécessitent une validation rigoureuse pour les types de requêtes spécifiques qu'AutoAgent utilisera (probablement au-delà des simples filtres eq). Le risque de rencontrer des performances décevantes ou imprévisibles en production auto-hébergée avec Dgraph v24+ est jugé significatif.

## **VI. Comparaison de la Complexité Opérationnelle (Auto-hébergé, Gratuit)**

Le choix d'une base de données auto-hébergée et gratuite impose une évaluation attentive de la complexité liée à son déploiement, sa configuration, sa gestion quotidienne (sauvegardes, mises à jour, surveillance) et sa maintenance.

### **A. Cluster Dgraph (Zero \+ Alpha)**

* **Architecture et Déploiement :** Un cluster Dgraph fonctionnel nécessite au minimum un nœud Dgraph Zero (gestion des métadonnées, consensus, équilibrage des shards) et un nœud Dgraph Alpha (stockage et service des données).12 Cependant, pour atteindre la **haute disponibilité (HA)**, la configuration recommandée et typique implique **3 nœuds Zero et 3 nœuds Alpha** (ou plus, si plusieurs groupes de shards sont nécessaires), chacun devant idéalement tourner sur une machine physique ou virtuelle distincte, de préférence dans des zones de disponibilité différentes.11 Le déploiement se fait couramment via Docker 3 ou Kubernetes 67, avec des binaires disponibles pour Linux/amd64.3 Une configuration réseau précise est nécessaire pour permettre la communication entre les nœuds Zero, les nœuds Alpha, et les clients, sur des ports spécifiques.11  
* **Configuration et Ressources :** Le déploiement d'un cluster Dgraph HA exige des **ressources matérielles substantielles** : CPU multi-cœurs (8-16 vCPU recommandés par nœud Alpha), mémoire vive importante (16-32 Go+ par nœud Alpha), et stockage SSD rapide à IOPS élevées (1000-3000+ IOPS recommandés).11 Des ajustements au niveau du système d'exploitation sont également requis (par exemple, augmenter la limite de descripteurs de fichiers).11 La configuration des nœuds Dgraph eux-mêmes se fait via des options en ligne de commande, qui peuvent être nombreuses et complexes, notamment avec l'introduction de "superflags" regroupant plusieurs options.49  
* **Gestion et Maintenance :** La gestion opérationnelle inclut :  
  * **Surveillance :** Il est fortement recommandé de mettre en place des outils de surveillance externes comme Prometheus pour les métriques et Grafana pour la visualisation, ainsi que Jaeger pour le traçage distribué, afin d'avoir une visibilité sur l'état et les performances du cluster.11  
  * **Sauvegardes et Restaurations :** Historiquement, les sauvegardes binaires efficaces étaient une fonctionnalité de l'édition Enterprise.40 La version OSS propose une fonctionnalité d'exportation des données 11, moins performante pour la restauration. L'annonce de l'inclusion des **sauvegardes binaires dans la version OSS de Dgraph v25** 2 est une amélioration majeure très attendue, mais sa disponibilité et sa fiabilité dépendent de la sortie effective de v25. Une politique de sauvegardes régulières (complètes quotidiennes, incrémentielles toutes les 2-4h) est recommandée.11  
  * **Mises à jour :** La mise à jour d'un cluster distribué nécessite une procédure coordonnée pour éviter les interruptions de service.  
  * **Dépannage :** La nature distribuée du système peut rendre le diagnostic des problèmes plus complexe, comme l'illustrent les difficultés rencontrées par les utilisateurs pour identifier les causes des erreurs "Unhealthy connection".16  
* **Complexité Globale :** La complexité opérationnelle d'un cluster Dgraph auto-hébergé en configuration HA est **élevée**. Elle découle directement de la nécessité de gérer un système distribué composé de 6 nœuds minimum, avec des exigences matérielles importantes et la nécessité d'une expertise en administration de systèmes distribués, en configuration réseau, et en outils de surveillance.

### **B. Neo4j Community Edition**

* **Architecture et Déploiement :** L'édition Community gratuite de Neo4j est fondamentalement **mono-serveur**.3 La réplication et le clustering sont des fonctionnalités réservées à l'édition Enterprise.3 Le déploiement est simple : via une image Docker officielle, une application Neo4j Desktop pour le développement local, ou une installation directe des binaires.22  
* **Configuration et Ressources :** La configuration d'un nœud unique est beaucoup plus simple que celle d'un cluster distribué. Les exigences en ressources dépendent de la taille du graphe et de la charge, mais sont généralement inférieures à celles d'un cluster Dgraph HA pour une même quantité de données initiale.  
* **Gestion et Maintenance :** Les tâches opérationnelles (sauvegardes, surveillance, mises à jour) sont celles d'une base de données mono-serveur standard, considérablement moins complexes que la gestion d'un état distribué, du consensus, ou des partitions réseau.  
* **Complexité Globale :** La complexité opérationnelle est **faible** pour un déploiement de base. La principale limitation n'est pas la complexité, mais l'**absence native de haute disponibilité et de scalabilité horizontale** dans la version gratuite. Un autre point important est la licence **GPLv3** 3, plus restrictive que l'Apache 2.0 et pouvant avoir des implications sur la distribution ou la liaison avec le code d'AutoAgent, nécessitant une analyse juridique spécifique.

### **C. ArangoDB Community Edition**

* **Architecture et Déploiement :** ArangoDB est une base de données **multi-modèle** (Document, Graphe, Clé/Valeur).23 Point important, l'édition Community **supporte le déploiement en cluster** 23, offrant une voie vers la haute disponibilité et la scalabilité horizontale dans la version gratuite. Le déploiement peut se faire via Docker, un opérateur Kubernetes 68, ou des paquets natifs. Un cluster ArangoDB implique plusieurs types de composants : Agents (pour le consensus et la configuration), DBServers (pour le stockage des données), et Coordinators (pour le traitement des requêtes).  
* **Configuration et Ressources :** La mise en place d'un cluster ArangoDB nécessite une configuration soignée des rôles de chaque nœud et de leur communication. Les exigences en ressources dépendent de la taille et de la configuration du cluster.  
* **Gestion et Maintenance :** La gestion d'un cluster ArangoDB implique des tâches similaires à celles de Dgraph (surveillance, sauvegardes, mises à jour coordonnées), mais avec une architecture et des composants différents. ArangoDB fournit une interface web d'administration (Aardvark).69  
* **Complexité Globale :** La complexité opérationnelle pour un déploiement en cluster est **modérée à élevée**, probablement comparable à celle de Dgraph en termes de nécessité de gérer un système distribué. Bien que le clustering soit disponible en Community Edition, certaines fonctionnalités avancées optimisant les performances ou la gestion des données distribuées (comme SmartGraphs, SmartJoins, OneShard) sont réservées à l'édition Enterprise.23 La licence **Apache 2.0** 23 est un avantage par rapport à Neo4j CE.

En synthèse, le choix de Dgraph pour AutoAgent V1, s'il vise la haute disponibilité dès le départ, implique d'accepter une charge opérationnelle significativement plus élevée que celle de Neo4j Community Edition. ArangoDB Community Edition représente une alternative intéressante offrant le clustering sous licence Apache 2.0, mais sa propre complexité de gestion en cluster doit être évaluée. La décision doit donc soigneusement peser le besoin réel de distribution et de HA pour la V1 d'AutoAgent par rapport à la capacité et à la volonté d'investir les ressources nécessaires à la gestion d'un système distribué complexe comme Dgraph ou ArangoDB en cluster, surtout compte tenu des contraintes de gratuité et d'auto-hébergement. L'arrivée promise des sauvegardes binaires OSS en Dgraph v25 2 réduira un point de friction opérationnel historique, mais ne changera pas la nature fondamentalement complexe de l'administration d'un cluster distribué.

**Tableau 3 : Comparaison de la Complexité Opérationnelle (Auto-hébergé, Gratuit)**

| Aspect | Dgraph v24+ OSS | Neo4j Community Edition | ArangoDB Community Edition |
| :---- | :---- | :---- | :---- |
| **Architecture** | Distribuée (Zero \+ Alpha) 12 | Mono-serveur 3 | Multi-modèle, Clusterisable 23 |
| **HA/Scalabilité (Gratuit)** | Oui (3 Zero \+ 3 Alpha min) 11 | Non (Fonctionnalité Enterprise) 3 | Oui (Cluster CE) 23 |
| **Déploiement Options** | Docker, K8s, Binaire (Linux) 3 | Docker, Desktop, Binaire 22 | Docker, K8s Operator, Paquets 68 |
| **Complexité Configuration** | Élevée (Cluster, Ressources, Flags) 11 | Faible (Mono-nœud) | Modérée/Élevée (Cluster) |
| **Sauvegarde/Restauration (Gratuit)** | Export OSS.11 Binaire prévu v25 2 | Outils mono-serveur standards | Outils de cluster standards |
| **Surveillance** | Externe recommandée (Prometheus, Jaeger) 11 | Outils mono-serveur standards | Outils de cluster, UI Web 69 |
| **Complexité Globale (HA)** | Élevée | N/A (Très faible si mono-nœud acceptable) | Modérée/Élevée |
| **Licence OSS** | Apache 2.0 3 | GPLv3 3 | Apache 2.0 23 |

## **VII. Évaluation du Client Go (dgo)**

La qualité et la maturité du client Go officiel, dgo, sont essentielles pour l'intégration de Dgraph dans AutoAgent, développé en Go.

### **A. Maturité, Documentation et Conception de l'API**

Le client dgo est le client Go officiel pour Dgraph, maintenu activement par l'équipe Hypermode sous le dépôt hypermodeinc/dgo.13 Il semble mature, avec une version stable (v240 utilisée dans les chemins d'import et exemples 70) et des API expérimentales pour la future v25 également présentes.13 Le client utilise les modules Go et requiert une version récente de Go (1.22/1.23 mentionné).14 Sa popularité relative, indiquée par les étoiles et forks sur GitHub 13, suggère une adoption par la communauté.

La documentation disponible semble de bonne qualité. Le fichier README.md du dépôt 13 fournit un bon aperçu, des exemples clairs pour la connexion (y compris via chaînes de connexion, vers Dgraph Cloud, avec authentification ACL), et pour les opérations de base (modification de schéma, mutations, requêtes, transactions). Une page de documentation dédiée existe également sur le site de Dgraph 14, qui renvoie vers la documentation GoDoc complète pour les détails de l'API. Des exemples de code sont inclus dans le dépôt lui-même.70

La conception de l'API semble idiomatique en Go. Elle propose des fonctions simples comme dgo.Open pour les cas d'usage courants via des chaînes de connexion 13, et des constructeurs plus flexibles comme dgo.NewClient et dgo.NewRoundRobinClient pour des configurations avancées ou la connexion à plusieurs Alphas.13 La gestion des transactions se fait via un objet Txn obtenu par NewTxn(), avec des méthodes claires Commit() et Discard().14 Les opérations DQL sont exécutées via des fonctions dédiées comme RunDQL et RunDQLWithVars.13

### **B. Couverture des Fonctionnalités (Transactions, v24+) et Maintenance**

Le client dgo couvre bien les fonctionnalités fondamentales de Dgraph :

* Exécution de requêtes et mutations DQL.13  
* Modification du schéma via la méthode Alter (API v1) ou SetSchema (API v25).13  
* Gestion complète des **transactions ACID**, y compris les transactions en lecture seule et les options "best-effort".13  
* Support des opérations **Upsert** (requête \+ mutation conditionnelle) via la méthode Do de l'objet transaction.13  
* Gestion de l'**authentification** (ACL via login/password, clés API Dgraph Cloud, tokens Bearer).13  
* Support expérimental des **namespaces** de Dgraph v25 (création, suppression, renommage, listing).13

Cependant, un point d'incertitude majeur concerne le support explicite de la **recherche vectorielle**, une fonctionnalité clé de Dgraph v24+. **Aucun des extraits de code ou de documentation fournis pour dgo (**13**\-**13**) ne montre d'exemple concret ou d'API dédiée pour construire ou exécuter une requête de similarité vectorielle** (utilisant similar\_to en DQL ou les requêtes GraphQL querySimilar\*). Bien qu'il soit très probable que de telles requêtes puissent être exécutées en passant la chaîne DQL complète aux fonctions RunDQL ou RunDQLWithVars, l'absence d'abstractions ou d'assistants spécifiques dans le client pour gérer les vecteurs (en entrée et en sortie) est notable. Cela pourrait rendre l'intégration de la recherche vectorielle dans AutoAgent moins aisée et plus sujette aux erreurs que si des API dédiées existaient. Cette absence dans la documentation fournie constitue une lacune d'information significative.

Concernant la **maintenance**, le client dgo semble activement maintenu. Le dépôt GitHub montre des commits récents 13, des mises à jour régulières des dépendances (par exemple, Go 1.23.6, gRPC v1.70.0 via renovate\[bot\]) 71, et un nombre actuellement faible d'issues et de PR ouvertes.3

En résumé, dgo est un client Go mature, bien conçu et activement maintenu, qui couvre solidement les fonctionnalités transactionnelles et administratives de base de Dgraph. Son adéquation pour AutoAgent est bonne pour les opérations standards. Toutefois, le manque de documentation ou d'API explicites pour la recherche vectorielle v24+ dans les sources fournies est un point faible potentiel qui nécessiterait une vérification plus approfondie (par exemple, en examinant directement le code source du client ou les notes de version les plus récentes) si AutoAgent prévoit d'utiliser intensivement cette fonctionnalité.

## **VIII. Synthèse de l'Évaluation des Risques pour Dgraph**

L'adoption de Dgraph v24+ comme base de données principale pour AutoAgent V1 comporte plusieurs risques techniques, opérationnels et liés à l'écosystème, qui doivent être soigneusement pesés.

### **A. Risques Techniques**

* **Stabilité / Fiabilité : Risque Élevé.** C'est le risque le plus critique identifié. Des rapports utilisateurs récents et détaillés sur le forum officiel 15 font état de problèmes significatifs de performance (fortes latences, utilisation CPU excessive) et de stabilité (erreurs "Unhealthy connection") avec la version v24+ en environnement de production auto-hébergé et sous charge. Ces problèmes semblent liés à des changements fondamentaux dans le moteur (système de cache 15) ou à des complexités inhérentes à la communication distribuée.16 Bien que Hypermode investigue et propose des correctifs 15, ces incidents remettent sérieusement en question la maturité et la fiabilité de la v24+ pour une application comme AutoAgent exigeant une haute disponibilité. De plus, l'absence de validation indépendante récente (type Jepsen) des garanties ACID distribuées pour v24+ \[Insight IV.A\] ajoute à l'incertitude. La focalisation de Hypermode sur l'IA pourrait aussi potentiellement se faire au détriment de la stabilisation du cœur \[Insight III.A\].  
* **Maturité / Complétude des Fonctionnalités : Risque Moyen.** Bien que Dgraph offre un ensemble de fonctionnalités riche (distribution native, GraphQL, vecteurs), des interrogations subsistent. Le filtrage avancé en GraphQL pourrait être limité \[Insight IV.C\]. La configurabilité de l'index HNSW pour la recherche vectorielle semble basique par rapport aux solutions dédiées \[Insight IV.D\]. Le support explicite de la recherche vectorielle dans le client Go dgo n'est pas documenté dans les sources fournies. Des demandes de fonctionnalités plus anciennes de la communauté sont peut-être encore en attente.17  
* **Performance : Risque Moyen à Élevé.** Le manque flagrant de benchmarks indépendants récents comparant Dgraph v24+ à Neo4j CE et ArangoDB CE rend l'évaluation objective difficile \[Insight V.A\]. Les gains de performance annoncés pour v24.1 10 sont prometteurs mais non vérifiés pour la charge d'AutoAgent. Les problèmes de performance rapportés par les utilisateurs sous charge en v24.0.2 15 indiquent un risque réel de ne pas atteindre les performances attendues ou d'avoir des performances imprévisibles.

### **B. Risques Opérationnels**

* **Complexité (pour HA) : Risque Élevé.** La gestion d'un cluster Dgraph auto-hébergé en haute disponibilité (minimum 6 nœuds) est intrinsèquement complexe.11 Cela requiert une expertise significative en systèmes distribués, des ressources matérielles importantes, une configuration minutieuse et une surveillance constante. Cette complexité est un fardeau potentiellement lourd pour une équipe projet, surtout comparée à la simplicité d'une solution mono-nœud \[Insight VI\].  
* **Documentation : Risque Moyen.** La documentation est en cours de refonte 11, ce qui est positif à terme mais peut entraîner des incohérences ou des manques pendant la transition. Une documentation fiable et complète est pourtant cruciale pour gérer un système complexe en auto-hébergement \[Insight III.C\]. Les faiblesses historiques de la documentation 52 accentuent ce risque.  
* **Sauvegarde / Restauration : Risque Faible à Moyen.** Les sauvegardes binaires, plus robustes que l'export OSS 11, étaient historiquement une fonctionnalité payante et un point de friction.40 Leur intégration promise dans la version OSS de Dgraph v25 2 atténue considérablement ce risque. Le risque résiduel dépend du respect du calendrier de v25 et de la qualité de l'implémentation de cette fonctionnalité en OSS.

### **C. Risques liés à l'Écosystème**

* **Viabilité / Support à Long Terme : Risque Moyen.** L'acquisition par Hypermode apporte des ressources financières et une nouvelle direction.1 Cependant, leur stratégie est fortement axée sur l'IA et l'intégration de Dgraph dans leur propre plateforme (Modus).1 La priorité accordée au cœur open-source de Dgraph en tant que produit autonome et stable sur le long terme, indépendamment de Modus, devra être surveillée. La communauté Dgraph, bien qu'active, est plus petite que celle de concurrents 46, et la pérennité d'un support expert gratuit pour les utilisateurs auto-hébergés est incertaine.  
* **Licence : Risque Faible (Conditionnel).** La licence actuelle Apache 2.0 3 est idéale pour les contraintes d'AutoAgent. L'engagement de passer Dgraph v25 entièrement sous Apache 2.0 2 est un signal très positif. Le risque est faible, à condition que Hypermode respecte cet engagement (Dgraph a connu des changements de licence par le passé 75).

**Tableau 4 : Matrice des Risques de Dgraph v24+ pour AutoAgent V1**

| Domaine de Risque | Niveau de Risque | Preuves / Sources Clés | Facteurs d'Atténuation / Notes |
| :---- | :---- | :---- | :---- |
| **Technique** |  |  |  |
| Stabilité / Fiabilité | Élevé | Rapports utilisateurs v24+.15 Cache.15 | Correctifs v24.0.3+.15 Efforts de stabilisation par Hypermode.24 |
| Maturité Fonctionnalités | Moyen | GraphQL avancé? \[IV.C\]. Vecteur tunable? \[IV.D\]. dgo?. | Développement actif \[III.A\]. v25 apporte fonctionnalités EE.2 |
| Performance | Moyen / Élevé | Manque benchmarks indép. \[V.A\]. Rapports v24.15 | Améliorations v24.1 annoncées.10 Architecture distribuée théoriquement adaptée. |
| **Opérationnel** |  |  |  |
| Complexité (HA) | Élevé | Cluster 6+ nœuds.11 Ressources.11 | Inhérent à l'architecture distribuée. Alternatives plus simples existent. |
| Documentation | Moyen | En refonte.11 Historique.52 | Effort d'amélioration par Hypermode.11 |
| Sauvegarde / Restauration | Faible / Moyen | Historique.40 Export OSS.11 | Sauvegardes binaires OSS prévues pour v25 2, réduirait significativement le risque si livré. |
| **Écosystème** |  |  |  |
| Viabilité / Support LT | Moyen | Acquisition Hypermode.17 Focus IA.1 Communauté? | Financement.17 Équipe dédiée.17 Engagement OSS v25.2 |
| Licence | Faible | Apache 2.0.3 | Engagement fort pour v25 tout Apache 2.0.2 À surveiller (historique de changements 75). |

## **IX. Évaluation des Alternatives Principales**

Si les risques associés à Dgraph sont jugés trop élevés, Neo4j Community Edition et ArangoDB Community Edition constituent les alternatives open-source et auto-hébergeables les plus crédibles.

### **A. Neo4j Community Edition**

* **Points Forts :**  
  * **Maturité et Écosystème :** Base de données graphe la plus ancienne et la plus populaire, avec une communauté très large, une documentation exhaustive et un riche écosystème d'outils et de bibliothèques (ex: GDS pour les algorithmes 76).22  
  * **Simplicité Opérationnelle :** Le modèle mono-serveur de l'édition Community rend le déploiement et la gestion beaucoup plus simples qu'un cluster distribué \[Insight VI\].  
  * **Langage Cypher :** Langage de requête déclaratif mature, puissant et relativement intuitif pour les opérations sur graphes.22  
  * **Algorithmes de Graphe :** Dispose d'une bibliothèque très complète d'algorithmes de graphe via le plugin Graph Data Science (GDS), dont une partie est open-source (OpenGDS).45  
* **Points Faibles :**  
  * **Absence de HA/Scalabilité Native (CE) :** La limitation majeure est l'architecture mono-serveur. Pas de haute disponibilité ni de scalabilité horizontale intégrées dans la version gratuite.3 La performance est limitée par les ressources d'une seule machine.  
  * **Licence GPLv3 :** La licence GNU GPL v3 3 est plus restrictive que l'Apache 2.0. Elle impose des contraintes de réciprocité qui pourraient affecter la manière dont AutoAgent est développé, distribué ou lié à la base de données, nécessitant une analyse juridique approfondie.  
  * **Pas de GraphQL Natif / Recherche Vectorielle Native (CE) :** Bien qu'il existe des bibliothèques pour intégrer GraphQL, ce n'est pas une fonctionnalité native comme dans Dgraph. Le support de la recherche vectorielle est également moins intégré nativement dans la CE.  
* **Adéquation pour AutoAgent :** Neo4j CE est une option viable **uniquement si** les besoins de performance et de disponibilité d'AutoAgent V1 peuvent être satisfaits par un unique serveur robuste et si la licence GPLv3 est jugée acceptable. Sa simplicité opérationnelle est un atout majeur. Cependant, l'absence de voie d'évolution vers la HA/scalabilité sans passer à la version Enterprise payante est un inconvénient stratégique important.

### **B. ArangoDB Community Edition**

* **Points Forts :**  
  * **Licence Apache 2.0 :** Licence permissive, alignée avec les préférences d'AutoAgent.23  
  * **Clustering Disponible en CE :** Permet de déployer un cluster pour la haute disponibilité et la scalabilité horizontale dans la version gratuite 23, offrant une alternative directe à l'architecture distribuée de Dgraph.  
  * **Multi-modèle :** Support natif des modèles Document, Graphe et Clé/Valeur, offrant une flexibilité potentielle si les besoins d'AutoAgent évoluent au-delà du pur graphe.23  
  * **Écosystème Actif :** Développement actif, communauté présente, et divers pilotes officiels (Go, Python, Java, JS).23  
  * **AQL :** Langage de requête unifié permettant des opérations complexes sur les différents modèles de données.23  
* **Points Faibles :**  
  * **Complexité Opérationnelle (Cluster) :** Le déploiement et la gestion d'un cluster ArangoDB, bien que possible en CE, présentent une complexité significative, potentiellement comparable à celle de Dgraph \[Insight VI\].  
  * **Maturité/Performance Graphe vs Dédié :** Bien que performant (des benchmarks récents le montrent plus rapide que Neo4j sur certaines tâches 36), ses capacités spécifiques au modèle graphe pourraient être moins matures ou optimisées que celles d'une base purement graphe comme Neo4j.  
  * **Courbe d'Apprentissage :** La nature multi-modèle et le langage AQL peuvent présenter une courbe d'apprentissage plus raide pour les équipes habituées aux bases de données relationnelles ou graphes pures.46  
  * **Fonctionnalités Enterprise :** Certaines fonctionnalités avancées pour optimiser les performances ou la gestion des clusters (SmartGraphs, OneShard) sont réservées à l'édition Enterprise.23  
  * **GraphQL / Recherche Vectorielle :** Le support natif de GraphQL est moins central que pour Dgraph. La recherche vectorielle est également une addition plus récente (via ArangoSearch).  
* **Adéquation pour AutoAgent :** ArangoDB CE apparaît comme une **alternative très sérieuse à Dgraph**. Elle partage la licence Apache 2.0 et offre une voie vers la haute disponibilité et la scalabilité via le clustering en version gratuite. Sa nature multi-modèle pourrait être un avantage ou un inconvénient selon la pureté du modèle de données d'AutoAgent. La complexité opérationnelle en mode cluster reste un facteur important à évaluer, mais elle évite les risques spécifiques liés à l'écosystème Dgraph/Hypermode actuel (stabilité v24, incertitudes roadmap).

**Tableau 5 : Comparaison des Alternatives selon les Exigences d'AutoAgent V1**

| Exigence | Dgraph v24+ OSS | Neo4j Community Edition | ArangoDB Community Edition |
| :---- | :---- | :---- | :---- |
| Auto-hébergeable | ✅ | ✅ | ✅ |
| Gratuit / Sans Licence | ✅ | ✅ | ✅ |
| Licence Permissive (Apache 2.0 pref.) | ✅ (Apache 2.0) 3 | ❌ (GPLv3) 3 | ✅ (Apache 2.0) 23 |
| Intégration Go (Client Off.) | ✅ (dgo mature) 13 | ✅ (Client officiel) | ✅ (Client officiel) 68 |
| Distribué / HA (Gratuit) | ✅ (Natif) 3 | ❌ (Mono-nœud) 3 | ✅ (Cluster CE) 23 |
| GraphQL Natif | ✅ (Mature) 3 | ❌ (Via extensions) | △ (Moins central) |
| Recherche Vectorielle Native (Gratuit) | ✅ (HNSW basique) 5 | ❌ (Moins intégré) | △ (Via ArangoSearch) |
| Simplicité Opérationnelle | ❌ (Élevée pour HA) \[VI.A\] | ✅ (Faible si mono-nœud) | ❌ (Modérée/Élevée pour Cluster) \[VI.C\] |
| Maturité Écosystème/Support | △ (En transition, \< Neo4j) | ✅ (Très mature) \[IX.A\] | ✅ (Mature) |

## **X. Conclusion et Recommandation**

L'évaluation approfondie de Dgraph v24+ sous la direction de Hypermode révèle une technologie en pleine évolution, avec des atouts indéniables mais aussi des risques significatifs dans le contexte spécifique du projet AutoAgent V1.

**A. Synthèse des Constats sur la Pertinence de Dgraph**

Dgraph présente des caractéristiques théoriquement attrayantes pour AutoAgent : une architecture nativement distribuée promettant scalabilité et haute disponibilité 3, une licence open-source permissive Apache 2.0 3, une API GraphQL native 4 et l'ajout récent de capacités de recherche vectorielle.5 L'engagement de Hypermode à rendre la version v25 entièrement open-source, en y intégrant des fonctionnalités clés comme les sauvegardes binaires 2, est un signal très positif pour la communauté et répond à une contrainte majeure du projet. Le développement actif 3 et la maintenance du client Go dgo 71 sont également des points favorables.

Cependant, ces points positifs sont contrebalancés par des risques substantiels et des incertitudes critiques :

1. **Stabilité et Fiabilité (Risque Élevé) :** Des rapports utilisateurs crédibles et récents font état de problèmes majeurs de performance et de stabilité avec Dgraph v24+ en production auto-hébergée sous charge.15 Ces problèmes, potentiellement liés à des changements internes profonds (cache) ou à la complexité distribuée, sont inacceptables pour un composant critique d'AutoAgent qui vise une haute fiabilité.  
2. **Complexité Opérationnelle (Risque Élevé pour HA) :** La mise en œuvre et la gestion d'un cluster Dgraph auto-hébergé pour la haute disponibilité (6+ nœuds) représentent une charge opérationnelle très importante en termes de ressources, d'expertise et de temps 11, potentiellement disproportionnée pour les besoins initiaux de la V1 d'AutoAgent.  
3. **Manque de Validation Indépendante (Risque Moyen/Élevé) :** L'absence de benchmarks indépendants récents pour Dgraph v24+ \[V.A\] et de tests de cohérence type Jepsen récents \[IV.A\] rend difficile la validation objective des affirmations de performance et des garanties ACID distribuées dans la version actuelle.  
4. **Incertitudes Écosystème (Risque Moyen) :** Bien que l'engagement OSS pour v25 soit fort, le calendrier précis reste flou.25 La focalisation stratégique de Hypermode sur l'IA et sa plateforme Modus pourrait influencer les priorités de développement au détriment de la stabilisation du cœur de Dgraph \[III.A\].

**B. Recommandation Finale**

Compte tenu de la priorité absolue accordée à la **fiabilité**, à la **stabilité** et à la **sécurité** pour AutoAgent V1, et au vu des **risques élevés identifiés concernant la stabilité de Dgraph v24+ en production auto-hébergée**, de sa **complexité opérationnelle significative** pour atteindre la haute disponibilité, et du **manque de validation indépendante récente** de ses performances et garanties de cohérence :

**Il est recommandé de NE PAS ADOPTER Dgraph v24+ comme base de données principale pour AutoAgent V1 à ce stade (Recommandation : No-Go).**

**C. Justification**

La décision "No-Go" est principalement motivée par les **preuves de problèmes de stabilité et de performance rapportées par des utilisateurs sur la version v24+**.15 Ces incidents, survenant dans des environnements de production auto-hébergés similaires à celui visé par AutoAgent, indiquent que Dgraph v24+ ne présente pas encore le niveau de maturité et de fiabilité requis pour un système critique comme AutoAgent. Le risque d'introduire une instabilité fondamentale au cœur du système est trop important.

De plus, la **complexité opérationnelle** inhérente à la gestion d'un cluster Dgraph distribué en HA 11 représente un fardeau potentiellement excessif pour l'équipe AutoAgent V1, surtout si les besoins initiaux peuvent être couverts par une solution plus simple. Les bénéfices théoriques de la distribution native de Dgraph ne l'emportent pas sur les risques avérés et la complexité induite dans le contexte actuel.

Enfin, le **manque de données de performance indépendantes et de vérification récente de la cohérence** \[V.A, IV.A\] empêche une évaluation objective et confiante de ces aspects pourtant cruciaux.

**D. Voie Alternative Recommandée**

Face au rejet de Dgraph, il est recommandé d'orienter l'évaluation vers **ArangoDB Community Edition** comme alternative principale :

1. **Justification :** ArangoDB CE offre une combinaison attrayante : licence **Apache 2.0** 23, possibilité de **clustering pour HA/scalabilité** dans la version gratuite 23, et un **écosystème mature**. Elle évite les risques spécifiques liés à la stabilité actuelle de Dgraph v24+ et à l'incertitude de son écosystème post-acquisition. Sa nature multi-modèle peut offrir une flexibilité future.  
2. **Prochaines Étapes :**  
   * Mener une évaluation approfondie d'ArangoDB Community Edition, en se concentrant sur :  
     * La complexité réelle du déploiement et de la gestion d'un cluster CE auto-hébergé.  
     * Les performances spécifiques aux requêtes de type graphe pour la charge de travail d'AutoAgent (rechercher des benchmarks ou en réaliser).  
     * La maturité et la facilité d'utilisation de son client Go officiel.68  
     * L'adéquation de son modèle de graphe et de son langage AQL aux besoins d'AutoAgent.  
   * Envisager **Neo4j Community Edition** comme plan B **uniquement si** une architecture mono-serveur est jugée suffisante pour la V1 *et* si les implications de la licence GPLv3 sont acceptables après analyse juridique. Sa simplicité opérationnelle reste son principal avantage.

En conclusion, bien que Dgraph sous Hypermode présente une vision prometteuse avec son engagement OSS pour v25, les risques actuels liés à sa stabilité et à sa complexité opérationnelle en version v24+ le rendent un choix trop incertain pour la fondation de données d'un projet critique comme AutoAgent V1. L'exploration d'ArangoDB Community Edition offre une voie alternative plus prudente et potentiellement mieux alignée avec l'ensemble des contraintes et exigences du projet.

## **XI. Références**

1

#### **Sources des citations**

1. Why we're continuing to invest in Dgraph \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/why-invest-in-dgraph](https://hypermode.com/blog/why-invest-in-dgraph)  
2. The future of Dgraph is open, serverless, and AI-ready \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/the-future-of-dgraph-is-open-serverless-and-ai-ready](https://hypermode.com/blog/the-future-of-dgraph-is-open-serverless-and-ai-ready)  
3. hypermodeinc/dgraph: high-performance graph database for real-time use cases \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgraph](https://github.com/hypermodeinc/dgraph)  
4. GraphQL API \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/graphql/overview](https://docs.hypermode.com/dgraph/graphql/overview)  
5. v24 \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/v24](https://hypermode.com/blog/v24)  
6. Predicate indexes \- DQL \- Dgraph, consulté le avril 24, 2025, [https://dgraph.io/docs/dql/predicate-indexing/](https://dgraph.io/docs/dql/predicate-indexing/)  
7. HNSW index in depth \- Weaviate, consulté le avril 24, 2025, [https://weaviate.io/developers/academy/py/vector\_index/hnsw](https://weaviate.io/developers/academy/py/vector_index/hnsw)  
8. ACID Transactions \- Design concepts \- Dgraph, consulté le avril 24, 2025, [https://dgraph.io/docs/design-concepts/transactions-concept/](https://dgraph.io/docs/design-concepts/transactions-concept/)  
9. Dgraph 1.0.2 \- Jepsen, consulté le avril 24, 2025, [https://jepsen.io/analyses/dgraph-1-0-2](https://jepsen.io/analyses/dgraph-1-0-2)  
10. Dgraph v24.1: Making knowledge graphs faster with performance enhancements, consulté le avril 24, 2025, [https://hypermode.com/blog/dgraph-v241-knowledge-graphs-faster](https://hypermode.com/blog/dgraph-v241-knowledge-graphs-faster)  
11. Production Checklist \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/self-managed/production-checklist](https://docs.hypermode.com/dgraph/self-managed/production-checklist)  
12. Self-Managed Cluster \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/self-managed/overview](https://docs.hypermode.com/dgraph/self-managed/overview)  
13. hypermodeinc/dgo: Official Dgraph Go client \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo](https://github.com/hypermodeinc/dgo)  
14. Go \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/sdks/go](https://docs.hypermode.com/dgraph/sdks/go)  
15. Performance issues with v24.0.2 \- Dgraph \- Discuss Dgraph, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/performance-issues-with-v24-0-2/19543](https://discuss.dgraph.io/t/performance-issues-with-v24-0-2/19543)  
16. Unhealthy connection when querying \- Dgraph \- Discuss Dgraph, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/unhealthy-connection-when-querying/19357](https://discuss.dgraph.io/t/unhealthy-connection-when-querying/19357)  
17. Dgraph Labs is becoming part of Hypermode \- Dgraph Blog, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/dgraph-labs-is-becoming-part-of-hypermode-dgraph-blog/19040](https://discuss.dgraph.io/t/dgraph-labs-is-becoming-part-of-hypermode-dgraph-blog/19040)  
18. Hypermode \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc](https://github.com/hypermodeinc)  
19. hypermodeinc/dgraph-js: Official Dgraph JavaScript client \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgraph-js](https://github.com/hypermodeinc/dgraph-js)  
20. hypermodeinc/dgraph4j: Official Dgraph Java client \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgraph4j](https://github.com/hypermodeinc/dgraph4j)  
21. hypermodeinc/dgraph-experimental \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgraph-experimental](https://github.com/hypermodeinc/dgraph-experimental)  
22. neo4j/neo4j: Graphs for Everyone \- GitHub, consulté le avril 24, 2025, [https://github.com/neo4j/neo4j](https://github.com/neo4j/neo4j)  
23. arangodb/arangodb: ArangoDB is a native multi-model ... \- GitHub, consulté le avril 24, 2025, [https://github.com/arangodb/arangodb](https://github.com/arangodb/arangodb)  
24. Q1 Update from Dgraph HQ \- Users, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/q1-update-from-dgraph-hq/19257](https://discuss.dgraph.io/t/q1-update-from-dgraph-hq/19257)  
25. Any news about v25? \- Discuss Dgraph, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/any-news-about-v25/19826](https://discuss.dgraph.io/t/any-news-about-v25/19826)  
26. Announcing Dgraph support for Google's Gen AI Toolbox for Databases \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/dgraph-google-gen-ai-toolbox-databases](https://hypermode.com/blog/dgraph-google-gen-ai-toolbox-databases)  
27. Building agents with Dgraph using Google's Gen AI Toolbox for Databases \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/ai-agents-dgraph-google-gen-ai-toolbox](https://hypermode.com/blog/ai-agents-dgraph-google-gen-ai-toolbox)  
28. Blog – Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog](https://hypermode.com/blog)  
29. Product recommendation using RAG on Dgraph \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/20240724\_rag\_on\_graph](https://hypermode.com/blog/20240724_rag_on_graph)  
30. Graph \+ Vector vs Graph on Vector \- Dgraph Blog, consulté le avril 24, 2025, [https://dgraph.io/blog/post/20231010-graph-plus-vector-vs-graph-on-vector/](https://dgraph.io/blog/post/20231010-graph-plus-vector-vs-graph-on-vector/)  
31. Dgraph with Native Vector Support \- The Best of Both Worlds, consulté le avril 24, 2025, [https://dgraph.io/blog/post/20230628-vectordb/](https://dgraph.io/blog/post/20230628-vectordb/)  
32. Product recommendation using RAG on Dgraph \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/rag-on-graph](https://hypermode.com/blog/rag-on-graph)  
33. Intro to Dgraph Vector Embeddings \- GraphQL, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/intro-to-dgraph-vector-embeddings/19598](https://discuss.dgraph.io/t/intro-to-dgraph-vector-embeddings/19598)  
34. hypermodeinc/modusGraph: modusDB: a transactional, embedded database system for model-native apps \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/modusGraph](https://github.com/hypermodeinc/modusGraph)  
35. How to Build an Instant Vector Search App using Hypermode & Modus, consulté le avril 24, 2025, [https://hypermode.com/blog/instant-vector-search-guide](https://hypermode.com/blog/instant-vector-search-guide)  
36. ArangoDB vs. Neo4j: Benchmark Shows 8x Speed Advantage, consulté le avril 24, 2025, [https://arangodb.com/2024/12/benchmark-results-arangodb-vs-neo4j-arangodb-up-to-8x-faster-than-neo4j/](https://arangodb.com/2024/12/benchmark-results-arangodb-vs-neo4j-arangodb-up-to-8x-faster-than-neo4j/)  
37. Overview \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/overview](https://docs.hypermode.com/dgraph/overview)  
38. Celebrating 10000 GitHub Stars \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/10k-github-stars](https://hypermode.com/blog/10k-github-stars)  
39. Engineers Working Remotely: 3 Lessons Learned at Dgraph Labs \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/remote-work-lesson-learnt](https://hypermode.com/blog/remote-work-lesson-learnt)  
40. Dgraph Labs is becoming part of Hypermode \- Dgraph Blog \- \#7 by vnium \- Blog, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/dgraph-labs-is-becoming-part-of-hypermode-dgraph-blog/19040/7](https://discuss.dgraph.io/t/dgraph-labs-is-becoming-part-of-hypermode-dgraph-blog/19040/7)  
41. Discuss Dgraph, consulté le avril 24, 2025, [https://discuss.dgraph.io/](https://discuss.dgraph.io/)  
42. The future of Dgraph is open, serverless, and AI-ready \- Announce, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/the-future-of-dgraph-is-open-serverless-and-ai-ready/19611](https://discuss.dgraph.io/t/the-future-of-dgraph-is-open-serverless-and-ai-ready/19611)  
43. Dgraph Labs is becoming part of Hypermode \- Dgraph Blog \- \#6 by thelovesmith \- Blog, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/dgraph-labs-is-becoming-part-of-hypermode-dgraph-blog/19040/6](https://discuss.dgraph.io/t/dgraph-labs-is-becoming-part-of-hypermode-dgraph-blog/19040/6)  
44. Dgraph Product Roadmap \- Users, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/dgraph-product-roadmap/3315](https://discuss.dgraph.io/t/dgraph-product-roadmap/3315)  
45. Dgraph vs Neo4j: A Comprehensive Comparison for Data Engineers \- luminousmen, consulté le avril 24, 2025, [https://luminousmen.com/post/dgraph-vs-neo4j-a-comprehensive-comparison-for-data-engineers](https://luminousmen.com/post/dgraph-vs-neo4j-a-comprehensive-comparison-for-data-engineers)  
46. 7 Best Graph Databases in 2025 \- PuppyGraph, consulté le avril 24, 2025, [https://www.puppygraph.com/blog/best-graph-databases](https://www.puppygraph.com/blog/best-graph-databases)  
47. The Good, The Bad, The Ugly \- State of Dgraph \- Users, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/the-good-the-bad-the-ugly-state-of-dgraph/17697](https://discuss.dgraph.io/t/the-good-the-bad-the-ugly-state-of-dgraph/17697)  
48. What is Dgraph lacking?, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/what-is-dgraph-lacking/16010](https://discuss.dgraph.io/t/what-is-dgraph-lacking/16010)  
49. Command Reference \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/cli/command-reference](https://docs.hypermode.com/dgraph/cli/command-reference)  
50. Quickstart \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/quickstart](https://docs.hypermode.com/dgraph/quickstart)  
51. Connection \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/ratel/connection](https://docs.hypermode.com/dgraph/ratel/connection)  
52. Compare Dgraph vs. Neo4j Graph Database \- G2, consulté le avril 24, 2025, [https://www.g2.com/compare/dgraph-vs-neo4j-graph-database](https://www.g2.com/compare/dgraph-vs-neo4j-graph-database)  
53. v24 \- Dgraph Blog, consulté le avril 24, 2025, [https://dgraph.io/blog/post/v24/](https://dgraph.io/blog/post/v24/)  
54. FAQ \- Netlify, consulté le avril 24, 2025, [https://release-v21-03--dgraph-docs-repo.netlify.app/docs/v21.03/faq/](https://release-v21-03--dgraph-docs-repo.netlify.app/docs/v21.03/faq/)  
55. Consistency Model \- Design concepts \- Overview \- Dgraph, consulté le avril 24, 2025, [https://dgraph.io/docs/design-concepts/consistency-model/](https://dgraph.io/docs/design-concepts/consistency-model/)  
56. How I solved Jepsen with OpenCensus Distributed Tracing: A personal journey, consulté le avril 24, 2025, [https://dgraph.io/blog/post/solving-jepsen-with-opencensus/](https://dgraph.io/blog/post/solving-jepsen-with-opencensus/)  
57. Comparing Dgraph and Neo4j Graph Databases: Key Differences and Use Cases, consulté le avril 24, 2025, [https://luminousmen.com/post/comparing-dgraph-and-neo4j-graph-databases-key-differences-and-use-cases](https://luminousmen.com/post/comparing-dgraph-and-neo4j-graph-databases-key-differences-and-use-cases)  
58. Search and Filtering \- GraphQL \- Dgraph, consulté le avril 24, 2025, [https://dgraph.io/docs/graphql/schema/directives/search/](https://dgraph.io/docs/graphql/schema/directives/search/)  
59. Similarity Search \- GraphQL \- Dgraph, consulté le avril 24, 2025, [https://dgraph.io/docs/graphql/queries/vector-similarity/](https://dgraph.io/docs/graphql/queries/vector-similarity/)  
60. Releases · hypermodeinc/dgraph \- GitHub, consulté le avril 24, 2025, [https://github.com/dgraph-io/dgraph/releases](https://github.com/dgraph-io/dgraph/releases)  
61. Hierarchical Navigable Small Worlds (HNSW) \- Pinecone, consulté le avril 24, 2025, [https://www.pinecone.io/learn/series/faiss/hnsw/](https://www.pinecone.io/learn/series/faiss/hnsw/)  
62. Using Vector similarity search in DQL \- Dgraph Blog, consulté le avril 24, 2025, [https://discuss.dgraph.io/t/using-vector-similarity-search-in-dql-dgraph-blog/19340](https://discuss.dgraph.io/t/using-vector-similarity-search-in-dql-dgraph-blog/19340)  
63. Benchmark results of Neo4j vs Dgraph \- Google Groups, consulté le avril 24, 2025, [https://groups.google.com/g/neo4j/c/9X-4DA-Llrc](https://groups.google.com/g/neo4j/c/9X-4DA-Llrc)  
64. Neo4j vs Dgraph \- The numbers speak for themselves, consulté le avril 24, 2025, [https://dgraph.io/blog/post/benchmark-neo4j/](https://dgraph.io/blog/post/benchmark-neo4j/)  
65. Compare ArangoDB vs. Dgraph \- G2, consulté le avril 24, 2025, [https://www.g2.com/compare/arangodb-vs-dgraph](https://www.g2.com/compare/arangodb-vs-dgraph)  
66. ArangoDB Benchmark | Performance Testing and Analysis, consulté le avril 24, 2025, [https://arangodb.com/tag/benchmark/](https://arangodb.com/tag/benchmark/)  
67. Single Server Cluster Setup \- Dgraph \- Hypermode, consulté le avril 24, 2025, [https://docs.hypermode.com/dgraph/self-managed/single-server-cluster](https://docs.hypermode.com/dgraph/self-managed/single-server-cluster)  
68. Repositories \- ArangoDB \- GitHub, consulté le avril 24, 2025, [https://github.com/orgs/arangodb/repositories](https://github.com/orgs/arangodb/repositories)  
69. ArangoDB \- GitHub, consulté le avril 24, 2025, [https://github.com/arangodb](https://github.com/arangodb)  
70. dgo/examples\_test.go at main · hypermodeinc/dgo \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo/blob/master/examples\_test.go](https://github.com/hypermodeinc/dgo/blob/master/examples_test.go)  
71. dgo/go.mod at main · hypermodeinc/dgo \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo/blob/main/go.mod](https://github.com/hypermodeinc/dgo/blob/main/go.mod)  
72. dgo/client.go at main · hypermodeinc/dgo \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo/blob/main/client.go](https://github.com/hypermodeinc/dgo/blob/main/client.go)  
73. dgo/client\_v25.go at main · hypermodeinc/dgo \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo/blob/main/client\_v25.go](https://github.com/hypermodeinc/dgo/blob/main/client_v25.go)  
74. dgo/acl\_test.go at main · hypermodeinc/dgo \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo/blob/main/acl\_test.go](https://github.com/hypermodeinc/dgo/blob/main/acl_test.go)  
75. Building a long lasting company around open-source \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/licensing](https://hypermode.com/blog/licensing)  
76. Source code for the Neo4j Graph Data Science library of graph algorithms. \- GitHub, consulté le avril 24, 2025, [https://github.com/neo4j/graph-data-science](https://github.com/neo4j/graph-data-science)  
77. neo4j/neo4j-documentation \- GitHub, consulté le avril 24, 2025, [https://github.com/neo4j/neo4j-documentation](https://github.com/neo4j/neo4j-documentation)  
78. Top 10 Open Source Graph Databases in 2025 | GeeksforGeeks, consulté le avril 24, 2025, [https://www.geeksforgeeks.org/open-source-graph-databases/](https://www.geeksforgeeks.org/open-source-graph-databases/)  
79. Graph Database Battle: Neo4j, TigerGraph, and ArangoDB Compared \- RisingWave, consulté le avril 24, 2025, [https://risingwave.com/blog/graph-database-battle-neo4j-tigergraph-and-arangodb-compared/](https://risingwave.com/blog/graph-database-battle-neo4j-tigergraph-and-arangodb-compared/)  
80. Official Neo4j JDBC Driver \- GitHub, consulté le avril 24, 2025, [https://github.com/neo4j/neo4j-jdbc](https://github.com/neo4j/neo4j-jdbc)  
81. arangodb/python-arango: The official ArangoDB Python driver. \- GitHub, consulté le avril 24, 2025, [https://github.com/arangodb/python-arango](https://github.com/arangodb/python-arango)  
82. How to use Dgraph for OLAP data analysis \- Hypermode, consulté le avril 24, 2025, [https://hypermode.com/blog/analytics-olap-in-dgraph](https://hypermode.com/blog/analytics-olap-in-dgraph)  
83. dgo/doc.go at main · hypermodeinc/dgo \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/dgo/blob/main/doc.go](https://github.com/hypermodeinc/dgo/blob/main/doc.go)  
84. Python \- DQL \- Dgraph, consulté le avril 24, 2025, [https://dgraph.io/docs/dql/clients/python/](https://dgraph.io/docs/dql/clients/python/)  
85. vector embeddings \- Dgraph Blog, consulté le avril 24, 2025, [https://dgraph.io/blog/tags/vector-embeddings/](https://dgraph.io/blog/tags/vector-embeddings/)  
86. docs/getting-started-with-hyper-commerce.mdx at main · hypermodeinc/docs \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/docs/blob/main/getting-started-with-hyper-commerce.mdx](https://github.com/hypermodeinc/docs/blob/main/getting-started-with-hyper-commerce.mdx)  
87. hypermodeinc/hyper-commerce \- GitHub, consulté le avril 24, 2025, [https://github.com/hypermodeinc/hyper-commerce](https://github.com/hypermodeinc/hyper-commerce)  
88. System Properties Comparison ArangoDB vs. Dgraph vs. Neo4j \- DB-Engines, consulté le avril 24, 2025, [https://db-engines.com/en/system/ArangoDB%3BDgraph%3BNeo4j](https://db-engines.com/en/system/ArangoDB%3BDgraph%3BNeo4j)  
89. Best Graph Database for Enterprise: Neo4j vs TigerGraph vs Dgraph vs NebulaGraph Comparison, consulté le avril 24, 2025, [https://www.nebula-graph.io/posts/best-graph-database-for-enterprise](https://www.nebula-graph.io/posts/best-graph-database-for-enterprise)  
90. Dgraph Pricing 2025, consulté le avril 24, 2025, [https://www.g2.com/products/dgraph/pricing](https://www.g2.com/products/dgraph/pricing)  
91. System Properties Comparison ArangoDB vs. Dgraph \- DB-Engines, consulté le avril 24, 2025, [https://db-engines.com/en/system/ArangoDB%3BDgraph](https://db-engines.com/en/system/ArangoDB%3BDgraph)