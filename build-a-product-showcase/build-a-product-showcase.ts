interface Item {
  type: "book" | "electronics" | "clothing";
  id: string;
  price: number;
}

interface Book extends Item {
  type: "book";
  title: string;
  author: string;
}

interface Electronics extends Item {
  type: "electronics";
  item: string;
  model: string;
  warranty?: number;
}

interface Clothing extends Item {
  type: "clothing";
  item: string;
  brand: string;
  size?: "S" | "M" | "L";
}

type Product = Book | Electronics | Clothing;

class Collection<T> {
  items: T[];
  constructor(items: T[]) {
    this.items = items;
  }
  getAll(): T[] {
    return this.items;
  }
  filter(callback: (element: T) => boolean): T[] {
    return this.items.filter(callback);
  }
}

function renderProduct(p: Product): string {
  let info: string;

  switch (p.type) {
    case "book":
      info = `Book: ${p.title} by ${p.author}`;
      break;

    case "electronics":
      info = `Electronics: ${p.item} - ${p.model}`;
      if (p.warranty !== undefined) {
        info += ` - Warranty: ${p.warranty} year(s)`;
      }
      break;

    case "clothing":
      info = `Clothing: ${p.item} by ${p.brand}`;
      if (p.size !== undefined) {
        info += ` - Size ${p.size}`;
      }
      break;

    default: {
      throw new Error(`Unknown product type: ${JSON.stringify(p as never)}`);
    }
  }

  return `
  <div class="item" id="${p.id}">
    <span class="price">$${p.price.toFixed(2)}</span>
    <span>${info}</span>
  </div>
  `;
}

const products = new Collection<Product>([
  { type: "book", id: "B1", price: 14.99, title: "Book № 1", author: "idk" },
  {
    type: "electronics",
    id: "E1",
    price: 185.99,
    item: "electric chair",
    model: "EC99999KW",
  },
  {
    type: "clothing",
    id: "C1",
    price: 40.99,
    item: "T-shirt",
    brand: "asdasdadasd",
  },
]);

function showProducts(filter?: Item["type"]): void {
  const list = filter
    ? products.filter((p) => p.type === filter)
    : products.getAll();

  const html = list.map(renderProduct).join("");

  const output = document.getElementById("output");
  if (output) output.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("all")
    ?.addEventListener("click", () => showProducts());
  document
    .getElementById("books")
    ?.addEventListener("click", () => showProducts("book"));
  document
    .getElementById("electronics")
    ?.addEventListener("click", () => showProducts("electronics"));
  document
    .getElementById("clothing")
    ?.addEventListener("click", () => showProducts("clothing"));

  showProducts();
});
