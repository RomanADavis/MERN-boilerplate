export function getFromStorage(key){
  if(!key){
    return null
  }

  try{
    const valueString = localStorage.getItem(key)
    if(valueString){
      return JSON.parse(valueString)
    }
  }catch(error){
    return null
  }
}

export function setInStorage(key, object){
  if(!key){
    console.error('Key is missing.')
  }

  try{
    localStorage.setItem(key, JSON.stringify(object))
  }catch(error){
    console.log(error)
  }
}