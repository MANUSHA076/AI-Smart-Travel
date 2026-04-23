export default function UsersPage() {
  const users = [
    { id: 1, name: "Manusha", role: "Admin", status: "Active" },
    { id: 2, name: "Sushena", role: "User", status: "Active" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">System Users</h1>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4 text-green-600">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}