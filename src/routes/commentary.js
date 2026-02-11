import { Router } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";
import { commentary } from "../db/schema.js";
import { db } from "../db/db.js";
import { desc, eq } from "drizzle-orm";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get('/', async (req, res) => {
    const paramsParsed = matchIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
        return res.status(400).json({ error: 'Invalid match id.', details: paramsParsed.error.issues });
    }

    const queryParsed = listCommentaryQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
        return res.status(400).json({ error: 'Invalid query.', details: queryParsed.error.issues });
    }

    const limit = Math.min(queryParsed.data.limit ?? 10, MAX_LIMIT);

    try {
        const { id } = paramsParsed.data;
        const data = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, id))
            .orderBy(desc(commentary.createdAt))
            .limit(limit);

        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to list commentary.' });
    }
});

commentaryRouter.post('/', async (req, res) => {
    const paramsParsed = matchIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
        return res.status(400).json({ error: 'Invalid match id.', details: paramsParsed.error.issues });
    }

    const bodyParsed = createCommentarySchema.safeParse(req.body);
    if (!bodyParsed.success) {
        return res.status(400).json({ error: 'Invalid payload.', details: bodyParsed.error.issues });
    }

    try {
        const { id } = paramsParsed.data;
        const payload = bodyParsed.data;

        const [created] = await db.insert(commentary).values({
            matchId: id,
            minute: payload.minute,
            sequence: payload.sequence,
            period: payload.period,
            eventType: payload.eventType,
            actor: payload.actor,
            team: payload.team,
            message: payload.message,
            metadata: payload.metadata ?? null,
            tags: payload.tags ?? null,
        }).returning();

        if(res.app.locals.broadcastCommentary) {
            res.app.locals.broadcastCommentary(created.matchId, created);
        }

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create commentary.' });
    }
});