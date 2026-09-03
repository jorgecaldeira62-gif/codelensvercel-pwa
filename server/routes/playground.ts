import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, snippetsTable } from "../../lib/db/index.js";

const router: IRouter = Router();

// Listar snippets
router.get("/snippets", async (_req, res): Promise<void> => {
  try {
    const rows = await db.select().from(snippetsTable).orderBy(desc(snippetsTable.createdAt));
    res.json(rows.map(r => ({ ...r, id: String(r.id) })));
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar snippets" });
  }
});

// Criar snippet
router.post("/snippets", async (req, res): Promise<void> => {
  try {
    const { title = "Sem título", html = "", css = "", js = "", mode = "html" } = req.body;
    const now = new Date().toISOString();
    const rows = await db.insert(snippetsTable)
      .values({ title, html, css, js, mode, createdAt: now })
      .returning();
    res.json({ ...rows[0], id: String(rows[0].id) });
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar snippet" });
  }
});

// Renomear snippet
router.patch("/snippets/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title } = req.body;
    if (!title?.trim()) { res.status(400).json({ error: "Título não pode ser vazio" }); return; }
    const rows = await db.update(snippetsTable)
      .set({ title: title.trim() })
      .where(eq(snippetsTable.id, id))
      .returning();
    if (!rows[0]) { res.status(404).json({ error: "Não encontrado" }); return; }
    res.json({ ...rows[0], id: String(rows[0].id) });
  } catch (err) {
    res.status(500).json({ error: "Erro ao renomear" });
  }
});

// Deletar snippet
router.delete("/snippets/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(snippetsTable).where(eq(snippetsTable.id, id));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir" });
  }
});

export default router;
