export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D9362B]">
            Freshly Baked, Delivered With Love
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-[#242424] md:text-6xl">
            Every Slice
            <br />
            Tells a <span className="text-[#D9362B]">Story.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Discover delicious, freshly prepared pizzas made with quality
            ingredients. Your next favorite slice is waiting for you.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/menu"
              className="rounded-full bg-[#D9362B] px-8 py-4 font-bold text-white shadow-lg transition hover:bg-[#b92b23]"
            >
              Explore Our Menu
            </a>

            <a
              href="/register"
              className="rounded-full border-2 border-[#242424] px-8 py-4 font-bold text-[#242424] transition hover:bg-[#242424] hover:text-white"
            >
              Join PizzaHub
            </a>
          </div>

          <div className="mt-10 flex gap-10">
            <div>
              <h3 className="text-2xl font-extrabold text-[#242424]">Fresh</h3>
              <p className="text-sm text-gray-500">Quality Ingredients</p>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-[#242424]">Fast</h3>
              <p className="text-sm text-gray-500">Delivery Service</p>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-[#242424]">Tasty</h3>
              <p className="text-sm text-gray-500">Amazing Flavors</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex aspect-square w-full max-w-lg items-center justify-center rounded-full bg-[#FCE2C5] p-8">
            <div className="flex aspect-square w-full items-center justify-center rounded-full bg-[#F28C28]/20 text-9xl">
              🍕
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="bg-white px-5 py-20 text-center"
      >
        <h2 className="text-3xl font-extrabold text-[#242424] md:text-4xl">
          Why Choose <span className="text-[#D9362B]">PizzaHub?</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Great ingredients, delicious recipes and a simple ordering
          experience—all in one place.
        </p>
      </section>

      <section
        id="contact"
        className="bg-[#FFF9F2] px-5 py-16 text-center"
      >
        <h2 className="text-3xl font-extrabold text-[#242424]">
          Ready for Your Next Slice?
        </h2>
        <p className="mt-3 text-gray-600">
          Explore our menu and discover your favorite pizza.
        </p>
        <a
          href="/menu"
          className="mt-6 inline-block rounded-full bg-[#D9362B] px-8 py-3 font-bold text-white hover:bg-[#b92b23]"
        >
          Order Your Pizza
        </a>
      </section>
    </div>
  );
}