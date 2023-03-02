import AppWrapper from "@/components/appWrapper";
import { useState, useEffect } from "react";

export default function Users() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
        setLoading(false);
      });
  }, []);

  return <AppWrapper title='Users'>{data}</AppWrapper>;
}
