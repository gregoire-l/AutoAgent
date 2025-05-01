# **Analyse Comparative des Technologies de Sandboxing pour le Projet AutoAgent V1**

## **I. Introduction**

**Objectif du Rapport:** Ce rapport présente une analyse comparative rigoureuse des technologies de sandboxing prédominantes – gVisor, Firecracker et Kata Containers – par rapport à la référence des conteneurs Linux standards (runc). L'objectif principal est d'éclairer la sélection technologique pour le projet AutoAgent V1, en évaluant les options selon des critères définis de sécurité, performance, facilité d'utilisation, compatibilité, flexibilité et maturité.

**Contexte du Problème:** La nécessité du sandboxing dans le développement logiciel moderne est croissante, particulièrement lors de l'exécution de code potentiellement non fiable, de la gestion d'environnements multi-locataires ou lorsque des exigences de sécurité renforcées sont primordiales. Ces considérations sont directement pertinentes pour les systèmes basés sur des agents comme AutoAgent V1. Une tension inhérente existe entre le niveau d'isolation fourni, l'impact sur les performances et la complexité opérationnelle.1 Choisir la bonne technologie nécessite une compréhension approfondie de ces compromis.

**Portée et Technologies Examinées:** L'analyse se concentre sur les technologies suivantes :

* **Référence:** Conteneurs Linux Standards (via runc) – utilisant les espaces de noms et cgroups du noyau Linux.  
* **Noyau en Espace Utilisateur:** gVisor (via runsc) – interceptant les appels système via son composant Sentry.2  
* **Micro-Virtualisation:** Firecracker – un moniteur de machine virtuelle (VMM) minimaliste utilisant KVM.7  
* **VM par Conteneur:** Kata Containers – un runtime OCI utilisant des machines virtuelles légères, souvent avec Firecracker ou QEMU comme hyperviseurs.11

**Critères Clés d'Évaluation:** Les technologies seront évaluées selon les dimensions suivantes, issues de la demande initiale : Sécurité/Isolation, Impact sur les Performances, Facilité d'Utilisation/Gestion, Compatibilité, Flexibilité et Maturité/Support.

**Structure du Rapport:** Ce document est structuré comme suit : définition du sandboxing, présentation détaillée de chaque technologie, analyse comparative selon les critères établis, discussion de l'adéquation aux cas d'usage, et enfin, une synthèse des compromis et des recommandations pour guider le choix pour AutoAgent V1.

## **II. Définition du Sandboxing en Sécurité Logicielle**

**Concept Fondamental:** Le sandboxing (ou "mise en bac à sable") est un mécanisme de sécurité essentiel visant à séparer les programmes en cours d'exécution.2 Son objectif principal est d'empêcher que les défaillances système ou les vulnérabilités logicielles ne se propagent au-delà d'un environnement contrôlé. Cela implique l'exécution de code dans un espace restreint où l'accès aux ressources système (CPU, mémoire, réseau, système de fichiers) est rigoureusement contrôlé et limité.

**Objectifs du Sandboxing:**

* **Confinement:** Limiter la portée (le "rayon d'explosion") des exploits ou des bugs à l'intérieur des limites du sandbox, protégeant ainsi le système hôte et les autres processus.1  
* **Moindre Privilège:** S'assurer que le processus isolé ne dispose que des permissions et des accès aux ressources strictement nécessaires à son fonctionnement.16 Toute tentative d'accès au-delà de ces limites est bloquée.  
* **Exécution de Code Non Fiable:** Permettre l'exécution sécurisée de code provenant de sources potentiellement non fiables, telles que des fichiers téléversés par des utilisateurs, des bibliothèques tierces, du code généré par des modèles d'IA, ou des composants externes.3  
* **Défense en Profondeur:** Fournir une couche de sécurité supplémentaire qui peut contenir une attaque même si d'autres mécanismes de défense ont échoué.3 Le sandboxing agit comme un filet de sécurité additionnel.

**Aperçu des Mécanismes:** L'isolation est réalisée par diverses techniques. Celles-ci incluent l'interception des interactions entre le processus et le système hôte (notamment les appels système ou *syscalls*), la virtualisation des ressources (présenter une vue limitée ou simulée des ressources système), ou l'utilisation de fonctionnalités de virtualisation matérielle offertes par les processeurs modernes.1 Ces approches contrastent avec l'exécution traditionnelle des processus, où ces derniers interagissent directement et avec moins de restrictions avec le noyau du système d'exploitation hôte.

## **III. Aperçu des Technologies et Architectures de Sandboxing**

**Catégorisation:** Les techniques d'isolation forment un spectre allant des contrôles au niveau du système d'exploitation à la virtualisation matérielle complète. Les technologies analysées ici se situent à différents points de ce spectre :

* **Virtualisation au Niveau OS (Espaces de Noms/cgroups):** Approche la plus légère, utilisée par les conteneurs standards.  
* **Noyaux en Espace Utilisateur:** Une couche logicielle qui réimplémente une partie de l'interface du noyau en dehors du noyau principal.  
* **Virtualisation Légère / MicroVMs:** Machines virtuelles minimalistes conçues pour la rapidité et une faible empreinte.  
* **VM par Conteneur:** Lancement de chaque conteneur dans sa propre VM dédiée.  
* **Sandboxing au Niveau Applicatif:** Mécanismes intégrés aux applications (ex: navigateurs web, WebAssembly). Bien qu'existants, ils sortent du cadre principal de cette analyse comparative axée sur l'isolation au niveau système/processus.  
* **Systèmes Basés sur les Capacités:** Une approche de sécurité où les permissions sont attachées aux objets plutôt qu'aux sujets. Mentionnés pour complétude mais non analysés en détail ici.

**A. Référence: Conteneurs Linux Standards (runc)**

* **Mécanisme:** Cette approche repose sur les fonctionnalités natives du noyau Linux : les espaces de noms (namespaces) pour isoler la vue du processus sur les ressources système (PID, réseau, points de montage, utilisateurs, UTS, IPC) et les groupes de contrôle (cgroups) pour limiter l'utilisation des ressources (CPU, mémoire, I/O).1 Les processus du conteneur s'exécutent directement sur le noyau partagé de l'hôte.  
* **Modèle de Sécurité:** La frontière d'isolation est entièrement gérée par le noyau de l'hôte. La principale faiblesse réside dans le partage de ce noyau. Une vulnérabilité dans le noyau, notamment via l'interface des appels système, peut potentiellement être exploitée par un conteneur compromis pour s'échapper et obtenir des privilèges sur l'hôte ou affecter d'autres conteneurs.1 Cette approche est souvent jugée insuffisante pour l'exécution de code non fiable.2  
* **Performance:** Offre généralement des performances proches de celles d'une exécution native, car l'accès au noyau est direct et les surcoûts liés à l'isolation sont minimes.22  
* **Cas d'Usage Typique:** Charges de travail fiables, microservices où la performance est critique et où le risque lié au partage du noyau est jugé acceptable, environnements de développement.

**B. Noyau en Espace Utilisateur: gVisor (runsc)**

* **Mécanisme:** gVisor implémente une part significative de l'interface des appels système Linux (environ 237 syscalls supportés selon 29) dans un "noyau applicatif" fonctionnant en espace utilisateur, appelé Sentry.2 Ce noyau est principalement écrit en Go, un langage à mémoire sûre.5 Il intercepte les appels système de l'application conteneurisée avant qu'ils n'atteignent le noyau de l'hôte.2  
* **Architecture:**  
  * **Sentry:** Le composant central qui agit comme un noyau en espace utilisateur, traitant les appels système, la gestion de la mémoire, et les opérations réseau via sa propre pile réseau (Netstack).5  
  * **Gofer:** Un processus proxy séparé et fiable, responsable de la gestion des opérations sur le système de fichiers pour le compte du Sentry.3 La communication entre Sentry et Gofer se fait via un protocole dédié (initialement une variante de 9P, maintenant LISAFS).3 Historiquement, le Gofer était nécessaire pour les systèmes de fichiers distants internes à Google, mais il est devenu une source de surcoût pour les systèmes de fichiers locaux dans la version open-source runsc.32 Des optimisations récentes comme DirectFS visent à réduire cette dépendance.32  
  * **Plateformes:** gVisor propose différentes méthodes (plateformes) pour intercepter les appels système, chacune avec ses compromis : ptrace (plus lent, très compatible), KVM (plus rapide, nécessite la virtualisation matérielle, peut souffrir de la virtualisation imbriquée), et Systrap (récent, rapide, ne nécessite pas de virtualisation matérielle).25  
* **Modèle de Sécurité:** gVisor adopte une approche de défense en profondeur. La première couche est le Sentry qui intercepte les appels système, réduisant drastiquement la surface d'attaque exposée au noyau hôte.15 La deuxième couche consiste à isoler le Sentry lui-même du système hôte en utilisant les mécanismes d'isolation de Linux comme seccomp-bpf pour filtrer les appels système que le Sentry est autorisé à faire vers l'hôte.15 gVisor interdit au Sentry d'effectuer directement certains appels système jugés dangereux sur l'hôte, comme open (sauf dans des modes spécifiques comme le passthrough réseau).16 Le modèle de menace de gVisor suppose que le Sentry *peut* être compromis par l'application, mais vise à empêcher cette compromission de s'étendre à l'hôte.3 Il est considéré comme une amélioration significative de la sécurité par rapport à runc.6  
* **Cas d'Usage Typique:** Exécution de code non fiable ou moins fiable (téléversements utilisateur, code généré par IA, bibliothèques tierces), applications multi-locataires nécessitant une isolation plus forte que runc mais potentiellement plus légère que des VMs complètes, ajout d'une défense en profondeur aux services conteneurisés existants.3

