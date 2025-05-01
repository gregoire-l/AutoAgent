exemple :


Mission : rechercher les moyens de transports / un itineraire entre Lyon Paris aller retour

=> préciser missions / les contraintes / etc



Contraintes : 
budget maximum : 100 euros
temps maximum : 6h

arrivé le le vendredi 04 avril avant 20h.
retour le plus tard dimanche soir






Doit penser a tout inclure, les tickets de bus pour aller au train a Lyon, le ticket de metro pour aller de la gare de paris a la destination finale, etc

Doit demander le nombre de personne si non precise

=> 4 personnes

=> resume la mission pour s'assurer d'avoir bien compris et que rien ne manque


Doit :
- Regarder distance lyon paris : 300 km (exemple)
-lister moyen de transport possibles : 
a pied ou velo => non trop long
train, voiture, co-voiturage, bus, avion

Si voiture, doit penser a calculer prix essence, plus peage eventuel, plus parking a paris si besoin
=> doit demander si acces a une voiture, si acces a un parking sur place
=> demande asynchrone, continue a faire le reste le temps que l'utilisateur réponde


faiure recherche sur internet pour site covoiturage france
=> va trouver par exemple blablacar et moovit
=> s'assurer que ces sites sont sur
=> pour chacun de ces sites, allez desus et faire une recherche avec le voyage pour avoir tous les possibilites

faire pariel pour le train
=> trouver probablement sncf connect et trainline
=> se renseigner sur les différentes compagnies qui permettent de faire lyon Paris
=> devrait trouver sncf, une autre compagnie italienne, etc. 
=> se renseigner sur ces compagnies, voir qu'elles proposent des cartes de reductions
=> demander a l'utilisateur si il/les perosnnes avec qui il voyage en possede une => si oui, se renseigner sur la carte et cve qu'elle apporte. Demande asynchrone donc attendre réponse utuilisateur
=> faire des simulations des trajets sur les differents sites pour avoir tous les prix disponibles, avec les options et ce qui est compris / non compris, les temps, etc.bref extraires les informations


faire pareil por les bus :
=> recherhc einternet
=> blablabus, flixbus
=> aller sur leur site, pour chaque faire simulations trajet et extraire informations => 1 agent par site

En parallele, se renseigner sur frais annexe : 
=> Trouver prix ticket bus lyon => 1 agent
=> trouver prix ticket metro paris => 1 agent
=> trouver prix parking paris => 1 agent


=> attendre tous les remontes d'informaitons
=> compiler les résultats par rapport aux contrainte et a la mission





En terme d'agent :
- agent orchestrateur => avec lui que l'utilisateur discute
=>




- agent collect information / extraction information / computer use sur un site
=> on lui donne une tache precise, récuperer tel informations et redonnner ce format
=> temps maximulm alloué / nbr de requete maxium alloué donc un budget, gere par l'orchestrateur 


