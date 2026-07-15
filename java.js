// Toggle to enable/disable liquid glass features
const ENABLE_LIQUID = false;

// Pomoćna funkcija koja pokreće WebGL SAMO na vidljivim elementima aktivne stranice
function inicijalizirajVidljiveParagrafe() {
  if (!ENABLE_LIQUID || typeof liquidGL === 'undefined') return;

  // Inicijaliziraj 'paragraf' elementi
  const aktivniParagrafi = document.querySelectorAll(".stranica.aktivna .paragraf");
  aktivniParagrafi.forEach((paragraf, index) => {
    if (paragraf.querySelector("canvas")) return;
    if (!paragraf.id) {
      paragraf.id = "paragraf-aktivni-" + Date.now() + "-" + index;
    }
    liquidGL({
      target: "#" + paragraf.id,
      snapshot: "body",
      frost: 2.5,
      bevelDepth: 0.02,
      reveal: "fade"
    });
  });

  // Inicijaliziraj 'staklo-pozadina' elementi
  const aktivnePozadine = document.querySelectorAll(".stranica.aktivna .staklo-pozadina");
  aktivnePozadine.forEach((pozadina, index) => {
    if (pozadina.querySelector("canvas")) return;
    if (!pozadina.id) {
      pozadina.id = "staklo-bg-" + Date.now() + "-" + index;
    }
    liquidGL({
      target: "#" + pozadina.id,
      snapshot: "body",
      frost: 3,
      bevelDepth: 0.02,
      reveal: "none"
    });
  });
}

window.onload = function () {
  if (ENABLE_LIQUID) {
    if (typeof liquidGL !== 'undefined') {
      // Initialize header liquid effect
      liquidGL({
        target: '.liquidGL',
        snapshot: 'body',
        frost: 3,
        reveal: 'fade'
      });

      // Initialize paragraph/background liquids on the active page
      inicijalizirajVidljiveParagrafe();

      // Sync on scroll
      let skrolanjeUtijeku = false;
      window.addEventListener('scroll', function () {
        if (!skrolanjeUtijeku) {
          window.requestAnimationFrame(function () {
            if (window.liquidGL && typeof liquidGL.syncWith === 'function') {
              liquidGL.syncWith();
            }
            skrolanjeUtijeku = false;
          });
          skrolanjeUtijeku = true;
        }
      });
    } else {
      console.error('liquidGL.js nije učitan!');
    }
  }
};

// --- FUNKCIJE ZA PROMJENU STRANICA ---
function prikaziStranicu(idStranice) {
  var sveStranice = document.getElementsByClassName("stranica");
  var trenutnoAktivna = null;

  for (var i = 0; i < sveStranice.length; i++) {
    if (sveStranice[i].classList.contains("aktivna")) {
      trenutnoAktivna = sveStranice[i];
      break;
    }
  }

  if (trenutnoAktivna) {
    trenutnoAktivna.classList.remove("aktivna"); 

    setTimeout(function() {
      trenutnoAktivna.style.display = "none"; 
      prikaziNovuStranicu(idStranice);        
    }, 300); 
  } else {
    prikaziNovuStranicu(idStranice);
  }
}

function prikaziNovuStranicu(idStranice) {
  var novaStranica = document.getElementById(idStranice);
  if (novaStranica) {
    novaStranica.style.display = "block"; 
    
    setTimeout(function() {
      novaStranica.classList.add("aktivna"); 
      
      // KADA SE STRANICA PROMIJENI: 
      // 1. Inicijaliziraj WebGL staklo samo za paragrafe na novoj stranici
      inicijalizirajVidljiveParagrafe();

      // 2. Napravi brzi snapshot tek kad je sve na svom mjestu
      setTimeout(function() {
        if (window.liquidGL && typeof liquidGL.syncWith === "function") {
          liquidGL.syncWith();
        }
      }, 150);

    }, 10);
  }
}

// (Function merged above; duplicate removed)

// --- DYNAMIC PAGES SWITCHER (updates text + video) ---
const PAGES_CONTENT = {
  home: {
    title: 'HELLO!',
    text: 'Hello! Welcome to my little website! Take a look around, as that\'s really all you can do here. Maybe read a blog?',
    video: 'https://www.youtube.com/embed/Vb_7Mdmzt-E'
  },
  blog: {
    title: 'BLOG',
    text: 'This is the blog page. Posts about projects, notes, and experiments will appear here.',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  about: {
    title: 'ABOUT',
    text: 'About me: I study multimedia and like video editing and 3D printing.',
    video: 'https://www.youtube.com/embed/aqz-KE-bpKQ'
  },
  faq: {
    title: 'FAQ',
    text: 'Frequently asked questions go here. Click items on the left to change this content.',
    video: 'https://www.youtube.com/embed/5qap5aO4i9A'
  }
};

function setupPagesSwitcher() {
  const links = document.querySelectorAll('.page-link');
  if (!links) return;
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const key = this.getAttribute('data-page');
      showPageContent(key);
      // visually mark active link
      links.forEach(l => l.classList.remove('active-page-link'));
      this.classList.add('active-page-link');
    });
  });
}

function showPageContent(key) {
  const data = PAGES_CONTENT[key];
  if (!data) return;
  const titleEl = document.querySelector('#dynamic-content .lv-title');
  const para = document.getElementById('lv-paragraph');
  const iframe = document.getElementById('lv-iframe');
  if (titleEl) titleEl.textContent = data.title;
  if (para) para.textContent = data.text;
  if (iframe) iframe.src = data.video;
}

// Initialize switcher after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  setupPagesSwitcher();
  // set initial content
  showPageContent('home');
  // mark the home link active if present
  const first = document.querySelector('.page-link[data-page="home"]');
  if (first) first.classList.add('active-page-link');
});