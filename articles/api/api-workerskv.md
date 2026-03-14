# Skill Vault

Personal vault deployed on Cloudflare Pages with token-based authentication, persistent notes, and file downloads. Backend logic runs entirely on Cloudflare Workers with KV storage.

---

## Stack

- **Cloudflare Pages** — static hosting
- **Cloudflare Workers** — serverless backend (`_worker.js`)
- **Cloudflare KV** — persistent storage for tokens, notes, and access logs
- **Vanilla JS + CSS** — no frameworks, no build step

---

## Project Structure

```
/
├── _worker.js          # Worker: auth + notes API + asset protection
├── index.html          # Login screen and vault shell
├── assets/
│   ├── css/main.css    # All styles
│   └── js/main.js      # Auth, notes, downloads logic
├── downloads/          # Protected files (.md, .epub, .pdf, etc.)
└── README.md
```

---

## Authentication

Access is controlled by a username token stored directly in KV. The client submits the token and the Worker validates it against the KV namespace.

- Tokens are managed manually in the Cloudflare KV dashboard
- To create access: add a key `{username}` with any value (e.g. `active`)
- To revoke access: delete the key from KV
- Notes data is stored separately under `notes:{username}` and is not affected by token changes

### KV Key Schema

| Key | Description |
|---|---|
| `{username}` | Access token. Value can be any string. |
| `notes:{username}` | JSON array of the user's notes. |
| `log:{YYYY-MM-DD}` | Daily access log. Expires after 30 days. |

---

## API Endpoints

All endpoints are handled by `_worker.js`.

### POST /api/auth
Validates a username token and returns session confirmation.

**Request**
```json
{ "username": "your-token" }
```

**Response**
```json
{ "success": true, "token": "<uuid>", "user": "your-token" }
```

---

### POST /api/validate
Checks whether a username is still valid in KV.

**Request**
```json
{ "username": "your-token" }
```

**Response**
```json
{ "valid": true }
```

---

### GET /api/notes
Returns the authenticated user's notes array.

**Headers**
```
Authorization: Bearer {username}
```

**Response**
```json
{ "notes": [ { "id": "...", "titulo": "...", "conteudo": "...", "criadoEm": "...", "atualizadoEm": "..." } ] }
```

---

### POST /api/notes
Saves the full notes array for the authenticated user, overwriting previous state.

**Headers**
```
Authorization: Bearer {username}
Content-Type: application/json
```

**Request**
```json
{ "notes": [ ... ] }
```

---

## Notes

Each note object follows this structure:

```json
{
  "id": "1700000000000",
  "titulo": "Note title",
  "conteudo": "Note body text",
  "criadoEm": "2026-01-01T00:00:00.000Z",
  "atualizadoEm": "2026-01-01T00:00:00.000Z"
}
```

Notes are stored as a JSON array in KV. The entire array is sent on every save operation (last-write-wins).

---

## Downloads

Files inside `downloads/` are served as static assets via Cloudflare Pages. The download list is defined in `main.js`:

```js
const downloads = [
  { nome: "Bio", arquivo: "downloads/bio.md", ext: "md" },
  { nome: "Frontend Blueprint 2026", arquivo: "downloads/FrontendBlueprint2026.epub", ext: "epub" },
];
```

To add a file: upload it to `downloads/` and add a new entry to the array.

---

## Deployment

1. Connect the repository to Cloudflare Pages
2. Create a KV namespace (e.g. `VAULT_KV`) in the Cloudflare dashboard
3. Bind the namespace to the Pages project under **Settings > Functions > KV namespace bindings** with the variable name `VAULT_KV`
4. Deploy — no build command required

---

## Author

Developed by Guilherme Ribeiro — [fronthub.pages.dev](https://fronthub.pages.dev)