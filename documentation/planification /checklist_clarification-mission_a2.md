# **AutoAgent \- Checklist de Clarification de Mission (Noyau Dur V1)**

**Objectif :** Définir l'ensemble **minimal et indispensable** d'informations qu'un agent Orchestrateur doit chercher à comprendre et faire valider par l'utilisateur lors de la phase de clarification (A2). Cette checklist sert de **guide interne adaptatif** pour l'agent, garantissant qu'une compréhension fondamentale et partagée de la mission est atteinte avant de procéder à la planification détaillée ou à l'exécution.

**Principes Directeurs :**

* **Compréhension Profonde (Vision/Intention) :** L'objectif principal n'est pas de cocher des cases, mais de comprendre le **"Pourquoi"** derrière la mission, les attentes réelles et la vision de l'utilisateur.  
* **Vérifiabilité Objective :** Les informations collectées, en particulier les objectifs et les livrables, doivent être suffisamment claires pour permettre la définition ultérieure de **critères de succès mesurables et vérifiables**.  
* **Focus sur l'Essentiel (V1) :** Se concentrer sur les éléments absolument critiques pour démarrer la mission sur des bases saines, en acceptant qu'une exploration plus poussée puisse être nécessaire pour des missions complexes.  
* **Pragmatisme :** Viser une définition suffisante pour la V1, sans chercher une exhaustivité absolue qui pourrait créer une friction inutile.

## **Checklist "Noyau Dur V1" (Catégories d'Informations à Valider)**

L'agent Orchestrateur doit s'assurer d'avoir une compréhension validée par l'utilisateur pour chacune des catégories suivantes avant de conclure la phase A2 :

1. **Info\_Motivation\_Contexte : Pourquoi cette mission est-elle entreprise ? Quel problème fondamental cherche-t-on à résoudre ou quelle opportunité vise-t-on ?**  
   * *Critère de Qualité (Agent) :* L'agent doit pouvoir reformuler la raison d'être de la mission et son importance pour l'utilisateur.  
   * *Exemple de Question IA (si non clair) :* "Pour m'assurer de bien saisir l'enjeu, pourriez-vous m'expliquer le problème principal que cette mission doit adresser ou l'objectif plus large qu'elle sert ?"  
2. **Info\_Objective\_Principal : Quel est l'objectif principal, spécifique et concret de la mission ?**  
   * *Critère de Qualité (Agent) :* L'objectif doit être formulé de manière suffisamment claire pour pouvoir en déduire les actions principales requises et imaginer un état final mesurable (idéalement SMART).  
   * *Exemple de Question IA (si non clair) :* "Quel résultat spécifique et observable attendez-vous à la fin de cette mission ?" / "Comment décririez-vous le succès principal de cette mission en une phrase ?"  
3. **Info\_Livrable\_Cle : Quel est le résultat tangible principal qui doit être produit ?**  
   * *Critère de Qualité (Agent) :* Le livrable doit être identifié clairement (ex: "un rapport", "un script", "une liste d'options", "une interface utilisateur prototypée"). Le format ou la nature générale doit être compris.  
   * *Exemple de Question IA (si non clair) :* "Concrètement, qu'est-ce que je devrai vous fournir à la fin ?" / "Quel artefact ou résultat principal attendez-vous ?"  
4. **Info\_Critere\_Acceptation\_Fondamental : Quel est LE critère le plus important qui déterminera si le livrable clé est acceptable/réussi ?**  
   * *Critère de Qualité (Agent) :* Doit être un critère objectif et vérifiable, même s'il est simple pour la V1. (ex: "Le script s'exécute sans erreur", "Le rapport contient les données X et Y", "La liste respecte le budget").  
   * *Exemple de Question IA (si non clair) :* "Comment jugerez-vous principalement si le \[Livrable Clé\] répond à vos attentes ?" / "Quel est l'aspect le plus important à vérifier pour valider ce travail ?"  
5. **Info\_Contrainte\_Critique : Existe-t-il une contrainte absolument non négociable (délai impératif, budget maximal strict, ressource indispensable, exclusion majeure) qui encadre toute la mission ?**  
   * *Critère de Qualité (Agent) :* L'agent doit avoir identifié les limites infranchissables ou avoir obtenu confirmation qu'il n'y en a pas d'identifiée à ce stade.  
   * *Exemple de Question IA (si non clair) :* "Y a-t-il des limites absolues (date, budget, technologie à éviter...) que je dois impérativement connaître dès maintenant ?" / "Pouvons-nous confirmer l'absence de contrainte bloquante majeure ?"  
6. **Info\_Validateur\_Principal : Qui est la personne (ou le rôle) qui aura l'autorité finale pour valider que la mission est réussie ?**  
   * *Critère de Qualité (Agent) :* L'agent doit savoir à qui s'adresser pour la validation finale (même si c'est l'utilisateur unique en V1).  
   * *Exemple de Question IA (si non clair) :* "Juste pour confirmer, qui sera la personne qui validera le résultat final de cette mission ?"

## **Principes d'Application Adaptative par l'Agent Orchestrateur**

L'agent ne doit PAS dérouler cette checklist comme un questionnaire rigide. Il doit :

1. **Analyser d'Abord :** Examiner attentivement l'input initial et les réponses suivantes de l'utilisateur pour identifier quelles informations de la checklist sont déjà fournies, même implicitement.  
2. **Questionner Cibléelement :** Poser des questions ouvertes et spécifiques **uniquement** sur les informations de la checklist qui sont manquantes, ambiguës, ou qui ont été inférées par l'IA avec une faible confiance. Prioriser le "Noyau Dur V1".  
3. **Écouter Activement :** Utiliser la reformulation et la synthèse progressive pour valider sa compréhension et montrer à l'utilisateur qu'il est écouté.  
4. **Confirmer Explicitement :** Demander une confirmation claire ("Est-ce exact ?", "Pouvons-nous confirmer que...") avant de considérer une information comme validée et de la persister.  
5. **Sonder si Nécessaire :** Si une réponse est vague, poser des questions de suivi pour approfondir et atteindre le niveau de clarté requis par le critère de qualité de l'information.  
6. **Être Flexible :** S'adapter si l'utilisateur aborde les points dans un ordre différent ou introduit de nouvelles informations, tout en gardant la trace des éléments de la checklist restant à valider.  
7. **Conclure la Clarification :** Ne passer à la phase de synthèse (A5) que lorsque **tous les points du Noyau Dur V1** ont été explicitement confirmés.

Ce document fournit un cadre pour l'agent Orchestrateur, équilibrant la nécessité d'une collecte d'informations structurée et fiable avec le besoin d'une interaction fluide et adaptative centrée sur la compréhension profonde de la vision de l'utilisateur.