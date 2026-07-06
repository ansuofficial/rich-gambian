import { products } from "../app/lib/products";

const ids = products.map((p) => p.id);
const uniqueIds = new Set(ids);

if (uniqueIds.size !== ids.length) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  console.error("Duplicate product IDs found:", [...new Set(duplicates)]);
  process.exit(1);
}

console.log(`Validated ${products.length} products — all IDs unique.`);