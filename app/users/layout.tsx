import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UsersList from "./components/UserList";

export default async function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = await getUsers();
  return (
    <Sidebar>
        <div className="h-full">
            <UsersList items={users} />
            {children}
        </div>
    </Sidebar>
  );
}
