#=============================================================================
# Variables
# =============================================================================

COMPOSE_FILE := "docker-compose.yml"

# =============================================================================
# Tâches Fondamentales
# =============================================================================

# Point d'entrée par défaut pour les nouveaux développeurs
default: help

# Affiche une aide décrivant toutes les commandes disponibles
help:
    @echo "Available commands:"
    @just --list

# Démarre tous les services en mode détaché
up:
    @echo "Starting all services..."
    docker-compose -f {{ COMPOSE_FILE }} up --build -d

# Arrête tous les services
down:
    @echo "Stopping all services..."
    docker-compose -f {{ COMPOSE_FILE }} down

# Affiche les logs de tous les services
logs:
    docker-compose -f {{ COMPOSE_FILE }} logs -f

# Nettoie complètement l'environnement (volumes, réseaux...)
clean: down
    @echo "Cleaning up Docker environment..."
    docker-compose -f {{ COMPOSE_FILE }} down -v --remove-orphans

# =============================================================================
# Tâches de Génération de Code
# =============================================================================

# Génère les stubs gRPC pour tous les langages
proto-gen:
    @echo "Generating gRPC stubs for all languages..."
    buf generate

# =============================================================================
# Tâches de Test
# =============================================================================

# Lance tous les tests
test: test-go test-python

# Lance les tests unitaires Go
test-go:
    @echo "Running Go tests..."
    cd services/go-core && go test ./...

# Lance les tests unitaires Python
test-python:
    @echo "Running Python tests..."
    # Commande pour lancer pytest ici
