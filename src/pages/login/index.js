import Login from "components/Login/Login";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) router.push("/products");
  }, [])

  return (
    <div>
      <Login />
    </div>
  )
}
