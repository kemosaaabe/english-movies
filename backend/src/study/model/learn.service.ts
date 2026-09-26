import { randomUUID } from 'node:crypto';

import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

import { DatabaseService } from '../../database/model/database.service';

import { advanceSession, answerSession, overrideSessionAnswer } from '../lib/learning';
import type { SessionInput, SessionRow } from '../types';
import { StudyService } from './study.service';

@Injectable()
export class LearnService {
  constructor(
    private readonly database: DatabaseService,
    private readonly study: StudyService,
  ) {}

  async session(owner: string, id: string, action: string, body: SessionInput = {}) {
    return this.database.transaction(async (client) => {
      const module = await this.study.get(client, owner, id);
      const stored = await client.query<SessionRow>(
        'SELECT document FROM study_sessions WHERE module_id=$1 AND owner_id=$2',
        [id, owner],
      );
      let session = stored.rows[0]?.document;
      const historical = await this.study.progress(client, owner, module);
      if (action === 'resume' && session) {
        return session;
      }
      if (action === 'resume' || action === 'review' || action === 'fresh') {
        if (action === 'fresh') {
          for (const card of module.cards) {
            historical[card.id] = { ...historical[card.id], masteryLevel: 0 };
            await this.study.putProgress(client, owner, card.id, historical[card.id]);
          }
        }
        const progress = structuredClone(historical);
        if (action === 'review') {
          for (const card of module.cards) {
            progress[card.id].masteryLevel = 0;
          }
        }
        session = advanceSession({
          id: randomUUID(),
          cards: module.cards,
          progress,
          review: {},
          question: null,
          feedback: null,
          previousCardId: null,
          total: 0,
          correct: 0,
          reviewOnly: action === 'review',
        });
      } else {
        if (!session || session.id !== body.sessionId) {
          throw new ConflictException(
            'This session changed or was invalidated by a module edit. Reload to start again.',
          );
        }
        if (action === 'answer') {
          if (!body.questionId || session.question?.id !== body.questionId) {
            throw new ConflictException('This question has already changed. Reload to resume.');
          }
          if (!body.answer?.trim()) {
            throw new BadRequestException('An answer is required.');
          }
          const updated = answerSession(session, body.questionId, body.answer);
          if (updated !== session && updated.question && updated.feedback) {
            const cardId = updated.question.cardId;
            const current = historical[cardId];
            const learned = updated.progress[cardId];
            await this.study.putProgress(client, owner, cardId, {
              ...learned,
              flashcardStatus: current.flashcardStatus,
              masteryLevel: session.reviewOnly ? current.masteryLevel : learned.masteryLevel,
            });
          }
          session = updated;
        } else if (action === 'override') {
          if (
            !body.questionId ||
            session.question?.id !== body.questionId ||
            !session.feedback ||
            !session.feedback.previousProgress
          ) {
            throw new ConflictException('This answer can no longer be changed. Reload to resume.');
          }
          const updated = overrideSessionAnswer(session, body.questionId);
          if (updated !== session && updated.question && updated.feedback) {
            const cardId = updated.question.cardId;
            const current = historical[cardId];
            const learned = updated.progress[cardId];
            await this.study.putProgress(client, owner, cardId, {
              ...learned,
              flashcardStatus: current.flashcardStatus,
              masteryLevel: session.reviewOnly ? current.masteryLevel : learned.masteryLevel,
            });
          }
          session = updated;
        } else if (action === 'continue') {
          if (session.question?.id === body.questionId && session.feedback) {
            session = advanceSession(session);
          }
        } else {
          throw new BadRequestException('Unknown session action.');
        }
      }
      await client.query(
        'INSERT INTO study_sessions(module_id,owner_id,document) VALUES($1,$2,$3) ON CONFLICT(module_id) DO UPDATE SET document=$3',
        [id, owner, session],
      );

      return session;
    });
  }
}
