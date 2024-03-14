export const getData = async (url: string) => {
  // const res = await fetch("http://localhost:3000/api/buku", {
  //     next: { revalidate: 1 },
  // });
  try {
    const res = await fetch(url, {
      cache: "no-store",
      // next: { revalidate: 1 },
    });
    return res.json();
  } catch (error) {
    console.log(error)
  }
};
