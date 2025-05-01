# **Guide Technique de Mise en Forme Markdown pour LLM : Optimisation Cognitive des Supports Techniques**

**Version 1.0**

## **1\. Introduction**

Ce document constitue un guide technique prescriptif destiné à un Large Language Model (LLM) chargé de la mise en forme de documents techniques au format Markdown. L'objectif est d'établir un ensemble de règles de formatage claires, cohérentes et algorithmiquement applicables, fondées sur les principes des sciences cognitives, de la psychologie de l'apprentissage et de la communication technique. L'application rigoureuse de ces règles vise à optimiser la lisibilité, la structure et l'impact pédagogique des documents pour un lecteur humain, tout en garantissant une interprétation et une application aisées par le LLM.

## **2\. Fondements Scientifiques (Justification des Règles \- Contexte pour le LLM)**

La conception de supports d'apprentissage efficaces repose sur la compréhension des mécanismes cognitifs humains. Les règles de formatage présentées dans ce guide sont justifiées par plusieurs théories et principes fondamentaux :

* **Théorie de la Charge Cognitive (Sweller) :** La mémoire de travail humaine a une capacité limitée.1 Une information mal structurée ou trop dense surcharge cette mémoire (charge extrinsèque élevée), nuisant à l'apprentissage. Une structure claire, un découpage logique et l'élimination des éléments superflus réduisent cette charge extrinsèque, libérant des ressources cognitives pour le traitement de l'information pertinente (charge intrinsèque et germane).1 Les règles de découpage (chunking), de titrage et de formatage des paragraphes visent directement cette réduction.  
* **Principes d'Apprentissage Multimédia (Mayer) :** Richard Mayer a établi plusieurs principes pour optimiser l'apprentissage à partir de supports multimédias. Le **Principe de Signalisation (Signaling)** stipule que l'apprentissage est amélioré lorsque des indices sont utilisés pour attirer l'attention sur les informations essentielles.5 Cela justifie l'utilisation contrôlée de la mise en évidence (gras, italique) pour signaler les termes clés ou les avertissements, mais aussi la nécessité d'éviter la sur-signalisation qui devient contre-productive.6 Le **Principe de Cohérence** recommande d'exclure les informations, sons ou images non pertinents qui pourraient distraire.6 Le **Principe de Segmentation** suggère de découper l'information en unités plus petites et gérables 6, renforçant l'importance du chunking.  
* **Théorie du Double Codage (Paivio) :** Allan Paivio a postulé que l'information est traitée et stockée via deux canaux distincts mais interconnectés : verbal (mots) et non verbal (images).10 Présenter l'information sous ces deux formes (ex: texte et schéma pertinent) peut améliorer la mémorisation et la compréhension (effet de supériorité de l'image, si pertinente).10 Cela justifie l'intégration réfléchie d'images et de schémas qui clarifient le texte, mais aussi l'exclusion des images purement décoratives qui n'ajoutent pas de valeur sémantique et peuvent même distraire.6  
* **Mémoire de Travail et Découpage (Chunking) :** La mémoire de travail ne peut traiter qu'un nombre limité d'éléments simultanément (environ 3-7 "chunks" ou unités d'information).1 Le découpage ("chunking") consiste à organiser l'information en unités plus petites et significatives pour respecter cette limitation.17 Diviser le contenu en sections courtes, paragraphes concis et listes structurées permet de réduire la charge cognitive et facilite le traitement de l'information.1

## **3\. Règles Pratiques de Structure et Mise en Forme (Format Markdown)**

Cette section détaille les règles impératives de formatage que le LLM doit appliquer.

### **3.1. Structure Globale**

#### **3.1.1. Titre Principal (\#)**

* DO Utiliser un unique titre de niveau 1 (\#) au tout début du document pour le titre principal.20  
* DO S'assurer que ce titre est identique ou très proche du nom de fichier ou du sujet principal du document.21  
* DON'T Utiliser plus d'un titre \#.21  
* DON'T Inclure de formatage (gras, italique) dans le titre \#.

#### **3.1.2. Table des Matières (Table of Contents \- TOC)**

* DO Générer une table des matières (TOC) cliquable (utilisant des liens internes vers les sections \#\# et \#\#\#) si le document contient **plus de 5 sections de niveau 2 (\#\#)** (Seuil Z=5).20 Une TOC fournit une vue d'ensemble structurelle et facilite la navigation dans les documents longs, réduisant l'effort cognitif nécessaire pour s'orienter et permettant un accès rapide à des sections spécifiques.23 Le seuil de 5 sections assure que la TOC n'est générée que lorsque le document atteint une longueur justifiant cet outil de navigation.  
* DO Placer la TOC immédiatement après la courte introduction du document (si présente) ou après le titre principal et l'auteur (si présent).21 Cet emplacement est standard et attendu par les lecteurs.  
* DO Utiliser une liste (ordonnée ou non ordonnée, mais cohérente) pour la TOC, reflétant la hiérarchie des sections (indentation pour les sous-sections \#\#\#).23  
* DO Utiliser les titres exacts des sections comme texte pour les liens dans la TOC pour une correspondance claire.25  
* DON'T Inclure la TOC elle-même, le titre principal (\#), l'abstract ou les remerciements dans la liste de la TOC.26  
* DON'T Générer une TOC pour des documents très courts (\<= 5 sections \#\#), car elle serait redondante.

#### **3.1.3. Sectionnement et Hiérarchie des Titres**

* DO Utiliser les titres Markdown (\#\#, \#\#\#, \#\#\#\#) pour structurer logiquement le contenu en sections et sous-sections. Commencer la hiérarchie des sections principales à \#\# (le titre \# étant réservé au titre du document).20  
* DO Respecter strictement la hiérarchie des titres. Ne pas sauter de niveaux (par exemple, ne pas passer directement d'un titre \#\# à un titre \#\#\#\# sans \#\#\# intermédiaire).21 Une hiérarchie cohérente aide le lecteur à comprendre la structure logique du document.  
* DO Limiter la profondeur maximale des titres à \#\#\#\# (niveau 4). Une profondeur excessive complexifie la structure et peut indiquer un besoin de réorganisation du contenu. Si une granularité plus fine est nécessaire, envisager l'utilisation de listes imbriquées ou la division en documents séparés.  
* DO Laisser une ligne vide avant et après chaque titre (\#\#, \#\#\#, \#\#\#\#) pour améliorer l'aération visuelle et la distinction des sections.21  
* DON'T Utiliser de formatage (gras, italique) dans les titres.21 Le niveau de titre lui-même fournit la distinction visuelle nécessaire.  
* DON'T Utiliser plus d'un titre de niveau 1 (\#).21  
* DON'T Utiliser les titres à des fins purement stylistiques (par exemple, pour augmenter la taille de la police sans signification structurelle). Les titres doivent refléter l'organisation sémantique du contenu.29

#### **3.1.4. Découpage du Contenu (Chunking)**

* DO Diviser le contenu en sections (\#\#) et sous-sections (\#\#\#, \#\#\#\#) qui représentent des unités logiques et cohérentes d'information.1 Ce découpage est fondamental pour respecter les limites de la mémoire de travail.15  
* DO Viser des sous-sections terminales (le niveau le plus bas de titre dans une branche, par exemple un \#\#\# sans \#\#\#\# en dessous, ou un \#\#\#\#) relativement courtes.  
* DON'T Dépasser **15 lignes de texte rendu** OU **4 paragraphes** au sein d'une même sous-section terminale sans introduire une structure supplémentaire : soit une nouvelle sous-section de niveau inférieur (si la hiérarchie le permet), soit une liste, un bloc de code, un tableau ou une image pertinente (Seuil X \= 15 lignes / 4 paragraphes). Cette règle quantitative vise à garantir une granularité minimale et à prévenir les blocs de texte trop longs qui surchargent la mémoire de travail.1 La limite en lignes rendues prend en compte la densité visuelle, tandis que la limite en paragraphes offre une alternative structurelle.6 Le LLM doit activement surveiller ces seuils et insérer une structure appropriée pour segmenter le contenu lorsque la limite est atteinte.

#### **3.1.5. Formulation des Titres**

* DO Formuler des titres informatifs, clairs et concis qui décrivent précisément le contenu de la section qu'ils introduisent.25 Le titre doit permettre au lecteur d'anticiper le sujet traité.  
* DO Utiliser une formulation de type "nom" ou "groupe nominal" (ex: "Configuration Avancée") ou "verbe-nom" (ex: "Configurer le Serveur"). Maintenir une cohérence dans le style de formulation des titres au sein du document.  
* DO Limiter la longueur des titres à un maximum de **10 mots** (Seuil Y=10 mots).27 Des titres plus courts sont plus faciles à scanner et à mémoriser.  
* DON'T Utiliser des titres vagues, ambigus ou génériques qui n'apportent pas d'information sur le contenu (ex: "Introduction", "Détails", "Remarques", "Suite").  
* DON'T Utiliser la casse de phrase standard (première lettre en majuscule, reste en minuscules sauf noms propres) pour les titres en français (ex: "Configuration avancée du serveur"). Éviter le tout en majuscules (ALL CAPS). Maintenir une casse cohérente pour tous les titres du document..21

#### **3.1.6. Introductions et Conclusions de Section**

* DO Inclure une courte introduction (1-2 phrases concises) au début de chaque section majeure (commençant par \#\#) pour résumer son objectif ou le contenu qui va suivre.21 Cela aide le lecteur à s'orienter et à activer ses connaissances préalables.1  
* DO Pour les sections \#\# particulièrement longues ou complexes, envisager d'ajouter une courte conclusion ou un résumé des points clés (par exemple, sous forme de liste à puces) à la fin de la section pour renforcer la compréhension et la rétention.  
* DON'T Rendre ces introductions ou conclusions trop longues. Elles doivent être brèves et servir de "balises" cognitives, pas de répétitions détaillées.

### **3.2. Formatage du Texte**

#### **3.2.1. Paragraphes**

* DO Séparer les paragraphes adjacents par **une seule ligne vide**.30 C'est la convention standard en Markdown pour délimiter les paragraphes.  
* DO Concentrer chaque paragraphe sur **une seule idée principale** ou un aspect spécifique du sujet de la section.31 Cela améliore la clarté et la structure logique.  
* DO Commencer chaque paragraphe par une phrase thématique (topic sentence) qui énonce clairement l'idée principale du paragraphe.31 Cela facilite le balayage rapide du texte par le lecteur.  
* DON'T Créer des paragraphes contenant plus de **7 phrases** (Seuil N=7 phrases).31 Les paragraphes longs forment des "murs de texte" intimidants qui augmentent la charge cognitive.31 Viser une longueur moyenne de 3 à 5 phrases.31 Cette limite force la concision et aide à maintenir la focalisation sur une seule idée par paragraphe.  
* DON'T Indenter la première ligne des paragraphes.30 L'espacement par ligne vide est suffisant pour la séparation visuelle sur le web et dans la plupart des rendus Markdown.  
* DON'T Utiliser fréquemment des paragraphes d'une seule phrase. Si cela se produit, cela suggère souvent une mauvaise organisation ; envisager de regrouper ces phrases en paragraphes plus cohérents ou de les transformer en liste si approprié.31

#### **3.2.2. Mise en Évidence (Signaling)**

* DO Utiliser \*\*gras\*\* **uniquement et de manière très ciblée** pour :  
  * Les termes techniques, acronymes ou concepts clés lors de leur **première définition formelle** ou introduction significative dans le document.  
  * Les avertissements critiques, les messages de sécurité ou les notes de précaution très importantes (ex: \*\*Attention :\*\* Ne pas exécuter...).  
  * Les éléments d'interface utilisateur sur lesquels l'utilisateur doit cliquer ou interagir (ex: Cliquez sur le bouton **Valider**).  
* DO Utiliser \*italique\* **uniquement et de manière très ciblée** pour :  
  * Apporter une légère emphase à un mot ou une très courte expression (à utiliser avec une extrême parcimonie).  
  * Les titres d'œuvres, de publications, de documents cités (ex: Consulter le rapport *Analyse des Performances 2023*).  
  * Les variables, placeholders ou exemples de valeurs à remplacer par l'utilisateur (ex: Entrez la commande commande \--utilisateur \*votre\_login\*).  
* DON'T Mettre en gras ou en italique des phrases entières ou des paragraphes complets. Cela dilue l'impact de la signalisation.6  
* DON'T Utiliser le gras et l'italique de manière interchangeable. Chaque format a des usages spécifiques définis ci-dessus.  
* DON'T Combiner le gras et l'italique (\*\*\*texte\*\*\*) sauf dans des circonstances exceptionnelles et justifiées (ce qui devrait être extrêmement rare).  
* DON'T Utiliser la mise en évidence (gras/italique) pour indiquer la structure du document ; les titres (\#, \#\#, etc.) sont faits pour cela.29  
* DON'T Abuser de la mise en évidence. Trop d'éléments mis en exergue créent du bruit visuel, annulent l'effet de signalisation et augmentent la charge cognitive extrinsèque au lieu de la réduire.6 La parcimonie est essentielle pour que la signalisation reste efficace.  
* DON'T Utiliser le format \_souligné\_. Il est moins standardisé en Markdown, peut nuire à la lisibilité et est souvent confondu avec des liens hypertextes.

#### **3.2.3. Listes**

* DO Utiliser des listes à puces (commençant par \* ou \-) pour présenter des ensembles d'éléments où l'ordre n'a pas d'importance ou n'est pas séquentiel. Choisir un style de puce (\* ou \-) et l'utiliser de manière cohérente au sein d'une même liste et, idéalement, dans tout le document (préférer \- pour la clarté).20  
* DO Utiliser des listes numérotées (commençant par 1., 2., etc.) pour décrire des séquences d'étapes, des procédures ordonnées, des classements, ou lorsque le nombre d'éléments est important ou référencé dans le texte. Utiliser la numérotation "paresseuse" (1. pour chaque item) pour faciliter la réorganisation et la maintenance de la liste.20  
* DO Maintenir une structure grammaticale parallèle pour tous les éléments d'une même liste. Par exemple, tous les éléments devraient commencer par un verbe à l'infinitif, ou être des groupes nominaux, etc..20 La structure parallèle améliore la lisibilité et la compréhension.  
* DO Appliquer une ponctuation cohérente à la fin de chaque élément de la liste. Si les éléments sont des phrases complètes, terminer chacun par un point. Si ce sont des fragments ou des mots, ne pas mettre de ponctuation finale, ou utiliser une convention cohérente (ex: point-virgule pour tous sauf le dernier qui prend un point, mais la simplicité est préférable).  
* DO Indenter correctement les listes imbriquées (généralement par 4 espaces ou une tabulation) pour montrer clairement la hiérarchie.20  
* DON'T Mélanger différents types de puces (\* et \-) au même niveau d'indentation dans une seule liste.  
* DON'T Mélanger des listes à puces et des listes numérotées au même niveau d'indentation. Utiliser l'indentation pour imbriquer un type de liste dans un autre si nécessaire.  
* DON'T Créer des listes excessivement longues (par exemple, plus de 10 éléments principaux) sans envisager de les subdiviser avec des sous-titres ou des listes imbriquées si une structure logique le permet. Appliquer le principe de chunking aux listes également.

### **3.3. Présentation du Code**

#### **3.3.1. Blocs de Code**

* DO Utiliser **exclusivement** les blocs de code délimités par trois backticks (fenced code blocks : \`\`\`) pour tout extrait de code s'étendant sur plusieurs lignes.21  
* DO Spécifier **systématiquement et obligatoirement** le langage de programmation ou le format de données immédiatement après les trois backticks ouvrants (ex: python,javascript, bash,json, yaml,html, css,go, typescript,sql). Cela permet une coloration syntaxique correcte, améliorant considérablement la lisibilité.20 Si le langage est inconnu, mixte, ou s'il s'agit de texte brut formaté, utiliser ou simplement.  
* DO S'assurer que les exemples de code sont aussi courts et ciblés que possible, illustrant directement et uniquement le point discuté dans le texte qui précède ou suit immédiatement.  
* DO Veiller à ce que le code présenté soit syntaxiquement correct (dans la mesure où le LLM peut le vérifier) et fonctionnel dans son contexte, à moins que l'objectif ne soit spécifiquement de montrer une erreur ou un anti-pattern (auquel cas cela doit être clairement indiqué).  
* DON'T Utiliser l'ancienne méthode des blocs de code indentés (commençant chaque ligne par 4 espaces ou une tabulation). Cette méthode est moins flexible (pas de spécification de langage) et plus ambiguë.21  
* DON'T Inclure de très longs blocs de code sans fournir une explication textuelle suffisante avant et/ou après. Le texte doit contextualiser le code, expliquer son objectif, et éventuellement détailler les parties les plus importantes ou complexes.  
* DON'T Présenter du code sous forme d'images. Le code doit toujours être fourni sous forme de texte sélectionnable et copiable dans un bloc de code approprié.

#### **3.3.2. Code en Ligne (Inline Code)**

* DO Utiliser les backticks simples () \`\`code\`\` \*\*exclusivement\*\* pour marquer des éléments de code, des commandes, des identifiants techniques ou des littéraux courts qui apparaissent au sein d'une phrase ou d'un paragraphe. Exemples typiques : noms de variables (user\_count), noms de fonctions ou méthodes (calculate\_mean()), commandes système (grep,docker run), noms de fichiers ou chemins (/etc/config.conf), types de données (string,boolean), valeurs littérales (true,0,null), clés de configuration ou JSON ("timeout"), noms de balises HTML (\<img\>), propriétés CSS (border-radius), classes ou ID courts (.container\`), etc..20  
* DON'T Utiliser les backticks \` \` pour de l'emphase générale sur du texte non technique, pour des noms de produits, des acronymes non techniques, ou pour toute autre chose qui n'est pas un élément de code ou un identifiant technique précis. L'abus de backticks nuit à la lisibilité.

#### **3.3.3. Annotations de Code**

* DO Privilégier des explications claires et concises dans le texte narratif *avant* ou *après* le bloc de code pour décrire son fonctionnement général, son objectif, ou la logique de ses sections principales. Placer l'explication à l'extérieur du code réduit la charge cognitive lors de la lecture du code lui-même.35  
* DO Utiliser les commentaires de code natifs du langage (ex: \# en Python/Shell, // ou /\* \*/ en JavaScript/Java/C++, \`\` en HTML/XML) à l'intérieur du bloc de code **avec parcimonie**. Réserver les commentaires internes pour expliquer une ligne ou une petite section de code qui est particulièrement complexe, non intuitive, qui utilise une astuce spécifique, ou qui pourrait être mal interprétée sans clarification directe.  
* DON'T Surcharger le code avec des commentaires excessifs qui paraphrasent simplement ce que le code fait de manière évidente. Un code bien écrit doit être aussi auto-explicatif que possible.  
* DON'T Répéter dans les commentaires internes les informations déjà fournies de manière adéquate dans le texte explicatif environnant le bloc de code. Les commentaires doivent apporter une valeur ajoutée spécifique à la ligne ou au bloc qu'ils commentent.

### **3.4. Éléments Visuels et Données**

#### **3.4.1. Images et Schémas**

* DO Intégrer des images (formats web courants : PNG pour les graphiques et captures d'écran avec texte, JPG pour les photographies, SVG pour les schémas vectoriels, GIF pour les animations simples) **uniquement** lorsqu'elles apportent une valeur ajoutée significative par rapport au texte seul. Les cas d'usage pertinents incluent : la clarification visuelle d'un concept abstrait ou complexe, l'illustration d'une interface utilisateur (UI), la présentation de données sous forme de graphiques, ou la visualisation d'une architecture système. L'image doit être directement pertinente pour le contenu adjacent (Principe de Pertinence, Théorie du Double Codage) 10 et ne doit pas être redondante avec le texte (Principe de Cohérence de Mayer).6  
* DO Utiliser la syntaxe Markdown standard pour intégrer les images : \!(chemin/vers/image.png).20  
* DO Fournir **systématiquement** un texte alternatif (attribut alt) qui soit descriptif, concis et équivalent à l'information véhiculée par l'image. Ce texte est crucial pour l'accessibilité (lecteurs d'écran) et s'affiche si l'image ne peut être chargée.20 Il doit décrire le contenu *et* la fonction de l'image dans le contexte.  
* DO Si une image nécessite une explication plus détaillée que ce que permet un alt text concis, ou si elle est explicitement référencée dans le corps du texte (ex: "Comme le montre la Figure 2..."), ajouter une légende claire et numérotée sous l'image (ex: Figure 1 : Diagramme de séquence de l'authentification utilisateur.). Maintenir un format et une numérotation cohérents pour toutes les légendes de figures dans le document.  
* DON'T Utiliser des images purement décoratives, sans rapport direct avec le contenu technique, ou qui n'ajoutent aucune information pertinente.6 Elles augmentent la charge cognitive sans bénéfice pédagogique.  
* DON'T Omettre le texte alternatif (alt text). C'est une exigence d'accessibilité et de bonne pratique.  
* DON'T Intégrer des images excessivement lourdes (optimiser la taille des fichiers) ou trop larges qui pourraient perturber la mise en page sur différents appareils. Si un contrôle précis de la taille est nécessaire, et si les extensions Markdown le permettent, les utiliser ; sinon, envisager du HTML minimaliste \<img\> avec attributs width/height uniquement si c'est indispensable et autorisé par le contexte de publication.

#### **3.4.2. Tableaux**

* DO Utiliser des tableaux formatés en Markdown pour présenter des données structurées de manière concise et comparative. Les cas d'usage typiques incluent : comparaisons de fonctionnalités, listes de paramètres avec leurs descriptions et valeurs, glossaires de termes, résultats de tests tabulés.22  
* DO Inclure **systématiquement** une ligne d'en-tête (la première ligne du tableau) avec des titres clairs et descriptifs pour chaque colonne.22 La ligne de séparation (|---|---|) est obligatoire sous l'en-tête.  
* DO Utiliser la syntaxe Markdown pour spécifier l'alignement du contenu dans les colonnes (:--- pour alignement à gauche (défaut), :---: pour centré, \---: pour alignement à droite). L'alignement à droite est particulièrement recommandé pour les colonnes contenant des données numériques afin d'améliorer la lisibilité.28 Utiliser l'alignement de manière cohérente.  
* DO Garder le contenu des cellules aussi concis que possible.  
* DO Laisser une ligne vide avant et après la définition complète du tableau Markdown.22  
* DON'T Créer des tableaux excessivement larges (viser un maximum de 4-5 colonnes si possible). Les tableaux larges sont difficiles à afficher et à lire sur des écrans de petite taille (mobiles). Si l'information nécessite plus de colonnes, envisager de la restructurer (ex: diviser en plusieurs tableaux, utiliser une liste de définitions, transposer).  
* DON'T Essayer d'insérer des éléments complexes comme plusieurs paragraphes, des listes imbriquées, ou des blocs de code à l'intérieur d'une cellule de tableau Markdown standard. La syntaxe Markdown de base ne le supporte généralement pas bien ou pas du tout.22 Si un contenu complexe est nécessaire, le placer dans le texte principal et y faire référence depuis la cellule du tableau, ou utiliser un lien.  
* DON'T Utiliser des tableaux à des fins de mise en page globale du texte (ex: créer des colonnes de texte). Utiliser la structure sémantique du Markdown (titres, paragraphes, listes).

### **3.5. Autres Éléments de Mise en Forme**

#### **3.5.1. Citations (Blockquotes)**

* DO Utiliser la syntaxe \> au début de chaque ligne pour mettre en forme des blocs de texte qui sont des citations directes d'une source externe. Indiquer la source si possible.  
* DO Utiliser également la syntaxe \> pour mettre visuellement en évidence des blocs de notes informatives, des avertissements importants, des conseils ou des points clés qui doivent se distinguer du flux principal du texte.20 Pour améliorer la clarté et la cohérence, préfixer ces blocs avec une indication en gras, si possible. Exemples :  
  * \> \*\*Note :\*\* Ceci est une information complémentaire.  
  * \> \*\*Important :\*\* N'oubliez pas de sauvegarder vos modifications.  
  * \> \*\*Avertissement :\*\* La modification de ce paramètre peut entraîner une instabilité.  
  * \> \*\*Conseil :\*\* Pour de meilleures performances, envisagez d'utiliser...  
* DON'T Utiliser les blockquotes (\>) pour simplement indenter du texte ou pour créer une emphase stylistique sur un paragraphe ordinaire. Leur usage doit rester sémantiquement justifié (citation ou mise en évidence spéciale).

#### **3.5.2. Liens Hypertexte**

* DO Utiliser systématiquement des textes de liens (le texte visible entre \[ et \]) qui sont descriptifs, significatifs et qui indiquent clairement la nature ou le contenu de la ressource cible.20 Le lecteur doit pouvoir raisonnablement deviner où le lien mène sans avoir à cliquer dessus. Exemple : Consultez la \[documentation officielle de Python sur les listes\](URL) plutôt que Cliquez \[ici\](URL).  
* DO Pour les liens internes pointant vers d'autres sections du même document (utilisés notamment dans la TOC), utiliser le titre exact de la section cible comme texte de lien, ou une formulation très proche et non ambiguë.  
* DON'T Utiliser des textes de liens génériques, vagues ou non informatifs tels que "cliquez ici", "ici", "lien", "plus d'informations", "lire la suite".20 Ces textes nuisent à la fois à la lisibilité et à l'accessibilité (les utilisateurs de lecteurs d'écran scannent souvent les liens hors contexte).  
* DON'T Insérer des URLs brutes directement dans le corps du texte, sauf si l'URL elle-même est l'information principale à communiquer (ce qui est rare en documentation technique). Toujours préférer la syntaxe (URL).21  
* DO (Facultatif, si la complexité est gérable par le LLM et si les URL sont longues ou répétées) Envisager l'utilisation de liens de référence pour améliorer la lisibilité du source Markdown : définir \[texte du lien\]\[identifiant\_ref\] dans le texte, et \[identifiant\_ref\]: URL "Titre optionnel" à la fin de la section ou du document.21

#### **3.5.3. Espace Blanc (Whitespace)**

* DO Utiliser **une et une seule ligne vide** pour séparer les éléments de bloc distincts afin d'assurer une aération visuelle adéquate et une structure claire. Cela inclut :  
  * Entre les paragraphes.30  
  * Avant et après chaque titre (\#\#, \#\#\#, \#\#\#\#).21  
  * Avant et après un bloc de code complet (...).  
  * Avant et après une liste complète (mais pas entre les items individuels de la liste, sauf si chaque item contient plusieurs paragraphes, ce qui est à éviter si possible).  
  * Avant et après un tableau Markdown complet.22  
  * Avant et après un bloc de citation (\>...).  
  * Avant une image \!\[alt\](src) si elle n'est pas intégrée fluidement à la fin d'un paragraphe qui l'introduit directement.  
* DON'T Utiliser plusieurs lignes vides consécutives (\> 1 ligne vide) pour tenter de créer un espacement vertical supplémentaire.28 Le rendu de multiples lignes vides est souvent incohérent selon les interpréteurs Markdown et cela va à l'encontre de l'utilisation sémantique de la structure. La structure définie par les titres, paragraphes, listes, etc., et la séparation standard par une ligne vide doivent suffire. L'utilisation cohérente de l'espace blanc est cruciale pour la segmentation visuelle et la réduction de la charge cognitive.30

### **3.6. Tableau Récapitulatif des Seuils Quantitatifs**

Pour faciliter l'application cohérente des règles par le LLM, voici un résumé des limites quantitatives définies dans ce guide :

| Règle Concernée | Élément | Seuil / Limite | Justification Cognitive Principale | Section Référence |
| :---- | :---- | :---- | :---- | :---- |
| Génération TOC | Sections \#\# | \> 5 (Z=5) | Réduction Charge Cognitive, Navigation | 3.1.2 |
| Profondeur Titres | Niveaux | Max \#\#\#\# (4 niveaux) | Structure Claire, Éviter Complexité | 3.1.3 |
| Chunking (Sous-section) | Lignes / Paras | Max 15 lignes OU 4 paras (X) | Limitation Mémoire Travail, Segmentation | 3.1.4 |
| Longueur Titres | Mots | Max 10 mots (Y) | Lisibilité, Facilité de Balayage | 3.1.5 |
| Longueur Paragraphes | Phrases | Max 7 phrases (N) | Limitation Mémoire Travail, Balayage | 3.2.1 |
| Longueur Listes (indicatif) | Items principaux | Éviter \> 10 sans structure | Chunking, Gestion Complexité | 3.2.3 |
| Largeur Tableaux (indicatif) | Colonnes | Éviter \> 4-5 si possible | Lisibilité (Écrans Étroits), Simplicité | 3.4.2 |

Ce tableau centralise les paramètres numériques clés, permettant au LLM de les retrouver et de les appliquer de manière fiable lors du processus de formatage.

## **4\. Directives Générales pour l'LLM Formatteur**

Au-delà des règles spécifiques de formatage Markdown, le LLM doit adhérer aux principes directeurs suivants lors de l'exécution de sa tâche :

* **4.1. Cohérence Absolue :**  
  * DO Appliquer **systématiquement, rigoureusement et uniformément** toutes les règles de formatage définies dans ce guide à l'intégralité de chaque document traité. La cohérence est le facteur le plus critique pour réduire la charge cognitive extrinsèque du lecteur humain 1 et garantir une interprétation prévisible par d'autres outils ou systèmes.25 L'incohérence force le lecteur à s'adapter constamment, ce qui nuit à l'apprentissage.2 Le LLM agit ici comme un garant de cette cohérence à grande échelle.  
  * DON'T Dévier des règles établies, même si une alternative pourrait sembler localement plus "esthétique" ou "intelligente" dans un cas particulier. La prévisibilité et l'uniformité structurelle priment sur la variation stylistique individuelle.  
* **4.2. Priorité à la Lisibilité Humaine :**  
  * DO Toujours garder à l'esprit que l'objectif ultime de ce formatage est de produire un document qui soit **facile à lire, à comprendre, à naviguer et à utiliser efficacement par un lecteur humain**.32 Les règles sont conçues dans ce but.  
  * DO En cas d'ambiguïté mineure ou de situation non explicitement couverte par une règle (ce qui devrait être minimisé par la précision de ce guide), choisir l'option de formatage qui maximise la clarté, la simplicité et la structure logique pour le lecteur final, tout en restant fidèle à l'esprit des principes cognitifs sous-jacents (Section 2).  
* **4.3. Simplicité et Clarté :**  
  * DO Privilégier systématiquement la structure la plus simple et le formatage le moins ambigu possible qui satisfasse aux exigences des règles.1 Éviter toute complexité inutile.  
  * DON'T Introduire des constructions Markdown complexes, des imbrications excessives ou des formatages non essentiels qui n'apportent pas de valeur sémantique ou structurelle claire.  
* **4.4. Respect du Markdown Standard :**  
  * DO Utiliser **uniquement** la syntaxe Markdown standard et largement supportée, telle que définie par des spécifications comme CommonMark ou GitHub Flavored Markdown (GFM), selon ce qui est spécifié comme cible (en l'absence de spécification, viser CommonMark avec les extensions GFM courantes comme les tableaux, les tâches, les liens automatiques si nécessaire).  
  * DON'T Utiliser des extensions Markdown propriétaires ou spécifiques à une plateforme particulière, sauf si explicitement autorisé par une règle de ce guide.  
  * DON'T Incorporer du code HTML arbitraire dans le Markdown pour contourner les limitations de formatage, sauf dans des cas très spécifiques et explicitement permis (par exemple, potentiellement pour un contrôle fin de la taille d'image si absolument indispensable et si les mécanismes Markdown purs sont insuffisants, mais cela doit rester une exception).21 La portabilité et la simplicité du Markdown doivent être préservées.

## **5\. Conclusion**

Ce guide fournit un ensemble de règles prescriptives pour le formatage de documents techniques en Markdown, optimisé pour la cognition humaine et destiné à être appliqué par un LLM. En adhérant strictement à ces directives, le LLM produira des documents qui sont non seulement cohérents et prévisibles sur le plan structurel, mais aussi plus faciles à lire, à comprendre et à mémoriser pour les utilisateurs finaux. La réduction de la charge cognitive extrinsèque, l'amélioration de la signalisation des informations clés, et l'application des principes de double codage et de segmentation sont au cœur de cette approche. L'objectif final est d'exploiter la capacité du LLM à appliquer des règles complexes de manière cohérente pour générer des supports d'apprentissage et de documentation technique de haute qualité pédagogique.

#### **Sources des citations**

1. Cognitive Load Theory: How to Optimize Learning \- Let's Go Learn, consulté le avril 25, 2025, [https://www.letsgolearn.com/education-reform/cognitive-load-theory-how-to-optimize-learning/](https://www.letsgolearn.com/education-reform/cognitive-load-theory-how-to-optimize-learning/)  
2. Cognitive Load Theory: A teacher's guide \- Structural Learning, consulté le avril 25, 2025, [https://www.structural-learning.com/post/cognitive-load-theory-a-teachers-guide](https://www.structural-learning.com/post/cognitive-load-theory-a-teachers-guide)  
3. Cognitive Load Theory \- EdTech Books, consulté le avril 25, 2025, [https://edtechbooks.org/encyclopedia/cognitive\_load\_theory](https://edtechbooks.org/encyclopedia/cognitive_load_theory)  
4. Cognitive Load Theory and the Format of Instruction \- ResearchGate, consulté le avril 25, 2025, [https://www.researchgate.net/publication/48828982\_Cognitive\_Load\_Theory\_and\_the\_Format\_of\_Instruction](https://www.researchgate.net/publication/48828982_Cognitive_Load_Theory_and_the_Format_of_Instruction)  
5. Enhancing Learner Engagement with Mayer's Multimedia Learning Principles, consulté le avril 25, 2025, [https://www.digitallearninginstitute.com/blog/enhancing-learner-engagement-with-mayer-s-multimedia-learning-principles](https://www.digitallearninginstitute.com/blog/enhancing-learner-engagement-with-mayer-s-multimedia-learning-principles)  
6. Mayer's 12 Principles of Multimedia Learning | DLI, consulté le avril 25, 2025, [https://www.digitallearninginstitute.com/blog/mayers-principles-multimedia-learning](https://www.digitallearninginstitute.com/blog/mayers-principles-multimedia-learning)  
7. Multimedia Design Principles: What Are They, How to Use Them \- National University, consulté le avril 25, 2025, [https://www.nu.edu/blog/multimedia-design-principles/](https://www.nu.edu/blog/multimedia-design-principles/)  
8. Mayer's 12 Design Principles: What They Are & How to Apply Them to eLearning | eduMe, consulté le avril 25, 2025, [https://www.edume.com/blog/elearning-multimedia](https://www.edume.com/blog/elearning-multimedia)  
9. Mayer's Principles of Multimedia Learning \- Educational Technology, consulté le avril 25, 2025, [https://educationaltechnology.net/mayers-principles-of-multimedia-learning/](https://educationaltechnology.net/mayers-principles-of-multimedia-learning/)  
10. Dual-coding theory \- Wikipedia, consulté le avril 25, 2025, [https://en.wikipedia.org/wiki/Dual-coding\_theory](https://en.wikipedia.org/wiki/Dual-coding_theory)  
11. (PDF) Dual Coding Theory and Education \- ResearchGate, consulté le avril 25, 2025, [https://www.researchgate.net/publication/225249172\_Dual\_Coding\_Theory\_and\_Education](https://www.researchgate.net/publication/225249172_Dual_Coding_Theory_and_Education)  
12. Dual Coding Theory: The Complete Guide for Teachers \- Education Corner, consulté le avril 25, 2025, [https://www.educationcorner.com/dual-coding-theory/](https://www.educationcorner.com/dual-coding-theory/)  
13. Dual coding theory and education, consulté le avril 25, 2025, [https://nschwartz.yourweb.csuchico.edu/Clark%20&%20Paivio.pdf](https://nschwartz.yourweb.csuchico.edu/Clark%20&%20Paivio.pdf)  
14. Dual Coding in the Classroom \- The Effortful Educator, consulté le avril 25, 2025, [https://theeffortfuleducator.com/2017/02/07/dual-coding-in-the-classroom/](https://theeffortfuleducator.com/2017/02/07/dual-coding-in-the-classroom/)  
15. Intro to Document Design – Technical Writing and Presentation \- pressbooks.pub, consulté le avril 25, 2025, [https://pressbooks.pub/hayleyinhighered/chapter/intro-to-document-design/](https://pressbooks.pub/hayleyinhighered/chapter/intro-to-document-design/)  
16. The Mythical, Magical Number 7 in Technical Writing, consulté le avril 25, 2025, [https://www.writing-world.com/tech/seven.shtml](https://www.writing-world.com/tech/seven.shtml)  
17. Chunking Information for Instructional Design \- The eLearning Coach, consulté le avril 25, 2025, [https://theelearningcoach.com/elearning\_design/chunking-information/](https://theelearningcoach.com/elearning_design/chunking-information/)  
18. How to Chunk Training Materials | Vector Solutions, consulté le avril 25, 2025, [https://www.vectorsolutions.com/resources/blogs/chunk-training-materials/](https://www.vectorsolutions.com/resources/blogs/chunk-training-materials/)  
19. Decoding Chunking: Notes on Mastering Language Structure \- Cheshire Cat AI, consulté le avril 25, 2025, [https://cheshirecat.ai/decoding-chunking/](https://cheshirecat.ai/decoding-chunking/)  
20. Markdown for Technical Writers: Tips, Tricks, and Best Practices \- Israel Mitolu's Blog, consulté le avril 25, 2025, [https://israelmitolu.hashnode.dev/markdown-for-technical-writers-tips-tricks-and-best-practices](https://israelmitolu.hashnode.dev/markdown-for-technical-writers-tips-tricks-and-best-practices)  
21. Markdown style guide | styleguide \- Google, consulté le avril 25, 2025, [https://google.github.io/styleguide/docguide/style.html](https://google.github.io/styleguide/docguide/style.html)  
22. How to use Markdown for writing documentation | Adobe Experience Cloud, consulté le avril 25, 2025, [https://experienceleague.adobe.com/en/docs/contributor/contributor-guide/writing-essentials/markdown](https://experienceleague.adobe.com/en/docs/contributor/contributor-guide/writing-essentials/markdown)  
23. G64: Providing a Table of Contents | Techniques for WCAG 2.0 \- W3C, consulté le avril 25, 2025, [https://www.w3.org/TR/WCAG20-TECHS/G64.html](https://www.w3.org/TR/WCAG20-TECHS/G64.html)  
24. Table of Contents: How to Do It Right for SEO \- Zenbrief, consulté le avril 25, 2025, [https://zenbrief.com/blog/table-of-contents-for-seo/](https://zenbrief.com/blog/table-of-contents-for-seo/)  
25. Mastering Table of Contents: Samples, Tips, and SEO Benefits | AFFiNE, consulté le avril 25, 2025, [https://affine.pro/blog/table-of-contents-sample](https://affine.pro/blog/table-of-contents-sample)  
26. Dissertation Table of Contents in Word | Instructions & Examples \- Scribbr, consulté le avril 25, 2025, [https://www.scribbr.com/dissertation/table-of-contents/](https://www.scribbr.com/dissertation/table-of-contents/)  
27. What is a Table of Contents? A Comprehensive Guide \- sitecentre, consulté le avril 25, 2025, [https://www.sitecentre.com.au/blog/table-of-contents](https://www.sitecentre.com.au/blog/table-of-contents)  
28. Best practices and tips in markdown \- Technical writing mentorship program, consulté le avril 25, 2025, [https://technicalwritingmp.com/docs/markdown-course/best-practices-and-tips-in-markdown/](https://technicalwritingmp.com/docs/markdown-course/best-practices-and-tips-in-markdown/)  
29. Readability | Usability & Web Accessibility \- Yale University, consulté le avril 25, 2025, [https://usability.yale.edu/web-accessibility/articles/readability](https://usability.yale.edu/web-accessibility/articles/readability)  
30. Typography | U.S. Web Design System (USWDS) \- Digital.gov, consulté le avril 25, 2025, [https://designsystem.digital.gov/components/typography/](https://designsystem.digital.gov/components/typography/)  
31. Paragraphs | Technical Writing \- Google for Developers, consulté le avril 25, 2025, [https://developers.google.com/tech-writing/one/paragraphs](https://developers.google.com/tech-writing/one/paragraphs)  
32. Paragraphs \- Veeam Technical Writing Guidelines, consulté le avril 25, 2025, [https://helpcenter.veeam.com/docs/styleguide/tw/paragraphs.html](https://helpcenter.veeam.com/docs/styleguide/tw/paragraphs.html)  
33. Technical Writing Standards | Engineering Writing Center \- USU College of Engineering \- Utah State University, consulté le avril 25, 2025, [https://engineering.usu.edu/students/ewc/writing-resources/technical-writing-standards](https://engineering.usu.edu/students/ewc/writing-resources/technical-writing-standards)  
34. 3.1 KEY CONCEPT: Readability – Technical Writing Essentials, consulté le avril 25, 2025, [https://pressbooks.bccampus.ca/technicalwriting/chapter/readability/](https://pressbooks.bccampus.ca/technicalwriting/chapter/readability/)  
35. Cognitive Load Theory and the Format of Instruction \- Taylor & Francis Online, consulté le avril 25, 2025, [https://www.tandfonline.com/doi/abs/10.1207/s1532690xci0804\_2](https://www.tandfonline.com/doi/abs/10.1207/s1532690xci0804_2)  
36. Markdown Best Practices \- Ed-Fi Alliance, consulté le avril 25, 2025, [https://docs.ed-fi.org/community/sdlc/code-contribution-guidelines/coding-standards/markdown-best-practices/](https://docs.ed-fi.org/community/sdlc/code-contribution-guidelines/coding-standards/markdown-best-practices/)