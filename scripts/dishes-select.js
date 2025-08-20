document.getElementById('dishes-select').addEventListener('change', function () {
  const targetId = this.value;
  if (targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
});