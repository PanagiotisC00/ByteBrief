// Database seed file for ByteBrief blog - Categories and Tags only
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ByteBrief database with categories and tags...')

  // Create default categories
  const categories = [
    {
      name: 'AI & Machine Learning',
      slug: 'ai-machine-learning',
      description: 'Artificial Intelligence, Machine Learning, and Deep Learning news and insights',
      color: '#3B82F6',
      icon: 'Brain'
    },
    {
      name: 'Web Development',
      slug: 'web-development', 
      description: 'Frontend, backend, and full-stack development trends and tutorials',
      color: '#10B981',
      icon: 'Code'
    },
    {
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'iOS, Android, React Native, and Flutter development news',
      color: '#F59E0B',
      icon: 'Smartphone'
    },
    {
      name: 'Cloud Computing',
      slug: 'cloud-computing',
      description: 'AWS, Azure, Google Cloud, and serverless technologies',
      color: '#8B5CF6',
      icon: 'Cloud'
    },
    {
      name: 'DevOps & Infrastructure',
      slug: 'devops-infrastructure',
      description: 'CI/CD, containerization, orchestration, and infrastructure as code',
      color: '#EF4444',
      icon: 'Server'
    },
    {
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Security threats, vulnerabilities, and best practices',
      color: '#DC2626',
      icon: 'Shield'
    },
    {
      name: 'Blockchain & Web3',
      slug: 'blockchain-web3',
      description: 'Cryptocurrency, DeFi, NFTs, and decentralized technologies',
      color: '#7C3AED',
      icon: 'Link'
    },
    {
      name: 'Hardware & IoT',
      slug: 'hardware-iot',
      description: 'Computer hardware, Internet of Things, and embedded systems',
      color: '#059669',
      icon: 'Cpu'
    }
  ]

  // Create tags
  const tags = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'Python', slug: 'python' },
    { name: 'TensorFlow', slug: 'tensorflow' },
    { name: 'Docker', slug: 'docker' },
    { name: 'Kubernetes', slug: 'kubernetes' },
    { name: 'AWS', slug: 'aws' },
    { name: 'Tutorial', slug: 'tutorial' },
    { name: 'News', slug: 'news' },
    { name: 'Review', slug: 'review' },
    { name: 'Open Source', slug: 'open-source' },
    { name: 'API', slug: 'api' },
    { name: 'Database', slug: 'database' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Security', slug: 'security' }
  ]

  // Seed categories
  console.log('📁 Seeding categories...')
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData
    })
    console.log(`✅ Created category: ${category.name}`)
  }

  // Seed tags
  console.log('🏷️ Seeding tags...')
  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData
    })
    console.log(`✅ Created tag: ${tag.name}`)
  }

  console.log('🎉 Database seeded successfully with categories and tags!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
