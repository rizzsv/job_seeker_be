// prisma/seed/seedHrd.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('HrdValeantPassword', 10)

  const hrd = await prisma.user.create({
    data: {
      username: 'hrdvaleant',
      email: 'hrd@valeant.com',
      password: hashedPassword,
      role: 'HRD',
      address: 'Jalan HRD No. 123',
      phone: '081298765432',
      education: 'S1 Psikologi',
      date_of_birth: new Date('1990-05-15'),
      experience: '5 tahun di bidang HR',
      gender: 'L',
      cv: 'https://example.com/cv.pdf',
      photoProfile: 'https://example.com/photo.jpg'
    }
  })

  console.log('✅ HRD created:', hrd)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding HRD:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
