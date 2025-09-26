import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@wellapath.local' },
    update: {},
    create: { email: 'admin@wellapath.local', role: 'ADMIN' },
  })

  const clinics = [
    { name: 'Wella Clinic Central', lat: 0.3476, lng: 32.5825, address: 'Kampala Central', premium: true },
    { name: 'HealthCare East',      lat: 0.3269, lng: 32.6070, address: 'Nakawa',          premium: false },
  ]

  const pharmacies = [
    { name: 'Trust Pharmacy', lat: 0.3320, lng: 32.5700, address: 'Wandegeya', premium: false },
    { name: 'Prime Meds',     lat: 0.3500, lng: 32.6000, address: 'Bukoto',    premium: true },
  ]

  await prisma.clinic.createMany({ data: clinics, skipDuplicates: true })
  await prisma.pharmacy.createMany({ data: pharmacies, skipDuplicates: true })
}

main()
  .then(async () => { console.log('Seed complete'); await prisma.$disconnect() })
  .catch(async (e) => { console.error('Seed failed:', e); await prisma.$disconnect(); process.exit(1) })
