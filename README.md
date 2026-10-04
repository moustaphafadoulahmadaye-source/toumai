# toumai

Boutique web : frontend statique, API Express, base SQLite.

## Lancer le projet

```bash
cd backend
npm ci
cp .env.example .env      # puis remplir les variables ci-dessous
npm start                 # http://localhost:3001
```

## Créer le premier administrateur

Jamais de mot de passe dans le code, uniquement des variables d'environnement :

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='un-mot-de-passe-fort' ADMIN_NAME='Kolo Admin' node create_admin.js
```

## Configuration (`.env`)

```env
# Obligatoire
JWT_SECRET=                    # 32 caractères minimum
SUPER_ADMIN_EMAIL=
CORS_ORIGIN=                   # vide = même origine uniquement

# Sécurité dynamique (valeurs par défaut)
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7
RATE_LIMIT_WINDOW_MIN=15
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=10
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCK_MINUTES=15
PASSWORD_MIN_LENGTH=10
MAX_UPLOAD_MB=2
```

## Sécurité

**Authentification**
- JWT obligatoire, secret externe d'au moins 32 caractères
- Access token court (15 min) + refresh token révocable, renouvelé à chaque usage
- Mots de passe hachés avec bcrypt, politique de longueur minimale
- Verrouillage temporaire du compte après plusieurs échecs de connexion
- Messages d'erreur génériques (pas de fuite sur l'existence d'un compte)

**Accès et rôles**
- L'inscription publique crée uniquement un compte client
- Commandes visibles uniquement par leur propriétaire ou un administrateur
- Contrôle des rôles côté serveur sur chaque route sensible
- Aucune route Google « mock », aucun mot de passe codé en dur

**Protection de l'API**
- Rate limiting global, plus strict sur `/api/auth/*`
- En-têtes de sécurité via `helmet` (CSP, X-Frame-Options, HSTS)
- CORS fermé par défaut, liste explicite via `CORS_ORIGIN`
- Requêtes SQL préparées uniquement (pas de concaténation)
- Validation de tous les champs : quantités, prix, stocks, emails
- Limite de taille du body JSON

**Données et fichiers**
- Uploads limités en taille et en type (images uniquement), noms de fichiers régénérés
- Transaction SQLite pour empêcher les commandes au-delà du stock
- Journal d'audit (connexions, échecs, actions admin, changements de statut)
- Sauvegarde régulière du fichier SQLite, hors du dossier public

**Production**
- HTTPS obligatoire (reverse proxy Nginx/Caddy), `NODE_ENV=production`
- `.env` et la base jamais commités (`.gitignore`)
- `npm audit` régulier pour les dépendances

## Base de données

SQLite est la base réellement utilisée. `schema.sql` contient le schéma et les données initiales. Les migrations ajoutent automatiquement les colonnes manquantes
