import axios from "axios";

export const useFilterLostItems = () => {
  const filterItems = async (queryString:string) => {
    const res = await axios.get(`/api/v1/lost-item/filter?${queryString}`, {
      withCredentials: true,
    });
    return res; // only return actual items
  };

  return filterItems;
};
