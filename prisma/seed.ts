// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clinics
  const clinicCount = await prisma.clinic.count()
  if (clinicCount === 0) {
    await prisma.clinic.createMany({
      data: [
        { id: 'seedc1', name: 'Wella Clinic Central', lat: 0.3476, lng: 32.5825, address: 'Kampala Central', premium: true,  createdAt: new Date() },
        { id: 'seedc2', name: 'HealthCare East',     lat: 0.3269, lng: 32.6070, address: 'Nakawa',          premium: false, createdAt: new Date() },
      ],
      skipDuplicates: true
    })
  }

  // Pharmacy
  const pharmCount = await prisma.pharmacy.count()
  if (pharmCount === 0) {
    await prisma.pharmacy.createMany({
      data: [
        { id: 'seedp1', name: 'Prime Meds',   lat: 0.3500, lng: 32.6000, address: 'Bukoto', premium: true,  createdAt: new Date() },
        { id: 'seedp2', name: 'Trust Pharmacy', lat: 0.3300, lng: 32.5800, address: 'Ntinda', premium: false, createdAt: new Date() },
      ],
      skipDuplicates: true
    })
  }
}

main().finally(() => prisma.$disconnect())
