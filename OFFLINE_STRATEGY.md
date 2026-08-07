# Offline Experience & Caching Strategy

The MR Institute of Learning platform utilizes a carefully balanced offline strategy to ensure maximum reliability for the public website while preventing stale data collisions within the Office operations and CMS modules.

## 1. Static Asset Pre-caching (Workbox)
All UI elements, scripts, styles, and core fonts are cached aggressively by Workbox.
- **Result**: The App Shell loads instantly even when entirely offline, providing the `<OfflineBanner />` fallback rather than a Chrome "No Internet" dinosaur page.

## 2. Dynamic Form Fallback (Offline Queue)
Public users might attempt to submit an Enquiry or Contact form while their connection drops (e.g., while commuting).
- **Strategy**: 
  - If a form submission fails due to a network error, the payload is intercepted and serialized into a custom `localStorage` array (`pending_form_submissions`).
  - An event listener on the `window` object for `online` automatically detects network restoration, replays the queued submissions sequentially, and clears the queue upon success.
- **Benefit**: Zero data loss for prospective student enquiries.

## 3. Firestore Offline Persistence Matrix
Native Firestore Offline Persistence (`enableIndexedDbPersistence`) caches all reads and writes globally. Due to the hybrid nature of this application (Public Web + Admin Portal), we configure persistence carefully.

| Module | Persistence Strategy | Reason |
|--------|----------------------|--------|
| **Public Website** | Allowed via Workbox / Default Cache | Read-heavy. High tolerance for slight eventual consistency. |
| **Developer CMS** | Disabled / Strict Network First | Prevent editors from accidentally overwriting live data based on a stale local cache. |
| **Office Portal** | Disabled / Strict Network First | Prevent operational conflicts (e.g., two admins approving the same application simultaneously due to sync delays). |

## 4. Background Sync (Future Enhancement)
While `localStorage` + `online` events work well for immediate tab resilience, future iterations will utilize the native Workbox Background Sync API for true service-worker-level deferred POST replays, pending migration from the Firebase SDK to raw REST POST requests for those specific ingestion endpoints.
