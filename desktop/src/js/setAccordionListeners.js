const setAccordionListeners = () => {
  const accordionWrappers = document.querySelectorAll(
    '.utils-accordion-wrapper'
  );

  accordionWrappers.forEach((actualAccordion) => {
    const accordionTitle = actualAccordion.querySelector(
      '.utils-accordion-title'
    );
    accordionTitle.addEventListener('click', ({ target }) => {
      target.parentElement.classList.toggle('active');
    });
  });

  // const toggleAccordion = (accordion) => {

  // };
};

export default setAccordionListeners;
