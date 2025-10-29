import { drizzle } from "drizzle-orm/mysql2";
import { barbers, services } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Inserir barbeiros
    console.log("Inserindo barbeiros...");
    await db.insert(barbers).values([
      {
        name: "Carlos Silva",
        email: "carlos@barbearia.com",
        phone: "(11) 98765-4321",
        bio: "Especialista em cortes clássicos e modernos com mais de 10 anos de experiência.",
        specialties: "Cortes clássicos, Degradês, Barbas",
        isActive: true,
      },
      {
        name: "Roberto Santos",
        email: "roberto@barbearia.com",
        phone: "(11) 98765-4322",
        bio: "Mestre em barbas e acabamentos, referência em design de barba.",
        specialties: "Barbas, Acabamentos, Sobrancelhas",
        isActive: true,
      },
      {
        name: "Fernando Costa",
        email: "fernando@barbearia.com",
        phone: "(11) 98765-4323",
        bio: "Especializado em cortes modernos e coloração masculina.",
        specialties: "Cortes modernos, Coloração, Luzes",
        isActive: true,
      },
    ]);

    // Inserir serviços
    console.log("Inserindo serviços...");
    await db.insert(services).values([
      // Categoria: Corte
      {
        name: "Corte Masculino",
        description: "Corte tradicional ou moderno, com acabamento profissional e finalização.",
        durationMinutes: 30,
        priceInCents: 4500, // R$ 45,00
        category: "Corte",
        isActive: true,
      },
      {
        name: "Corte + Barba",
        description: "Corte completo com design e aparação de barba, incluindo hidratação.",
        durationMinutes: 50,
        priceInCents: 7000, // R$ 70,00
        category: "Combo",
        isActive: true,
      },
      {
        name: "Corte Infantil",
        description: "Corte especial para crianças até 12 anos, com paciência e cuidado.",
        durationMinutes: 25,
        priceInCents: 3500, // R$ 35,00
        category: "Corte",
        isActive: true,
      },
      {
        name: "Degradê",
        description: "Degradê profissional com transições suaves e acabamento impecável.",
        durationMinutes: 40,
        priceInCents: 5500, // R$ 55,00
        category: "Corte",
        isActive: true,
      },
      // Categoria: Barba
      {
        name: "Barba Completa",
        description: "Design, aparação e finalização de barba com produtos premium.",
        durationMinutes: 30,
        priceInCents: 4000, // R$ 40,00
        category: "Barba",
        isActive: true,
      },
      {
        name: "Barba Express",
        description: "Aparação rápida e alinhamento de barba para manutenção.",
        durationMinutes: 15,
        priceInCents: 2500, // R$ 25,00
        category: "Barba",
        isActive: true,
      },
      {
        name: "Design de Barba",
        description: "Modelagem e design personalizado de barba com acabamento detalhado.",
        durationMinutes: 35,
        priceInCents: 4500, // R$ 45,00
        category: "Barba",
        isActive: true,
      },
      // Categoria: Combo
      {
        name: "Combo Premium",
        description: "Corte + Barba + Sobrancelha + Hidratação facial. Experiência completa.",
        durationMinutes: 70,
        priceInCents: 9500, // R$ 95,00
        category: "Combo",
        isActive: true,
      },
      {
        name: "Combo Executivo",
        description: "Corte + Barba + Massagem relaxante. Perfeito para o dia a dia.",
        durationMinutes: 60,
        priceInCents: 8500, // R$ 85,00
        category: "Combo",
        isActive: true,
      },
      // Categoria: Tratamentos
      {
        name: "Hidratação Capilar",
        description: "Tratamento hidratante para cabelos ressecados e danificados.",
        durationMinutes: 30,
        priceInCents: 3500, // R$ 35,00
        category: "Tratamentos",
        isActive: true,
      },
      {
        name: "Coloração",
        description: "Coloração profissional para cabelos e barba, com produtos de qualidade.",
        durationMinutes: 60,
        priceInCents: 8000, // R$ 80,00
        category: "Tratamentos",
        isActive: true,
      },
      {
        name: "Sobrancelha Masculina",
        description: "Design e aparação de sobrancelhas com técnica profissional.",
        durationMinutes: 15,
        priceInCents: 2000, // R$ 20,00
        category: "Tratamentos",
        isActive: true,
      },
    ]);

    console.log("✅ Seed concluído com sucesso!");
    console.log("📊 Dados inseridos:");
    console.log("   - 3 barbeiros");
    console.log("   - 12 serviços");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("🎉 Processo finalizado!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Falha no seed:", error);
    process.exit(1);
  });
