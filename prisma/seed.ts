import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not configured.");
}

const adapter = new PrismaPg({connectionString,});
const prisma = new PrismaClient({adapter,});

async function main() {
  console.log("🌱 Seeding categories...");

  const categories = [
    {
      name: "Elektronik",
      slug: "elektronik",
    },
    {
      name: "Komputer & Aksesoris",
      slug: "komputer-aksesoris",
    },
    {
      name: "Fashion Pria",
      slug: "fashion-pria",
    },
    {
      name: "Fashion Wanita",
      slug: "fashion-wanita",
    },
    {
      name: "Sepatu",
      slug: "sepatu",
    },
    {
      name: "Tas & Aksesoris",
      slug: "tas-aksesoris",
    },
    {
      name: "Rumah Tangga",
      slug: "rumah-tangga",
    },
    {
      name: "Olahraga",
      slug: "olahraga",
    },
    {
      name: "Makanan & Minuman",
      slug: "makanan-minuman",
    },
    {
      name: "Buku & Alat Tulis",
      slug: "buku-alat-tulis",
    },
  ];

  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
      },
      create: category,
    });

    console.log(`✓ Category: ${result.name}`);
  }

  console.log("✅ Category seed completed.");

  console.log("🌱 Seeding products...");

  const products = [
    {
      id: "wireless-headphone",
      name: "Wireless Headphone",
      price: 350000,
      categorySlug: "elektronik",
      description:
        "Headphone wireless dengan kualitas suara jernih dan nyaman digunakan untuk mendengarkan musik, menonton film, maupun bekerja.",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      rating: 4.8,
      stock: 10,
    },
    {
      id: "smart-watch",
      name: "Smart Watch",
      price: 450000,
      categorySlug: "elektronik",
      description:
        "Smart watch modern dengan berbagai fitur untuk membantu memantau aktivitas harian Anda.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      rating: 4.6,
      stock: 10,
    },
    {
      id: "casual-sneakers",
      name: "Casual Sneakers",
      price: 600000,
      categorySlug: "sepatu",
      description:
        "Sneakers casual dengan desain modern dan nyaman digunakan untuk aktivitas sehari-hari.",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      rating: 4.4,
      stock: 10,
    },
    {
      id: "minimalist-backpack",
      name: "Minimalist Backpack",
      price: 275000,
      categorySlug: "tas-aksesoris",
      description:
        "Tas ransel minimalis dengan desain modern dan ruang penyimpanan yang cukup untuk kebutuhan sehari-hari.",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      rating: 4.5,
      stock: 10,
    },
  ];

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: {
        slug: product.categorySlug,
      },
    });

    if (!category) {
      throw new Error(
        `Category "${product.categorySlug}" tidak ditemukan`
      );
    }

    const result = await prisma.product.upsert({
      where: {
        id: product.id,
      },
      update: {
        name: product.name,
        price: product.price,
        categoryId: category.id,
        description: product.description,
        image: product.image,
        rating: product.rating,
        stock: product.stock,
      },
      create: {
        id: product.id,
        name: product.name,
        price: product.price,
        categoryId: category.id,
        description: product.description,
        image: product.image,
        rating: product.rating,
        stock: product.stock,
      },
    });

    console.log(`✓ Product: ${result.name}`);
  }

  console.log("✅ Product seed completed.");
}