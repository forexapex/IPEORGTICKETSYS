
import { z } from 'zod';
import { insertPanelSchema, insertSettingsSchema, panels, tickets, settings } from './schema';

export const api = {
  panels: {
    list: {
      method: 'GET' as const,
      path: '/api/panels',
      responses: {
        200: z.array(z.custom<typeof panels.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/panels',
      input: insertPanelSchema,
      responses: {
        201: z.custom<typeof panels.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/panels/:id',
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  tickets: {
    list: {
      method: 'GET' as const,
      path: '/api/tickets',
      responses: {
        200: z.array(z.custom<typeof tickets.$inferSelect>()),
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          total: z.number(),
          open: z.number(),
          closed: z.number(),
        }),
      },
    }
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings',
      responses: {
        200: z.custom<typeof settings.$inferSelect>().optional(),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/settings',
      input: insertSettingsSchema,
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
