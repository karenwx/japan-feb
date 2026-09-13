# Photo audit — 13 September 2026

Audited all 53 venue cards. Replaced the previous card image mappings with 49 individually sourced photographs. Dormy Inn Premium Kyoto Ekimae now shows its indoor public bath from the official Kyoto gallery. Restaurant replacements include the actual dishes, interiors, and exteriors from the named venue or its brand; brand menu photography is explicitly labeled.

Removed unverified photos from Menya Inoichi, Hitomi, W Osaka, and The Ritz-Carlton Osaka. These four cards display “Photo unavailable” rather than an unrelated photograph. Their venue links remain available.

The source manifest is `photo-sources.json`. It records each source page, original image URL, verification date, and embedded-image SHA-256; Wikimedia authors and licenses are preserved on the cards. Official-site photographs are credited to their source and are not represented as Creative Commons images. Resizing and display cropping are disclosed for Wikimedia images. The existing winter cover is unchanged.

Validation: all downloaded replacements visually inspected in contact sheets; 53 venue mappings checked against the manifest; five automated tests pass; all inline JavaScript parses; Wrangler production dry-run passes. Browser automation was unavailable (native pipe startup failure), so a fresh browser layout check could not be completed.
