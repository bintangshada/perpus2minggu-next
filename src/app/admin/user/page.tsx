import NavigationBarAdmin from "@/components/NavbarAdmin";
import UserList from "@/components/UserList";

export default async function Page() {

  return (
    <div>
      <NavigationBarAdmin />
        <UserList />
    </div>
  );
}
