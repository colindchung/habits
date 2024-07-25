import { formatDate } from "@/lib/date";
import { useQuery } from "@tanstack/react-query";
import { headers } from "next/headers";
import { useState } from "react";

function Body() {
  const [date, setDate] = useState(formatDate(new Date(), "YYYY-MM-DD"));

  const { data } = useQuery({
    queryKey: ["dailyInfo"],
    queryFn: async () => {
      // const formData = new FormData();
      const response = await fetch(`/api/dailyInfo?date=${date}`, {
        method: "GET",
        // body: new URLSearchParams({
        //   date: "2024-07-24",
        // }),
      });

      console.log(response);
      return await response.json();
    },
  });

  return (
    <main className="h-full w-full py-8">
      <h1 className="text-2xl font-semibold mb-3">{date}</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </main>
  );
}

export default Body;