**C. Micro-Virtualisation: Firecracker**

* **Mécanisme:** Firecracker est un Moniteur de Machine Virtuelle (VMM) spécifiquement conçu pour créer et gérer des machines virtuelles très légères (microVMs) en utilisant la fonctionnalité KVM (Kernel-based Virtual Machine) de Linux.7 Il est important de noter que Firecracker n'est *pas* un runtime OCI en soi, mais plutôt une technologie de virtualisation qui peut être utilisée *par* des runtimes (comme Kata Containers ou firecracker-containerd) pour exécuter des charges de travail isolées.  
* **Architecture:** Conçu avec une approche minimaliste pour réduire la surface d'attaque et la consommation de ressources.9 Écrit en Rust, un langage reconnu pour sa sécurité mémoire.9 Il n'émule qu'un ensemble très restreint de périphériques virtuels essentiels (virtio-net, virtio-block, virtio-vsock, console série, et un contrôleur de clavier minimal).4 Il s'appuie sur KVM pour la virtualisation assistée par matériel.8 Chaque microVM exécute généralement un noyau Linux minimal et un système de fichiers racine (rootfs) épuré.8 Un composant 'jailer' est fourni pour confiner davantage le processus Firecracker lui-même, en appliquant des restrictions via les namespaces et cgroups Linux.8  
* **Modèle de Sécurité:** Fournit une isolation très forte basée sur la virtualisation matérielle offerte par KVM.7 Son modèle de périphériques minimaliste réduit considérablement la surface d'attaque par rapport aux VMM plus complets comme QEMU.4 Conçu explicitement pour les environnements multi-locataires sécurisés.10 L'accès au stockage se fait typiquement via des périphériques bloc virtuels (virtio-block), évitant ainsi d'exposer la complexité et les risques potentiels du système de fichiers de l'hôte.9  
* **Cas d'Usage Typique:** Fonctions serverless (utilisé par AWS Lambda et Fargate) 4, charges de travail éphémères, scénarios nécessitant la sécurité d'une VM avec des temps de démarrage très rapides et une faible surcharge.7 Peut servir d'hyperviseur pour Kata Containers.11

**D. VM par Conteneur: Kata Containers**

* **Mécanisme:** Kata Containers est un runtime compatible avec la spécification OCI (Open Container Initiative) qui lance les conteneurs à l'intérieur de machines virtuelles légères dédiées, plutôt que d'utiliser directement les namespaces du noyau hôte.12  
* **Architecture:**  
  * **Runtime Kata:** Implémente la spécification OCI et sert d'interface avec les gestionnaires de conteneurs de haut niveau (Docker, containerd, CRI-O).14 Il utilise souvent un shim dédié, comme containerd-shim-kata-v2, pour s'intégrer avec containerd.47  
  * **Hyperviseur:** L'architecture est modulaire et permet d'utiliser différents hyperviseurs en backend. Les options incluent une version optimisée de QEMU, Cloud Hypervisor, et notamment Firecracker.11 Le choix de l'hyperviseur a un impact significatif sur les performances, les fonctionnalités et la complexité de Kata.23  
  * **Agent:** Un processus léger (kata-agent) s'exécute à l'intérieur de chaque VM pour gérer le cycle de vie du ou des conteneurs au sein de la VM et faciliter la communication avec le runtime sur l'hôte.14  
  * **Noyau Invité:** Chaque VM Kata exécute sa propre instance de noyau Linux, fournissant ainsi une isolation forte au niveau du noyau.14 Ce noyau est souvent une version optimisée ou minimale pour réduire l'empreinte et le temps de démarrage.4  
  * **Entrées/Sorties (I/O):** Utilise des périphériques para-virtualisés via le framework virtio (par exemple, virtio-fs ou virtio-9p pour les systèmes de fichiers, virtio-net pour le réseau) pour communiquer avec l'hôte.23  
* **Modèle de Sécurité:** Fournit une isolation robuste en tirant parti de la virtualisation matérielle, similaire aux VMs traditionnelles mais optimisée pour les charges de travail conteneurisées.12 Le fait que chaque conteneur (ou pod Kubernetes) dispose de son propre noyau empêche les exploits de noyau d'affecter l'hôte ou d'autres conteneurs.14 Kata est considéré comme plus sécurisé que runc, et potentiellement plus que gVisor dans certaines analyses en raison de la frontière matérielle explicite.23  
* **Cas d'Usage Typique:** Clusters Kubernetes multi-locataires, exécution de charges de travail non fiables, sandboxing pour l'intégration/déploiement continus (CI/CD), environnements réglementés nécessitant une isolation forte (par exemple, HIPAA, GDPR), charges de travail en périphérie (Edge) ou IoT.14

## **IV. Critères de Comparaison**

L'analyse comparative détaillée qui suit s'appuiera sur les critères définis précédemment, essentiels pour évaluer l'adéquation de chaque technologie au projet AutoAgent V1 :

