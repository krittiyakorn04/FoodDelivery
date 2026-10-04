import axios from "axios";


export const createCatagory = async (token,form) =>{
    return axios.post('http://localhost:5000/api/store/category',form,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    )
}

export const listCatagory = async (token) =>{
    return axios.get('http://localhost:5000/api/store/category',{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    )
}

export const updateCatagory = async(token,id,data)=>{
  return axios.put(
    `http://localhost:5000/api/store/category/${id}`,
    data,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  )
}

export const removeCatagory = async (token,id) =>{
    return axios.delete('http://localhost:5000/api/store/category/'+id,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    )
}

