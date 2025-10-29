import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLostItems } from "@/redux/lostitemSlice";

const useFetchAllLostItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("/api/v1/lost-item/get", {
          withCredentials: true,
        });
          console.log("Fetched lost items:", res.data);
        if (res.data.success) {
          dispatch(setLostItems(res.data.data));
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

    fetchItems();
  }, [dispatch]);

  // ✅ return useful info to component
  return { loading, error };
};

export default useFetchAllLostItems;
