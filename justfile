#=============================================================================
# Variables
#=============================================================================

BACKEND_DIR := "backend"
COMPOSE_FILE := BACKEND_DIR + "/docker-compose.yml"

#=============================================================================
# Tâches Fondamentales
#=============================================================================

# Point d'entrée par défaut pour les nouveaux développeurs
default: help

# Affiche une aide décrivant toutes les commandes disponibles
help:
    @echo "🚀 AutoAgent Development Commands:"
    @echo ""
    @just --list

# Démarre tous les services en mode détaché
up:
    @echo "🔄 Starting all services..."
    cd {{ BACKEND_DIR }} && sudo docker compose up --build -d

# Démarre un service spécifique
up-service service:
    @echo "🔄 Starting {{ service }}..."
    cd {{ BACKEND_DIR }} && sudo docker compose up --build -d {{ service }}

# Arrête tous les services
down:
    @echo "🛑 Stopping all services..."
    cd {{ BACKEND_DIR }} && sudo docker compose down

# Affiche les logs de tous les services
logs:
    @echo "📋 Showing logs for all services..."
    cd {{ BACKEND_DIR }} && sudo docker compose logs -f

# Logs d'un service spécifique
logs-service service:
    @echo "📋 Showing logs for {{ service }}..."
    cd {{ BACKEND_DIR }} && sudo docker compose logs -f {{ service }}

# Nettoie complètement l'environnement (volumes, réseaux...)
clean: down
    @echo "🧹 Cleaning up Docker environment..."
    cd {{ BACKEND_DIR }} && sudo docker compose down -v --remove-orphans
    sudo docker system prune -f

#=============================================================================
# Génération de Code
#=============================================================================

# Génère les stubs gRPC pour tous les langages
proto-gen:
    @echo "🔧 Generating gRPC stubs..."
    buf generate

#=============================================================================
# Gestion des Dépendances Poetry
#=============================================================================

# Met à jour tous les lock files Poetry
poetry-lock:
    @echo "🔒 Updating Poetry lock files..."
    cd gen/python && poetry lock
    cd backend/python-agent && poetry lock
    cd backend/python-reasoning && poetry lock

# Installe les dépendances Poetry en mode développement
poetry-install:
    @echo "📦 Installing Poetry dependencies..."
    cd gen/python && poetry install
    cd backend/python-agent && poetry install
    cd backend/python-reasoning && poetry install

# Ajoute une dépendance à un service spécifique
poetry-add service dependency:
    @echo "➕ Adding {{ dependency }} to {{ service }}..."
    cd backend/{{ service }} && poetry add {{ dependency }}

#=============================================================================
# Tests
#=============================================================================

# Lance tous les tests
test: test-go test-python

# Tests Go
test-go:
    @echo "🧪 Running Go tests..."
    cd backend/go-core && go test ./...

# Tests Python
test-python:
    @echo "🧪 Running Python tests..."
    cd backend/python-agent && poetry run pytest
    cd backend/python-reasoning && poetry run pytest

# Tests d'un service spécifique
test-service service:
    @echo "🧪 Running tests for {{ service }}..."
    cd backend/{{ service }} && poetry run pytest

#=============================================================================
# Développement et Débogage
#=============================================================================

# Rebuild et redémarre un service spécifique
rebuild service:
    @echo "🔨 Rebuilding and restarting {{ service }}..."
    cd {{ BACKEND_DIR }} && docker compose up --build -d {{ service }}

# Ouvre un shell dans un container en cours d'exécution
shell service:
    @echo "🐚 Opening shell in {{ service }} container..."
    cd {{ BACKEND_DIR }} && sudo docker compose exec {{ service }} /bin/bash

# Affiche le statut de tous les services
status:
    @echo "📊 Service status:"
    cd {{ BACKEND_DIR }} && sudo docker compose ps

# Affiche les ressources utilisées par les containers
stats:
    @echo "📈 Container resource usage:"
    sudo docker stats --no-stream

#=============================================================================
# Maintenance et Nettoyage
#=============================================================================

# Nettoie les images Docker inutilisées
clean-images:
    @echo "🗑️  Cleaning unused Docker images..."
    sudo docker image prune -f

# Nettoie tout (containers, images, volumes, networks)
clean-all: down
    @echo "🧹 Deep cleaning Docker environment..."
    cd {{ BACKEND_DIR }} && docker compose down -v --remove-orphans
    sudo docker system prune -a -f --volumes

# Redémarre complètement l'environnement
restart: down up
    @echo "♻️  Environment restarted!"

#=============================================================================
# Utilitaires de Développement
#=============================================================================

# Vérifie la syntaxe des fichiers Docker Compose
validate:
    @echo "✅ Validating Docker Compose configuration..."
    cd {{ BACKEND_DIR }} && sudo docker compose config

# Affiche les variables d'environnement utilisées
env:
    @echo "🔍 Environment variables:"
    cd {{ BACKEND_DIR }} && sudo docker compose config --services

# Lance un linter sur le code Python
lint-python:
    @echo "🔍 Linting Python code..."
    cd backend/python-agent && poetry run mypy src/
    cd backend/python-reasoning && poetry run mypy src/

# Formate le code Python avec black
format-python:
    @echo "🎨 Formatting Python code..."
    cd backend/python-agent && poetry run black src/
    cd backend/python-reasoning && poetry run black src/
