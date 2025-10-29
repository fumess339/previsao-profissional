import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  barbers, InsertBarber, Barber,
  services, InsertService, Service,
  barberSchedules, InsertBarberSchedule, BarberSchedule,
  appointments, InsertAppointment, Appointment,
  settings, InsertSetting, Setting
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER QUERIES =====
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== BARBER QUERIES =====
export async function getAllBarbers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(barbers).orderBy(asc(barbers.name));
}

export async function getActiveBarbers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(barbers).where(eq(barbers.isActive, true)).orderBy(asc(barbers.name));
}

export async function getBarberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(barbers).where(eq(barbers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBarber(barber: InsertBarber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(barbers).values(barber);
  return result;
}

export async function updateBarber(id: number, barber: Partial<InsertBarber>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(barbers).set(barber).where(eq(barbers.id, id));
}

export async function deleteBarber(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(barbers).where(eq(barbers.id, id));
}

// ===== SERVICE QUERIES =====
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).orderBy(asc(services.category), asc(services.name));
}

export async function getActiveServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.category), asc(services.name));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(services).values(service);
}

export async function updateService(id: number, service: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(services).set(service).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(services).where(eq(services.id, id));
}

// ===== BARBER SCHEDULE QUERIES =====
export async function getBarberSchedules(barberId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(barberSchedules)
    .where(and(eq(barberSchedules.barberId, barberId), eq(barberSchedules.isActive, true)))
    .orderBy(asc(barberSchedules.dayOfWeek));
}

export async function createBarberSchedule(schedule: InsertBarberSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(barberSchedules).values(schedule);
}

export async function updateBarberSchedule(id: number, schedule: Partial<InsertBarberSchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(barberSchedules).set(schedule).where(eq(barberSchedules.id, id));
}

export async function deleteBarberSchedule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(barberSchedules).where(eq(barberSchedules.id, id));
}

// ===== APPOINTMENT QUERIES =====
export async function getAllAppointments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments)
    .where(and(
      gte(appointments.appointmentDate, startDate),
      lte(appointments.appointmentDate, endDate)
    ))
    .orderBy(asc(appointments.appointmentDate));
}

export async function getAppointmentsByBarber(barberId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments)
    .where(eq(appointments.barberId, barberId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAppointment(appointment: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(appointments).values(appointment);
}

export async function updateAppointment(id: number, appointment: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(appointments).set(appointment).where(eq(appointments.id, id));
}

export async function deleteAppointment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(appointments).where(eq(appointments.id, id));
}

// ===== SETTINGS QUERIES =====
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(settings);
}

export async function upsertSetting(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertSetting = { key, value, description };
  const updateSet: Partial<InsertSetting> = { value };
  if (description !== undefined) {
    updateSet.description = description;
  }
  
  return await db.insert(settings).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
