// Regular Function
function esParOImparRegular(numero) {
  if (numero % 2 === 0) {
    console.log(`${numero} es par`);
  } else {
    console.log(`${numero} es impar`);
  }
}

// Arrow Function
const esParOImparArrow = (numero) => {
  if (numero % 2 === 0) {
    console.log(`${numero} es par`);
  } else {
    console.log(`${numero} es impar`);
  }
};

// Pruebas
esParOImparRegular(7);  //  impar
esParOImparArrow(10);   // par
