# MargiAI

Aplicação web estática para inteligência de margem em ecommerce. A interface usa uma camada de repositório (`src/data.js`) e IndexedDB para persistência local de demonstração; a interface não acessa o armazenamento diretamente. Para conectar ao Supabase, implemente o mesmo contrato de `repository` com um adaptador Supabase e aplique o modelo em `SUPABASE_SCHEMA.sql`.

## Executar

Abra `index.html` usando um servidor estático, por exemplo:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`. A importação aceita CSV e XLSX pelo leitor SheetJS carregado no navegador.

Os dados iniciais são explicitamente dados de demonstração e podem ser alterados ou removidos nos cadastros.
