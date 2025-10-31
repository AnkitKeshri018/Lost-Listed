import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserLostItems } from "@/redux/lostitemSlice";

const useGetallUserLostItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/v1/lost-item/user", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setuserLostItems(res.data.data));
      } else {
        throw new Error(res.data.message || "Failed to fetch items");
      }
    } catch (err: any) {
      console.error("Error fetching lost items:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return { loading, error, refetchItems: fetchItems };
};

export default useGetallUserLostItems;
