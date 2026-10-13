const arrayMemo = [
  { img: "🐥", valor: 6, match: false },
  { img: "🤖", valor: 1, match: false },
  { img: "😉", valor: 2, match: false },
  { img: "👽", valor: 4, match: false },
  { img: "😉", valor: 2, match: false },
  { img: "🐶", valor: 3, match: false },
  { img: "🤡", valor: 5, match: false },
  { img: "🐶", valor: 3, match: false },
  { img: "🤖", valor: 1, match: false },
  { img: "🐥", valor: 6, match: false },
  { img: "👽", valor: 4, match: false },
  { img: "🤡", valor: 5, match: false },
];

const randomMemo = () => {};

const contenedor = document.querySelector("#contenedor");
let primerValor = null;
let segundoValor = null;

arrayMemo.forEach((item, index) => {
  const col = `<div class="col p-0 tarjeta" onclick=seleccionar(${index}) id="col-${index}">
  <div class="d-flex justify-content-center align-items-center bg-primary rounded h-100 w-100 d-none" id="tarjeta${index}">
    <h3 >${item.img}</h3>
  </div>
  </div>`;
  contenedor.innerHTML += col;
});

function seleccionar(index) {
  if (arrayMemo[index].match) {
    return;
  }

  if (!primerValor) {
    primerValor = arrayMemo[index].valor;
    console.log(primerValor);

    document.querySelector(`#tarjeta${index}`).classList.remove("d-none");
    document.querySelector(`#tarjeta${index}`).classList.add("d-block");
  } else {
    segundoValor = arrayMemo[index].valor;
    console.log(segundoValor);

    document.querySelector(`#tarjeta${index}`).classList.remove("d-none");
    document.querySelector(`#tarjeta${index}`).classList.add("d-block");

    setTimeout(() => {
      if (primerValor === segundoValor) {
        arrayMemo.map((item) => {
          if (item.valor === primerValor) {
            item.match = true;
          }
        });
        mensajeWinner();
        primerValor = null;
        segundoValor = null;
      } else {
        primerValor = null;
        segundoValor = null;
        darVueltaTarjeta();
      }
    }, 1000);
  }
}

const darVueltaTarjeta = () => {
  arrayMemo.forEach((item, index) => {
    if (!item.match) {
      //   document.querySelector(`#tarjeta${index}`).classList = "d-none";
      document.querySelector(`#tarjeta${index}`).classList.remove("d-block");
      document.querySelector(`#tarjeta${index}`).classList.add("d-none");
    }
  });
};

const mensajeWinner = () => {
  const resto = arrayMemo.filter((item) => !item.match);
  if (!resto.length) {
    alert("GANASTE!!🎉");
  }
};
