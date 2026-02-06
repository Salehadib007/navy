const products = [
  {
    id: 1,
    name: "Navy Jacket",
    price: 3500,
    image:
      "https://i.ibb.co.com/23qfZ4qC/490736080-1057170739557252-779871721182014804-n.jpg",
  },
  {
    id: 2,
    name: "Navy Shoes",
    price: 4200,
    image: "https://i.ibb.co.com/VYTs4hpN/10.jpg",
  },
  {
    id: 3,
    name: "Navy Cap",
    price: 900,
    image: "https://picsum.photos/300/200?random=3",
  },
  {
    id: 4,
    name: "Navy Backpack",
    price: 2800,
    image: "https://picsum.photos/300/200?random=4",
  },
  {
    id: 5,
    name: "Navy Watch",
    price: 5200,
    image: "https://picsum.photos/300/200?random=5",
  },
  {
    id: 6,
    name: "Navy Sunglasses",
    price: 1800,
    image: "https://picsum.photos/300/200?random=6",
  },
  {
    id: 7,
    name: "Navy Wallet",
    price: 1200,
    image: "https://picsum.photos/300/200?random=7",
  },
  {
    id: 8,
    name: "Navy Belt",
    price: 1000,
    image: "https://picsum.photos/300/200?random=8",
  },
  {
    id: 9,
    name: "Navy T-Shirt",
    price: 1500,
    image: "https://picsum.photos/300/200?random=9",
  },
  {
    id: 10,
    name: "Navy Hoodie",
    price: 3200,
    image: "https://picsum.photos/300/200?random=10",
  },
  {
    id: 11,
    name: "Navy Jeans",
    price: 2600,
    image: "https://picsum.photos/300/200?random=11",
  },
  {
    id: 12,
    name: "Navy Shorts",
    price: 1700,
    image: "https://picsum.photos/300/200?random=12",
  },
  {
    id: 13,
    name: "Navy Sneakers",
    price: 4800,
    image: "https://picsum.photos/300/200?random=13",
  },
  {
    id: 14,
    name: "Navy Formal Shirt",
    price: 2300,
    image: "https://picsum.photos/300/200?random=14",
  },
  {
    id: 15,
    name: "Navy Blazer",
    price: 6500,
    image: "https://picsum.photos/300/200?random=15",
  },
  {
    id: 16,
    name: "Navy Gloves",
    price: 800,
    image: "https://picsum.photos/300/200?random=16",
  },
  {
    id: 17,
    name: "Navy Scarf",
    price: 1100,
    image: "https://picsum.photos/300/200?random=17",
  },
  {
    id: 18,
    name: "Navy Perfume",
    price: 3900,
    image: "https://picsum.photos/300/200?random=18",
  },
  {
    id: 19,
    name: "Navy Sports Bag",
    price: 3000,
    image: "https://picsum.photos/300/200?random=19",
  },
  {
    id: 20,
    name: "Navy Earbuds",
    price: 2700,
    image: "https://picsum.photos/300/200?random=20",
  },
];

export default function Navy() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Navy Product Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-blue-600 font-bold mt-2">৳ {item.price}</p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