* A. Niveau de Sécurité et d'Isolation Offert  
* B. Impact sur les Performances (Latence, Débit, Utilisation CPU/Mémoire)  
* C. Facilité d'Implémentation, de Configuration et de Gestion  
* D. Compatibilité (Systèmes d'Exploitation, Architectures, API/Syscall)  
* E. Flexibilité et Granularité du Contrôle (Ressources, Permissions)  
* F. Maturité et Support de l'Écosystème (Communauté, Commercial, Production)

## **V. Analyse Comparative Détaillée**

Cette section examine chaque technologie à travers le prisme des critères définis, en s'appuyant sur les données et observations issues des recherches.

**A. Sécurité et Isolation**

* **runc:** L'isolation repose entièrement sur les mécanismes du noyau Linux (namespaces, cgroups). La surface d'attaque est l'intégralité de l'interface des appels système du noyau hôte exposée au conteneur. Une faille dans le noyau peut mener à une évasion du conteneur.1 Ce niveau d'isolation est généralement considéré comme faible pour du code non fiable.  
* **gVisor:**  
  * *Mécanisme:* Utilise une double barrière : interception des appels système par le Sentry (noyau en espace utilisateur) et filtrage seccomp-bpf appliqué au Sentry lui-même pour limiter ses interactions avec l'hôte.15 Le Sentry réimplémente une partie de l'ABI Linux, réduisant l'exposition directe au noyau hôte.25 L'écriture en Go contribue à la sécurité mémoire.5  
  * *Surface d'Attaque:* La surface d'attaque directe sur le noyau hôte est considérablement réduite (le Sentry n'a besoin que de 53 à 68 appels système hôtes pour fonctionner).29 La surface d'attaque principale se déplace vers l'implémentation de l'ABI Linux par le Sentry 29 et le protocole de communication avec le Gofer (LISAFS).3 L'introduction de DirectFS, bien qu'améliorant les performances, augmente la dépendance vis-à-vis des mécanismes d'isolation de système de fichiers de Linux eux-mêmes.32  
  * *Niveau d'Isolation:* Nettement supérieur à runc grâce à l'interception des syscalls et à la surface d'attaque réduite du noyau hôte.2 Considéré comme offrant une isolation élevée 28, appliquant une défense en profondeur.3  
* **Firecracker:**  
  * *Mécanisme:* Repose sur la virtualisation matérielle via KVM.7 Possède un modèle de périphériques minimaliste et utilise un processus 'jailer' pour confiner le VMM.4  
  * *Surface d'Attaque:* Très réduite, limitée au VMM minimaliste et aux quelques périphériques émulés.4 L'interaction avec le noyau hôte se fait principalement via les interfaces KVM. L'accès au stockage via périphériques bloc évite d'exposer la complexité du système de fichiers hôte.9  
  * *Niveau d'Isolation:* Très élevé, bénéficiant de la frontière d'isolation matérielle fournie par la virtualisation.7 Conçu spécifiquement pour la multi-location sécurisée.10  
* **Kata Containers:**  
  * *Mécanisme:* Utilise la virtualisation matérielle via un hyperviseur enfichable (QEMU, Firecracker, etc.).11 Chaque conteneur ou pod s'exécute dans sa propre VM avec un noyau dédié.14  
  * *Surface d'Attaque:* Dépend fortement de l'hyperviseur choisi. L'utilisation de Firecracker comme backend offre une surface d'attaque plus petite que QEMU. La surface inclut le noyau invité, l'agent Kata et les périphériques virtio utilisés.14  
  * *Niveau d'Isolation:* Très élevé, grâce à la virtualisation matérielle.12 Plus fort que runc, et souvent considéré comme comparable, voire supérieur à gVisor en raison de la frontière matérielle nette.23

Le choix entre ces technologies implique un arbitrage fondamental entre sécurité et compatibilité. gVisor atteint un haut niveau de sécurité en réimplémentant l'ABI Linux, ce qui introduit intrinsèquement des limitations de compatibilité : tous les appels système ou toutes leurs fonctionnalités ne sont pas supportés.16 Tenter d'élargir la compatibilité en autorisant plus d'interactions directes avec l'hôte (comme le mode réseau passthrough) affaiblit son modèle de sécurité.16 À l'inverse, Kata Containers et Firecracker obtiennent une isolation forte via la virtualisation, en exécutant un noyau Linux (potentiellement minimal) complet à l'intérieur de la VM. Cela leur confère généralement une meilleure compatibilité avec les applications Linux existantes 14, mais au prix d'une surcharge de ressources par instance plus élevée et d'une complexité de gestion liée aux VMs.

Il est également pertinent de noter que les approches de défense en profondeur sont centrales pour gVisor, Firecracker et Kata. gVisor combine l'interception par Sentry avec le sandboxing du Sentry lui-même via seccomp/namespaces.15 Kata/Firecracker combinent la virtualisation matérielle (KVM) avec le confinement du VMM (via le jailer pour Firecracker) et l'isolation offerte par le noyau invité.9 La sécurité globale dépend donc de la robustesse de chaque couche et des interfaces entre elles. Une vulnérabilité dans l'une de ces couches pourrait compromettre l'isolation.

**B. Impact sur les Performances**

* **Référence (runc):** Sert de point de comparaison "natif". Offre les meilleures performances et la plus faible surcharge.22  
* **gVisor:**  
  * *CPU:* Performances proches du natif pour les calculs purs. La surcharge provient principalement de l'interception des appels système et des opérations d'E/S.26  
  * *Mémoire:* Surcharge modérée. L'utilisation mémoire dépend de la charge de travail et du cache interne.25 L'overlay du rootfs peut augmenter l'utilisation mémoire s'il n'est pas sauvegardé sur fichier.35  
  * *Latence des Appels Système:* Historiquement, une surcharge très importante, surtout avec la plateforme ptrace (ex: 2.2x à plus de 200x plus lent pour des appels simples).25 La plateforme KVM est meilleure mais conserve une surcharge.25 La nouvelle plateforme Systrap réduit significativement cette surcharge, visant des performances proches de KVM sans nécessiter de virtualisation imbriquée.37  
  * *E/S Fichiers:* C'était un goulot d'étranglement majeur à cause des communications RPC avec le Gofer (ex: open/close 216x plus lent, lecture petits fichiers 11x plus lent).25 Des optimisations significatives ont été apportées :  
    * *VFS2/LISAFS:* Remplacement du protocole 9P, jugé trop "bavard", par LISAFS, plus économique en RPC et en mémoire. Amélioration des parcours de chemins (un seul RPC au lieu d'un par composant). A amélioré le temps de démarrage à froid de plus de 25% sur App Engine.3 A réduit la surcharge de runsc de 50-75% pour certaines charges de travail intensives en fichiers.56  
    * *Rootfs Overlay:* Utilise un overlay basé sur tmpfs pour le système de fichiers racine. Les modifications sont écrites dans la couche supérieure en mémoire (ou sur fichier si configuré), évitant les appels au Gofer et au noyau hôte. A réduit de moitié la surcharge pour la compilation d'Abseil.31 Activé par défaut.35  
    * *DirectFS:* Permet au Sentry un accès direct (mais sécurisé via mount ns/pivot\_root) au système de fichiers hôte, contournant les RPCs du Gofer. L'appel stat est plus de 2x plus rapide. Des benchmarks applicatifs montrent une réduction de 12-17% du temps d'exécution.32 Activé par défaut.35  
  * *Débit Réseau:* Historiquement plus lent que le natif (ex: téléchargements volumineux 2.8x plus lents) à cause de la pile réseau en espace utilisateur (Netstack).16 Le mode "passthrough" utilise la pile de l'hôte, potentiellement plus rapide mais moins sécurisé et moins compatible.16 Les performances de Netstack sont en amélioration.26 Des benchmarks montrent une surcharge notable par rapport à runc/Kata.24  
  * *Temps de Démarrage:* Légèrement plus lent que runc (ex: \~1.1-1.2s vs 1.0s pour un conteneur simple).25 Généralement plus rapide que les solutions basées sur VM comme Kata/Firecracker.15 Un démarrage en millisecondes est revendiqué.15  
* **Firecracker:**  
  * *CPU:* Performances proches du natif (\>95% du bare-metal) pour les calculs à l'intérieur de la microVM.42  
  * *Mémoire:* Faible surcharge du VMM (\<= 5 MiB de base).4 L'utilisation totale dépend du système d'exploitation invité et de l'application.  
  * *Latence des Appels Système:* Non applicable directement (exécution d'un noyau invité complet). La performance dépend du noyau invité.  
  * *E/S Fichiers:* Utilise virtio-block. Les performances dépendent du stockage hôte et de l'implémentation virtio. Peut être limité en débit (rate-limited).9 Peut atteindre des débits élevés (ex: 1 Gio/s revendiqué dans la spécification).41  
  * *Débit Réseau:* Utilise virtio-net via un périphérique TAP.7 Les performances dépendent du réseau hôte et de l'implémentation virtio. Peut être limité en débit.40 Peut atteindre des débits très élevés (ex: 14.5-25 Gbit/s revendiqués).41 Faible latence ajoutée par la couche de virtualisation (0.06ms).42  
  * *Temps de Démarrage:* Très rapide (\<= 125ms de l'appel API au processus init invité).4 La fonctionnalité SnapStart réduit encore les démarrages à froid en restaurant depuis un instantané.39  
* **Kata Containers:**  
  * *CPU:* Généralement proche du natif à l'intérieur de la VM, similaire à Firecracker/QEMU.22  
  * *Mémoire:* Surcharge de base plus élevée que runc ou gVisor due à la nécessité d'une VM, d'un noyau invité et d'un agent par conteneur/pod.14 Cette surcharge peut être spécifiée dans la RuntimeClass Kubernetes.11  
  * *Latence des Appels Système:* Non applicable directement (exécution d'un noyau invité complet).  
  * *E/S Fichiers:* Les performances dépendent fortement du mécanisme utilisé (virtio-9p, virtio-fs) et de l'hyperviseur.50 Les premiers benchmarks avec virtio-9p montraient une surcharge significative par rapport à runc.19 virtio-fs est potentiellement meilleur.50 Peut être plus lent que runc, et potentiellement plus lent que gVisor après ses récentes optimisations, en particulier pour certaines opérations.19  
  * *Débit Réseau:* Utilise virtio-net. Performances généralement bonnes, potentiellement proches de runc et meilleures que Netstack de gVisor.22 Des problèmes potentiels de MTU peuvent nécessiter des contournements.13  
  * *Temps de Démarrage:* Plus lent que runc et gVisor à cause du processus de démarrage de la VM.19 Une étude rapporte un temps de démarrage moyen d'environ 2s.22 L'utilisation de Firecracker comme backend est probablement plus rapide que QEMU.49

L'évolution des performances de gVisor est notable. Les benchmarks initiaux (vers 2019\) 25 mettaient en évidence des surcoûts importants, notamment pour les E/S et les appels système. Cependant, des publications ultérieures (2021-2023) 3 décrivent des optimisations ciblées (VFS2, LISAFS, Rootfs Overlay, DirectFS, Systrap) qui ont considérablement amélioré la situation. Les données quantitatives montrent des gains substantiels (démarrage à froid amélioré de \>25%, surcharge de compilation réduite de moitié, stat \>2x plus rapide, etc.). Il est donc crucial de ne pas se fier uniquement aux anciens benchmarks. Le profil de performance de gVisor a évolué, réduisant l'écart avec runc et Kata dans certains domaines, bien que des surcoûts architecturaux fondamentaux subsistent probablement pour certaines opérations (ex: pile réseau). La performance dépend fortement de la version de gVisor, de sa configuration (plateforme, directfs, overlay) et de la charge de travail spécifique.

Un autre point clé est la nature différente des surcoûts. Kata et Firecracker induisent un coût initial en ressources (mémoire, temps de démarrage) pour l'environnement VM, mais offrent des performances proches du natif *à l'intérieur* de cette VM.14 gVisor a un coût initial plus faible 15 mais introduit une surcharge *par opération* pour les appels système interceptés et les E/S passant par Sentry/Gofer.25 La technologie la plus "rapide" dépend donc entièrement de la charge de travail. Les tâches liées au CPU pourraient favoriser gVisor ou être équivalentes. Les tâches intensives en appels système ou E/S pourraient favoriser Kata/Firecracker si le coût de la VM est amorti, *sauf si* les optimisations récentes de gVisor sont particulièrement efficaces pour ce motif d'accès spécifique. Pour les tâches sensibles au temps de démarrage, l'ordre est généralement : runc \> gVisor \> Firecracker \> Kata (avec QEMU).

**Tableau V.B.1: Résumé Comparatif des Performances**

| Caractéristique | runc (Référence) | gVisor (Systrap, DirectFS, Overlay) | Kata (Backend Firecracker) | Firecracker (VMM seul) |
| :---- | :---- | :---- | :---- | :---- |
| Temps Démarrage (typique) | \~1 s 25 | \~1.1-1.2 s 25, ms revendiqué 15 | \> 2 s 22 (variable) | \<= 125 ms 42 |
| Surcharge Mémoire (base) | Minime | Faible 15 | Modérée (VM/Noyau/Agent) 14 | \<= 5 MiB (VMM) 42 |
| Surcharge CPU (calcul) | \~0% | \~0% 26 | \~0-5% 54 | \~\<5% 42 |
| Latence Syscall (simple) | Baseline | Modérée (Systrap) 37 | N/A (Noyau invité) | N/A (Noyau invité) |
| E/S Fichier (Débit R/W) | Élevé | Variable, amélioré 3 | Variable (virtio) 50 | Élevé (virtio-block) 42 |
| E/S Fichier (Surcharge vs natif) | Baseline | Significative (historique), réduite 32 | Significative 19 | Variable (virtio) |
| Débit Réseau | Élevé | Modéré (Netstack) 25 | Élevé (virtio-net) 27 | Élevé (virtio-net) 42 |
| Débit Réseau (Surcharge vs natif) | Baseline | Significative 24 | Faible 22 | Faible 42 |

*Note: Les valeurs sont indicatives et dépendent fortement de la charge de travail, de la configuration et de la version. Consulter les benchmarks spécifiques pour des détails précis.*

**C. Facilité d'Implémentation, de Configuration et de Gestion**

* **Installation:**  
  * *runc:* Simple, généralement inclus avec Docker ou containerd.  
  * *gVisor:* Relativement simple. Installation du binaire runsc, puis configuration de Docker/containerd via la commande runsc install et redémarrage du démon.6 L'approche centrée sur un seul binaire est un avantage.36  
  * *Firecracker:* Plus complexe pour une utilisation directe. Nécessite le téléchargement du binaire, la configuration de l'accès KVM, l'obtention d'un noyau/rootfs invité, la configuration réseau (périphériques TAP), et la gestion via API/SDK.7  
  * *Kata Containers:* Plusieurs méthodes : paquets de distribution (recommandé pour les mises à jour), installateur automatique (kata-manager), déploiement Kubernetes (kata-deploy), compilation manuelle.47 Implique l'installation de multiples composants (runtime, shim, agent, hyperviseur, noyau/rootfs invité).14 Nécessite le support de la virtualisation matérielle sur l'hôte (potentiellement imbriquée si l'hôte est une VM).19 Apparaît plus complexe à installer que gVisor.62  
* **Configuration (Docker/Kubernetes):**  
  * *gVisor:* S'intègre comme un runtime OCI (runsc). Configuré dans Docker via daemon.json.6 Utilisé dans Kubernetes via une RuntimeClass spécifiant le handler runsc.2 Des intégrations gérées existent (GKE Sandbox) 3 et des addons pour des outils locaux (Minikube).5 Les options de configuration (plateforme, overlay, directfs, etc.) sont passées via runtimeArgs dans Docker ou les paramètres de la RuntimeClass.35  
  * *Firecracker:* N'étant pas un runtime CRI/OCI direct, son intégration passe par des outils intermédiaires comme firecracker-containerd 18 ou en tant que backend pour Kata.11 La configuration implique la mise en place de snapshotters (ex: devmapper) pour fournir les rootfs comme périphériques bloc 11, la définition d'une RuntimeClass pointant vers le shim/handler approprié (ex: kata-fc) 11, et la configuration réseau (périphériques TAP, chaînage CNI).7  
  * *Kata Containers:* S'intègre comme un runtime OCI (kata-runtime). Utilisé dans Kubernetes via une RuntimeClass spécifiant le handler approprié (ex: kata-qemu, kata-fc).11 La configuration nécessite l'enregistrement du runtime dans containerd/CRI-O et la définition de la RuntimeClass, y compris les paramètres de surcharge (overhead).11  
* **APIs/SDKs de Gestion:**  
  * *gVisor:* Principalement géré via l'orchestrateur (Docker/K8s) utilisant le runtime OCI runsc. Pas de SDK de gestion de haut niveau spécifique mentionné au-delà des APIs conteneur standard, bien que des paquets Go sous-jacents existent.6 Le débogage et le profilage sont possibles via les sous-commandes runsc debug et les outils Go standards.33 Le support du checkpoint/restore est mentionné.15  
  * *Firecracker:* Géré via une API REST sur un socket Unix.8 Un SDK Go officiel est disponible pour le contrôle programmatique (configuration de la VM, des disques, du réseau, démarrage/arrêt).7  
  * *Kata Containers:* Principalement géré via l'orchestrateur (Docker/K8s) utilisant le runtime/shim OCI.14 Pas de SDK de gestion de haut niveau spécifique mentionné au-delà des APIs conteneur standard. La configuration se fait via un fichier TOML.48

L'intégration standardisée via la RuntimeClass de Kubernetes simplifie *l'invocation* d'un runtime spécifique pour un pod donné. Cependant, la complexité de la mise en place initiale et de la maintenance opérationnelle varie considérablement. gVisor semble offrir l'approche la plus simple (un binaire et une configuration). Kata Containers implique davantage de composants mobiles (runtime, shim, agent, noyau invité, hyperviseur) et potentiellement l'ajustement fin de l'hyperviseur. L'utilisation directe de Firecracker nécessite une configuration manuelle significative (réseau, stockage, interaction API). Il est explicitement mentionné que l'exploitation de Kata Containers en production demande un effort non négligeable.52 Les solutions basées sur VM (Kata/Firecracker) introduisent également la complexité de la gestion des images de noyau/rootfs invités et les problèmes potentiels de performance liés à la virtualisation imbriquée si l'hôte est déjà une VM.19 Pour une équipe de taille réduite ou un projet en phase initiale comme AutoAgent V1, la charge opérationnelle est un facteur critique. gVisor présente probablement la charge la plus faible, tandis que Kata/Firecracker demandent une expertise en virtualisation et un effort de configuration plus importants.

**D. Compatibilité**

* **Système d'Exploitation et Architecture:**  
  * *runc:* Principalement Linux ; les conteneurs Windows existent mais utilisent un mécanisme différent. Supporte x86\_64, ARM64.  
  * *gVisor:* Hôte Linux (noyau 4.14.77+ recommandé).6 Fonctionne sur x86\_64 et ARM64.6 Peut s'exécuter sur des VMs ou du matériel nu ; ne requiert pas de virtualisation matérielle (sauf pour la plateforme KVM).15  
  * *Firecracker:* Hôte Linux (noyau 4.14+).8 Requiert KVM, ce qui implique le support de la virtualisation matérielle (Intel VT-x, AMD-V).7 Supporte les hôtes x86\_64 et AArch64 (ARM64).8 Le système d'exploitation invité doit être Linux ou OSv.10  
  * *Kata Containers:* Hôte Linux.45 Requiert le support de la virtualisation matérielle (VT-x, SVM) 19, et potentiellement la virtualisation imbriquée si l'hôte est une VM.19 Supporte x86\_64, AArch64, ppc64le, s390x.45 Le système d'exploitation invité est Linux.46  
* **Compatibilité des Appels Système / API:**  
  * *runc:* Compatibilité complète avec le noyau hôte.  
  * *gVisor:* Implémente un sous-ensemble important (\~237 sur 350+) des appels système Linux.25 N'implémente *pas* tous les appels système ni toutes les fonctionnalités (ex: certains fichiers de périphériques comme /dev/nvidia-caps, /dev/nvidia-drm ; anciens appels epoll).29 Des problèmes de compatibilité peuvent survenir à cause de fonctionnalités manquantes ou de différences de comportement.16 Vise à supporter les charges de travail conteneurisées courantes.29 Le mode réseau passthrough a une compatibilité *inférieure* au mode Netstack car il nécessiterait des appels système jugés dangereux.16 Le support GPU (via nvproxy) a des limitations spécifiques (modèles de GPU, versions de pilotes, ioctls supportés).70  
  * *Firecracker:* Exécute un noyau Linux standard dans l'invité, la compatibilité dépend donc de ce noyau invité. Le modèle de périphériques minimal signifie que les fonctionnalités matérielles spécifiques de l'hôte (au-delà des périphériques virtio de base) ne sont pas directement exposées.10  
  * *Kata Containers:* Exécute un noyau Linux standard dans l'invité, offrant ainsi une haute compatibilité avec les applications Linux.14 La compatibilité dépend du noyau invité et des pilotes virtio. Le support GPU/accélérateurs est en cours de développement.71

La relation étroite entre sécurité et compatibilité pour gVisor est un point central. Sa proposition de valeur sécuritaire fondamentale (intercepter et réimplémenter les appels système) est la cause directe de ses limitations de compatibilité.16 Autoriser davantage d'appels système directs vers l'hôte (comme dans le mode réseau passthrough ou potentiellement pour un accès plus large au système de fichiers avant DirectFS) affaiblit directement son modèle de sécurité en augmentant la surface d'attaque de l'hôte.16 Par conséquent, les utilisateurs de gVisor doivent valider soigneusement si leur charge de travail applicative spécifique est compatible avec la surface ABI implémentée par gVisor. Si ce n'est pas le cas, ils sont confrontés à un choix : modifier l'application, accepter le risque de modes moins sécurisés (si disponibles), ou opter pour une autre solution de sandboxing comme Kata/Firecracker qui offre une meilleure compatibilité grâce à la virtualisation complète du noyau.

**E. Flexibilité et Granularité du Contrôle**

* **Contrôle des Ressources:**  
  * *runc:* Utilise les cgroups du noyau pour limiter le CPU, la mémoire, les E/S. Les limites de ressources standard des conteneurs s'appliquent.  
  * *gVisor:* S'exécute comme un processus hôte, les cgroups de l'hôte peuvent donc être appliqués au processus runsc lui-même. Peut s'adapter aux changements de ressources au fil du temps comme un processus normal.2 Les limites de ressources appliquées via Docker/K8s fonctionnent comme prévu.  
  * *Firecracker:* Configuré via API/SDK : nombre de vCPUs, taille de la mémoire.8 Les cgroups de l'hôte sont appliqués via le Jailer pour limiter le CPU, la mémoire, les E/S du processus VMM.9 Supporte virtio-balloon pour le redimensionnement de la mémoire.10 Limitation de débit (rate limiting) configurable via API pour le réseau et les périphériques bloc.40  
  * *Kata Containers:* Les limites de ressources (CPU, mémoire) sont définies via la spécification standard du conteneur, mais s'appliquent à la VM. Le choix de l'hyperviseur peut influencer la granularité. La surcharge de la VM doit être prise en compte dans les quotas.11  
* **Contrôle des Permissions / Capacités:**  
  * *runc:* Utilise les capacités Linux standard, seccomp, les profils AppArmor/SELinux.  
  * *gVisor:* L'application s'exécute à l'intérieur du Sentry ; les permissions Linux standard s'appliquent *à l'intérieur* du sandbox. Le Sentry lui-même s'exécute avec des privilèges minimaux et des filtres seccomp stricts sur l'hôte.15 L'accès au système de fichiers est contrôlé via les mécanismes Gofer/DirectFS.3  
  * *Firecracker:* Les permissions concernent le système d'exploitation invité s'exécutant à l'intérieur de la microVM. Les interactions avec l'hôte sont médiatisées par KVM et le VMM minimaliste. Le Jailer restreint les permissions du processus VMM.40  
  * *Kata Containers:* Les permissions concernent le système d'exploitation invité à l'intérieur de la VM. Les contextes de sécurité standard des conteneurs (capacités, SELinux) s'appliquent *à l'intérieur* de la VM invitée.

On observe une différence dans la granularité du contrôle. runc et gVisor permettent un contrôle fin via les mécanismes Linux standard (cgroups, capacités) appliqués directement ou indirectement aux processus de la charge de travail. Firecracker et Kata opèrent davantage au niveau de la VM pour l'allocation des ressources (vCPU, RAM définis lors de la création/configuration de la VM), bien que les mécanismes internes à l'invité et les cgroups hôtes sur le VMM/runtime ajoutent des couches de contrôle. Firecracker offre une limitation de débit spécifique au niveau du plan de données via son API.40 Si un contrôle dynamique et fin des ressources *par processus* à l'intérieur du sandbox est critique, runc/gVisor pourraient offrir des mécanismes plus directs. Si une allocation plus grossière au niveau de la VM avec une limitation de débit spécifique pour les E/S est suffisante, Firecracker/Kata le permettent.

**F. Maturité et Support de l'Écosystème**

* **runc (et containerd):** Technologie mature, standard de l'industrie, communauté immense, largement déployée. Constitue la base de l'exécution des conteneurs Docker et Kubernetes.  
* **gVisor:**  
  * *Historique:* Open-sourcé par Google en 2018\.2 Basé sur des années d'utilisation interne chez Google.15 Développement actif (optimisations récentes documentées).3  
  * *Support:* Open source (Licence Apache 2.0).6 Support communautaire via GitHub, liste de diffusion.3 Support commercial implicite via les produits Google Cloud (GKE Sandbox, Cloud Run, App Engine).3  
  * *Adoption:* Utilisé intensivement au sein de Google.15 Adopté par des entreprises comme Ant Group, Cloudflare, DigitalOcean, Docker (pour Netstack), Freedom of the Press Foundation, Grist, Modal, OpenAI, Tailscale (pour Netstack), Blink.17  
* **Firecracker:**  
  * *Historique:* Développé par AWS, open-sourcé en 2018\.7 Forké depuis crosvm.10 Développement actif.  
  * *Support:* Open source (Licence Apache 2.0).10 Support communautaire via GitHub, Slack.18 Support commercial implicite via les services AWS (Lambda, Fargate).4  
  * *Adoption:* Au cœur d'AWS Lambda et Fargate.4 Utilisé par containerd (via firecracker-containerd), Kata Containers, Weave Ignite.10 Également utilisé par Fly.io, potentiellement Oracle Cloud.  
* **Kata Containers:**  
  * *Historique:* Lancé en décembre 2017, fusionnant Intel Clear Containers et runV de Hyper.sh.44 Hébergé par l'OpenInfra Foundation (anciennement OpenStack Foundation).14 Développement actif.  
  * *Support:* Open source (Licence Apache 2.0).46 Support communautaire via GitHub, Slack, liste de diffusion, réunions hebdomadaires.46 Un Comité d'Architecture supervise les décisions techniques.46  
  * *Adoption:* Utilisé par de grandes organisations comme JD.com, Alibaba, Ant Group (?), Confluent.44 Cas d'usage mentionnés incluent K8s multi-locataire, CI/CD, Edge.44 Des défis opérationnels sont notés pour l'adoption en production.52

Bien que les trois alternatives (gVisor, Firecracker, Kata) soient utilisées en production par des organisations majeures 10, gVisor et Firecracker bénéficient d'être des composants essentiels de grands services de cloud public (Google Cloud, AWS Lambda/Fargate). Cela suggère un niveau significatif de durcissement opérationnel et de tests à grande échelle. Kata Containers, bien qu'utilisé par de grandes entreprises, fait l'objet de mentions explicites concernant la complexité opérationnelle et les défis qui freinent une adoption plus large, en particulier pour les équipes plus petites.52 Par conséquent, bien que toutes soient "matures" au sens d'un développement actif et d'une utilisation en production, la maturité opérationnelle et la facilité d'adoption pourraient être plus élevées pour gVisor et Firecracker en raison de leur soutien et de leur utilisation dans des environnements hyperscale. Kata pourrait nécessiter une expertise interne plus importante pour être exploité efficacement à grande échelle.

**Tableau V.F.1: Résumé de la Maturité et de l'Adoption des Technologies**

| Caractéristique | runc (containerd) | gVisor | Firecracker | Kata Containers |
| :---- | :---- | :---- | :---- | :---- |
| Origine/Historique | Standard OCI, Docker/Google | Google (2018, basé sur usage interne) 2 | AWS (2018, fork crosvm) 7 | Fusion Intel/Hyper.sh (2017) 44 |
| Gouvernance/Licence | OCI (LF) / Apache 2.0 | Google / Apache 2.0 6 | AWS / Apache 2.0 10 | OpenInfra Fdn / Apache 2.0 14 |
| Soutiens/Mainteneurs | Large communauté, entreprises | Google | AWS | Communauté large, Intel, etc. |
| Utilisateurs Prod Notables | Quasi-totalité (via Docker/K8s) | Google Cloud, Ant, Cloudflare, OpenAI, Modal 17 | AWS Lambda/Fargate, Fly.io 10 | JD.com, Alibaba, Confluent 44 |
| Support Principal | Communauté / Commercial (Distros) | Communauté / Google Cloud (implicite) 3 | Communauté / AWS (implicite) 18 | Communauté 46 |
| Intégration | Docker, K8s (via CRI-O, containerd) | Docker, K8s (RuntimeClass runsc) 5 | containerd (plugin), Kata (backend) 11 | Docker, K8s (RuntimeClass kata-\*) 11 |

## **VI. Adéquation aux Cas d'Usage**

* **Conteneurs Standards (runc):**  
  * *Scénarios Idéaux:* Charges de travail internes fiables, microservices où la performance prime et le risque du noyau partagé est acceptable, environnements de développement. Maximisation de la densité avec une surcharge minimale.  
  * *Justification:* Performances les plus élevées 22, simplicité opérationnelle.  
* **gVisor (runsc):**  
  * *Scénarios Idéaux:* Exécution de code non fiable (scripts utilisateur, code IA, bibliothèques tierces) 3, SaaS multi-locataire où la surcharge des VMs est indésirable mais une isolation plus forte que runc est requise 15, ajout de défense en profondeur 3, charges de travail compatibles avec sa surface d'appels système limitée 16, environnements sans virtualisation imbriquée performante ou disponible.15  
  * *Justification:* Modèle de sécurité robuste 2, empreinte ressource plus faible que les VMs 2, démarrage rapide par rapport aux VMs 15, adoption par des services cloud majeurs et entreprises axées sur la sécurité.17 Les améliorations récentes de performance le rendent plus viable pour des tâches sensibles aux E/S.3  
* **Firecracker (en tant que VMM):**  
  * *Scénarios Idéaux:* Fonctions serverless (FaaS) nécessitant des démarrages à froid rapides et une haute densité 4, exécution de tâches CI/CD éphémères 18, sandboxes légères pour des tâches spécifiques, backend pour Kata Containers nécessitant une empreinte minimale et un démarrage rapide.11  
  * *Justification:* Temps de démarrage extrêmement rapide 7, faible surcharge mémoire 42, forte isolation KVM 9, technologie éprouvée au cœur d'AWS Lambda/Fargate.10  
* **Kata Containers:**  
  * *Scénarios Idéaux:* Clusters Kubernetes multi-locataires exigeant une isolation forte de niveau VM entre locataires/pods 11, exécution de charges de travail sensibles ou réglementées dans des conteneurs 14, sandboxing CI/CD où une isolation VM complète est souhaitée 44, scénarios nécessitant une meilleure compatibilité que gVisor mais une isolation plus forte que runc.14  
  * *Justification:* Conformité OCI et intégration K8s 11, frontière de sécurité au niveau VM 12, flexibilité de l'hyperviseur 11, adoption par de grandes entreprises pour la multi-location sécurisée.44

## **VII. Synthèse et Recommandations pour AutoAgent V1**

* **Résumé des Compromis Clés:**  
  * *Sécurité:* runc (la plus faible) \< gVisor (élevée, interception syscall) \< Kata/Firecracker (la plus élevée, virtualisation matérielle).  
  * *Performance (général):* runc (la meilleure) \> Kata/Firecracker (variable, CPU proche du natif, surcharge E/S VM) \> gVisor (variable, améliorée mais surcharge potentielle syscall/E/S). Le temps de démarrage suit un ordre différent : Firecracker \< gVisor \< runc (très proche) \< Kata.  
  * *Compatibilité:* runc (la meilleure) \> Kata/Firecracker (élevée, noyau Linux invité) \> gVisor (bonne mais limitée par l'ABI implémentée).  
  * *Empreinte Ressource (par sandbox):* runc (la plus faible) \< gVisor (faible) \< Firecracker (VMM faible, dépend invité) \< Kata (modérée, VM par pod).  
  * *Complexité Opérationnelle:* runc (la plus faible) \< gVisor (faible à modérée) \< Kata/Firecracker (modérée à élevée, gestion VM/hyperviseur).  
* **Analyse pour AutoAgent V1:** L'adéquation de chaque technologie dépendra fortement des caractéristiques spécifiques et des exigences d'AutoAgent V1. Plusieurs questions clés doivent guider la décision :  
  * *Quel type de code les agents exécuteront-ils?* S'agit-il de logique interne fiable, de plugins tiers, ou de scripts fournis par l'utilisateur potentiellement non fiables? Cela détermine le niveau d'isolation requis.  
  * *Quelles sont les exigences de performance?* Les agents sont-ils sensibles à la latence? Nécessitent-ils un débit élevé? Sont-ils limités par le CPU ou les E/S? Cela influence la tolérance à la surcharge.  
  * *Quelles ressources chaque agent nécessite-t-il?* Sont-ils petits et éphémères, ou volumineux et de longue durée? Cela impacte la pertinence d'une VM par agent par rapport à des options plus légères.  
  * *Quelle est la capacité opérationnelle de l'équipe?* L'équipe possède-t-elle une expertise en virtualisation? Préfère-t-elle la simplicité? Cela affecte la faisabilité des configurations complexes.  
  * *Quel est l'environnement de déploiement?* Matériel nu? VMs cloud? Kubernetes? Cela influence la compatibilité et l'intégration.  
* **Avantages et Inconvénients Spécifiques pour AutoAgent V1:**  
  * *gVisor:*  
    * *Avantages:* Amélioration significative de la sécurité par rapport à runc, surcharge potentiellement inférieure à Kata, opérations plus simples (binaire unique, pas de gestion de VM/noyau invité). Performances en nette amélioration.  
    * *Inconvénients:* Risque de compatibilité avec le code de l'agent (ABI limitée), performances potentiellement inférieures à Kata/Firecracker pour certaines charges très intensives en syscalls/E/S malgré les optimisations.  
  * *Kata Containers (backend Firecracker):*  
    * *Avantages:* Isolation la plus forte (VM matérielle), bonne compatibilité Linux, temps de démarrage rapide (pour une VM).  
    * *Inconvénients:* Utilisation de ressources par agent plus élevée que gVisor/runc, complexité opérationnelle liée à la gestion des VMs et de l'écosystème Kata. Nécessite la virtualisation matérielle (potentiellement imbriquée).  
  * *Kata Containers (backend QEMU):*  
    * *Avantages:* Isolation la plus forte, potentiellement la meilleure compatibilité (QEMU plus complet).  
    * *Inconvénients:* Utilisation de ressources la plus élevée, temps de démarrage plus lent, complexité opérationnelle.  
  * *Firecracker (utilisation directe, 1 agent \= 1 microVM):*  
    * *Avantages:* Isolation forte, démarrage très rapide, faible surcharge du VMM.  
    * *Inconvénients:* Nécessite de construire une couche de gestion au-dessus de l'API Firecracker, configuration réseau/stockage potentiellement complexe à gérer manuellement.  
* **Facteurs de Décision Recommandés:** La priorisation devrait suivre cet ordre :  
  1. **Niveau de Confiance du Code de l'Agent:** Si le code est fortement non fiable ou provient d'utilisateurs externes, privilégier Kata Containers (avec Firecracker) ou une solution basée sur Firecracker. Si le code est modérément fiable (plugins tiers contrôlés) ou interne, gVisor est un candidat sérieux. Si le code est entièrement fiable, runc pourrait suffire si la performance est la priorité absolue.  
  2. **Sensibilité et Profil de Performance:** Idéalement, effectuer des benchmarks avec des charges de travail représentatives d'AutoAgent V1. Si les E/S ou les appels système sont critiques, évaluer attentivement les *dernières* versions de gVisor par rapport à Kata/Firecracker. Si le temps de démarrage est primordial, Firecracker (direct ou via Kata) est le meilleur choix, suivi de gVisor.  
  3. **Capacité Opérationnelle:** Pour la simplicité, favoriser gVisor. N'envisager Kata/Firecracker que si l'équipe dispose de l'expertise et de la bande passante nécessaires pour gérer la virtualisation. L'effort opérationnel pour Kata en production est non négligeable.52  
  4. **Besoins de Compatibilité:** Tester impérativement le code de l'agent et ses dépendances avec gVisor. En cas d'incompatibilité avérée et non contournable, Kata/Firecracker (qui exécutent un noyau Linux complet) deviennent les alternatives probables.

## **VIII. Conclusion**

Cette analyse a exploré le spectre des technologies de sandboxing pour conteneurs, allant des mécanismes légers basés sur le noyau (runc) aux approches de virtualisation matérielle robustes (Firecracker, Kata Containers), en passant par l'interception d'appels système en espace utilisateur (gVisor). Chaque approche présente un ensemble distinct de compromis entre le niveau d'isolation, l'impact sur les performances, la compatibilité applicative et la complexité opérationnelle.

* **runc** offre des performances optimales mais une sécurité insuffisante pour l'exécution de code non fiable.  
* **gVisor** représente un compromis intéressant, offrant une sécurité nettement améliorée par rapport à runc avec une surcharge de ressources potentiellement plus faible que les solutions basées sur VM et une complexité opérationnelle moindre. Ses performances, historiquement un point faible pour les E/S et les appels système, se sont considérablement améliorées grâce à des optimisations récentes (LISAFS, DirectFS, Systrap), bien que la compatibilité ABI reste un facteur clé à valider.  
* **Firecracker** excelle dans le démarrage rapide et l'isolation forte avec une faible empreinte VMM, idéal pour les fonctions éphémères ou comme backend pour d'autres systèmes, mais nécessite une gestion plus directe.  
* **Kata Containers** fournit l'isolation la plus forte via des VMs dédiées par pod, offrant une excellente compatibilité Linux mais au prix d'une surcharge de ressources et d'une complexité opérationnelle plus élevées, particulièrement notées lors de l'adoption en production.

Pour le projet **AutoAgent V1**, le choix final dépendra d'une pondération minutieuse des priorités. Si l'exécution de code potentiellement non fiable est une exigence centrale et que la compatibilité applicative le permet, **gVisor (avec ses optimisations récentes activées)** apparaît comme un candidat de premier plan en raison de son équilibre entre sécurité renforcée, performances améliorées et gestion simplifiée par rapport aux VMs. Des tests de compatibilité et de performance avec des charges de travail représentatives d'AutoAgent V1 sont cependant indispensables. Si une isolation matérielle absolue est non négociable, ou si des incompatibilités bloquantes sont découvertes avec gVisor, **Kata Containers utilisant Firecracker comme backend** constitue l'alternative la plus logique, tout en reconnaissant l'investissement opérationnel supplémentaire requis.

#### **Sources des citations**

1. A Hardware-Software Co-Design for Efficient Secure Containers \- ipads, consulté le avril 24, 2025, [https://ipads.se.sjtu.edu.cn/\_media/pub/members/paper.pdf](https://ipads.se.sjtu.edu.cn/_media/pub/members/paper.pdf)  
2. Open-sourcing gVisor, a sandboxed container runtime | Google Cloud Blog, consulté le avril 24, 2025, [https://cloud.google.com/blog/products/identity-security/open-sourcing-gvisor-a-sandboxed-container-runtime](https://cloud.google.com/blog/products/identity-security/open-sourcing-gvisor-a-sandboxed-container-runtime)  
3. gVisor File system Improvements for GKE and Serverless | Google Cloud Blog, consulté le avril 24, 2025, [https://cloud.google.com/blog/products/containers-kubernetes/gvisor-file-system-improvements-for-gke-and-serverless](https://cloud.google.com/blog/products/containers-kubernetes/gvisor-file-system-improvements-for-gke-and-serverless)  
4. Comparative Performance Study of Lightweight Hypervisors Used in Container Environment \- Semantic Scholar, consulté le avril 24, 2025, [https://pdfs.semanticscholar.org/c4bf/bc08a9f022f5001f1b6fd25fedf5a270013e.pdf](https://pdfs.semanticscholar.org/c4bf/bc08a9f022f5001f1b6fd25fedf5a270013e.pdf)  
5. gVisor in Kubernetes \- Zesty.co, consulté le avril 24, 2025, [https://zesty.co/finops-glossary/gvisor-in-kubernetes/](https://zesty.co/finops-glossary/gvisor-in-kubernetes/)  
6. google/gvisor: Application Kernel for Containers \- GitHub, consulté le avril 24, 2025, [https://github.com/google/gvisor](https://github.com/google/gvisor)  
7. Let's Learn Firecracker MicroVM with Go Firecracker SDK\! \- Tutorials Dojo, consulté le avril 24, 2025, [https://tutorialsdojo.com/lets-learn-firecracker-microvm-with-go-firecracker-sdk/](https://tutorialsdojo.com/lets-learn-firecracker-microvm-with-go-firecracker-sdk/)  
8. Getting Started with Firecracker \- CoCalc, consulté le avril 24, 2025, [https://cocalc.com/github/aos/firecracker/blob/main/docs/getting-started.md](https://cocalc.com/github/aos/firecracker/blob/main/docs/getting-started.md)  
9. Cloud virtualization: Red Hat, AWS Firecracker, and Ubicloud internals, consulté le avril 24, 2025, [https://www.ubicloud.com/blog/cloud-virtualization-red-hat-aws-firecracker-and-ubicloud-internals](https://www.ubicloud.com/blog/cloud-virtualization-red-hat-aws-firecracker-and-ubicloud-internals)  
10. firecracker/FAQ.md at main \- GitHub, consulté le avril 24, 2025, [https://github.com/firecracker-microvm/firecracker/blob/main/FAQ.md](https://github.com/firecracker-microvm/firecracker/blob/main/FAQ.md)  
11. Enhancing Kubernetes workload isolation and security using Kata Containers \- AWS, consulté le avril 24, 2025, [https://aws.amazon.com/blogs/containers/enhancing-kubernetes-workload-isolation-and-security-using-kata-containers/](https://aws.amazon.com/blogs/containers/enhancing-kubernetes-workload-isolation-and-security-using-kata-containers/)  
12. 5 Creating Kata Containers \- Oracle Help Center, consulté le avril 24, 2025, [https://docs.oracle.com/en/operating-systems/olcne/2.0/kubernetes/kata.html](https://docs.oracle.com/en/operating-systems/olcne/2.0/kubernetes/kata.html)  
13. Kubernetes Networking Kata Containers with Cilium, consulté le avril 24, 2025, [https://docs.cilium.io/en/latest/network/kubernetes/kata.html](https://docs.cilium.io/en/latest/network/kubernetes/kata.html)  
14. Kata Containers: From Kubernetes Pods to Secure VMs \- DZone, consulté le avril 24, 2025, [https://dzone.com/articles/kata-containers-from-kubernetes-pods-to-secure-vms](https://dzone.com/articles/kata-containers-from-kubernetes-pods-to-secure-vms)  
15. gVisor: The Container Security Platform, consulté le avril 24, 2025, [https://gvisor.dev/](https://gvisor.dev/)  
16. gVisor Networking Security, consulté le avril 24, 2025, [https://gvisor.dev/blog/2020/04/02/gvisor-networking-security/](https://gvisor.dev/blog/2020/04/02/gvisor-networking-security/)  
17. Who's Using gVisor, consulté le avril 24, 2025, [https://gvisor.dev/users/](https://gvisor.dev/users/)  
18. firecracker-microvm/firecracker-containerd: firecracker-containerd enables containerd to manage containers as Firecracker microVMs \- GitHub, consulté le avril 24, 2025, [https://github.com/firecracker-microvm/firecracker-containerd](https://github.com/firecracker-microvm/firecracker-containerd)  
19. I/O performance of Kata containers \- StackHPC, consulté le avril 24, 2025, [https://www.stackhpc.com/kata-io-1.html](https://www.stackhpc.com/kata-io-1.html)  
20. Optimizing seccomp usage in gVisor, consulté le avril 24, 2025, [https://gvisor.dev/blog/2024/02/01/seccomp/](https://gvisor.dev/blog/2024/02/01/seccomp/)  
21. Comparing 3 Docker container runtimes \- Runc, gVisor and Kata Containers, consulté le avril 24, 2025, [https://dev.to/rimelek/comparing-3-docker-container-runtimes-runc-gvisor-and-kata-containers-16j](https://dev.to/rimelek/comparing-3-docker-container-runtimes-runc-gvisor-and-kata-containers-16j)  
22. Performance Analysis Between RunC and Kata Container Runtime | Request PDF, consulté le avril 24, 2025, [https://www.researchgate.net/publication/345086558\_Performance\_Analysis\_Between\_RunC\_and\_Kata\_Container\_Runtime](https://www.researchgate.net/publication/345086558_Performance_Analysis_Between_RunC_and_Kata_Container_Runtime)  
23. Security-Performance Trade-offs of Kubernetes Container Runtimes \- Cristian Klein, consulté le avril 24, 2025, [https://cristian.kleinlabs.eu/publications/mascots2020\_container\_runtime\_security.pdf](https://cristian.kleinlabs.eu/publications/mascots2020_container_runtime_security.pdf)  
24. Blending Containers and Virtual Machines:A Study of Firecracker and gVisor \- scail, consulté le avril 24, 2025, [https://scail.cs.wisc.edu/papers/vee20-isolation.pdf](https://scail.cs.wisc.edu/papers/vee20-isolation.pdf)  
25. The True Cost of Containing: A gVisor Case Study Abstract 1 Introduction 2 Background \- USENIX, consulté le avril 24, 2025, [https://www.usenix.org/system/files/hotcloud19-paper-young.pdf](https://www.usenix.org/system/files/hotcloud19-paper-young.pdf)  
26. Performance Guide \- gVisor, consulté le avril 24, 2025, [https://gvisor.dev/docs/architecture\_guide/performance/](https://gvisor.dev/docs/architecture_guide/performance/)  
27. A Functional and Performance Benchmark of Lightweight Virtualization Platforms for Edge Computing \- Biblio Back Office, consulté le avril 24, 2025, [https://backoffice.biblio.ugent.be/download/8769638/8769643](https://backoffice.biblio.ugent.be/download/8769638/8769643)  
28. Performance and isolation analysis of RunC, gVisor and Kata Containers runtimes, consulté le avril 24, 2025, [https://www.researchgate.net/publication/358043994\_Performance\_and\_isolation\_analysis\_of\_RunC\_gVisor\_and\_Kata\_Containers\_runtimes](https://www.researchgate.net/publication/358043994_Performance_and_isolation_analysis_of_RunC_gVisor_and_Kata_Containers_runtimes)  
29. gVisor Security Basics \- Part 1 \- gVisor, consulté le avril 24, 2025, [https://gvisor.dev/blog/2019/11/18/gvisor-security-basics-part-1/](https://gvisor.dev/blog/2019/11/18/gvisor-security-basics-part-1/)  
30. SoK: Virtualization Challenges and Techniques in Serverless Computing \- HotInfra 2024, consulté le avril 24, 2025, [https://hotinfra24.github.io/papers/hotinfra24-final86.pdf](https://hotinfra24.github.io/papers/hotinfra24-final86.pdf)  
31. gVisor improves performance with root filesystem overlay \- Google Open Source Blog, consulté le avril 24, 2025, [https://opensource.googleblog.com/2023/04/gvisor-improves-performance-with-root-filesystem-overlay.html](https://opensource.googleblog.com/2023/04/gvisor-improves-performance-with-root-filesystem-overlay.html)  
32. Optimizing gVisor filesystems with Directfs \- Google Open Source Blog, consulté le avril 24, 2025, [https://opensource.googleblog.com/2023/06/optimizing-gvisor-filesystems-with-directfs.html](https://opensource.googleblog.com/2023/06/optimizing-gvisor-filesystems-with-directfs.html)  
33. Running gVisor in Production at Scale in Ant, consulté le avril 24, 2025, [https://gvisor.dev/blog/2021/12/02/running-gvisor-in-production-at-scale-in-ant/](https://gvisor.dev/blog/2021/12/02/running-gvisor-in-production-at-scale-in-ant/)  
34. Faster filesystem access with Directfs \- gVisor, consulté le avril 24, 2025, [https://gvisor.dev/blog/2023/06/27/directfs/](https://gvisor.dev/blog/2023/06/27/directfs/)  
35. Filesystem \- gVisor, consulté le avril 24, 2025, [https://gvisor.dev/docs/user\_guide/filesystem/](https://gvisor.dev/docs/user_guide/filesystem/)  
36. Performance of gvisor \- Google Groups, consulté le avril 24, 2025, [https://groups.google.com/g/gvisor-users/c/NS6tsKFYhmk](https://groups.google.com/g/gvisor-users/c/NS6tsKFYhmk)  
37. Releasing Systrap \- A high-performance gVisor platform, consulté le avril 24, 2025, [https://gvisor.dev/blog/2023/04/28/systrap-release/](https://gvisor.dev/blog/2023/04/28/systrap-release/)  
38. Kata Containers vs Firecracker vs gvisor : r/docker \- Reddit, consulté le avril 24, 2025, [https://www.reddit.com/r/docker/comments/1fmuv5b/kata\_containers\_vs\_firecracker\_vs\_gvisor/](https://www.reddit.com/r/docker/comments/1fmuv5b/kata_containers_vs_firecracker_vs_gvisor/)  
39. AWS Lambda SnapStart: Reducing Cold Start Times with Firecracker | ElasticScale, consulté le avril 24, 2025, [https://elasticscale.com/blog/aws-lambda-snapstart-reducing-cold-start-times-with-firecracker/](https://elasticscale.com/blog/aws-lambda-snapstart-reducing-cold-start-times-with-firecracker/)  
40. firecracker/docs/prod-host-setup.md at main · firecracker-microvm ..., consulté le avril 24, 2025, [https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)  
41. 6.5810: Firecracker \- GitHub Pages, consulté le avril 24, 2025, [https://abelay.github.io/6828seminar/notes/65810\_lec\_firecracker.pdf](https://abelay.github.io/6828seminar/notes/65810_lec_firecracker.pdf)  
42. firecracker/SPECIFICATION.md at main · firecracker-microvm ..., consulté le avril 24, 2025, [https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md](https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md)  
43. What is the difference between enhanced container isolation projects like runq, Kata Containers, Firecracker and gVisor? \- Information Security Stack Exchange, consulté le avril 24, 2025, [https://security.stackexchange.com/questions/279785/what-is-the-difference-between-enhanced-container-isolation-projects-like-runq](https://security.stackexchange.com/questions/279785/what-is-the-difference-between-enhanced-container-isolation-projects-like-runq)  
44. What Are Kata Containers? A Dev Guide to Secure Containers \- Zesty.co, consulté le avril 24, 2025, [https://zesty.co/finops-glossary/kata-containers/](https://zesty.co/finops-glossary/kata-containers/)  
45. Kata Containers, Docker and Kubernetes: How They All Fit Together \- Platform9, consulté le avril 24, 2025, [https://platform9.com/blog/kata-containers-docker-and-kubernetes-how-they-all-fit-together/](https://platform9.com/blog/kata-containers-docker-and-kubernetes-how-they-all-fit-together/)  
46. Learn About the Kata Containers Project | Kata Containers, consulté le avril 24, 2025, [https://katacontainers.io/learn/](https://katacontainers.io/learn/)  
47. Kata-containers with vAccel, consulté le avril 24, 2025, [https://docs.vaccel.org/kata\_vaccel/](https://docs.vaccel.org/kata_vaccel/)  
48. GitHub \- kata-containers/kata-containers: Kata Containers is an ..., consulté le avril 24, 2025, [https://github.com/kata-containers/kata-containers](https://github.com/kata-containers/kata-containers)  
49. Exploring the Performance of Kubernetes-Deployed Containers \- Atlarge Research, consulté le avril 24, 2025, [https://atlarge-research.com/pdfs/2023-asklavos-msc\_thesis.pdf](https://atlarge-research.com/pdfs/2023-asklavos-msc_thesis.pdf)  
50. Disk I/O Performance of Kata Containers \- StackHPC, consulté le avril 24, 2025, [https://www.stackhpc.com/images/IO-Performance-of-Kata-Containers-TheNewStack.pdf](https://www.stackhpc.com/images/IO-Performance-of-Kata-Containers-TheNewStack.pdf)  
51. Impact of Secure Container Runtimes on File I/O Performance in Edge Computing \- MDPI, consulté le avril 24, 2025, [https://www.mdpi.com/2076-3417/13/24/13329](https://www.mdpi.com/2076-3417/13/24/13329)  
52. community/elections/arch-committee-2023-04/FengWang.txt at main ..., consulté le avril 24, 2025, [https://github.com/kata-containers/community/blob/main/elections/arch-committee-2023-04/FengWang.txt](https://github.com/kata-containers/community/blob/main/elections/arch-committee-2023-04/FengWang.txt)  
53. Secure Container Runtime, consulté le avril 24, 2025, [https://careers.coccoc.com/blogs/secure-container-runtime](https://careers.coccoc.com/blogs/secure-container-runtime)  
54. a Quantitative Comparison, consulté le avril 24, 2025, [https://object-storage-ca-ymq-1.vexxhost.net/swift/v1/6e4619c416ff4bd19e1c087f27a43eea/www-assets-prod/presentation-media/kata-containers-and-gvisor-a-quantitave-comparison.pdf](https://object-storage-ca-ymq-1.vexxhost.net/swift/v1/6e4619c416ff4bd19e1c087f27a43eea/www-assets-prod/presentation-media/kata-containers-and-gvisor-a-quantitave-comparison.pdf)  
55. Improving gVisor Memory Subsystem Performance \- Xiaohan Fu, consulté le avril 24, 2025, [https://xhfu.me/files/ad5e3bbbdb2e7f4dbb5dc19c121e89a9/cse291\_project\_final\_report.pdf](https://xhfu.me/files/ad5e3bbbdb2e7f4dbb5dc19c121e89a9/cse291_project_final_report.pdf)  
56. Google Boosts Sandboxed Container File System Performance by Improving gVisor \- InfoQ, consulté le avril 24, 2025, [https://www.infoq.com/news/2023/01/gvisor-file-system-improvements/](https://www.infoq.com/news/2023/01/gvisor-file-system-improvements/)  
57. Faster filesystem access with Directfs \- Hacker News, consulté le avril 24, 2025, [https://news.ycombinator.com/item?id=36901543](https://news.ycombinator.com/item?id=36901543)  
58. syzbot, consulté le avril 24, 2025, [https://syzkaller.appspot.com/gvisor/manager/ci-gvisor-ptrace-3](https://syzkaller.appspot.com/gvisor/manager/ci-gvisor-ptrace-3)  
59. Comparison of various runtimes in Kubernetes \- HPS, consulté le avril 24, 2025, [https://hps.vi4io.org/\_media/teaching/autumn\_term\_2023/stud/scap\_jule\_anger.pdf](https://hps.vi4io.org/_media/teaching/autumn_term_2023/stud/scap_jule_anger.pdf)  
60. Sabre: Hardware-Accelerated Snapshot Compression for Serverless MicroVMs \- USENIX, consulté le avril 24, 2025, [https://www.usenix.net/system/files/osdi24-lazarev\_1.pdf](https://www.usenix.net/system/files/osdi24-lazarev_1.pdf)  
61. Docker Quick Start \- gVisor, consulté le avril 24, 2025, [https://gvisor.dev/docs/user\_guide/quick\_start/docker/](https://gvisor.dev/docs/user_guide/quick_start/docker/)  
62. kata-containers/docs/install/README.md at main \- GitHub, consulté le avril 24, 2025, [https://github.com/kata-containers/kata-containers/blob/main/docs/install/README.md](https://github.com/kata-containers/kata-containers/blob/main/docs/install/README.md)  
63. config package \- gvisor.dev/gvisor/runsc/config \- Go Packages, consulté le avril 24, 2025, [https://pkg.go.dev/gvisor.dev/gvisor/runsc/config](https://pkg.go.dev/gvisor.dev/gvisor/runsc/config)  
64. firecracker-containerd/docs/shim-design.md at main \- GitHub, consulté le avril 24, 2025, [https://github.com/firecracker-microvm/firecracker-containerd/blob/main/docs/shim-design.md](https://github.com/firecracker-microvm/firecracker-containerd/blob/main/docs/shim-design.md)  
65. Docker vs. containerd vs. Nabla vs. Kata vs. Firecracker: Welcome To The Container Jungle\!, consulté le avril 24, 2025, [https://www.inovex.de/de/blog/containers-docker-containerd-nabla-kata-firecracker/](https://www.inovex.de/de/blog/containers-docker-containerd-nabla-kata-firecracker/)  
66. firecracker-go-sdk-example.go \- GitHub Gist, consulté le avril 24, 2025, [https://gist.github.com/hharnisc/facfe973a6d42291fa54658e4a981c66](https://gist.github.com/hharnisc/facfe973a6d42291fa54658e4a981c66)  
67. firecracker package \- github.com/768bit/firecracker-go-sdk \- Go Packages, consulté le avril 24, 2025, [https://pkg.go.dev/github.com/768bit/firecracker-go-sdk](https://pkg.go.dev/github.com/768bit/firecracker-go-sdk)  
68. An SDK in Go for the Firecracker microVM API \- GitHub, consulté le avril 24, 2025, [https://github.com/firecracker-microvm/firecracker-go-sdk](https://github.com/firecracker-microvm/firecracker-go-sdk)  
69. ignite/docs/FAQ.md at main · weaveworks/ignite \- GitHub, consulté le avril 24, 2025, [https://github.com/weaveworks/ignite/blob/main/docs/FAQ.md](https://github.com/weaveworks/ignite/blob/main/docs/FAQ.md)  
70. GPU Support \- gVisor, consulté le avril 24, 2025, [https://gvisor.dev/docs/user\_guide/gpu/](https://gvisor.dev/docs/user_guide/gpu/)  
71. Kata Containers and gVisor a Quantitative Comparison \- YouTube, consulté le avril 24, 2025, [https://www.youtube.com/watch?v=D1B512e6V4U](https://www.youtube.com/watch?v=D1B512e6V4U)  
72. HOW LAMBDA WORKS \- COLD STARTS? FIRECRACKER? CONTAINER SUPPORT?, consulté le avril 24, 2025, [https://www.youtube.com/watch?v=OOGV81YbuEo](https://www.youtube.com/watch?v=OOGV81YbuEo)