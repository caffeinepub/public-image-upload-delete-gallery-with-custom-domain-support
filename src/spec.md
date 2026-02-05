# Specification

## Summary
**Goal:** Create a public image gallery where any visitor can upload, view, and delete images, and ensure it works cleanly on a custom domain.

**Planned changes:**
- Implement backend APIs (no authentication) to upload images, list image metadata, fetch image bytes by id, and delete images by id.
- Build a frontend page with an upload control, a gallery that displays all uploaded images, and per-image delete actions.
- Add loading and error states for upload/list/delete operations.
- Apply a cohesive visual theme suitable for an image gallery, using a non-blue/purple primary palette.
- Add custom domain guidance and configure the frontend so API calls work from both default canister URLs and custom domains (no hard-coded host assumptions).
- Add and reference generated static assets (logo and hero/banner) from `frontend/public/assets/generated`.

**User-visible outcome:** Visitors can upload images, see them in a gallery, view served images, and delete any image, all from a themed UI that works on a custom domain and includes a logo and hero/banner.
