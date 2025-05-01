en go




automatic tool creation
automatic prompt creation based on template



define agent type

agent domain
agent permission

agent communication => utiliser des channels => agnostic pattern
agent memory => utiliser mem0 ????? => agnotistic pattern


enforcer meilleur pattern



validation input / output


fonctionnement pipeline

avec input / process / output abstraction


gestion multithread
gestion stream
asynchrone


sandbox by default




actions = tools ?????


securite par default


=> 



ui node based



everything in go:


frontend :
- htmx
- echo framework
- tailwind css
- templ
- GoShip.it : daisyui compobentn tailwindcss for templ
- air - live reload for dev
- urfave/cli : command line parser
- koanf : configuration
- sqlc : type safe sql query



test driven developement : strictly enforced





agent :
cadré ses choix :
décider entre
=> ne rien faire
=> faire une action
=> faire faire une action




Une partie sandbox :
utilisation de docker avec outils preinstalle







pour plus tard : utilisation de proxy residentiel




utilisation d'un routeur / loadbalancer / proxy pour rotate api key






avoir des process definis






tout passe par des tools :
- creation agent
=> cree aussi sandbox associe


tools : communication

- send_message : envoit message agent
- new task
- new agent
- delete agent
- change agent
+> follow CRUD ??? api way of doing thing ?




