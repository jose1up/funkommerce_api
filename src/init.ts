import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import console from "console";
import { seedProducts } from "./seeders/product";
import { seedCategory } from "./seeders/category";
import { seedBrands } from "./seeders/brand";
import {seedLicenses } from "./seeders/license"

export const init = async () => {
  try {
    const verification = await prisma.product.findMany({});

    if (!verification.length) {
      await Promise.all([prisma.license.createMany({
        data: seedLicenses, 
        skipDuplicates:true
      }), 
        prisma.brand.createMany({
        data: seedBrands,
        skipDuplicates:true
      }), prisma.category.createMany({
        data: seedCategory,
      })]).then(()=>{
        seedProducts.map(async (product: any) => {
          await prisma.product.create({
          data: {
            title: product.attributes.title,
            number: product.attributes.number,
            price: Math.floor(Math.random() * (50 - 5) + 5).toFixed(2),
            stock: Math.floor(Math.random() * (25 - 0)) + 0,
            formFactor: product.attributes["form-factor"],
            image:
              product.attributes["image-url"] ||
              "https://cdn.shopify.com/s/files/1/0154/8877/8288/products/1-Mystery-funko-pop-Brand-new-unopened-ones.jpg?v=1577791303",
             Category: {
              connect: {
                  name: product.attributes.category
            },
           }, 
           Brand: {
               connectOrCreate: {
                where: {
                  name:  (await product.attributes.brand)
                },
                create: {
                 name:  (await product.attributes.brand)
               },
              },
             },
            License: {
              connectOrCreate: {
                where: {
                  name:  (await product.attributes.license)
                },
                create: {
                  name:   (await product.attributes.license)
                },
              },
            },
          },
        })
      })
      })
     
    } else {
      console.log("database loaded");
    }
  } catch (error) {
    console.log(error);
  }
};
