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

# Installe les dépendances de test
poetry-install-test:
    @echo "📦 Installing test dependencies..."
    cd backend/python-agent && poetry install --with test
    cd backend/python-reasoning && poetry install --with test

# Ajoute une dépendance à un service spécifique
poetry-add service dependency:
    @echo "➕ Adding {{ dependency }} to {{ service }}..."
    cd backend/{{ service }} && poetry add {{ dependency }}

# Ajoute une dépendance de test à un service spécifique
poetry-add-test service dependency:
    @echo "➕ Adding test dependency {{ dependency }} to {{ service }}..."
    cd backend/{{ service }} && poetry add --group test {{ dependency }}

#=============================================================================
# Tests
#=============================================================================

# Lance tous les tests (toutes catégories)
test: test-python

# Tests Go
test-go:
    @echo "🧪 Running Go tests..."
    cd backend/go-core && go test ./...

# Tests Python (tous niveaux)
test-python: test-python-unit test-python-integration

# Tests Python unitaires rapides
test-python-unit:
    @echo "🧪 Running Python unit tests..."
    cd backend/python-agent && poetry run pytest tests/unit/ -v
    cd backend/python-reasoning && poetry run pytest tests/unit/ -v

# Tests Python d'intégration
test-python-integration:
    @echo "🧪 Running Python integration tests..."
    cd backend/python-agent && poetry run pytest tests/integration/ -v
    cd backend/python-reasoning && poetry run pytest tests/integration/ -v

# Tests Python avec Docker
test-python-docker:
    @echo "🧪 Running Python Docker tests..."
    cd backend/python-agent && poetry run pytest tests/integration/test_grpc_docker.py -v
    cd backend/python-reasoning && poetry run pytest tests/integration/test_grpc_docker.py -v

# Tests de validation Buf protovalidate
test-python-validation:
    @echo "🧪 Running Buf protovalidate tests..."
    cd backend/python-agent && poetry run pytest tests/unit/test_protobuf_validation.py -v
    cd backend/python-reasoning && poetry run pytest tests/unit/test_protobuf_validation.py -v

# Tests avec couverture de code
test-python-coverage:
    @echo "🧪 Running Python tests with coverage..."
    cd backend/python-agent && poetry run pytest --cov=src --cov-report=html --cov-report=term
    cd backend/python-reasoning && poetry run pytest --cov=src --cov-report=html --cov-report=term

# Tests en parallèle (plus rapide)
test-python-parallel:
    @echo "🧪 Running Python tests in parallel..."
    cd backend/python-agent && poetry run pytest -n auto
    cd backend/python-reasoning && poetry run pytest -n auto

# Tests d'un service spécifique
test-service service:
    @echo "🧪 Running tests for {{ service }}..."
    cd backend/{{ service }} && poetry run pytest

# Tests d'un service spécifique par niveau
test-service-unit service:
    @echo "🧪 Running unit tests for {{ service }}..."
    cd backend/{{ service }} && poetry run pytest tests/unit/ -v

test-service-integration service:
    @echo "🧪 Running integration tests for {{ service }}..."
    cd backend/{{ service }} && poetry run pytest tests/integration/ -v

# Tests end-to-end avec live-reload
test-e2e:
    @echo "🧪 Running end-to-end tests..."
    cd backend/python-agent && poetry run pytest tests/e2e/ -v
    cd backend/python-reasoning && poetry run pytest tests/e2e/ -v

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

# Formate le code de test Python
format-python-tests:
    @echo "🎨 Formatting Python test code..."
    cd backend/python-agent && poetry run black tests/
    cd backend/python-reasoning && poetry run black tests/

# Nettoie les fichiers de cache de test
clean-test-cache:
    @echo "🧹 Cleaning test cache..."
    find backend/ -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    find backend/ -name "*.pyc" -delete 2>/dev/null || true
    find backend/ -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null || true
    find backend/ -name "htmlcov" -type d -exec rm -rf {} + 2>/dev/null || true
    find backend/ -name ".coverage" -delete 2>/dev/null || true

# Vérifie la qualité du code de test
lint-python-tests:
    @echo "🔍 Linting Python test code..."
    cd backend/python-agent && poetry run mypy tests/ || true
    cd backend/python-reasoning && poetry run mypy tests/ || true

# Génère un rapport de couverture HTML
test-coverage-html:
    @echo "📊 Generating HTML coverage report..."
    cd backend/python-agent && poetry run pytest --cov=src --cov-report=html
    cd backend/python-reasoning && poetry run pytest --cov=src --cov-report=html
    @echo "📊 Coverage reports generated in htmlcov/ directories"

# Teste et génère un rapport complet
test-report: clean-test-cache test-python-coverage
    @echo "📋 Complete test report generated!"

# Commande de développement : tests rapides en boucle
test-watch:
    @echo "👀 Running tests in watch mode (Ctrl+C to stop)..."
    cd backend/python-agent && poetry run pytest tests/unit/ --tb=short -q || true
    cd backend/python-reasoning && poetry run pytest tests/unit/ --tb=short -q || true
