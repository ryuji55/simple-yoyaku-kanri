import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword
      }
    })

    console.log('Admin user created:', admin.email)
  } else {
    console.log('Admin user already exists:', adminEmail)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })