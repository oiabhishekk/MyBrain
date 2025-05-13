export const random =(size:number)=>{
  const validTexts= "qpowejzxmcnvbalskdjfhgpqowieuryt7896325410"
  let hash= ""
  for(let i=0; i<size;i++){
    const randomval= validTexts.charAt(Math.floor(Math.random()*validTexts.length))
    hash+=randomval;
  }
  return hash
}