import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Middleware para verificar se o usuário é admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== BARBERS =====
  barbers: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveBarbers();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllBarbers();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBarberById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        photo: z.string().optional(),
        bio: z.string().optional(),
        specialties: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createBarber(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        photo: z.string().optional(),
        bio: z.string().optional(),
        specialties: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateBarber(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteBarber(input.id);
      }),
  }),

  // ===== SERVICES =====
  services: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveServices();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllServices();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        durationMinutes: z.number().min(1),
        priceInCents: z.number().min(0),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createService(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        durationMinutes: z.number().min(1).optional(),
        priceInCents: z.number().min(0).optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateService(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteService(input.id);
      }),
  }),

  // ===== BARBER SCHEDULES =====
  barberSchedules: router({
    getByBarber: publicProcedure
      .input(z.object({ barberId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBarberSchedules(input.barberId);
      }),
    
    create: adminProcedure
      .input(z.object({
        barberId: z.number(),
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
      }))
      .mutation(async ({ input }) => {
        return await db.createBarberSchedule(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        dayOfWeek: z.number().min(0).max(6).optional(),
        startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateBarberSchedule(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteBarberSchedule(input.id);
      }),
  }),

  // ===== APPOINTMENTS =====
  appointments: router({
    list: adminProcedure.query(async () => {
      return await db.getAllAppointments();
    }),
    
    listByDateRange: publicProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        return await db.getAppointmentsByDateRange(input.startDate, input.endDate);
      }),
    
    listByBarber: publicProcedure
      .input(z.object({ barberId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAppointmentsByBarber(input.barberId);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAppointmentById(input.id);
      }),
    
    create: publicProcedure
      .input(z.object({
        barberId: z.number(),
        serviceId: z.number(),
        appointmentDate: z.date(),
        clientName: z.string().min(1),
        clientPhone: z.string().min(1),
        clientEmail: z.string().email().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const appointment = {
          ...input,
          userId: ctx.user?.id,
          status: "pending" as const,
        };
        return await db.createAppointment(appointment);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateAppointment(id, data);
      }),
    
    cancel: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const appointment = await db.getAppointmentById(input.id);
        if (!appointment) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Agendamento não encontrado' });
        }
        
        // Verifica se o usuário é admin ou dono do agendamento
        if (ctx.user?.role !== 'admin' && appointment.userId !== ctx.user?.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Você não tem permissão para cancelar este agendamento' });
        }
        
        return await db.updateAppointment(input.id, { status: "cancelled" });
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteAppointment(input.id);
      }),
  }),

  // ===== SETTINGS =====
  settings: router({
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await db.getSetting(input.key);
      }),
    
    getAll: publicProcedure.query(async () => {
      return await db.getAllSettings();
    }),
    
    upsert: adminProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.upsertSetting(input.key, input.value, input.description);
      }),
  }),

  // ===== DASHBOARD =====
  dashboard: router({
    stats: adminProcedure.query(async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayAppointments = await db.getAppointmentsByDateRange(today, tomorrow);
      const allAppointments = await db.getAllAppointments();
      const barbers = await db.getAllBarbers();
      const services = await db.getAllServices();
      
      return {
        todayAppointments: todayAppointments.length,
        totalAppointments: allAppointments.length,
        totalBarbers: barbers.length,
        totalServices: services.length,
        pendingAppointments: allAppointments.filter(a => a.status === 'pending').length,
        confirmedAppointments: allAppointments.filter(a => a.status === 'confirmed').length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
