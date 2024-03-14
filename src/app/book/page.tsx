import BookList from "@/components/BookList";
import NavigationBar from "@/components/Navbar";


export default async function Page() {
  return (
    <div>
      <NavigationBar />
      <BookList />
    </div>
  );
}
