import axios from "axios";

export const useFetchLostItemById = async (id: string) => {
  try {
    const res = await axios.get(`/api/v1/lost-item/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching lost item:", error);
    throw error;
  }
};
