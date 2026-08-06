let numeros = [1, 2, 3, 4, 5];
console.log(`El array de numeros del 1 al 5 es: [${numeros}]`);

// length
console.log(`Longitud: ${numeros.length}`);

// at
console.log(`El primer elemento es: ${numeros.at(0)}`);
console.log(`El último elemento es: ${numeros.at(-1)}`);

let numerossiguientes = [6, 7, 8, 9, 10];
console.log(`El array de numeros del 6 al 10 es: [${numerossiguientes}]`);

// concat
let numeroscompletos = numeros.concat(numerossiguientes);
console.log(`Al concatenar los dos arrays nos da: [${numeroscompletos}]`);

// array con constructor
const colores = new Array("rojo", "verde", "azul");
console.log(`El array de colores es: [${colores}]`);

// copyWithin
let copia = [...numeroscompletos];
copia.copyWithin(0, 5, 10);
console.log(`El array después de copyWithin es: [${copia}]`);

// entries, devuelve un iterador con pares [índice, valor]
const letras = ["a", "b"].entries();
console.log(letras.next().value);

// every
const sonMenoresOIgualesA10 = numeroscompletos.every(x => x <= 10);
console.log("¿Los elementos del array son menores o iguales a 10?", sonMenoresOIgualesA10);

// fill
colores.fill("amarillo");
console.log(colores);

// filter
console.log(`Los elementos mayores a 8 son: [${numeroscompletos.filter(x => x > 8)}]`);

// find
console.log(`El primer elemento mayor a 7 es: ${numeroscompletos.find(x => x > 7)}`);

// findIndex
console.log(`El índice del primer elemento mayor a 3 es: ${numeroscompletos.findIndex(x => x > 3)}`);

// findLast
console.log(`El último elemento mayor a 5 es: ${numeroscompletos.findLast(x => x > 5)}`);

// findLastIndex
console.log(`El índice del último elemento mayor a 5 es: ${numeroscompletos.findLastIndex(x => x > 5)}`);

// flat
console.log(colores.flat());

// flatMap
console.log(colores.flatMap(x => x + " claro"));

// forEach
numeroscompletos.forEach(x => console.log(x));

// includes
console.log("¿El array de colores incluye el color verde?", colores.includes("verde"));

// indexOf, devuelve el índice de la primera aparición de un elemento
console.log(`El índice del elemento 5 es: ${numeroscompletos.indexOf(5)}`);

// join
console.log(`El array con join es: ${["Hola", "querido lector de mi codigo"].join(" ")}`);

// keys, devuelve un iterador con los índices del array
const llaves = ["a", "b", "c"].keys();
console.log(llaves.next().value);

// lastIndexOf, devuelve el índice de la última aparición de un elemento
console.log(`El índice del último elemento 5 es: ${numeroscompletos.lastIndexOf(5)}`);

// length
console.log(`La longitud del array es: ${numeroscompletos.length}`);

// map
console.log(`El array multiplicado por 2 es: [${numeroscompletos.map(x => x * 2)}]`);

// pop
console.log(colores.pop());
console.log(`El array de colores después de pop es: [${colores}]`);

// push
colores.push("morado");
console.log(`El array de colores después de push es: [${colores}]`);

// reduce
console.log(`La suma de los elementos es: ${numeroscompletos.reduce((acumulador, valorActual) => acumulador + valorActual)}`);

// reduceRight
console.log(`La suma de los elementos desde la derecha es: ${numeroscompletos.reduceRight((acumulador, valorActual) => acumulador + valorActual)}`);

// reverse
copia = [...numeroscompletos];
console.log(`El array invertido es: [${copia.reverse()}]`);

// shift
console.log(colores.shift());

// slice
console.log(`El array cortado desde la posición 2 hasta la 5 es: [${numeroscompletos.slice(2, 5)}]`);

// some
console.log("¿Algún elemento es mayor a 10?", numeroscompletos.some(x => x > 10));

// sort
copia = [...numeroscompletos];
console.log(`El array ordenado es: [${copia.sort((a, b) => a - b)}]`);

// splice
copia = [...numeroscompletos];
copia.splice(5, 2);
console.log(`El array después de splice es: [${copia}]`);

// toLocaleString
console.log(`El array con toLocaleString es: ${numeroscompletos.toLocaleString()}`);

// toString
console.log(`El array con toString es: ${numeroscompletos.toString()}`);

// unshift
copia = [...numeroscompletos];
copia.unshift(0);
console.log(`El array después de unshift es: [${copia}]`);

// values, devuelve un iterador con los valores del array
const valores = numeroscompletos.values();
console.log(valores.next().value);