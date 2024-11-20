
import mongoose from "mongoose"
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB=(uri : string)=>{
    mongoose.connect(uri,{
        dbName:"Ecommerce_24"
    }).then((c)=>console.log(`DB connected to ${c.connection.host}`)).catch((e)=>console.log(e));
}


export const invalidateCache=({product,order,admin,userId,orderId,productId}:InvalidateCacheProps)=>{
    if(product){
        const productKeys :string[]=["latest-product","categories","all-products"];

        if(typeof productId==="string") productKeys.push(`product - ${productId}`)

        if(typeof productId==="object"){
            productId.forEach((i)=>productKeys.push(`product - ${i}`))    
        }

        myCache.del(productKeys)
    }
    if(order){
        const orderKeys: string[]=["all-orders",`my-orders-${userId}`,`order- ${orderId}`]

        

        myCache.del(orderKeys)
    }
    if(admin){
        myCache.del(["admin-stats","admin-pie-charts","admin-pie-charts","admin-line-charts"])
    }
}

export const reduceStock = async(orderItems:OrderItemType[])=>{
    for (let i = 0; i < orderItems.length; i++) {
        const order=orderItems[i];
        const product = await Product.findById(order.productId)
        
        if(!product)
            throw new Error("Product Not Found");

        product.stock -=order.quantity;

        await product.save();
    }
}

export const calculatePercentage=(thismonth:number,lastMonth:number)=>{

    if(lastMonth===0) return thismonth*100;

    const percent =((thismonth)/lastMonth)*100;
    return Number(percent.toFixed(0));
}

export const getInventories=async ({categories,productsCount}:{categories:string[];productsCount:number;})=>{
    const categoriesCountPromise = categories.map((category)=>Product.countDocuments({category}))

    const categoriesCount= await Promise.all(categoriesCountPromise )

    const categoryCount:Record<string,number>[]=[];

    categories.forEach((category,i)=>{
        categoryCount.push({
        [category]:Math.round((categoriesCount[i]/productsCount)*100)
        })
    })

    return categoryCount;
}

interface MyDocument{
    createdAt:Date;
    discount?:number;
    total?:number
}

// interface MyDocument {
//     URL: string;
//     alinkColor: string;
//     all: any; // Adjust type based on actual data
//     anchors: any[]; // Adjust type based on actual data
//     // ... other properties
//     createdAt: Date; // Assuming Date type for timestamps
//     updatedAt: Date;
//     name: string;
//     photo: string;
//     price: number;
//     stock: number;
//     category: string;
//     discount?:number;
//     total?:number;
// }


type FuncProps={
    length:number;
    docArr:MyDocument[];
    today:Date;
    property?: "discount" | "total";
}


export const getChartData =({length,docArr,today,property}:FuncProps)=>{


        const data:number[]=new Array(length).fill(0);
    
        docArr.forEach((i)=>{
            const creationDate=i.createdAt;
            const monthDiff=(today.getMonth()-creationDate.getMonth()+12)%12;


            if(monthDiff<length){
                    data[length-monthDiff-1]+=property? i[property]! : 1;
            }
        });

        return data;
}