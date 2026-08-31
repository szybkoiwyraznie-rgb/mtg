# Treść bazy (content/)

Źródło prawdy witryny (ADR 0001). Cała treść to markdown z frontmatterem;
build (`npm run build`) wstrzykuje ją do jednoplikowego artefaktu.

| Katalog | Co |
|---|---|
| `cards/` | Karty Katalogowe (materializacje) |
| `lore/` | Karty Haseł (encje świata) |
| `planes/` | strony planów/settingów |
| `taxonomia.json` | słownik tagów (tag poza słownikiem = czerwony test) |
| `co-nowego.md` | dziennik zmian (strona „Co nowego") |

Zasady pisania: ADR 0005 + `docs/guides/` (SZKIELET_KARTY, SZKIELET_HASLA).
README.md w podkatalogach to dokumentacja katalogu, nie strony bazy.
