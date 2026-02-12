import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable detailed logging
});

// =============================================================================
// CONFIGURATION – Adjust these numbers to scale the dataset
// =============================================================================
const CONFIG = {
  STORES: 3, // Number of stores
  BILLBOARDS_PER_STORE: 2, // Billboards per store
  CATEGORIES_PER_STORE: 6, // Categories per store
  SIZES_PER_STORE: 6, // Sizes per store
  COLORS_PER_STORE: 8, // Colors per store
  PRODUCTS_PER_STORE: 50, // Products per store
  IMAGES_PER_PRODUCT: 3, // Images per product
  ORDERS_PER_STORE: 30, // Orders per store
  MAX_ITEMS_PER_ORDER: 5, // Max products per order
};

// =============================================================================
// PREDEFINED REALISTIC DATA POOLS
// =============================================================================
const STORE_NAMES = [
  "Urban Style",
  "Tech Haven",
  "Home Comforts",
  "Sports District",
  "Book Nook",
  "Gourmet Pantry",
  "Pet Paradise",
  "Auto Emporium",
  "Garden Oasis",
  "Toy Box",
];

const CATEGORY_POOLS = {
  fashion: [
    "T-Shirts",
    "Jeans",
    "Dresses",
    "Shoes",
    "Accessories",
    "Jackets",
    "Sweaters",
    "Skirts",
    "Shorts",
    "Activewear",
  ],
  tech: [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Headphones",
    "Accessories",
    "Monitors",
    "Keyboards",
    "Mice",
    "Smartwatches",
    "Cameras",
  ],
  home: [
    "Furniture",
    "Decor",
    "Kitchenware",
    "Bath",
    "Lighting",
    "Bedding",
    "Storage",
    "Rugs",
    "Curtains",
    "Tools",
  ],
  sports: [
    "Sportswear",
    "Footwear",
    "Equipment",
    "Supplements",
    "Bags",
    "Balls",
    "Fitness Trackers",
    "Yoga Mats",
    "Water Bottles",
    "Gym Gloves",
  ],
  books: [
    "Fiction",
    "Non-fiction",
    "Children’s Books",
    "Science",
    "History",
    "Biographies",
    "Comics",
    "Textbooks",
    "Cooking",
    "Travel",
  ],
  food: [
    "Pantry Staples",
    "Beverages",
    "Snacks",
    "Organic",
    "Spices",
    "Baking",
    "Breakfast",
    "Canned Goods",
    "Sauces",
    "Desserts",
  ],
};

const SIZE_NAMES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "One Size",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
];

const COLOR_NAMES = [
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#00FF00" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#808080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Purple", value: "#800080" },
  { name: "Orange", value: "#FFA500" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Turquoise", value: "#40E0D0" },
  { name: "Beige", value: "#F5F5DC" },
  { name: "Navy", value: "#000080" },
  { name: "Gold", value: "#FFD700" },
  { name: "Silver", value: "#C0C0C0" },
];

// =============================================================================
// DATABASE CONNECTION VERIFICATION
// =============================================================================
async function verifyConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection established.");
  } catch (error) {
    console.error("❌ Could not connect to database:", error);
    process.exit(1);
  }
}

