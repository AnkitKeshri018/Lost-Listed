import axios from "axios";

export const useFilterFoundItems = () => {
  const filterItems = async (queryString: string) => {
    const res = await axios.get(`/api/v1/found-item/filter?${queryString}`, {
      withCredentials: true,
    });
    return res; // only return actual items
  };

  return filterItems;
};
