"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnLearnMore = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const userNameRegister = document.querySelector(".modal__userName");
const passwordRegister = document.querySelector(".modal__password");
const nameRegister = document.querySelector(".modal__name");
const emailRegister = document.querySelector(".modal__email");

const btnRegister = document.querySelector(".modal__button");

const urlLending = "https://lending-service-d11ff0ebb68a.herokuapp.com";
const registerPath = "/api/v1/register";

//btn scrolling
btnLearnMore.addEventListener("click", () => {
  section1.scrollIntoView({ behavior: "smooth" });
});

//Event Delegation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.className === "nav__link") {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
  //ingat!! kita klik childnya, maka capture dilakukan dari document hingga ke
  //target(navLink) cek target gak ada event, lalu bubble up ke parent (navLinks)
  //e target tetap child 😉😉😉
  //tldr, saat kita klik between child, maka gak masuk ke if, karna e targetnya navLinks jg 👍
});

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");

//Creating and inserting elements
// .insertAdjacentHTML
const message = document.createElement("div");
message.classList.add("cookie-message");
//message.textContent = 'We use cookies for improved unctionality and analytics.'
message.innerHTML =
  'We use cookies for improved unctionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
//first child
// header.append(message);
//last child
//when using prepend and append, it will show the last one (append)

// header.append(message.cloneNode(true));
//in case we wanted to show prepend and append

// header.before(message);
header.after(message);
//before and after the selected node

//Delete elements
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", () => message.remove());

// () => message.parentElement.removeChild(message)
// old school to delete elements

//Styles
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + "px";

document.documentElement.style.setProperty("--color-uwuw", "orangered");

//Attributes
const logo = document.querySelector(".nav__logo");
logo.alt = "Beautiful minimalist logo";

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabContent = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", function (e) {
  // console.log(e.target);
  //we get the button, but when clicking the number, it target is span which is not what we needed
  // console.log(e.target.parentElement);
  //when clicking the number, we successfully got the button, but when we clicked
  //the button, we got operation tab container 🤭🤭
  const clicked = e.target.closest(".operations__tab");
  //karna span ada didalam button (span is button child/ button is span parent), kita menggunakan closest

  if (!clicked) return;
  //guard close, to prevent clicked outside the button
  //bisa aja if(clicked){......} tapi lebih clear pake cara diatas, karna gk perlu nulis
  //condition di dalam block {}

  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  tabContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );
  //activate content area

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

const nav = document.querySelector(".nav");

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((sibling) => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

const navHeight = nav.getBoundingClientRect().height;
//dipake supaya berapapun heigh nav, dia bakal ngikutin ukuran nav (dinamik)

const stickyNavFn = (entries) => {
  const [entry] = entries;
  const { isIntersecting } = entry;
  if (!isIntersecting) nav.classList.add("sticky");
  else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNavFn, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
  //pelajari lagi rootMargin
});

headerObserver.observe(header);

// Reveal section
const allSection = document.querySelectorAll(".section");
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
  //to prevent observer when scrolling upside (isObserving: false, intersection <0.15)
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach((section) => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imgTarget = document.querySelectorAll("img[data-src]");

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img');
  // we dont use this because it will immediately remove the class, try using slow 3G network

  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTarget.forEach((img) => {
  imgObserver.observe(img);
});

const slider = () => {
  const slides = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  slides.forEach(
    (slide, idx) => (slide.style.transform = `translateX(${idx * 100}%)`)
  );

  // Next Slide
  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = () => {
    slides.forEach((_, idx) =>
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${idx}"></button>`
      )
    );
  };

  const activateDot = (slide) => {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = (slideNo) =>
    slides.forEach(
      (slide, idx) =>
        (slide.style.transform = `translateX(${(idx - slideNo) * 100}%)`)
    );

  //goToSlide(0) => slide0 = translateX((0-0)*100), slide1 = translateX((1-0)*100), slide2 = translateX((2-0)*100)
  //goToSlide(1) => slide0 = translateX((0-1)*100), slide1 = translateX((1-1)*100), slide2 = translateX((2-1)*100)
  //goToSlide(2) => slide0 = translateX((0-2)*100), slide1 = translateX((1-2)*100), slide2 = translateX((2-2)*100)

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const nextSlide = () => {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const init = () => {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();
};

slider();

const registerFn = function (e) {
  e.preventDefault();
  axios
    .post(`${urlLending}${registerPath}`, {
      username: userNameRegister.value,
      password: passwordRegister.value,
      name: nameRegister.value,
      email: emailRegister.value,
    })
    .then((res) => {
      if (res.status === 200)
        window.location.replace("https://danielpanggabean.com/perhutangan");
    });
};

btnRegister.addEventListener("click", registerFn);
