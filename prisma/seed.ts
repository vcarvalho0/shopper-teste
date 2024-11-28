import { prisma } from "../src/database";
import { Decimal } from "@prisma/client/runtime/library";

async function seed() {
  const homerReview = await prisma.review.create({
    data: {
      rating: 2,
      comment:
        "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts."
    }
  });

  const dominicReview = await prisma.review.create({
    data: {
      rating: 4,
      comment:
        "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!"
    }
  });

  const jamesReview = await prisma.review.create({
    data: {
      rating: 5,
      comment:
        "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto."
    }
  });

  await prisma.drivers.createMany({
    data: [
      {
        name: "Homer Simpson",
        description:
          "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
        reviewId: homerReview.id,
        pricePerKm: new Decimal(2.5),
        minKm: 1
      },
      {
        name: "Dominic Toretto",
        description:
          "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        vehicle: "Dodge Charger R/T 1970 modificado",
        reviewId: dominicReview.id,
        pricePerKm: new Decimal(5.0),
        minKm: 5
      },
      {
        name: "James Bond",
        description:
          "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        vehicle: "Aston Martin DB5 clássico",
        reviewId: jamesReview.id,
        pricePerKm: new Decimal(10.0),
        minKm: 10
      }
    ]
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
