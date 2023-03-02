import AppWrapper from "@/components/appWrapper";
import { useState, useEffect } from "react";

export default function Qa() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.API_URL}/api/qaCategories`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
      });
  }, []);

  return <AppWrapper title='QA'>Data</AppWrapper>;
}
