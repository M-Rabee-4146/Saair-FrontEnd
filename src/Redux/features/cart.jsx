import { createSlice } from "@reduxjs/toolkit";

const CartSlice=createSlice({
    name:'cart/Product',
    initialState:{
        cart:[]
    },
    reducers:{
        addToCart:(state,action)=>{
            // console.log(action.payload)
            const IteminCart=state.cart.find((item)=>item._id==action.payload._id);
            if(IteminCart){
                if(action.payload.quantity){
                  IteminCart.quantity+=parseInt(action.payload.quantity)
                    // console.log('Quantity after Adding incoming qty',IteminCart.quantity)
                }else{
                    IteminCart.quantity++
                    // console.log('Quantity without Adding incoming qty',IteminCart.quantity)
                    
                }
                // console.log('Quantity',IteminCart.quantity)
            }else{
                if(action.payload.quantity){
                    state.cart.push({...action.payload})
                    // console.log(action.payload.quantity)
                }else{
                    state.cart.push({...action.payload,quantity:1})
                }
                // console.log(IteminCart?.quantity?[IteminCart.quantity]:[])
            }
        },
        IncrementQuantity:(state,action)=>{
            
            const item=state.cart.find((item)=>item._id==action.payload);
            item.quantity++;
        },
        DecrementQuantity:(state,action)=>{
            const item=state.cart.find((item)=>item._id==action.payload);
            if(item.quantity>1){
                item.quantity--;
            }
        },
        RemoveItem:(state,action)=>{
            // console.log(action.payload)
            const RemoveItem=state.cart.filter((item)=>item._id!==action.payload)
            // console.log(RemoveItem)
            state.cart=RemoveItem
        },
        ClearCart:(state)=>{
            state.cart=[];
            // console.log(state.cart)
        }
    }
})

export const cartReducer=CartSlice.reducer;
export const {addToCart,IncrementQuantity,DecrementQuantity,RemoveItem,ClearCart}=CartSlice.actions