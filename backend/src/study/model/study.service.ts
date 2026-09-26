import { randomUUID } from 'node:crypto';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { PoolClient } from 'pg';

import { DatabaseService } from '../../database/model/database.service';

import { emptyProgress } from '../lib/learning';
import { validateModule } from '../lib/modules';
import type {
  CardInput,
  FlashcardStatus,
  ModuleInput,
  ModuleRow,
  Progress,
  ProgressRow,
  StudyModule,
} from '../types';
@Injectable()
export class StudyService {
  constructor(private readonly database: DatabaseService) {}
  async list(owner: string) {
    const result = await this.database.pool.query<ModuleRow>(
      "SELECT document FROM study_modules WHERE owner_id=$1 ORDER BY document->>'updatedAt' DESC",
      [owner],
    );

    return result.rows.map((row) => {
      return row.document;
    });
  }

  async get(client: PoolClient, owner: string, id: string) {
    const result = await client.query<ModuleRow>(
      'SELECT document FROM study_modules WHERE id=$1 AND owner_id=$2 FOR UPDATE',
      [id, owner],
    );
    if (!result.rows[0]) {
      throw new NotFoundException('Module not found.');
    }

    return result.rows[0].document;
  }

  async detail(owner: string, id: string) {
    return this.database.transaction(async (client) => {
      const module = await this.get(client, owner, id);
      const progress = await this.progress(client, owner, module);

      return { module, progress };
    });
  }

  async progress(client: PoolClient, owner: string, module: StudyModule) {
    const result = await client.query<ProgressRow>(
      'SELECT card_id, document FROM study_progress WHERE owner_id=$1 AND card_id=ANY($2::text[])',
      [
        owner,
        module.cards.map((card) => {
          return card.id;
        }),
      ],
    );
    const progress: Record<string, Progress> = {};
    for (const card of module.cards) {
      progress[card.id] =
        result.rows.find((row) => {
          return row.card_id === card.id;
        })?.document ?? emptyProgress();
    }

    return progress;
  }

  async writeModule(client: PoolClient, owner: string, input: ModuleInput, existing?: StudyModule) {
    validateModule(input);
    const now = new Date().toISOString();
    const id = existing?.id ?? randomUUID();
    const cards = input.cards.map((card, position) => {
      const previous = existing?.cards.find((item) => {
        return item.id === card.id;
      });
      if (card.id && !previous) {
        throw new BadRequestException('Unknown card identifier.');
      }

      return {
        id: previous?.id ?? randomUUID(),
        moduleId: id,
        term: card.term.trim(),
        definition: card.definition.trim(),
        position,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      };
    });
    const module: StudyModule = {
      id,
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      cards,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await client.query(
      'INSERT INTO study_modules(id,owner_id,document) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET document=$3',
      [id, owner, module],
    );
    await client.query('DELETE FROM study_cards WHERE module_id=$1 AND NOT(id=ANY($2::text[]))', [
      id,
      cards.map((card) => {
        return card.id;
      }),
    ]);
    for (const card of cards) {
      await client.query('INSERT INTO study_cards(id,module_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [
        card.id,
        id,
      ]);
    }
    await client.query('DELETE FROM study_sessions WHERE module_id=$1', [id]);

    return module;
  }

  async save(owner: string, input: ModuleInput, id?: string) {
    return this.database.transaction(async (client) => {
      if (id) {
        return this.writeModule(client, owner, input, await this.get(client, owner, id));
      }

      return this.writeModule(client, owner, input);
    });
  }

  async append(owner: string, id: string, card: CardInput) {
    return this.database.transaction(async (client) => {
      const module = await this.get(client, owner, id);

      return this.writeModule(
        client,
        owner,
        { ...module, cards: [...module.cards, { term: card.term, definition: card.definition }] },
        module,
      );
    });
  }

  async remove(owner: string, id: string) {
    await this.database.transaction(async (client) => {
      await this.get(client, owner, id);
      await client.query('DELETE FROM study_modules WHERE id=$1', [id]);
    });
  }

  async putProgress(client: PoolClient, owner: string, cardId: string, progress: Progress) {
    await client.query(
      'INSERT INTO study_progress(owner_id,card_id,document) VALUES($1,$2,$3) ON CONFLICT(owner_id,card_id) DO UPDATE SET document=$3',
      [owner, cardId, progress],
    );
  }

  async mark(owner: string, id: string, cardId: string, status: FlashcardStatus) {
    if (!['known', 'learning', 'unreviewed'].includes(status)) {
      throw new BadRequestException('Invalid status.');
    }
    await this.database.transaction(async (client) => {
      const module = await this.get(client, owner, id);
      if (
        !module.cards.some((card) => {
          return card.id === cardId;
        })
      ) {
        throw new NotFoundException();
      }
      const progress = await this.progress(client, owner, module);
      await this.putProgress(client, owner, cardId, { ...progress[cardId], flashcardStatus: status });
    });
  }

  async reset(owner: string, id: string) {
    await this.database.transaction(async (client) => {
      await this.get(client, owner, id);
      await client.query(
        'DELETE FROM study_progress WHERE owner_id=$1 AND card_id IN (SELECT id FROM study_cards WHERE module_id=$2)',
        [owner, id],
      );
      await client.query('DELETE FROM study_sessions WHERE module_id=$1', [id]);
    });
  }
}