// =============================================================================
// CLEAN DATABASE (OPTIONAL)
// =============================================================================
async function cleanDatabase(skip = false) {
  if (skip) {
    console.log("⏩ Database cleanup skipped.");
    return;
  }
  console.log("🧹 Cleaning database...");
  // Delete in reverse dependency order
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.color.deleteMany({});
  await prisma.size.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.billboard.deleteMany({});
  await prisma.store.deleteMany({});
  console.log("✅ Database cleaned.\n");
}

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================
async function main() {
  console.log("🌱 Seeding database with massive realistic data...\n");

  await verifyConnection();

  // ───────────────────────────────────────────────────────────────────────────
  // CHANGE TO `true` IF YOU DON'T WANT TO DELETE EXISTING DATA
  // ───────────────────────────────────────────────────────────────────────────
  const SKIP_CLEAN = false;
  await cleanDatabase(SKIP_CLEAN);

  for (let storeIndex = 0; storeIndex < CONFIG.STORES; storeIndex++) {
    // Cycle through store types for variety
    const storeType = ["fashion", "tech", "home", "sports", "books", "food"][
      storeIndex % 6
    ] as keyof typeof CATEGORY_POOLS;
    const storeName = `${
      STORE_NAMES[storeIndex % STORE_NAMES.length]
    } ${faker.location.city()}`;

    console.log(
      `\n🏬 [${storeIndex + 1}/${CONFIG.STORES}] Creating store: ${storeName} (${storeType})`,
    );

    try {
      // ----- 1. CREATE STORE -----
      const store = await prisma.store.create({
        data: {
          name: storeName,
          userId: faker.string.uuid(),
        },
      });
      console.log(`   ✅ Store created: ${store.id}`);

      // ----- 2. CREATE BILLBOARDS -----
      const billboards = [];
      for (let i = 0; i < CONFIG.BILLBOARDS_PER_STORE; i++) {
        const billboard = await prisma.billboard.create({
          data: {
            label: `${faker.commerce.department()} Collection`,
            imageUrl: faker.image.urlPicsumPhotos({
              width: 1920,
              height: 1080,
            }),
            storeId: store.id,
          },
        });
        billboards.push(billboard);
      }
      console.log(`   ✅ ${billboards.length} billboards created.`);

      // ----- 3. CREATE CATEGORIES -----
      const categories = [];
      const categoryPool = CATEGORY_POOLS[storeType] || CATEGORY_POOLS.fashion;
      const selectedCategories = faker.helpers.arrayElements(
        categoryPool,
        CONFIG.CATEGORIES_PER_STORE,
      );
      for (const catName of selectedCategories) {
        const category = await prisma.category.create({
          data: {
            name: catName,
            storeId: store.id,
            billboardId: faker.helpers.arrayElement(billboards).id,
          },
        });
        categories.push(category);
      }
      console.log(`   ✅ ${categories.length} categories created.`);

      // ----- 4. CREATE SIZES -----
      const sizes = [];
      const selectedSizes = faker.helpers.arrayElements(
        SIZE_NAMES,
        CONFIG.SIZES_PER_STORE,
      );
      for (const sizeName of selectedSizes) {
        const size = await prisma.size.create({
          data: {
            name: sizeName,
            value: sizeName, // Could be numeric or code, but keep simple
            storeId: store.id,
          },
        });
        sizes.push(size);
      }
      console.log(`   ✅ ${sizes.length} sizes created.`);

      // ----- 5. CREATE COLORS -----
      const colors = [];
      const selectedColors = faker.helpers.arrayElements(
        COLOR_NAMES,
        CONFIG.COLORS_PER_STORE,
      );
      for (const color of selectedColors) {
        const newColor = await prisma.color.create({
          data: {
            name: color.name,
            value: color.value,
            storeId: store.id,
          },
        });
        colors.push(newColor);
      }
      console.log(`   ✅ ${colors.length} colors created.`);

      // ----- 6. CREATE PRODUCTS WITH IMAGES -----
      const products = [];
      for (let p = 0; p < CONFIG.PRODUCTS_PER_STORE; p++) {
        const category = faker.helpers.arrayElement(categories);
        const size = faker.helpers.arrayElement(sizes);
        const color = faker.helpers.arrayElement(colors);

        const product = await prisma.product.create({
          data: {
            name: faker.commerce.productName(),
            price: parseFloat(
              faker.commerce.price({ min: 5, max: 500, dec: 2 }),
            ),
            isFeatured: faker.datatype.boolean(0.3), // 30% featured
            isArchived: faker.datatype.boolean(0.1), // 10% archived
            storeId: store.id,
            categoryId: category.id,
            sizeId: size.id,
            colorId: color.id,
          },
        });

        // Create images for the product
        for (let img = 0; img < CONFIG.IMAGES_PER_PRODUCT; img++) {
          await prisma.image.create({
            data: {
              productId: product.id,
              url: `${faker.image.urlPicsumPhotos({
                width: 800,
                height: 600,
              })}?product=${product.id}&img=${img}`,
            },
          });
        }

        products.push(product);

        if ((p + 1) % 10 === 0) {
          console.log(
            `      📦 Product ${p + 1}/${CONFIG.PRODUCTS_PER_STORE} created`,
          );
        }
      }
      console.log(
        `   ✅ ${products.length} products created (${
          CONFIG.IMAGES_PER_PRODUCT * products.length
        } images).`,
      );

      // ----- 7. CREATE ORDERS WITH ORDER ITEMS -----
      for (let o = 0; o < CONFIG.ORDERS_PER_STORE; o++) {
        const orderProducts = faker.helpers.arrayElements(
          products,
          faker.number.int({ min: 1, max: CONFIG.MAX_ITEMS_PER_ORDER }),
        );
        const isPaid = faker.datatype.boolean(0.7); // 70% paid

        const order = await prisma.order.create({
          data: {
            storeId: store.id,
            isPaid,
            phone: faker.phone.number(),
            address: faker.location.streetAddress({ useFullAddress: true }),
          },
        });

        for (const product of orderProducts) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
            },
          });
        }

        if ((o + 1) % 10 === 0) {
          console.log(
            `      🛒 Order ${o + 1}/${CONFIG.ORDERS_PER_STORE} created`,
          );
        }
      }
      console.log(`   ✅ ${CONFIG.ORDERS_PER_STORE} orders created.`);

      console.log(`✅ Store ${storeName} completed.\n`);
    } catch (error) {
      console.error(`❌ Critical error while seeding store ${storeName}:`);
      console.error(error);
      throw error; // Stop the whole process
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

// =============================================================================
// EXECUTION
// =============================================================================
main()
  .catch((error) => {
    console.error("\n🔥 Fatal error during seeding:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
