document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".section-card").forEach((card) => {
    const main = card.querySelector(".swiper.main");
    const priceElem = card.querySelector(".card-info-price");
    const colorImages = card.querySelectorAll(".card-info-images img, .thumb-btn");
    const sizeItems = card.querySelectorAll(".tabs-item");
    const stockMessage = card.querySelector("#color-stock-msg");

    // Initialize Swiper thumbs
    const initThumbsSwiper = () => {
      const width = window.innerWidth;
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1199;

      return new Swiper(card.querySelector(".thumbs"), {
        direction: isMobile || isTablet ? "horizontal" : "vertical",
        spaceBetween: 12,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true
      });
    };

    let swiperThumbs = initThumbsSwiper();

    const swiperMain = new Swiper(main, {
      spaceBetween: 10,
      thumbs: { swiper: swiperThumbs }
    });

    window.addEventListener("resize", () => {
      swiperThumbs.destroy(true, true);
      swiperThumbs = initThumbsSwiper();
      swiperMain.thumbs.swiper = swiperThumbs;
    });

    // Color image click
    colorImages.forEach((img) => {
      img.addEventListener("click", () => {
        colorImages.forEach((item) => item.classList.remove("active"));
        img.classList.add("active");

        const color = img.dataset.color;
        const quantity = parseInt(img.dataset.qty, 10);
        const available = img.dataset.available === "true";

        const availableText = stockMessage.dataset.available || `Доступно ${quantity}`;
        const unavailableText = stockMessage.dataset.unavailable || "Не доступно";

        // Update stock message
        if (!available || quantity === 0) {
          stockMessage.textContent = unavailableText;
          stockMessage.classList.add("unavailable");
        } else {
          stockMessage.textContent = availableText.replace("{{quantity}}", quantity);
          stockMessage.classList.remove("unavailable");
        }

        const targetSlide = Array.from(swiperThumbs.slides).findIndex((slide) => slide.dataset.color === color);
        if (targetSlide >= 0) {
          swiperMain.slideTo(targetSlide);
          priceElem.textContent = `$${swiperThumbs.slides[targetSlide].dataset.price}.00`;
        }
      });
    });

    // Size selection
    sizeItems.forEach((item) => {
      item.addEventListener("click", () => {
        sizeItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        const selectedColor = card.querySelector(".card-info-images img.active").dataset.color;
        const selectedSize = item.textContent.trim();
        const variant = banner_product_item.variants.find(
          (v) => v.option1.toLowerCase() === selectedColor && v.option2 === selectedSize
        );
        if (variant) hiddenInput.value = variant.id;
      });
    });

    // Clicking thumbs
    swiperThumbs.slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        swiperMain.slideTo(index);
        const color = slide.dataset.color;
        colorImages.forEach((item) => item.classList.toggle("active", item.dataset.color === color));
        priceElem.textContent = `$${slide.dataset.price}.00`;
      });
    });
  });
});
