document.addEventListener("DOMContentLoaded", function () {
  const hotspots = [
    {
      top: "10%",
      left: "25%",
      title: "Shruti",
      content: "Oldest Veda containing hymns dedicated to deities and cosmic elements."
    },
    {
      top: "10%",
      left: "75%",
      title: "Smriti",
      content: "Focuses on ritual formulas and sacrificial rites."
    },
    {
      top: "25%",
      left: "10%",
      title: "Vedas",
      content: "Collection of melodies and chants for devotional songs."
    },
    {
      top: "35%",
      left: "21%",
      title: "Upavedas",
      content: "Contains knowledge about healing, rituals, and domestic affairs."
    },
    {
      top: "23%",
      left: "37%",
      title: "Vedangas",
      content: "Six auxiliary sciences that assist in understanding Vedic texts."
    },
    {
      top: "22%",
      left: "52%",
      title: "Shastras",
      content: "Philosophical explorations of the soul (Atman) and ultimate reality (Brahman)."
    },
    {
      top: "22%",
      left: "70%",
      title: "Puranas",
      content: "Philosophical explorations of the soul (Atman) and ultimate reality (Brahman)."
    },
    {
      top: "22%",
      left: "90%",
      title: "Sad Darshana",
      content: "Philosophical explorations of the soul (Atman) and ultimate reality (Brahman)."
    }
  ];

  const hotspotContainer = document.querySelector('.map-hotspots');
  const detailBox = document.getElementById('map-detail');

  hotspots.forEach((hotspot, index) => {
    const btn = document.createElement('button');
    btn.className = 'hotspot';
    btn.style.top = hotspot.top;
    btn.style.left = hotspot.left;
    btn.innerText = index + 1;
    btn.title = hotspot.title;

    btn.addEventListener('click', () => {
      detailBox.innerHTML = `<h5>${hotspot.title}</h5><p>${hotspot.content}</p>`;
    });

    hotspotContainer.appendChild(btn);
  });
});
